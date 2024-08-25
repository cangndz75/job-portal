import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import JobPublishAction from "./_components/jobs-publish-actions";
import Banner from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import TitleForm from "./_components/title-form";
import CategoryForm from "./_components/category-form";
import ImageForm from "./_components/image-form";
import ShortDescription from "./_components/short-description";
import ShiftTimingForm from "./_components/shift-timing-mode";
import HourlyRateForm from "./_components/hourly-rate-form";
import JobModeForm from "./_components/job-mode-form";
import YearsOfExperienceForm from "./_components/work-experience-form";
import JobDescription from "./_components/job-description";

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
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!job) {
    return redirect("/admin/jobs");
  }

  const requiredFields = [
    job.title,
    job.description,
    job.imageUrl,
    job.categoryId,
  ];
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
      {!job.isPublished && (
        <Banner variant={"warning"} label="This job is not published" />
      )}

      {/* Container Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div>
          {/*title */}
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl text-neutral-700">Customize your job</h2>
          </div>
          {/* title form */}
          <div>
            <TitleForm initialData={job} jobId={job.id} />
            {/* category form */}
            <CategoryForm
              initialData={job}
              jobId={job.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />

            {/* cover image*/}
            <ImageForm initialData={job} jobId={job.id} />

            {/* short description */}
            <ShortDescription initialData={job} jobId={job.id} />

            {/* shift timing */}
            <ShiftTimingForm initialData={job} jobId={job.id} />

            {/* hourly rate */}
            <HourlyRateForm initialData={job} jobId={job.id} />

            {/* job mode */}
            <JobModeForm initialData={job} jobId={job.id} />

            {/* work experience */}
            <YearsOfExperienceForm initialData={job} jobId={job.id} />
          </div>
        </div>

        {/* Right Container */}

        {/* Description */}
        <div className="col-span-2">
          <JobDescription initialData={job} jobId={job.id} />
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
