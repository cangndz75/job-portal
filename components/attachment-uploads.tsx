"use client";

import { storage } from "@/config/firebase.config";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { FilePlus, ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";

interface AttachmentsUploadsProps {
  disabled?: boolean;
  onChange: (value: { url: string; name: string }[]) => void;
  onRemove: (value: string) => void;
  value: { url: string; name: string }[];
}
const AttachmentsUploads = ({
  disabled,
  onChange,
  onRemove,
  value,
}: AttachmentsUploadsProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
   
  };

  const onDelete = () => {};

  return (
    <div>
      <label>
        <div className="flex gap-2 items-center justify-center cursor-pointer">
          <FilePlus className="w-3 h-3 mr-2" />
          <p>Add a file</p>
        </div>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
          className="w-0 h-0"
          onChange={onUpload}
        />
      </label>
      <div className="flex-col">
        {value && value.length > 0 ? <>{}</> : <p>No attachments</p>}
      </div>
    </div>
  );
};

export default AttachmentsUploads;
