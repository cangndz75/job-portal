import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Job } from "@prisma/client";

type GetJobs = {
    title?: string;
    categoryId?: string;
    createdAtFilter?: string;
    shiftTiming?: string;
    workMode?: string;
    yearsofExperience?: string;
    savedJobs?: boolean;
};

export const getJobs = async({title, categoryId,createdAtFilter, shiftTiming, workMode, yearsofExperience, savedJobs}:GetJobs): Promise<Job[]> => {
    const {userId} = auth();
    try {
        let query : any = {
            where:{
                isPublished:true,
            },
            include:{
                company:true,
                category: true,
                attachments:true
            },
            orderBy:{
                createdAt:"desc"
            },
        };

        const jobs = await db.job.findMany(query);
        return jobs;
    } catch (error) {
        console.log("[GET_JOBS]", error);
        return [];
    }

}