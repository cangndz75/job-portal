import { storage } from "@/config/firebase.config";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { deleteObject, ref } from "firebase/storage";
import { NextResponse } from "next/server"

export const DELETE = async(req:Request, {params}: {params:{resumeId:string}}) => {
    try {
        const {userId} = auth();
        const {resumeId} = params;
        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const resume = await db.resumes.findFirst({
            where:{
                id: resumeId,
            }
        });
        if(!resume || resume.id !== resumeId){
            return new NextResponse("Resume not found", { status: 404 });
        }

        const storageRef = ref(storage, resume.url || "");
        await deleteObject(storageRef);

        await db.resumes.delete({
            where:{
                id: resumeId
            }
        });
        return NextResponse.json({message: "resume deleted"});
    } catch (error) {
        console.error(`[RESUME_DELETE]: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}