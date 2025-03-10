import { NextResponse } from "next/server";

// /api/create-chat

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json()
        const { file_key, file_name } = body;
        return NextResponse.json({message:"Success"})
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            {
                error: "Internal Server error"
            },
            {
                status: 500
            }
            
        )
    }
    
}