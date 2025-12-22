"use client";

import * as React from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowUpDown, ChevronDown, GraduationCap } from "lucide-react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ActionsCell from "./actionCell";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// CHANGE 1: Updated the Folder type to match the new API response
export type Folder = {
  id: string;
  title: string;
  completionPercentage: number;
  averageScore: number;
  isDeleting?: boolean;
};

export function TopicsTable(): React.JSX.Element {
  const [data, setData] = React.useState<Folder[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const handleRemoveFolder = (folderId: string) => {
    setData((prev) =>
      prev.map((folder) =>
        folder.id === folderId ? { ...folder, isDeleting: true } : folder
      )
    );
    setTimeout(() => {
      setData((prev) => prev.filter((folder) => folder.id !== folderId));
    }, 500);
  };

  const columns: ColumnDef<Folder>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Folder <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Link
          href={`/folder/${row.original.id}`}
          className="hover:underline font-medium"
        >
          {row.getValue("title")}
        </Link>
      ),
    },
    // CHANGE 2: Replaced the old "status" and "progress" columns with the new stacked bar
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const { completionPercentage, averageScore } = row.original;

        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full bg-zinc-700 rounded-full h-2.5 relative overflow-hidden cursor-pointer">
                  {/* Completion Bar (Light Green background) */}
                  <div
                    className="bg-lime-400/30 h-2.5 rounded-full"
                    style={{ width: `${completionPercentage}%` }}
                  />
                  {/* Performance Bar (Dark Green foreground) */}
                  <div
                    className="bg-lime-400 h-2.5 rounded-full absolute top-0"
                    style={{
                      width: `${(completionPercentage * averageScore) / 100}%`,
                    }}
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Completion: {completionPercentage.toFixed(0)}%</p>
                <p>Average Score: {averageScore.toFixed(0)}%</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-right">Actions</div>,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <ActionsCell
            folderId={row.original.id}
            onDelete={handleRemoveFolder}
          />
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  React.useEffect(() => {
    async function fetchFolders() {
      setIsLoading(true);
      try {
        const res = await axios.get("/api/folder");
        const folders = (res.data as { folders: Folder[] }).folders;
        setData(folders);
      } catch (error) {
        console.error("Error occurred", error);
        toast.error("Failed to load folders");
      } finally {
        setIsLoading(false);
      }
    }
    fetchFolders();
  }, []);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Folders</h2>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((c) => c.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value: boolean) =>
                    column.toggleVisibility(!!value)
                  }
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {isLoading ? (
        <div className="flex h-64 items-center justify-center text-white">
          <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-id={row.original.id}
                    className={
                      row.original.isDeleting
                        ? "opacity-0 transition-opacity duration-500"
                        : ""
                    }
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No folders created yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
