
import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import React from 'react';
import ChatSideBar from '@/components/ChatSideBar';
import PDFViewer from '@/components/PDFViewer';
import ChatComponent from '@/components/ChatComponent';
import { checkSubscription } from '@/lib/subscription';
type Params = Promise<{ chatId: string }>



export default async function ChatPage(props: { params: Params }) {
    const params = await props.params;
    const chatId = params.chatId;
    const { userId } = await auth();
    if (!userId) {
        return redirect('/sign-in');
    }
    const _chats = await db.select().from(chats).where(eq(chats.userId, userId));
    if (!_chats) {
        return redirect('/');
    }
    if (!_chats.find(chat => chat.id == parseInt(chatId))) {
        return redirect('/');
    }

    const currentChat = _chats.find(chat => chat.id === parseInt(chatId));
    const isPro = await checkSubscription();

    return (
        <div className="flex max-h-screen overflow-hidden bg-gray-100">
            <div className="flex w-full max-h-screen">
                {/* Sidebar */}
                <div className="w-1/4 bg-white shadow-md overflow-hidden border-r">
                    <ChatSideBar chats={_chats} chatId={parseInt(chatId)} isPro={isPro} />
                </div>

                {/* PDF Viewer */}
                <div className="flex-1 p-6 bg-white overflow-auto">
                    <PDFViewer pdf_url={currentChat?.pdfUrl || ''} />
                </div>

                {/* Chat Component */}
                <div className="w-1/4 bg-white border-l shadow-md p-4 overflow-auto">
                    <ChatComponent chatId={parseInt(chatId)} />
                </div>
            </div>
        </div>
    );
};

// export default ChatPage;

