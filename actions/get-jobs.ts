import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Job } from "@prisma/client";

type GetJobs = {
    title?: string;
    categoryId?: string;
    createdAtFilter?: string;
    shiftTiming?: string;
    workMode?: string;
    yearsOfExperience?: string;
    savedJobs?: boolean;
};

export const getJobs = async({title, categoryId,createdAtFilter, shiftTiming, workMode, yearsOfExperience, savedJobs}:GetJobs): Promise<Job[]> => {
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
        if(typeof title !== "undefined" || typeof categoryId !== "undefined"){
            query.where ={
                AND:[
                    typeof title !=="undefined" && {
                        title:{
                            contains:title,
                            mode:"insensitive"
                        }
                    },
                    typeof categoryId !=="undefined" && {
                        categoryId:{
                            equals:categoryId
                        }
                    }
                ].filter(Boolean)
            }
        }
        if(createdAtFilter){
            const currentDate = new Date();
            let startDate: Date;
            switch (createdAtFilter) {
                case "today":
                    startDate = new Date(currentDate);
                    break;
                case "yesterday":
                    startDate = new Date(currentDate);
                    startDate.setDate(startDate.getDate() - 1);
                    break;
                case "this-week":
                    startDate = new Date(currentDate);
                    startDate.setDate(startDate.getDate() - 7);
                    break;
                case "last-week":
                    startDate = new Date(currentDate);
                    startDate.setDate(startDate.getDate() - 14);
                    break;
                case "this-month":
                    startDate = new Date(currentDate);
                    startDate.setMonth(startDate.getMonth() - 1);
                    break;
                    default:
                    startDate = new Date(currentDate);
            }
            query.where.createdAt = {
                gte:startDate
            }
        }
        let formattedShiftTiming = shiftTiming?.split(",");
        if(formattedShiftTiming && formattedShiftTiming.length > 0){
            query.where.shiftTiming = {
                in:formattedShiftTiming
            }
        }
        let formattedWorkingModes = workMode?.split(",");
        if(formattedWorkingModes && formattedWorkingModes.length > 0){
            query.where.workMode = {
                in:formattedWorkingModes
            }
        }
        let formattedExperiences = yearsOfExperience?.split(",");
        if(formattedExperiences && formattedExperiences.length > 0){
            query.where.yearsOfExperience = {
                in:formattedExperiences
            }
        }
        const jobs = await db.job.findMany(query);
        return jobs;
    } catch (error) {
        console.log("[GET_JOBS]", error);
        return [];
    }

}