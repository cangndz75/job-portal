"use client";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combo-box";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job } from "@prisma/client";
import axios from "axios";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface YearsOfExperienceFormProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  yearsOfExperience: z.string().min(1),
});

let options = [
  { label: "Fresher", value: "0" },
  { label: "0-2 years", value: "2" },
  { label: "2-4 years", value: "3" },
  { label: "5+ years", value: "5" },
];

const YearsOfExperienceForm = ({ initialData, jobId }: YearsOfExperienceFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      yearsOfExperience: initialData.yearsOfExperience || "",
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Job work mode updated");
      toggleEditting();
      router.refresh();
    } catch (error) {
      toast.error("Failed to update job work mode");
    }
  };

  const toggleEditting = () => setIsEditing((current) => !current);
  const selectedOption = options.find(
    (option) => option.value === initialData.yearsOfExperience
  );
  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Work Experience
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
      {!isEditing && (
        <p
          className={cn(
            "text-sm mt-2",
            !initialData?.yearsOfExperience && "text-neutral-500 italic"
          )}
        >
          {selectedOption?.label || "No work experience"}
        </p>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="yearsOfExperience"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      heading="Work Experience"
                      options={options}
                      {...field}
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

export default YearsOfExperienceForm;
