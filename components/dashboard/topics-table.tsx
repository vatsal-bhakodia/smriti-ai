"use client";

import * as React from "react";
import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";
import {
  ArrowUpDown,
  CheckCircle2,
  ChevronDown,
  Clock,
  GraduationCap,
  PauseCircle,
} from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import ActionsCell from "./actionCell";

export type Topic = {
  id: string;
  title: string;
  status: "learning" | "completed" | "paused";
  progress: number;
  isDeleting?: boolean;
};

export function TopicsTable(): React.JSX.Element {
  const [data, setData] = React.useState<Topic[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState<
    Record<string, boolean>
  >({});

  const handleRemoveTopic = (topicId: string) => {
    // First mark the row as deleting
    setData((prev) =>
      prev.map((topic) =>
        topic.id === topicId ? { ...topic, isDeleting: true } : topic
      )
    );

    // Then remove it after animation
    setTimeout(() => {
      setData((prev) => prev.filter((topic) => topic.id !== topicId));
    }, 500);
  };

  const columns: ColumnDef<Topic>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Topic <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <Link
          href={`/dashboard/topic/${row.original.id}`}
          className="hover:underline"
        >
          {row.getValue("title")}
        </Link>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as Topic["status"];
        const statusMap = {
          learning: {
            label: "Learning",
            icon: <Clock className="w-4 h-4" />,
            color: "bg-blue-100 text-blue-800",
          },
          completed: {
            label: "Completed",
            icon: <CheckCircle2 className="w-4 h-4" />,
            color: "bg-green-100 text-green-800",
          },
          paused: {
            label: "Paused",
            icon: <PauseCircle className="w-4 h-4" />,
            color: "bg-yellow-100 text-yellow-800",
          },
        };
        const { label, icon, color } = statusMap[status];
        return (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${color}`}
          >
            {icon} {label}
          </span>
        );
      },
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }) => {
        const value = row.getValue("progress") as number;
        return (
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">
              {value}%
            </span>
            <Progress value={value} className="h-2" />
          </div>
        );
      },
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-center w-full">Actions</div>,
      cell: ({ row }) => (
        <ActionsCell topicId={row.original.id} onDelete={handleRemoveTopic} />
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
    async function fetchTopics() {
      try {
        setIsLoading(true); // Start spinner
        const topicAPI = "/api/topic";
        const res = await axios.get(topicAPI);

        const transformed = (res.data as any).topics.map(
          ({ id, ...rest }: { id: string }) => {
            const progress = Math.round(Math.random() * 100);
            const status = progress === 100 ? "completed" : "learning";

            return {
              id,
              progress,
              status,
              ...rest,
            };
          }
        );

        setData(transformed);
      } catch (error) {
        console.error("Error occurred", error);
        toast.error("Failed to load topics");
      } finally {
        setIsLoading(false); // Stop spinner
      }
    }

    fetchTopics();
  }, []);

  return (
  <div className="w-full">
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center space-x-2">
        <GraduationCap className="h-5 w-5 text-primary light:text-lime-600" />
        <h2 className="text-xl font-semibold light:text-gray-900">Topics</h2>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="light:bg-white light:border light:border-gray-200 light:text-gray-900">
            Columns <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="light:bg-white light:border light:border-gray-200 light:text-gray-900">
          {table
            .getAllColumns()
            .filter((c) => c.getCanHide())
            .map((column) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize light:text-gray-900"
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
      <div className="flex flex-col items-center justify-center text-white light:text-gray-900 text-lg gap-4">
        <div className="w-10 h-10 border-4 border-white light:border-gray-300 border-t-transparent rounded-full animate-spin" />
        <span>Loading Topics...</span>
      </div>
    ) : (
      <div className="rounded-md border light:border-gray-200 light:bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="light:text-gray-900">
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
                      : "light:text-gray-900"
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="light:text-gray-900">
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
                  className="h-24 text-center light:text-gray-900"
                >
                  No results.
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
