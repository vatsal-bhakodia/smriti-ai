// "use client";

// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import * as React from "react";
// import {
//   ColumnDef,
//   ColumnFiltersState,
//   SortingState,
//   VisibilityState,
//   flexRender,
//   getCoreRowModel,
//   getFilteredRowModel,
//   getPaginationRowModel,
//   getSortedRowModel,
//   useReactTable,
// } from "@tanstack/react-table";
// import { ArrowUpDown, ChevronDown, GraduationCap } from "lucide-react";

// import { Button } from "@/components/ui/button";
// import {
//   DropdownMenu,
//   DropdownMenuCheckboxItem,
//   DropdownMenuContent,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// import { Progress } from "@/components/ui/progress";
// import { CheckCircle2, Clock, PauseCircle } from "lucide-react";
// import axios from "axios";
// import Link from "next/link";
// import { toast } from "sonner";

// export type Topic = {
//   id: string;
//   title: string;
//   status: "learning" | "completed" | "paused";
//   progress: number; // percentage
// };

// export const columns: ColumnDef<Topic>[] = [
//   {
//     accessorKey: "title",
//     header: ({ column }) => (
//       <Button
//         variant="ghost"
//         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
//       >
//         Topic
//         <ArrowUpDown className="ml-2 h-4 w-4" />
//       </Button>
//     ),
//   },
//   {
//     accessorKey: "status",
//     header: "Status",
//     cell: ({ row }) => {
//       const status = row.getValue("status") as Topic["status"];
//       const statusMap: Record<
//         Topic["status"],
//         { label: string; icon: React.ReactNode; color: string }
//       > = {
//         learning: {
//           label: "Learning",
//           icon: <Clock className="w-4 h-4" />,
//           color: "bg-blue-100 text-blue-800",
//         },
//         completed: {
//           label: "Completed",
//           icon: <CheckCircle2 className="w-4 h-4" />,
//           color: "bg-green-100 text-green-800",
//         },
//         paused: {
//           label: "Paused",
//           icon: <PauseCircle className="w-4 h-4" />,
//           color: "bg-yellow-100 text-yellow-800",
//         },
//       };

//       const { label, icon, color } = statusMap[status];

//       return (
//         <span
//           className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${color}`}
//         >
//           {icon}
//           {label}
//         </span>
//       );
//     },
//   },
//   {
//     accessorKey: "progress",
//     header: "Progress",
//     cell: ({ row }) => {
//       const value = row.getValue("progress") as number;
//       return (
//         <div className="flex flex-col gap-1">
//           <span className="text-sm font-medium text-muted-foreground">
//             {value}%
//           </span>
//           <Progress value={value} className="h-2" />
//         </div>
//       );
//     },
//   },
// ];

// export function TopicsTable(): React.JSX.Element {
//   const [isLoading, setIsLoading] = React.useState(false);

//   const [sorting, setSorting] = React.useState<SortingState>([]);
//   const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
//     []
//   );
//   const [columnVisibility, setColumnVisibility] =
//     React.useState<VisibilityState>({});
//   const [rowSelection, setRowSelection] = React.useState<
//     Record<string, boolean>
//   >({});
//   const [data, setData]: [data: Topic[] | [], SetData: any] = React.useState(
//     []
//   );
//   const table = useReactTable<Topic>({
//     data,
//     columns,
//     onSortingChange: setSorting,
//     onColumnFiltersChange: setColumnFilters,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//     onColumnVisibilityChange: setColumnVisibility,
//     onRowSelectionChange: setRowSelection,
//     state: {
//       sorting,
//       columnFilters,
//       columnVisibility,
//       rowSelection,
//     },
//   });

//   React.useEffect(() => {
//     async function fetchTopics() {
//       try {
//         setIsLoading(true); // Start spinner
//         const topicAPI = "/api/topic";
//         const res = await axios.get(topicAPI);

//         const transformed = (res.data as any).topics.map(
//           ({ id, ...rest }: { id: string }) => {
//             const progress = Math.round(Math.random() * 100);
//             const status = progress === 100 ? "completed" : "learning";

//             return {
//               id,
//               progress,
//               status,
//               ...rest,
//             };
//           }
//         );

//         setData(transformed);
//       } catch (error) {
//         console.error("Error occurred", error);
//         toast.error("Failed to load topics");
//       } finally {
//         setIsLoading(false); // Stop spinner
//       }
//     }

