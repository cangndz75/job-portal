"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, Ellipsis, Eye, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export type CompanyColumns = {
  id: string;
  name: string;
  logo: string;
  createdAt: string;
};

export const columns: ColumnDef<CompanyColumns>[] = [
  {
    accessorKey: "logo",
    header: "Logo",
    cell: ({ row }) => {
      const logoUrl = row.original.logo;
      return (
        <div className="flex items-center justify-center">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Company Logo"
              className="h-12 w-12 object-cover"
            />
          ) : (
            "No Logo"
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size={"icon"} variant={"ghost"}>
              <Ellipsis className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <Link href={`/admin/companies/${id}`}>
              <DropdownMenuItem>
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
