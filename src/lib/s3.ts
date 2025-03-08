import * as AWS from 'aws-sdk';

export async function uploadToS3(file: File) {
    try {
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_ACCESS_SECRET_KEY
        });
        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
            },
            region: 'us-east-1'
        })

        const file_key = 'uploads/' + Date.now().toString() + file.name.replace(' ', '-');
        //  creates if not exists, a uploads Folder, append date to make it unique. replace blank space with -


        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: file_key,
            Body: file
        }

        // access event evt
        // to see the progress of the upload
        const upload = s3.putObject(params).on('httpUploadProgress', evt => {
            // console.log(`Uploading to S3... ${Math.round((evt.loaded * 100) / evt.total)}%`);
           console.log(
  `uploading to s3... ${parseInt(((evt.loaded * 100) / evt.total).toString())}%`
);
// evt.total is the total file size, we are calculating thr percentage 
        }).promise()

        await upload.then(() => {
            console.log('sccessfully uploaded to S3!', file_key)
        })

        return Promise.resolve({
            file_key,
            file_name: file.name,
        });
    }

    catch (error) {
        console.error('S3 Upload Error:', error);
        throw error;
    }
    
}
export function getS3Url(file_key: string) {
    const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.us-east-1.amazonaws.com/${file_key}`;
    return url;
}