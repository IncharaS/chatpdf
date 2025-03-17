import { db } from '@/lib/db';
import { chats } from '@/lib/db/schema';
import { auth } from '@clerk/nextjs/server';
import { eq } from 'drizzle-orm';
import { redirect } from 'next/navigation';
import React from 'react'
import ChatSideBar from '@/components/ChatSideBar';
import PDFViewer from '@/components/PDFViewer';
import ChatComponent from '@/components/ChatComponent';
import { checkSubscription } from '@/lib/subscription';
type Props = {
    params: {
        chatId: string;
    }
};
//chatId should match -> chat/[chatId]
// convert this to a server component using async
const ChatPage = async ({ params }: Props) => {
    const { chatId } = await params;
    const { userId } = await auth()
    if (!userId) {
        return redirect('/sign-in')
    }
    //  redirect from next/navigation
    const _chats = await db.select().from(chats).where(eq(chats.userId, userId))
    if (!_chats) {
        return redirect('/')
    }
    if (!_chats.find(chat => chat.id == parseInt(chatId))) {
        return redirect('/')
    }

    const currentChat = _chats.find(chat => chat.id === parseInt(chatId))
    const isPro = await checkSubscription()
    return (
        <div className='flex max-h-screen overflow-scroll'>
            <div className='flex w-full max-h-screen overflow-scroll'>
                {/* 3 divs inside */}
                {/* 1. Sidebar for chats, 2. PDF Viewer, 3. Chat Component  */}
                <div className='flex-[1] max-w-xs'>
                    <ChatSideBar chats={_chats} chatId={parseInt(chatId)} isPro={isPro} />
                </div>

                <div className='flex-[5] max-h-screen p-4 overflow-scroll'>
                    <PDFViewer pdf_url={currentChat?.pdfUrl || ''} /> 
                </div>

                <div className='flex-[3] border-l-4 border-l-slate-200'>
                    <ChatComponent chatId={parseInt(chatId)} /> 
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
