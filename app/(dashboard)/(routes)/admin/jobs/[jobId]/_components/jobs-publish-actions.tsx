"use client";

import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import React, { useState } from "react";

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
  const onClick=()=> {

  }

  const onDelete =() =>{

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