//     fetchTopics();
//   }, []);

//   return (
//     <div className="w-full">
//       <div className="flex items-center justify-between py-4">
//         <div className="flex items-center space-x-2">
//           <GraduationCap className="h-5 w-5 text-primary" />
//           <h2 className="text-xl font-semibold">Topics</h2>
//         </div>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="outline">
//               Columns <ChevronDown className="ml-2 h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             {table
//               .getAllColumns()
//               .filter((column) => column.getCanHide())
//               .map((column) => (
//                 <DropdownMenuCheckboxItem
//                   key={column.id}
//                   className="capitalize"
//                   checked={column.getIsVisible()}
//                   onCheckedChange={(value: boolean) =>
//                     column.toggleVisibility(!!value)
//                   }
//                 >
//                   {column.id}
//                 </DropdownMenuCheckboxItem>
//               ))}
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//       {isLoading ? (
//         <div className="h-[50vh] flex flex-col items-center justify-center text-white text-lg gap-4">
//           <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
//           <span>Loading Topics...</span>
//         </div>
//       ) : (
//         <div className="rounded-md border">
//           <Table>
//             <TableHeader>
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <TableRow key={headerGroup.id}>
//                   {headerGroup.headers.map((header) => (
//                     <TableHead key={header.id}>
//                       {header.isPlaceholder
//                         ? null
//                         : flexRender(
//                             header.column.columnDef.header,
//                             header.getContext()
//                           )}
//                     </TableHead>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableHeader>
//             <TableBody>
//               {table.getRowModel().rows?.length ? (
//                 table.getRowModel().rows.map((row) => (
//                   <TableRow
//                     key={row.id}
//                     data-state={row.getIsSelected() && "selected"}
//                   >
//                     {row.getVisibleCells().map((cell) => (
//                       <TableCell key={cell.id}>
//                         <Link href={`/dashboard/topic/${row.original.id}`}>
//                           {flexRender(
//                             cell.column.columnDef.cell,
//                             cell.getContext()
//                           )}
//                         </Link>
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 ))
//               ) : (
//                 <TableRow>
//                   <TableCell
//                     colSpan={columns.length}
//                     className="h-24 text-center"
//                   >
//                     No results.
//                   </TableCell>
//                 </TableRow>
//               )}
//             </TableBody>
//           </Table>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import * as React from "react";
import axios from "axios";
import { toast } from "sonner";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  ColumnDef,
} from "@tanstack/react-table";

import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { GraduationCap, ChevronDown } from "lucide-react";
import Link from "next/link";

type Topic = {
  id: string;
  title: string;
  progress: number;
  status: "completed" | "learning";
};

export default function TopicsTable() {
  const [data, setData] = React.useState<Topic[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedTopic, setSelectedTopic] = React.useState<Topic | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const fetchTopics = async () => {
    try {
      setLoading(true);
      // const res = await axios.get("/api/topic");
      const res = await axios.get<{ topics: any[] }>("/api/topic");
      const transformed = res.data.topics.map((t: any) => {
        const progress = Math.floor(Math.random() * 100);
        return {
          id: t.id,
          title: t.title,
          progress,
          // status: progress === 100 ? "completed" : "learning",
          status: progress === 100 ? "completed" : "learning" as "completed" | "learning",
        };
      });
      setData(transformed);
    } catch (err) {
      toast.error("Failed to fetch topics");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchTopics();
  }, []);

  const handleDelete = async () => {
    if (!selectedTopic) return;
    try {
      setDeleting(true);
      await axios.delete("/api/topic", {
        params: { id: selectedTopic.id },
      });
      toast.success("Topic deleted");
      fetchTopics();
    } catch (err) {
      toast.error("Failed to delete topic");
    } finally {
      setDeleting(false);
      setSelectedTopic(null);
    }
  };

  const columns: ColumnDef<Topic>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: (info) => <>{info.getValue()}</>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => <>{info.getValue()}</>,
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: (info) => <>{info.getValue()}%</>,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              onClick={() => setSelectedTopic(row.original)}
            >
              Delete
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to delete this topic?</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setSelectedTopic(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ),
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div className="flex items-center space-x-2">
          <GraduationCap className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Topics</h2>
        </div>
      </div>
      {loading ? (
        <div className="h-[50vh] flex items-center justify-center">Loading...</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
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
                  <TableCell colSpan={columns.length} className="text-center">
                    No topics found.
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
