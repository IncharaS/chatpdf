'use client'
// for stripe subscription
import { DrizzleChat } from '@/lib/db/schema'
import { MessageCircle, PlusCircle } from 'lucide-react'
import Link from "next/link";
import React from 'react'
import { Button } from './ui/button'
import {cn} from '@/lib/utils'

type Props = {
    chats: DrizzleChat[],
    chatId: number,
}

const ChatSideBar = ({chats, chatId}: Props) => {
  return (
      <div className='w-full h-screen p-4 text-gray-200 bg-gray-900'>
          <Link href='/'>
              <Button>
                  <PlusCircle className='mr-2 w-4 h-4' />
                  New Chat
              </Button></Link>
          {/* chat list in a flex  */}
          <div className='flex flex-col gap-2 mt-4'>
              {chats.map(chat => (
                  <Link key={chat.id} href={`/chat/${chat.id}`}>
                      <div className={
                          cn('rounded-lg p-3 text-slate-300 flex items-center', {
                              'bg-blue-600 text-white': chat.id === chatId,
                              'hover:text-white': chat.id !== chatId,
                          })
                      }>
                          <MessageCircle className='mr-2' />
                          <p className='w-full overflow-hidden text-sm truncate whitespace-nowrap text-ellipsis'>
                              {chat.pdfName}
                          </p>
                      </div>
                      </Link>
              ))}
          </div>


          <div className='absolute bottom-4 left-4'>
              <div className='flex items-center gap-2 text-sm text-slate-500 flex-wrap'>
                  <Link href='/'>Home</Link>
                  <Link href='/'>Source</Link>
                  {/* stripe button  */}
              </div>
          </div>
        </div>
  )
}

export default ChatSideBar;