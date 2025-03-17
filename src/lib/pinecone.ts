import { Pinecone} from '@pinecone-database/pinecone'
import { downloadFromS3 } from './s3-server';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'
import {Document, RecursiveCharacterTextSplitter} from '@pinecone-database/doc-splitter'
import { getEmbeddings } from './embeddings';
import md5 from 'md5';
import { convertToAscii } from './utils';

const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!
    // Pinecone SDK now derives the environment from your API key, so you don't need to pass it explicitly.
});

// Function to return Pinecone client
export const getPineconeClient = async () => {
  return pinecone;
};

type PDFPage = {
    pageContent: string;
    metadata: {
        loc: {pageNumber:number}
    }
}

export async function loadS3IntoPinecone(filekey:string) {
    // dwnload the PDF and use langchain
    console.log('downloading s3 into file system')
    const file_name = await downloadFromS3(filekey);
    console.log(file_name, "FILE_NAME")
    if (!file_name) {
        throw new Error('could not download form S3')
    }
    const loader = new PDFLoader(file_name)
    const pages = (await loader.load()) as PDFPage[];
    console.log(pages)

    // step 2: split and segment the pdf
    // return pages
    
    const documents = await Promise.all(pages.map(prepareDocument))
    // pages = Array(100) will now become documents = Array(1000)

    // step 3: vectorize and embed individual docs
    const vectors = await Promise.all(documents.flat().map(embedDocument))

    // Step 4 : Uplaod this to pinecone
    const client = await getPineconeClient()
    // const pineconeIndex = client.Index('chatpdf')
    // index is a databse in pinecone

    console.log('inserting vectors into pinecone')
    // convertToAscii defined in utils
    // const namespace = convertToAscii(filekey)
    // pineconeIndex.upsertRecords(vectors);

    const namespace = client.index('chatpdf').namespace(convertToAscii(filekey));
    await namespace.upsert(vectors);

    return documents[0];
}

async function embedDocument(doc: Document) {
    try {
        const embeddings = await getEmbeddings(doc.pageContent)
        const hash = md5(doc.pageContent)
        return {
            id: hash,
            values: embeddings,
            metadata: {
                text:   String(doc.metadata.text),
                pageNumber: Number(doc.metadata.pageNumber)
            }

        }

    } catch (error) {
        console.log('error embedding document', error)
        throw error
    }
    
}

export const truncateStringBytes = (str: string, bytes: number) => {
    const enc = new TextEncoder()
    return new TextDecoder('utf-8').decode(enc.encode(str).slice(0, bytes))
}

async function prepareDocument(page: PDFPage) {
    //takes in single pdf page
    // eslint-disable-next-line prefer-const
    let { pageContent, metadata } = page;
    pageContent = pageContent.replace(/\n/g, ' ')
    // replce new line characters with an empty string

    const splitter = new RecursiveCharacterTextSplitter()

    // here we define our own metadata to push this into pinecone
    // since pinecone has a limit of text being 36000 bytes, we use encoder 
    const docs = await splitter.splitDocuments([
        new Document(
            {
                pageContent,
                metadata: {
                    pageNumber: metadata.loc.pageNumber,
                    text: truncateStringBytes(pageContent, 36000)
            }
            }
        )
    ])
    // now this docs will the 5-6 or more paragraphs that 1 page is split into
    return docs;
}