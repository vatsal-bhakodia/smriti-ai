"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Brain,
  Trash2,
  Search,
  Upload,
  X,
  Pencil,
  Check,
  FileText,
} from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import Image from "next/image";
import { getYouTubeThumbnail } from "@/utils/youtube";
import { ResourceItem } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import AddResourceForm from "@/components/AddResourceForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface ResourceResponse {
  resource?: {
    id: string;
    title: string;
    url: string;
    summary: string;
    type: string;
    folderId?: string;
  };
  resources?: Array<{
    id: string;
    title: string;
    url: string;
    type: string;
  }>;
}

interface FolderResponse {
  folder?: {
    id: string;
    title: string;
    createdAt: string;
  };
}

export default function FolderPage({ params }: { params: any }) {
  const rawId = (use(params) as { id: string }).id;
  const folderId = rawId;
  const router = useRouter();

  const [folderName, setFolderName] = useState("");
  const [isLoadingFolder, setIsLoadingFolder] = useState(true);
  const [isEditingFolderName, setIsEditingFolderName] = useState(false);
  const [editedFolderName, setEditedFolderName] = useState("");
  const [showAddResource, setShowAddResource] = useState(false);
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [isLoadingResources, setIsLoadingResources] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [resourceToDelete, setResourceToDelete] = useState<string | null>(null);

  // Load folder name
  useEffect(() => {
    const loadFolderName = async () => {
      if (!folderId) return;

      setIsLoadingFolder(true);
      try {
        const folderRes = await axios.get<FolderResponse>("/api/folder", {
          params: { id: folderId },
        });
        if (folderRes.data.folder) {
          setFolderName(folderRes.data.folder.title);
        }
      } catch (error) {
        console.error("Error loading folder:", error);
        toast.error("Failed to load folder");
      } finally {
        setIsLoadingFolder(false);
      }
    };

    loadFolderName();
  }, [folderId]);

  // Load resources
  useEffect(() => {
    const loadResources = async () => {
      if (!folderId) return;

      setIsLoadingResources(true);
      try {
        const res = await axios.get<ResourceResponse>("/api/resource", {
          params: { folderId: folderId },
        });
        setResources(
          (res.data.resources || []).map((r) => ({
            id: r.id,
            title: r.title,
            type: r.type as "VIDEO" | "PDF" | "TEXT",
            url: r.url,
          }))
        );
      } catch (error) {
        console.error("Error loading resources:", error);
        toast.error("Failed to load resources");
      } finally {
        setIsLoadingResources(false);
      }
    };

    loadResources();
  }, [folderId]);

  const handleResourceCreated = async (resourceId: string) => {
    // Reload resources
    const res = await axios.get<ResourceResponse>("/api/resource", {
      params: { folderId: folderId },
    });
    setResources(
      (res.data.resources || []).map((r) => ({
        id: r.id,
        title: r.title,
        type: r.type as "VIDEO" | "PDF" | "TEXT",
        url: r.url,
      }))
    );
    setShowAddResource(false);
  };

  const handleResourceClick = (resourceId: string) => {
    router.push(`/resource/${resourceId}`);
  };

  const handleDeleteResource = async () => {
    if (!resourceToDelete) return;

    try {
      await axios({
        method: "DELETE",
        url: "/api/resource",
        data: { id: resourceToDelete },
      });
      // Reload resources
      const res = await axios.get<ResourceResponse>("/api/resource", {
        params: { folderId: folderId },
      });
      setResources(
        (res.data.resources || []).map((r) => ({
          id: r.id,
          title: r.title,
          type: r.type as "VIDEO" | "PDF" | "TEXT",
          url: r.url,
        }))
      );
      toast.success("Resource deleted");
      setResourceToDelete(null);
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast.error("Failed to delete resource");
      setResourceToDelete(null);
    }
  };

  // Filter resources based on search query
  const filteredResources = resources.filter((resource) =>
    resource.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStartEditFolderName = () => {
    setEditedFolderName(folderName);
    setIsEditingFolderName(true);
  };

  const handleCancelEditFolderName = () => {
    setIsEditingFolderName(false);
    setEditedFolderName("");
  };

  const handleSaveFolderName = async () => {
    if (!editedFolderName.trim()) {
      toast.error("Folder name cannot be empty");
      return;
    }

    if (editedFolderName.trim() === folderName) {
      setIsEditingFolderName(false);
      return;
    }

    try {
      await axios.put("/api/folder", {
        id: folderId,
        title: editedFolderName.trim(),
      });
      setFolderName(editedFolderName.trim());
      setIsEditingFolderName(false);
      toast.success("Folder renamed");
    } catch (error) {
      console.error("Error renaming folder:", error);
      toast.error("Failed to rename folder");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 pt-24">
      {/* Folder Name Header */}
      <div className="mb-8">
        {isLoadingFolder ? (
          <Skeleton className="h-9 w-64 mb-6 bg-zinc-800" />
        ) : isEditingFolderName ? (
          <div className="flex items-center gap-3 mb-6">
            <Input
              value={editedFolderName}
              onChange={(e) => setEditedFolderName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSaveFolderName();
                } else if (e.key === "Escape") {
                  handleCancelEditFolderName();
                }
              }}
              className="text-3xl font-bold text-white bg-zinc-800/60 border-zinc-700/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 transition-all h-auto py-2 px-4"
              autoFocus
            />
            <Button
              onClick={handleSaveFolderName}
              size="icon"
              className="bg-primary text-black hover:bg-primary-dark h-9 w-9"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              onClick={handleCancelEditFolderName}
              size="icon"
              variant="ghost"
              className="text-zinc-400 hover:text-white hover:bg-zinc-800 h-9 w-9"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3 group">
              <h1 className="text-3xl font-bold text-white">{folderName}</h1>
              <Pencil
                onClick={handleStartEditFolderName}
                className="text-zinc-400 hover:text-primary hover:bg-zinc-800/50 transition-opacity h-6 w-6 cursor-pointer"
              />
            </div>
            <Button
              onClick={() => setShowAddResource(!showAddResource)}
              className="bg-primary text-black hover:bg-primary-dark font-semibold"
            >
              {showAddResource ? (
                <>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Add New
                </>
              )}
            </Button>
          </div>
        )}

        {/* Resource Input Area */}
        {showAddResource && (
          <AddResourceForm
            folderId={folderId}
            onResourceCreated={handleResourceCreated}
            onCancel={() => setShowAddResource(false)}
            showCancelButton={true}
          />
        )}

        {/* Search Bar */}
        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search resources..."
            className="pl-10 bg-zinc-900/80 border-zinc-800 text-white placeholder:text-zinc-500 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* Resources Grid */}
      {isLoadingResources ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-zinc-900 rounded-lg overflow-hidden"
              style={{ maxWidth: "320px" }}
            >
              <Skeleton className="w-full aspect-video bg-zinc-800" />
              <div className="p-4">
                <Skeleton className="h-4 w-full bg-zinc-800 mb-2" />
                <Skeleton className="h-4 w-3/4 bg-zinc-800" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredResources.length === 0 ? (
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center max-w-md">
            <Brain className="h-16 w-16 mx-auto mb-4 text-zinc-600" />
            <h2 className="text-2xl font-bold mb-2 text-white">
              {resources.length === 0
                ? "No resources yet"
                : "No resources found"}
            </h2>
            <p className="text-zinc-400 mb-6">
              {resources.length === 0
                ? "Add your first resource above to get started"
                : searchQuery
                ? `No resources match "${searchQuery}"`
                : "Add your first resource above to get started"}
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {filteredResources.map((resource) => (
            <div
              key={resource.id}
              className="relative group cursor-pointer bg-zinc-900 rounded-lg overflow-hidden hover:ring-2 hover:ring-primary transition"
              style={{ maxWidth: "320px" }}
              onClick={() => handleResourceClick(resource.id)}
            >
              {/* Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setResourceToDelete(resource.id);
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-zinc-800 text-white hover:text-red-600 p-2 rounded-full transition z-10"
              >
                <Trash2 className="h-4 w-4" />
              </button>

              {resource.type === "VIDEO" ? (
                <div className="w-full aspect-video relative">
                  <Image
                    src={getYouTubeThumbnail(resource.url)}
                    alt={resource.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-full aspect-video flex items-center justify-center bg-zinc-800">
                  <FileText className="h-12 w-12 text-zinc-600" />
                </div>
              )}
              <div className="p-4">
                <p className="text-sm font-medium truncate text-white">
                  {resource.title}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={resourceToDelete !== null}
        onOpenChange={(open) => !open && setResourceToDelete(null)}
      >
        <AlertDialogContent className="bg-zinc-900 border-zinc-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Resource
            </AlertDialogTitle>
            <AlertDialogDescription className="text-zinc-400">
              Are you sure you want to delete this resource? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-zinc-800 text-white hover:bg-zinc-700 border-zinc-700">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteResource}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
