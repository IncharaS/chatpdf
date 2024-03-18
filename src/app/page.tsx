import { Button } from "@/components/ui/button";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { ArrowRight, LogIn } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import { checkSubscription } from "@/lib/subscription";
import SubscriptionButton from "@/components/SubscriptionButton";
import { db } from "@/lib/db";
import { chats } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export default async function Home() {
  const { userId } = await auth();
  const isAuth = !!userId;
  const isPro = await checkSubscription();
  let firstchat;
  if (userId) {
    firstchat = await db.select().from(chats).where(eq(chats.userId, userId));
    if (firstchat) {
      firstchat = firstchat[0];
    }
  }
  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-indigo-200 via-red-200 to-yellow-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center p-6 space-y-6">
          <div className="flex items-center justify-center space-x-3">
            <h1 className="text-5xl font-semibold text-gray-800">Hi</h1>
            <UserButton />
          </div>
          <div className="flex mt-3 space-x-3">
            {isAuth && firstchat && (
              <Link href={`/chat/${firstchat.id}`}>
                <Button className="flex items-center text-sm">
                  Go to Chats <ArrowRight className="ml-2 w-5 h-5 text-white-600" />
                </Button>
              </Link>
            )}
            <div>
              <SubscriptionButton isPro={isPro} />
            </div>
          </div>
          <p className="max-w-xl mt-3 text-lg text-slate-700">
            Unlock a whole new way to interact with your PDFs. ThisAI-powered chat that enables you to ask questions, get real-time insights, and dive deeper into your documents with ease.
          </p>

          <div className="w-full mt-6">
            {isAuth ? (
              <FileUpload />
            ) : (
              <Link href="/sign-in">
                <Button className="w-full flex items-center justify-center space-x-2">
                  <span>Login to get started</span>
                  <LogIn className="w-5 h-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
