"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface JobPublishActionProps {
  disabled: boolean;
  jobId: string;
  isPublished: boolean;
}

const JobPublishAction = ({
  disabled,
  jobId,
  isPublished,
}: JobPublishActionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onClick= async()=> {
    try {
      setIsLoading(true);
      if(isPublished){
        await axios.patch(`/api/jobs/${jobId}/unpublish`);
        toast.success("Job unpublished successfully");
      }else{
        await axios.patch(`/api/jobs/${jobId}/publish`);
        toast.success("Job published successfully");
      }
      router.refresh();
    } catch (error) {
      toast.error("Failed to publish job");
      console.log((error as Error)?.message);
    }finally{
      setIsLoading(false);
    }
  }

  const onDelete = async() =>{
    try {
      setIsLoading(true);
      await axios.delete(`/api/jobs/${jobId}`);
      toast.success("Job deleted successfully");
      router.refresh();
      return router.push("/admin/jobs");
    } catch (error) {
      toast.error("Failed to publish job");
      console.log((error as Error)?.message);
    }finally{
      setIsLoading(false);
    }
  }
  return (
    <div className="flex items-center gap-x-3">
      <Button variant={"outline"} onClick={onClick} disabled={disabled || isLoading} size={"sm"}>
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <Button variant={"destructive"} onClick={onDelete} disabled={isLoading} size={"icon"}>
        <Trash className="w-4 h-4"/>
      </Button>
    </div>
  );
};

export default JobPublishAction;
