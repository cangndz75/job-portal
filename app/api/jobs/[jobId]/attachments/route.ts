import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Attachment } from "@prisma/client";
import { NextResponse } from "next/server"

export const POST = async(req:Request, {params}: {params:{jobId:string}}) => {
    try {
        const {userId} = auth();
        const {jobId} = params;

        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!jobId){
            return new NextResponse("Id is missing", { status: 401 });
        }  
        const {attachments} = await req.json();
        if(!attachments || !Array.isArray(attachments)){
            return new NextResponse("Attachments are missing", { status: 400 });
        }

        const createdAttachments : Attachment[] = [];
        for (const attachment of attachments){
            const {url, name} = attachment;
            const createdAttachment = await db.attachment.create({
                data:{
                    url,
                    name,
                    jobId
                }
            });
            createdAttachments.push(createdAttachment);
        }
        return NextResponse.json(createdAttachments);
        } catch (error) {
        console.error(`[JOB_ATTACHMENT_POST]: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}