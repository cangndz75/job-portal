"use client";
import AttachmentsUploads from "@/components/attachment-uploads";
import ImageUpload from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job, Attachment } from "@prisma/client";
import axios from "axios";
import { url } from "inspector";
import { File, ImageIcon, Pencil, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
interface AttachmentsFormProps {
  initialData: Job & { attachments: Attachment[] };
  jobId: string;
}

const formSchema = z.object({
  attachments: z.object({ url: z.string(), name: z.string() }).array(),
});

const AttachmentsForm = ({ initialData, jobId }: AttachmentsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const initialAttachments = Array.isArray(initialData?.attachments)
    ? initialData.attachments.map((attachment: any) => {
        if (
          typeof attachment === "object" &&
          attachment !== null &&
          "url" in attachment &&
          "name" in attachment
        ) {
          return { url: attachment.url, name: attachment.name };
        }
        return { url: "", name: "" };
      })
    : [];
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attachments: initialAttachments,
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        `/api/jobs/${jobId}/attachments`,
        values
      );
      toast.success("Job attachments updated");
      toggleEditting();
      router.refresh();
    } catch (error) {
      toast.error("Failed to update job attachments");
    }
  };

  const toggleEditting = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Attachments
        <Button onClick={toggleEditting} variant={"ghost"}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" /> Edit
            </>
          )}
        </Button>
      </div>
      {!isEditing && <div className="space-y-2">
        {initialData.attachments.map((item) => (
            <div
              className="flex items-center p-3 w-full bg-purple-100 border-purple-200 border text-purple-700 rounded-md"
              key={item.url}
            >
              <File className="w-4 h-4 mr-2" />
              <p className="text-ws w-full truncate">{item.name} </p>
              <Button
                variant={"ghost"}
                size={"icon"}
                className="p-1"
                onClick={() => {}}
                type="button"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}</div>}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="attachments"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AttachmentsUploads
                      value={field.value}
                      disabled={isSubmitting}
                      onChange={(attachments) => {
                        if(attachments){
                          onSubmit({attachments});
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default AttachmentsForm;
