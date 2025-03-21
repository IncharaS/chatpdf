//s3 to run on server

import AWS from 'aws-sdk'
import fs from 'fs'
export async function downloadFromS3(file_key: string) {
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
    
        const params = {
            Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
            Key: file_key,
        }
        const obj = await s3.getObject(params).promise()
        // obj now has the actual downloaded file

        // const tempDir = path.join(process.cwd(), "tmp"); // Use process.cwd() instead of /tmp
        // if (!fs.existsSync(tempDir)) {
        //     fs.mkdirSync(tempDir, { recursive: true });
        // }
        const file_name = `/tmp/inchara${Date.now().toString()}.pdf`; 

        // const file_name = path.join(tempDir, `pdf-${Date.now()}.pdf`);
        fs.writeFileSync(file_name, obj.Body as Buffer);
        return file_name;
    } catch (error) {
        console.error("Error downloading from S3:", error);
        return null;
    }
}
