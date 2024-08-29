import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server"

export const POST = async(req:Request, {params}: {params:{jobId:string}}) => {
    try {
        const {userId} = auth();
        const {jobId} = params;
        const {url, name} = await req.json();

        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!jobId){
            return new NextResponse("Id is missing", { status: 401 });
        }  
        const attachment = await db.attachment.create({
            data:{
                url,
                name,
                jobId
            }
        });
        return NextResponse.json(attachment);
    } catch (error) {
        console.error(`[JOB_ATTACHMENT_POST]: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}