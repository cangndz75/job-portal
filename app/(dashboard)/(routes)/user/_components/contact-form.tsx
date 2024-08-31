"use client";
import Box from "@/components/box";
import { Button } from "@/components/ui/button";
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
import { UserProfile } from "@prisma/client";
import axios from "axios";
import { Pencil, UserCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { resolve } from "path";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
interface ContactFormProps {
  initialData: UserProfile | null;
  userId: string;
}

const formSchema = z.object({
  contact: z.string().min(1, { message: "Contact is required" }),
});

const ContactForm = ({ initialData, userId }: ContactFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      contact: initialData?.contact || "",
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/users/${userId}`, values);
      toast.success("Contact updated");
      toggleEditting();
      router.refresh();
    } catch (error) {
      toast.error("Failed to update contact");
    }
  };

  const toggleEditting = () => setIsEditing((current) => !current);

  return (
    <Box>
      {!isEditing && (
        <div
          className={cn(
            "text-lg mt-2 flex items-center gap-2",
            !initialData?.contact && "text-neutral-500 italic"
          )}
        >
          <UserCircle className="w-4 h-4 mr-2" />
          {initialData?.contact ? initialData.contact : "No contact"}
        </div>
      )}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex items-center gap-2 flex-1"
          >
            <FormField
              control={form.control}
              name="contact"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g '1234567890'"
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
      <Button onClick={toggleEditting} variant={"ghost"}>
        {isEditing ? (
          <>Cancel</>
        ) : (
          <>
            <Pencil className="w-4 h-4 mr-2" /> Edit
          </>
        )}
      </Button>
    </Box>
  );
};

export default ContactForm;
