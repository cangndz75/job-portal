import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { update } from "lodash";
import { NextResponse } from "next/server"
    
export const PATCH = async (req:Request, {params}: {params:{jobId:string}}) => {
        try {
            const {userId} = auth();
            const {jobId} = params;
            if (!userId) {
                return new NextResponse("Unauthorized",{status:401})
            }
            if (!jobId) {
                return new NextResponse("Not Found",{status:404})
            }
            const job = await db.job.findUnique({
                where:{
                    id:jobId,
                    userId
                }
            })
            if (!job) {
                return new NextResponse("Not Found",{status:404})
            }
            const userIndex = job.savedUsers.indexOf(userId);
            let updatedData;
            if(userIndex !== -1){
                updatedData = await db.job.update({
                    where:{
                        id:jobId,
                        userId
                    },
                    data:{
                        savedUsers:{
                            set:job.savedUsers.filter((saverUserId) => saverUserId !== userId)
                        }
                    }
                })
            }
            return NextResponse.json(updatedData);
    
        } catch (error) {
            return new NextResponse("Internal Server Error",{status:500})
        }
}