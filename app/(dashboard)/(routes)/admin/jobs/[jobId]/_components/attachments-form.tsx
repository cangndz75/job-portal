"use client";
import AttachmentsUploads from "@/components/attachment-uploads";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { File, Loader2, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { Job, Attachment } from "@prisma/client";

interface AttachmentsFormProps {
  initialData: Job & { attachments: Attachment[] };
  jobId: string;
}

const formSchema = z.object({
  attachments: z.object({ url: z.string(), name: z.string() }).array(),
});

const AttachmentsForm = ({ initialData, jobId }: AttachmentsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const initialAttachments = initialData?.attachments.map((attachment) => ({
    url: attachment.url,
    name: attachment.name,
  }));

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      attachments: initialAttachments,
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/jobs/${jobId}/attachments`, values);
      toast.success("Job attachments updated");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update job attachments");
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);
  const onDelete = async (attachment: Attachment) => {
    try {
      setDeletingId(attachment.id);
      await axios.delete(`/api/jobs/${jobId}/attachments/${attachment.id}`);
      toast.success("Attachment deleted");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete attachment");
    }
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Attachments
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? <>Cancel</> : <> <Pencil className="w-4 h-4 mr-2" /> Edit </>}
        </Button>
      </div>
      {!isEditing && (
        <div className="space-y-2">
          {initialData.attachments.map((item) => (
            <div
              className="flex items-center p-3 w-full bg-purple-100 border-purple-200 border text-purple-700 rounded-md"
              key={item.url}
            >
              <File className="w-4 h-4 mr-2" />
              <p className="text-ws w-full truncate">{item.name}</p>
              {deletingId === item.id && (
                <Button variant={"ghost"} size={"icon"} className="p-1" type="button">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </Button>
              )}
              {deletingId !== item.id && (
                <Button variant={"ghost"} size={"icon"} className="p-1" onClick={() => onDelete(item)} type="button">
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
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
                        field.onChange(attachments);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isSubmitting || !isValid}>
              {isSubmitting && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
              Save
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default AttachmentsForm;
