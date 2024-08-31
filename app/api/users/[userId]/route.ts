import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async(req:Request) => {
    try {
        const {userId} = auth();
        const values = await req.json();
        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }
        let profile = await db.userProfile.findFirst({
            where: {
                userId,
            },
        });
        let userProfile
        if(profile){
            userProfile = await db.userProfile.update({
                where: {
                    userId,
                },
                data: {
                    ...values,
                },
            })
        }else{
            userProfile = await db.userProfile.create({
                data: {
                    ...values,
                    userId,
                },
            });
        }        
        return NextResponse.json(userProfile);
    } catch (error) {
        console.error(`[JOB_PATCH]: ${error}`);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}