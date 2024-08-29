import { storage } from "@/config/firebase.config";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server"

export const DELETE = async(req:Request, {params}: {params:{jobId:string, attacmentId:string}}) => {
    try {
        const {userId} = auth();
        const {jobId, attacmentId} = params;
        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }
        if(!jobId){
            return new NextResponse("Id is missing", { status: 401 });
        }
        const attachment = await db.attachment.findFirst({
            where:{
                id: attacmentId,
            }
        });
        if(!attachment || attachment.jobId !== params.jobId){
            return new NextResponse("Attachment not found", { status: 404 });
        }

        const storageRef = ref(storage, attachment.url);
        await deleteObject(storageRef);

        await db.attachment.delete({
            where:{
                id: attacmentId
            }
        });
        return NextResponse.json({message: "Attachment deleted"});
    } catch (error) {
        console.error(`[JOB_DELETE]: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}