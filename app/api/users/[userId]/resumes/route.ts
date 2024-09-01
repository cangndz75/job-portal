import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Attachment, Resumes } from "@prisma/client";
import { NextResponse } from "next/server"

export const POST = async(req:Request) => {
    try {
        const {userId} = auth();

        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }
        const {resumes} = await req.json();
        if(!resumes || !Array.isArray(resumes) || resumes.length === 0){
            return new NextResponse("Resumes are missing", { status: 400 });
        }

        const createdresumes : Resumes[] = [];
        for (const resume of resumes){
            const {url, name} = resume;
            const existingresume = await db.resumes.findFirst({
                where:{
                    url,
                    userProfileId: userId
                }
            });
            if(existingresume){
                continue;
            }
            const createdresume = await db.resumes.create({
                data:{
                    url,
                    name,
                    userProfileId: userId,
                }
            });
            createdresumes.push(createdresume);
        }
        return NextResponse.json(createdresumes);
        } catch (error) {
        console.error(`[USER_RESUME_POST]: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}