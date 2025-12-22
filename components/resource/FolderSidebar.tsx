"use client";

import { useState, useEffect, useRef } from "react";
import {
  Folder,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  FileText,
  Video,
  ChevronRight,
  ChevronDown,
  MoreVertical,
  ChevronLeft,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
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
import FolderModal from "./FolderModal";
import axios from "axios";
import { toast } from "sonner";
import { useSidebar } from "@/contexts/SidebarContext";

interface Folder {
  id: string;
  title: string;
  createdAt: string;
}

interface FolderSidebarProps {
  selectedFolderId: string | null;
  onFolderSelect: (folderId: string | null) => void;
  onNewResource?: (folderId?: string) => void;
  resources?: Array<{
    id: string;
    title: string;
    url: string;
    type: string;
    folderId?: string;
  }>;
  onLoadMore?: (folderId: string) => void;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  currentResourceId?: string | null;
  onResourceSelect?: (resourceId: string) => void;
  resourcesByFolder?: Record<
    string,
    Array<{
      id: string;
      title: string;
      url: string;
      type: string;
    }>
  >;
  folders?: Folder[];
  isLoading?: boolean;
  onFoldersChange?: () => void;
  isOnFolderPage?: boolean; // Hide resources for selected folder when on folder page
  onResourcesRefresh?: (folderId: string) => void; // Callback to refresh resources for a folder
}

export default function FolderSidebar({
  selectedFolderId,
  onFolderSelect,
  onNewResource,
  resources = [],
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  currentResourceId = null,
  onResourceSelect,
  resourcesByFolder = {},
  folders: foldersProp = [],
  isLoading: isLoadingProp = false,
  onFoldersChange,
  isOnFolderPage = false,
  onResourcesRefresh,
}: FolderSidebarProps) {
  const router = useRouter();
  const { isCollapsed, setIsCollapsed, toggleSidebar } = useSidebar();
  const [isMobile, setIsMobile] = useState(false);
  const [folders, setFolders] = useState<Folder[]>(foldersProp);
  const [isLoading, setIsLoading] = useState(isLoadingProp);
  const prevFoldersRef = useRef<string>(JSON.stringify(foldersProp));
  const prevLoadingRef = useRef<boolean>(isLoadingProp);

  // Detect mobile/tablet screens
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Sync folders from prop only when they actually change
  useEffect(() => {
    const foldersStr = JSON.stringify(foldersProp);
    // Only update if folders actually changed
    if (prevFoldersRef.current !== foldersStr) {
      prevFoldersRef.current = foldersStr;
      setFolders(foldersProp);
    }
    // Only update if loading state actually changed
    if (prevLoadingRef.current !== isLoadingProp) {
      prevLoadingRef.current = isLoadingProp;
      setIsLoading(isLoadingProp);
    }
  }, [foldersProp, isLoadingProp]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [showNewFolderModal, setShowNewFolderModal] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    new Set()
  );
  const resourcesScrollRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [editingResourceId, setEditingResourceId] = useState<string | null>(
    null
  );
  const [editResourceTitle, setEditResourceTitle] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    open: boolean;
    type: "folder" | "resource" | null;
    id: string | null;
  }>({
    open: false,
    type: null,
    id: null,
  });

  // Auto-expand folder when resource is selected
  useEffect(() => {
    if (selectedFolderId && !expandedFolders.has(selectedFolderId)) {
      setExpandedFolders((prev) => new Set([...prev, selectedFolderId]));
    }
  }, [selectedFolderId, expandedFolders]);

  // Handle scroll for loading more resources per folder
  useEffect(() => {
    if (!onLoadMore || !hasMore || isLoadingMore) return;

    const scrollHandlers: Array<() => void> = [];

    // Add scroll listeners for all expanded folders
    Object.keys(resourcesScrollRefs.current).forEach((folderId) => {
      const container = resourcesScrollRefs.current[folderId];
      if (
        container &&
        expandedFolders.has(folderId) &&
        selectedFolderId === folderId
      ) {
        const handleScroll = () => {
          const { scrollTop, scrollHeight, clientHeight } = container;
          // Load more when user scrolls to within 100px of the bottom
          if (scrollHeight - scrollTop - clientHeight < 100) {
            onLoadMore(folderId);
          }
        };
        container.addEventListener("scroll", handleScroll);
        scrollHandlers.push(() =>
          container.removeEventListener("scroll", handleScroll)
        );
      }
    });

    return () => {
      scrollHandlers.forEach((cleanup) => cleanup());
    };
  }, [onLoadMore, hasMore, isLoadingMore, expandedFolders, selectedFolderId]);

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(folderId)) {
        newSet.delete(folderId);
      } else {
        newSet.add(folderId);
      }
      return newSet;
    });
  };

  // Group resources by folderId
  const getResourcesForFolder = (folderId: string) => {
    // First check resourcesByFolder prop
    if (resourcesByFolder[folderId]) {
      return resourcesByFolder[folderId];
    }
    // Fallback to resources prop (for selected folder)
    if (selectedFolderId === folderId) {
      return resources;
    }
    return [];
  };

  const handleResourceClick = (resourceId: string) => {
    if (onResourceSelect) {
      onResourceSelect(resourceId);
    } else {
      router.push(`/resource/${resourceId}`);
    }
  };

  // Auto-select first folder if none selected
  useEffect(() => {
    if (folders.length > 0 && !selectedFolderId) {
      onFolderSelect(folders[0].id);
    }
  }, [folders, selectedFolderId, onFolderSelect]);

  const handleCreateFolder = async (
    folderName: string
  ): Promise<string | null> => {
    try {
      const response = await axios.post<{ folder: Folder }>("/api/folder", {
        title: folderName.trim(),
      });
      const createdFolder = response.data.folder;
      setFolders((prev) => [...prev, createdFolder]);
      if (onFoldersChange) onFoldersChange();
      toast.success("Folder created");
      return createdFolder.id;
    } catch (error) {
      console.error("Error creating folder:", error);
      toast.error("Failed to create folder");
      return null;
    }
  };

  const handleUpdateFolder = async (id: string, title: string) => {
    if (!title.trim()) {
      setEditingId(null);
      return;
    }

    try {
      await axios.put("/api/folder", { id, title: title.trim() });
      setFolders((prev) =>
        prev.map((f) => (f.id === id ? { ...f, title: title.trim() } : f))
      );
      if (onFoldersChange) onFoldersChange();
      setEditingId(null);
      toast.success("Folder updated");
    } catch (error) {
      console.error("Error updating folder:", error);
      toast.error("Failed to update folder");
    }
  };

  const handleDeleteFolder = async (id: string) => {
    try {
      await axios({
        method: "DELETE",
        url: "/api/folder",
        data: { id },
      });
      const updatedFolders = folders.filter((f) => f.id !== id);
      setFolders(updatedFolders);
      if (onFoldersChange) onFoldersChange();

      // If the deleted folder is the selected folder, navigate to /resource
      if (selectedFolderId === id) {
        onFolderSelect(updatedFolders.length > 0 ? updatedFolders[0].id : null);
        router.push("/resource");
      }

      setDeleteConfirmation({ open: false, type: null, id: null });
      toast.success("Folder deleted");
    } catch (error) {
      console.error("Error deleting folder:", error);
      toast.error("Failed to delete folder");
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    try {
      await axios({
        method: "DELETE",
        url: "/api/resource",
        data: { id: resourceId },
      });

      // If the deleted resource is the current resource, navigate to /resource
      if (currentResourceId === resourceId) {
        router.push("/resource");
      }

      // Refresh resources for the folder that contained this resource
      let folderIdToRefresh: string | null = null;
      const resourceInSelectedFolder = resources.find(
        (r) => r.id === resourceId
      );
      if (resourceInSelectedFolder) {
        folderIdToRefresh = selectedFolderId;
      } else {
        for (const [folderId, folderResources] of Object.entries(
          resourcesByFolder
        )) {
          if (folderResources.some((r) => r.id === resourceId)) {
            folderIdToRefresh = folderId;
            break;
          }
        }
      }

      if (folderIdToRefresh && onResourcesRefresh) {
        onResourcesRefresh(folderIdToRefresh);
      }

      if (onFoldersChange) onFoldersChange();
      setDeleteConfirmation({ open: false, type: null, id: null });
      toast.success("Resource deleted");
    } catch (error) {
      console.error("Error deleting resource:", error);
      toast.error("Failed to delete resource");
    }
  };

  const handleUpdateResource = async (resourceId: string, title: string) => {
    if (!title.trim()) {
      setEditingResourceId(null);
      return;
    }

    try {
      await axios.put("/api/resource", { id: resourceId, title: title.trim() });
      if (onFoldersChange) onFoldersChange();
      setEditingResourceId(null);
      toast.success("Resource renamed");
    } catch (error) {
      console.error("Error updating resource:", error);
      toast.error("Failed to rename resource");
    }
  };

  const handleMoveResource = async (
    resourceId: string,
    targetFolderId: string
  ) => {
    // Find which folder the resource currently belongs to
    // Check resources prop first (for selected folder)
    let currentFolderId: string | null = null;
    const resourceInSelectedFolder = resources.find((r) => r.id === resourceId);
    if (resourceInSelectedFolder) {
      currentFolderId = selectedFolderId;
    } else {
      // Check resourcesByFolder
      for (const [folderId, folderResources] of Object.entries(
        resourcesByFolder
      )) {
        if (folderResources.some((r) => r.id === resourceId)) {
          currentFolderId = folderId;
          break;
        }
      }
    }

    try {
      await axios.put("/api/resource", {
        id: resourceId,
        folderId: targetFolderId,
      });

      // If the moved resource is the currently active resource, switch to target folder in sidebar
      if (currentResourceId === resourceId) {
        onFolderSelect(targetFolderId);
        // Refresh resources for the target folder to show the moved resource
        if (onResourcesRefresh) {
          onResourcesRefresh(targetFolderId);
        }
        // Also refresh the source folder if different to remove it from there
        if (
          currentFolderId &&
          currentFolderId !== targetFolderId &&
          onResourcesRefresh
        ) {
          onResourcesRefresh(currentFolderId);
        }
      } else {
        // If resource is not active, refresh resources for both folders
        if (currentFolderId && onResourcesRefresh) {
          onResourcesRefresh(currentFolderId);
        }
        if (onResourcesRefresh) {
          onResourcesRefresh(targetFolderId);
        }
      }

      if (onFoldersChange) onFoldersChange();
      toast.success("Resource moved");
    } catch (error) {
      console.error("Error moving resource:", error);
      toast.error("Failed to move resource");
    }
  };

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobile) {
      setIsCollapsed(true);
    }
  }, [currentResourceId, isMobile, setIsCollapsed]);

  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && !isCollapsed && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          ${
            isCollapsed
              ? "-translate-x-full lg:translate-x-0 lg:w-16 justify-between"
              : "translate-x-0 lg:w-64"
          }
          ${isMobile ? "fixed left-0 top-16 bottom-0 z-50" : "relative"}
          w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col h-full
          transition-all duration-300 ease-in-out
          overflow-hidden
        `}
      >
        {/* Header */}
        {!isCollapsed || isMobile ? (
          <div className="p-4 border-b border-zinc-800 space-y-2">
            <Button
              onClick={() => setShowNewFolderModal(true)}
              className="w-full bg-[#adff2f] text-black hover:bg-[#9dff07] font-semibold"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Folder
            </Button>
          </div>
        ) : (
          // Collapsed desktop header with icon buttons
          <div className="p-2 border-b border-zinc-800 space-y-2 flex flex-col items-center">
            <Button
              onClick={() => router.push("/resource")}
              className="w-12 h-12 p-0 bg-[#adff2f] text-black hover:bg-[#9dff07] font-semibold"
              title="New Resource"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => router.push("/dashboard")}
              variant="ghost"
              className="w-12 h-12 p-0 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
              title="Dashboard"
            >
              <LayoutDashboard className="h-4 w-4" />
            </Button>
          </div>
        )}

        {/* Folders List with Resources */}
        {(!isCollapsed || isMobile) && (
          <div className="flex-1 overflow-y-auto p-2">
            {isLoading ? (
              // Skeleton loading for folders
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2 rounded-lg animate-pulse"
                  >
                    <div className="w-4 h-4 bg-zinc-700/60 rounded" />
                    <div className="h-4 w-4 bg-zinc-700/60 rounded flex-shrink-0" />
                    <div className="flex-1 h-4 bg-zinc-700/60 rounded" />
                  </div>
                ))}
              </div>
            ) : folders.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-4">
                <Folder className="h-12 w-12 text-zinc-600 mb-2" />
                <p className="text-sm text-zinc-400">No folders yet</p>
                <p className="text-xs text-zinc-500 mt-1">
                  Create your first folder to get started
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {folders.map((folder) => {
                  const folderResources = getResourcesForFolder(folder.id);
                  const isExpanded = expandedFolders.has(folder.id);
                  const isSelected = selectedFolderId === folder.id;

                  return (
                    <div key={folder.id} className="space-y-0.5">
                      {/* Folder Header */}
                      <div
                        className={`group flex items-center gap-1 p-2 rounded-lg cursor-pointer hover:bg-zinc-800 ${
                          isSelected ? "bg-zinc-800" : ""
                        }`}
                      >
                        {/* Expand/Collapse Button */}
                        {!(isOnFolderPage && isSelected) && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFolder(folder.id);
                            }}
                            className="p-0.5 hover:bg-zinc-700 rounded"
                          >
                            {isExpanded ? (
                              <ChevronDown className="h-3 w-3 text-zinc-400" />
                            ) : (
                              <ChevronRight className="h-3 w-3 text-zinc-400" />
                            )}
                          </button>
                        )}
                        {/* Spacer when on folder page to maintain alignment */}
                        {isOnFolderPage && isSelected && (
                          <div className="w-4 h-4 flex-shrink-0" />
                        )}

                        {/* Folder Icon and Name */}
                        <div
                          className="flex-1 flex items-center gap-2 min-w-0 cursor-pointer"
                          onClick={(e) => {
                            if (!editingId) {
                              onFolderSelect(folder.id);
                              // Navigate to folder page when clicking folder
                              router.push(`/folder/${folder.id}`);
                            }
                          }}
                        >
                          <Folder className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                          {editingId === folder.id ? (
                            <div className="flex-1 flex items-center gap-1 min-w-0">
                              <Input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleUpdateFolder(folder.id, editTitle);
                                  } else if (e.key === "Escape") {
                                    setEditingId(null);
                                  }
                                }}
                                className="h-7 text-sm"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                              />
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 flex-shrink-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateFolder(folder.id, editTitle);
                                }}
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 w-6 p-0 flex-shrink-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingId(null);
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ) : (
                            <>
                              <span className="flex-1 text-sm text-zinc-300 truncate min-w-0">
                                {folder.title}
                              </span>
                              {!isSelected && folderResources.length > 0 && (
                                <span className="text-xs text-zinc-500 flex-shrink-0">
                                  ({folderResources.length})
                                </span>
                              )}
                              <div
                                className={`${
                                  isSelected
                                    ? "opacity-100"
                                    : "opacity-0 group-hover:opacity-100"
                                } flex items-center gap-1 flex-shrink-0`}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      className="h-6 w-6 p-0 hover:bg-zinc-700"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                      }}
                                    >
                                      <MoreVertical className="h-3.5 w-3.5" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent
                                    align="end"
                                    className="bg-zinc-800 border-zinc-700 text-zinc-200"
                                  >
                                    <DropdownMenuItem
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingId(folder.id);
                                        setEditTitle(folder.title);
                                      }}
                                      className="cursor-pointer focus:bg-zinc-700"
                                    >
                                      <Edit2 className="h-4 w-4 mr-2" />
                                      Rename
                                    </DropdownMenuItem>
                                    {folders.length > 1 && (
                                      <>
                                        <DropdownMenuSeparator className="bg-zinc-700" />
                                        <DropdownMenuItem
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setDeleteConfirmation({
                                              open: true,
                                              type: "folder",
                                              id: folder.id,
                                            });
                                          }}
                                          variant="destructive"
                                          className="cursor-pointer focus:bg-red-900/20 focus:text-red-400"
                                        >
                                          <Trash2 className="h-4 w-4 mr-2" />
                                          Delete
                                        </DropdownMenuItem>
                                      </>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Resources under folder */}
                      {isExpanded && !(isOnFolderPage && isSelected) && (
                        <div className="ml-6 space-y-0.5">
                          <div
                            ref={(el) => {
                              resourcesScrollRefs.current[folder.id] = el;
                            }}
                            className="max-h-64 overflow-y-auto space-y-0.5"
                          >
                            {folderResources.length === 0 &&
                            isLoadingMore &&
                            isSelected ? (
                              <div className="flex items-center justify-center p-4">
                                <div className="w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                              </div>
                            ) : (
                              <>
                                {folderResources.map((resource) => (
                                  <div
                                    key={resource.id}
                                    className={`group flex items-center gap-2.5 pl-6 pr-2 py-2 rounded hover:bg-zinc-800 transition-colors ${
                                      currentResourceId === resource.id
                                        ? "bg-zinc-800 border-l-2 border-zinc-400"
                                        : ""
                                    }`}
                                  >
                                    {editingResourceId === resource.id ? (
                                      <>
                                        {resource.type === "VIDEO" ? (
                                          <Video className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                                        ) : (
                                          <FileText className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                                        )}
                                        <Input
                                          value={editResourceTitle}
                                          onChange={(e) =>
                                            setEditResourceTitle(e.target.value)
                                          }
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                              handleUpdateResource(
                                                resource.id,
                                                editResourceTitle
                                              );
                                            } else if (e.key === "Escape") {
                                              setEditingResourceId(null);
                                            }
                                          }}
                                          className="h-6 text-sm flex-1"
                                          autoFocus
                                          onClick={(e) => e.stopPropagation()}
                                        />
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-5 w-5 p-0 flex-shrink-0"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleUpdateResource(
                                              resource.id,
                                              editResourceTitle
                                            );
                                          }}
                                        >
                                          <Check className="h-3 w-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-5 w-5 p-0 flex-shrink-0"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            setEditingResourceId(null);
                                          }}
                                        >
                                          <X className="h-3 w-3" />
                                        </Button>
                                      </>
                                    ) : (
                                      <>
                                        <div
                                          className="flex items-center gap-2.5 flex-1 min-w-0 cursor-pointer"
                                          onClick={() =>
                                            handleResourceClick(resource.id)
                                          }
                                        >
                                          {resource.type === "VIDEO" ? (
                                            <Video className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                                          ) : (
                                            <FileText className="h-4 w-4 text-zinc-400 flex-shrink-0" />
                                          )}
                                          <span className="flex-1 text-sm text-zinc-300 truncate leading-relaxed">
                                            {resource.title}
                                          </span>
                                        </div>
                                        <div
                                          className="opacity-0 group-hover:opacity-100 flex-shrink-0"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                              <Button
                                                size="sm"
                                                variant="ghost"
                                                className="h-5 w-5 p-0 hover:bg-zinc-700"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                }}
                                              >
                                                <MoreVertical className="h-3 w-3" />
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent
                                              align="end"
                                              className="bg-zinc-800 border-zinc-700 text-zinc-200"
                                            >
                                              <DropdownMenuItem
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setEditingResourceId(
                                                    resource.id
                                                  );
                                                  setEditResourceTitle(
                                                    resource.title
                                                  );
                                                }}
                                                className="cursor-pointer focus:bg-zinc-700"
                                              >
                                                <Edit2 className="h-4 w-4 mr-2" />
                                                Rename
                                              </DropdownMenuItem>
                                              <DropdownMenuSub>
                                                <DropdownMenuSubTrigger className="cursor-pointer focus:bg-zinc-700">
                                                  <Folder className="h-4 w-4 mr-2" />
                                                  Move to...
                                                </DropdownMenuSubTrigger>
                                                <DropdownMenuPortal>
                                                  <DropdownMenuSubContent className="bg-zinc-800 border-zinc-700 text-zinc-200">
                                                    {folders
                                                      .filter(
                                                        (f) =>
                                                          f.id !== folder.id
                                                      )
                                                      .map((targetFolder) => (
                                                        <DropdownMenuItem
                                                          key={targetFolder.id}
                                                          onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleMoveResource(
                                                              resource.id,
                                                              targetFolder.id
                                                            );
                                                          }}
                                                          className="cursor-pointer focus:bg-zinc-700"
                                                        >
                                                          <Folder className="h-4 w-4 mr-2" />
                                                          {targetFolder.title}
                                                        </DropdownMenuItem>
                                                      ))}
                                                    {folders.filter(
                                                      (f) => f.id !== folder.id
                                                    ).length === 0 && (
                                                      <DropdownMenuItem
                                                        disabled
                                                        className="text-zinc-500"
                                                      >
                                                        No other folders
                                                      </DropdownMenuItem>
                                                    )}
                                                  </DropdownMenuSubContent>
                                                </DropdownMenuPortal>
                                              </DropdownMenuSub>
                                              <DropdownMenuSeparator className="bg-zinc-700" />
                                              <DropdownMenuItem
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  setDeleteConfirmation({
                                                    open: true,
                                                    type: "resource",
                                                    id: resource.id,
                                                  });
                                                }}
                                                variant="destructive"
                                                className="cursor-pointer focus:bg-red-900/20 focus:text-red-400"
                                              >
                                                <Trash2 className="h-4 w-4 mr-2" />
                                                Delete
                                              </DropdownMenuItem>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        </div>
                                      </>
                                    )}
                                  </div>
                                ))}
                                {isLoadingMore &&
                                  isSelected &&
                                  folderResources.length > 0 && (
                                    <div className="flex items-center justify-center p-2">
                                      <div className="w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                  )}
                                {!hasMore &&
                                  isSelected &&
                                  folderResources.length > 0 && (
                                    <div className="text-xs text-zinc-500 text-center p-2">
                                      No more resources
                                    </div>
                                  )}
                                {folderResources.length === 0 &&
                                  !isLoadingMore &&
                                  isSelected && (
                                    <div className="text-xs text-zinc-500 text-center p-4">
                                      No resources in this folder
                                    </div>
                                  )}
                              </>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Folder Modal */}
        <FolderModal
          open={showNewFolderModal}
          onOpenChange={setShowNewFolderModal}
          onCreateFolder={async (folderName) => {
            const folderId = await handleCreateFolder(folderName);
            if (folderId) {
              // Navigate to the new folder page
              router.push(`/folder/${folderId}`);
            }
            return folderId;
          }}
        />

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={deleteConfirmation.open}
          onOpenChange={(open) => {
            setDeleteConfirmation((prev) => ({
              ...prev,
              open,
              ...(open ? {} : { type: null, id: null }),
            }));
          }}
        >
          <AlertDialogContent className="bg-zinc-800 border-zinc-700 text-zinc-200">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Delete{" "}
                {deleteConfirmation.type === "folder" ? "Folder" : "Resource"}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-zinc-400">
                Are you sure you want to delete this {deleteConfirmation.type}?
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setDeleteConfirmation({ open: false, type: null, id: null });
                }}
                className="bg-zinc-700 hover:bg-zinc-600 text-zinc-200 border-zinc-600"
              >
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  if (deleteConfirmation.id) {
                    if (deleteConfirmation.type === "folder") {
                      handleDeleteFolder(deleteConfirmation.id);
                    } else if (deleteConfirmation.type === "resource") {
                      handleDeleteResource(deleteConfirmation.id);
                    }
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Collapse Toggle Button - Always visible at bottom */}
        <div className="border-t border-zinc-800 p-2 flex justify-center">
          <Button
            onClick={toggleSidebar}
            variant="ghost"
            className="w-12 h-12 p-0 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            <ChevronLeft
              className={`h-4 w-4 transition-transform duration-300 ${
                isCollapsed ? "rotate-180" : ""
              }`}
            />
          </Button>
        </div>
      </div>
    </>
  );
}
