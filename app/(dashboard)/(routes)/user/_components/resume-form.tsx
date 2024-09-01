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
import { Job, Attachment, UserProfile, Resumes } from "@prisma/client";

interface ResumeFormProps {
  initialData: UserProfile & { resumes: Resumes[] };
  userId: string;
}

const formSchema = z.object({
  resumes: z.object({ url: z.string(), name: z.string() }).array(),
});

const ResumeForm = ({ initialData, userId }: ResumeFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();

  const initialResumes = Array.isArray(initialData?.resumes)
    ? initialData.resumes.map((resume: any) => {
        if (
          typeof resume === "object" &&
          resume !== null &&
          "url" in resume &&
          "name" in resume
        ) {
          return { url: resume.url, name: resume.name };
        }
      })
    : [];

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      resumes: initialResumes?.length ? initialResumes : [],
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/users/${userId}/resumes`, values);
      toast.success("Resume updated");
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update resumes");
    }
  };

  const toggleEditing = () => setIsEditing((current) => !current);
  const onDelete = async (resume: Resumes) => {
    try {
      setDeletingId(resume.id);
      await axios.delete(`/api/users/${userId}/resumes/${resume.id}`);
      toast.success("Resume deleted");
      router.refresh();
    } catch (error) {
      toast.error("Failed to delete resume");
    }
  };

  return (
    <div className="mt-6 border flex-1 w-full rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Your Resumes
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              {" "}
              <Pencil className="w-4 h-4 mr-2" /> Edit{" "}
            </>
          )}
        </Button>
      </div>
      {!isEditing && (
        <div className="space-y-2">
          {initialData?.resumes.map((item) => (
            <div
              className="flex items-center p-3 w-full bg-purple-100 border-purple-200 border text-purple-700 rounded-md"
              key={item.url}
            >
              <File className="w-4 h-4 mr-2" />
              <p className="text-ws w-full truncate">{item.name}</p>
              {deletingId === item.id && (
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="p-1"
                  type="button"
                >
                  <Loader2 className="w-4 h-4 animate-spin" />
                </Button>
              )}
              {deletingId !== item.id && (
                <Button
                  variant={"ghost"}
                  size={"icon"}
                  className="p-1"
                  onClick={() => onDelete(item)}
                  type="button"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="resumes"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <AttachmentsUploads
                      value={field.value}
                      disabled={isSubmitting}
                      onChange={(resumes) => {
                        if (resumes) {
                          onSubmit({ resumes });
                        }
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isSubmitting || !isValid}>
              {isSubmitting && (
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              )}
              Save
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default ResumeForm;
