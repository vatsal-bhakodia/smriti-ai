import { useState } from "react";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ActionsCell({
  folderId,
  onDelete,
}: {
  folderId: string;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/folder", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: folderId }),
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success("Folder deleted");

      // Delay to match animation before removal
      setTimeout(() => {
        onDelete(folderId);
      }, 300);
    } catch (err) {
      toast.error("Failed to delete folder");
      console.error(err);
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex justify-center">
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogTrigger asChild>
          <button
            className="p-2 text-muted-foreground hover:text-red-500 transition-colors"
            onClick={() => setOpen(true)}
            disabled={isDeleting}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Folder</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this folder? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
