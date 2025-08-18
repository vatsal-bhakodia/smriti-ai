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
  topicId,
  onDelete,
}: {
  topicId: string;
  onDelete: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch("/api/topic", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: topicId }),
      });

      if (!res.ok) throw new Error("Delete failed");

      toast.success("Topic deleted");

      // Delay to match animation before removal
      setTimeout(() => {
        onDelete(topicId);
      }, 300);
    } catch (err) {
      toast.error("Failed to delete topic");
      console.error(err);
      setIsDeleting(false);
    }
  };

  return (
   <div className="flex justify-center">
  <AlertDialog open={open} onOpenChange={setOpen}>
    <AlertDialogTrigger asChild>
      <button
        className="p-2 text-muted-foreground hover:text-red-500 light:text-gray-900 light:hover:text-red-600 transition-colors"
        onClick={() => setOpen(true)}
        disabled={isDeleting}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </AlertDialogTrigger>
    <AlertDialogContent className="light:bg-white light:text-gray-900 dark:bg-background dark:text-white">
      <AlertDialogHeader>
        <AlertDialogTitle className="light:text-gray-900 dark:text-white">
          Delete Topic
        </AlertDialogTitle>
        <AlertDialogDescription className="light:text-gray-700 dark:text-gray-300">
          Are you sure you want to delete this topic? This action cannot be
          undone.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel
          disabled={isDeleting}
          className="light:text-gray-700 dark:text-gray-300"
        >
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={handleDelete}
          disabled={isDeleting}
          className="light:bg-red-500 light:text-white light:hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</div>

  );
}
