import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import JobPublishAction from "./_components/jobs-publish-actions";
import Banner from "@/components/ui/banner";

const JobDetailsPage = async ({ params }: { params: { jobId: string } }) => {
  const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;
  if (!validObjectIdRegex.test(params.jobId)) {
    return redirect("/admin/jobs");
  }

  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  const job = await db.job.findUnique({
    where: {
      id: params.jobId,
      userId,
    },
  });

  if (!job) {
    return redirect("/admin/jobs");
  }

  const requiredFields = [job.title, job.description, job.imageUrl];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `${completedFields}/${totalFields} fields completed`;
  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="p-6">
      <Link href={"/admin/jobs"}>
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <ArrowLeft className="w-4 h-4" />
          Back
        </div>
      </Link>
      <div className="flex items-center justify-between my-4">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-bold">Job Setup</h1>
          <p className="text-sm text-neutral-500">{completionText}</p>
        </div>
        <JobPublishAction
          disabled={!isComplete}
          jobId={params.jobId}
          isPublished={job.isPublished}
        />
      </div>
      {!job.isPublished &&(
        <Banner variant={"warning"} label="This job is not published" />
      )} 
    </div>
  );
};

export default JobDetailsPage;
