"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Company } from "@prisma/client";
import axios from "axios";
import { Globe, Globe2, Linkedin, Mail, MapPin, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
interface CompanySocialContactsFormProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  mail: z.string().min(1, { message: "mail is required" }),
  website: z.string().min(1, { message: "website is required" }),
  linkedIn: z.string().min(1, { message: "linkedIn is required" }),
  address_line1: z.string().min(1, { message: "address_line1 is required" }),
  address_line2: z.string().min(1, { message: "address_line2 is required" }),
  city: z.string().min(1, { message: "city is required" }),
  state: z.string().min(1, { message: "state is required" }),
  zipcode: z.string().min(1, { message: "zipcode is required" }),
});

const CompanySocialContactsForm = ({
  initialData,
  companyId,
}: CompanySocialContactsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mail: initialData.mail || "",
      website: initialData.website || "",
      linkedIn: initialData.linkedIn || "",
      address_line1: initialData.address_line1 || "",
      address_line2: initialData.address_line2 || "",
      city: initialData.description || "",
      state: initialData.state || "",
      zipcode: initialData.zipcode || "",
    },
  });
  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/companies/${companyId}`, values);
      toast.success("Company name updated");
      toggleEditting();
      router.refresh();
    } catch (error) {
      toast.error("Failed to update company name");
    }
  };

  const toggleEditting = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Company Socials
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
        <>
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-3">
              {initialData.mail && (
                <div className="text-sm text-neutral-500 flex items-center w-full truncate">
                  <Mail className="w-3 h-3 mr-2" />
                  {initialData.mail}
                </div>
              )}
              {initialData.linkedIn && (
                <Link
                  href={initialData.linkedIn}
                  className="text-sm text-neutral-500 flex items-center w-full truncate"
                >
                  <Linkedin className="w-3 h-3 mr-2" />
                  {initialData.linkedIn}
                </Link>
              )}
              {initialData.website && (
                <Link
                  href={initialData.website}
                  className="text-sm text-neutral-500 flex items-center w-full truncate"
                >
                  <Globe2 className="w-3 h-3 mr-2" />
                  {initialData.website}
                </Link>
              )}
            </div>
            <div className="col-span-3">
              {initialData.address_line1 && (
                <div className="flex items-start gap-2 justify-start">
                  <MapPin className="w-3 h-3 mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {initialData.address_line1}, {initialData.address_line2}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {initialData.city}, {initialData.state}, {initialData.zipcode}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="mail"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="This is a company mail"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="This is a company website"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="linkedIn"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="Linkedin Link: 'https://linkedin.in/your-company'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address_line1"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="Address Line 1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address_line2"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      disabled={isSubmitting}
                      placeholder="Address Line 2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="City Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="State Name"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        disabled={isSubmitting}
                        placeholder="34000"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
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

export default CompanySocialContactsForm;
