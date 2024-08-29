"use client";

import { storage } from "@/config/firebase.config";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { File, FilePlus, ImagePlus, Trash, X } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";
import { on } from "events";

interface AttachmentsUploadsProps {
  disabled?: boolean;
  onChange: (value: { url: string; name: string }[]) => void;
  value: { url: string; name: string }[];
}
const AttachmentsUploads = ({
  disabled,
  onChange,
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
    const files: File[] = Array.from(e.target.files || []);
    setIsLoading(true);
    const newUrls: { url: string; name: string }[] = [];
    let completedFiles = 0;
    files.forEach((file: File) => {
      const uploadTask = uploadBytesResumable(
        ref(storage, `Attachments/${Date.now()}-${file?.name}`),
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
            newUrls.push({ url: downloadURL, name: file.name });
            completedFiles++;
            if (completedFiles === files.length) {
              onChange([...value, ...newUrls]);
              setIsLoading(false);
              toast.success("Attachments uploaded successfully");
            }
          });
        }
      );
    });

    const onDelete = ({ url, name }: { url: string; name: string }) => {
      const newValue = value.filter((data) => data.name !== name);
      onChange(newValue);
      deleteObject(ref(storage, url)).then(() => {
        toast.success("Attachment deleted successfully");
      });
    };

    return (
      <div>
        <div className="w-full h-40 bg-purple-100 p-2 flex items-center justify-center">
          {isLoading ? (
            <>
              <p>{`${progress.toFixed(2)}%`}</p>
            </>
          ) : (
            <>
              <label className="w-full h-full flex items-center justify-center">
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
            </>
          )}
        </div>
      </div>
    );
  };
};

export default AttachmentsUploads;
