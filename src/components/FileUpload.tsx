'use client';
import { uploadToS3 } from '@/lib/s3';
import { useMutation } from '@tanstack/react-query';
import { Inbox, Loader2 } from 'lucide-react';
import React, { useState } from 'react'
import {useDropzone} from 'react-dropzone'
import axios from "axios"
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const FileUpload = () => {
    const router = useRouter()
    const [uploading, setUploading] = useState(false);
    const { mutate, isPending } = useMutation({
        mutationFn: async ({
            file_key,
            file_name,
        }: {
            file_key: string;
            file_name: string;
        }) => {
            const response = await axios.post("/api/create-chat", { file_key, file_name });
            return response.data;
        },
    });
    const { getRootProps, getInputProps } = useDropzone({
        accept: { "application/pdf": [".pdf"] },
        maxFiles: 1,
        onDrop: async (acceptedFiles) => {
            console.log(acceptedFiles);
            const file = acceptedFiles[0]
            // taking the first file 
            if (file.size > 10 * 1024 * 1024) {
                // bigger than 10 mb 
                toast.error("File too big")
                // alert('please upload a smaller files')
                return
            }

            try {
                setUploading(true);
                const data = await uploadToS3(file);
                if (!data?.file_key || !data.file_name) {
                    // alert("somethings wrong");
                    toast.error("Something's wrong");
                    console.log("somethings wrong, No file_key and file_name in uploadToS3 return obejct");
                }
                mutate(data, {
                    onSuccess: ({chat_id}) => {
                        console.log(data);
                        toast.success("Chat created");
                        // after the chat is created redirect to the chat page
                        router.push(`/chat/${chat_id}`)
                    },
                    onError: (err) => {
                        console.error(err);
                        toast.error("Error creating chat");
                    }
                })
            } catch (error) {
                console.log(error);
            } finally {
                setUploading(false);
            }
        },
    });
    return (
        <div className="p-2 bg-white rounded-xl">
            <div {...getRootProps({
                className: "boarder-dashed border-2 rounded-xl cursor-pointer bg-gray-50 py-8 flex justify-center items-center flex-center"
            })}>
                <input {...getInputProps()} />
                {/* here uploading is wrt uploading to the s3, and isPending is sending the file_key and name to the endpoint */}
                {uploading || isPending ? (
                    <>
                        <Loader2 className='h-10 w-10 text-blue-500' />
                        <p className='mt-2 text-sm text-slate-400'>
                            Spliing the Tea, to GPT</p>
                    </>
                ) : (
                    <>
                        {/* for the picture */}
                        <Inbox className="w-10 h-10 text-blue-500" />
                        <p className='mt-2 text-sm text-slate-400'>Drop PDF</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default FileUpload;