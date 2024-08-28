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
  onChange: (value: {url:string, name:string}[]) => void;
  onRemove: (value: string) => void;
  value: {url:string, name:string}[];
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
    if (!e.target.files) return;
    const file: File = e.target.files[0];
    setIsLoading(true);
    const uploadTask = uploadBytesResumable(
      ref(storage, `JobCoverImage/${Date.now()}-${file?.name}`),
      file,
      { contentType: file?.type }
    );
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (error) => {
        toast.error(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          onChange(downloadURL);
          setIsLoading(false);
          toast.success("Image uploaded successfully");
        });
      }
    );
  };

  const onDelete = () => {
    
  };

  return (
    <div>
      {value && value.length ? 0 ? (
        <>
          
        </>
      ) : (
        <>
          <div className="w-full h-60 aspect-video bg-neutral-50 relative rounded-md flex items-center justify-center overflow-hidden border border-dashed">
            {isLoading ? (
              <>
                <p>{`${progress.toFixed(2)}%`}</p>{" "}
              </>
            ) : (
              <>
                <label>
                  <div className="w-full h-full flex gap-2 items-center justify-center cursor-pointer text-neutral-500">
                    <FilePlus className="w-10 h-10" />
                    <p>Upload an image</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-0 h-0"
                    onChange={onUpload}
                  />
                </label>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AttachmentsUploads;
