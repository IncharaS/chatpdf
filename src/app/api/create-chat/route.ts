import { db } from "@/lib/db";
import { loadS3IntoPinecone } from "@/lib/pinecone";
import { getS3Url } from "@/lib/s3";
import { NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server'
import { chats } from "@/lib/db/schema";

// /api/create-chat

export async function POST(req: Request) {
    const { userId } = await auth()
    if (!userId) {
        return NextResponse.json({error: "unauthorized"}, {status: 401})
    }
    try {
        const body = await req.json()
        const { file_key, file_name } = body;
        await loadS3IntoPinecone(file_key);
        // console.log(pages)
        // return NextResponse.json({pages})
        // return NextResponse.json({ message: "sucess" })

        // drizzle orm
        const chat_id = await db.insert(chats).values({
            fileKey: file_key,
            pdfName: file_name,
            pdfUrl: getS3Url(file_key),
            userId
        })
            .returning({
                insertedId: chats.id,
            });
        return NextResponse.json({
            chat_id: chat_id[0].insertedId
        },
            { status: 200 });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                error: "Internal Server error"
            },
            {
                status: 500
            }
        );
    }
    
}