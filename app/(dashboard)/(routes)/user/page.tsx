import Box from "@/components/box";
import CustomBreadCrumb from "@/components/custom-bread-crumb";
import { auth, currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import { redirect } from "next/navigation";
import React from "react";
import NameForm from "./_components/name-form";
import { db } from "@/lib/db";

const ProfilePage = async () => {
  const { userId } = auth();
  const user = await currentUser();
  if (!userId) {
    redirect("/sign-in");
  }
  let profile = await db.userProfile.findFirst({
    where: {
      userId,
    },
    include: {
      resumes: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  return (
    <div className="flex-col p-4 md:p-8 items-center justify-center flex">
      <Box>
        <CustomBreadCrumb
          breadCrumbPage="My Profile"
          //breadCrumbItem={[{ link: "/search", label: "Search" },{link:"#", label:"Some Job"}]}
        />
      </Box>
      <Box className="flex-col p-4 rounded-md border mt-8 w-full space-y-6">
        {user && user.hasImage && (
          <div className="aspect-square w-24 h-24 rounded-full shadow-md relative">
            <Image
              fill
              className="w-full h-full object-cover"
              alt="User Profile Pic"
              src={user.imageUrl}
            />
          </div>
        )}
        <NameForm initialData={profile} userId={userId} />
      </Box>
    </div>
  );
};

export default ProfilePage;
