"use client";

import Box from "@/components/box";
import CustomBreadCrumb from "@/components/custom-bread-crumb";
import { Button } from "@/components/ui/button";
import { Attachment, Company, Job, Resumes, UserProfile } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

interface JobDetailsPageContentProps {
  job: Job & { company: Company | null; attachments: Attachment[] };
  jobId: string;
  userProfile: (UserProfile & { resumes: Resumes[] }) | null;
}

const JobDetailsPageContent = ({
  job,
  jobId,
  userProfile,
}: JobDetailsPageContentProps) => {
  return (
    <>
      <Box className="mt-4">
        <CustomBreadCrumb
          breadCrumbItem={[{ label: "Search", link: "/search" }]}
          breadCrumbPage={job?.title !== undefined ? job.title : ""}
        />
      </Box>
      <Box className="mt-4">
        <div className="w-full flex items-center h-72 relative rounded-md overflow-hidden">
          {job?.imageUrl ? (
            <Image
              alt={job.title}
              src={job?.imageUrl}
              fill
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-purple-100 flex items-center justify-center">
              <h2 className="text-3xl font-semibold tracking-wider">
                {job?.title}
              </h2>
            </div>
          )}
        </div>
      </Box>
      <Box className="mt-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-neutral-600">
            {job?.title}
          </h2>
          <Link href={`/companies/${job.companyId}`}>
            <div className="flex items-center gap-2 mt-1">
              {job?.company?.logo && (
                <Image
                  alt={job.title}
                  src={job?.company.logo}
                  width={25}
                  height={25}
                />
              )}
              <p className="text-muted-foreground text-sm font-semibold">
                {job?.company?.name}
              </p>
            </div>
          </Link>
        </div>

        <div>
          {userProfile ? (
            <>
              {!userProfile.appliedJobs.some(
                (appliedJob) => appliedJob.jobId === jobId
              ) ? (
                <Button className="text-sm bg-purple-700 hover:bg-purple-900 hover:shadow-sm">
                  Apply
                </Button>
              ) : (
                <Button
                  className="text-sm text-purple-700 border-purple-500 hover:bg-purple-900 hover:text-white hover:shadow-sm"
                  variant={"outline"}
                >
                  Already Applied
                </Button>
              )}
            </>
          ) : (
            <Link href={"/user"}>
              <Button className="text-sm px-8 bg-purple-700 hover:bg-purple-900 hover:shadow-sm">
                Update Profile
              </Button>
            </Link>
          )}
        </div>
      </Box>
    </>
  );
};

export default JobDetailsPageContent;
