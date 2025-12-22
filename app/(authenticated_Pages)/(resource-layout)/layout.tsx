"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import FolderSidebar from "@/components/resource/FolderSidebar";
import axios from "axios";

interface Folder {
  id: string;
  title: string;
  createdAt: string;
}

interface ResourceResponse {
  resources?: Array<{
    id: string;
    title: string;
    url: string;
    type: string;
    folderId?: string;
  }>;
  hasMore?: boolean;
}

interface FolderResponse {
  folders: Folder[];
  folder?: Folder;
}

const RESOURCES_PER_PAGE = 20;

export default function ResourceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [isLoadingFolders, setIsLoadingFolders] = useState(true);
  const [resources, setResources] = useState<any[]>([]);
  const [resourcesFolderId, setResourcesFolderId] = useState<string | null>(
    null
  ); // Track which folder resources belong to
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Extract resourceId from pathname
  const resourceId = pathname?.startsWith("/resource/")
    ? pathname.split("/resource/")[1]?.split("/")[0]
    : null;

  // Extract folderId from pathname
  const folderId = pathname?.startsWith("/folder/")
    ? pathname.split("/folder/")[1]?.split("/")[0]
    : null;

  // Load folders
  useEffect(() => {
    const fetchFolders = async () => {
      setIsLoadingFolders(true);
      try {
        const response = await axios.get<FolderResponse>("/api/folder");
        setFolders(
          response.data.folders.map((t) => ({
            id: t.id,
            title: t.title,
            createdAt: t.createdAt,
          }))
        );
      } catch (error) {
        console.error("Error fetching folders:", error);
      } finally {
        setIsLoadingFolders(false);
      }
    };

    fetchFolders();
  }, []);

  // Set selected folder based on pathname or default
  useEffect(() => {
    if (folderId) {
      setSelectedFolderId(folderId);
    } else if (!selectedFolderId && !isLoadingFolders && folders.length > 0) {
      setSelectedFolderId(folders[0].id);
    }
  }, [folderId, folders, isLoadingFolders, selectedFolderId]);

  // Load resources for selected folder
  useEffect(() => {
    if (!selectedFolderId) {
      setResources([]);
      setResourcesFolderId(null);
      setPage(0);
      setHasMore(false);
      return;
    }

    // Clear resources immediately when folder changes to prevent showing old resources
    setResources([]);
    setResourcesFolderId(null);
    setPage(0);
    setHasMore(true);
    setIsLoadingMore(true);

    const loadFolderResources = async () => {
      try {
        const res = await axios.get<ResourceResponse>("/api/resource", {
          params: {
            folderId: selectedFolderId,
            limit: RESOURCES_PER_PAGE,
            skip: 0,
          },
        });

        // Only update if we're still on the same folder
        setResources(res.data.resources || []);
        setResourcesFolderId(selectedFolderId);
        setHasMore(res.data.hasMore ?? false);
        setPage(1);
      } catch (error) {
        console.error("Error loading folder resources:", error);
      } finally {
        setIsLoadingMore(false);
      }
    };

    loadFolderResources();
  }, [selectedFolderId]);

  // Load more resources function
  const loadMoreResources = useCallback(
    async (targetFolderId?: string) => {
      const targetId = targetFolderId || selectedFolderId;
      if (!targetId || !hasMore || isLoadingMore) return;
      if (targetId !== selectedFolderId) return;

      setIsLoadingMore(true);
      try {
        const currentSkip = resources.length;
        const res = await axios.get<ResourceResponse>("/api/resource", {
          params: {
            folderId: targetId,
            limit: RESOURCES_PER_PAGE,
            skip: currentSkip,
          },
        });

        setResources((prev) => [...prev, ...(res.data.resources || [])]);
        setHasMore(res.data.hasMore ?? false);
        setPage((prev) => prev + 1);
      } catch (error) {
        console.error("Error loading more resources:", error);
      } finally {
        setIsLoadingMore(false);
      }
    },
    [selectedFolderId, hasMore, isLoadingMore, resources.length]
  );

  // Refresh resources for a specific folder
  const refreshResources = useCallback(
    async (folderId: string) => {
      // If this is the currently selected folder, refresh its resources
      if (folderId === selectedFolderId && folderId === resourcesFolderId) {
        setIsLoadingMore(true);
        try {
          const res = await axios.get<ResourceResponse>("/api/resource", {
            params: {
              folderId: folderId,
              limit: RESOURCES_PER_PAGE,
              skip: 0,
            },
          });

          setResources(res.data.resources || []);
          setResourcesFolderId(folderId);
          setHasMore(res.data.hasMore ?? false);
          setPage(1);
        } catch (error) {
          console.error("Error refreshing resources:", error);
        } finally {
          setIsLoadingMore(false);
        }
      }
    },
    [selectedFolderId, resourcesFolderId]
  );

  return (
    <div className="h-[calc(100vh-56px)] -mt-10 bg-zinc-950 text-foreground flex">
      {/* Sidebar */}
      <FolderSidebar
        selectedFolderId={selectedFolderId}
        onFolderSelect={(folderId) => {
          setSelectedFolderId(folderId);
        }}
        resources={selectedFolderId === resourcesFolderId ? resources : []}
        onLoadMore={loadMoreResources}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        currentResourceId={resourceId}
        onResourceSelect={(id) => {
          router.push(`/resource/${id}`);
        }}
        folders={folders}
        isLoading={isLoadingFolders}
        onFoldersChange={() => {
          // Refetch folders when they change
          const fetchFolders = async () => {
            try {
              const response = await axios.get<FolderResponse>("/api/folder");
              setFolders(
                response.data.folders.map((t) => ({
                  id: t.id,
                  title: t.title,
                  createdAt: t.createdAt,
                }))
              );
            } catch (error) {
              console.error("Error fetching folders:", error);
            }
          };
          fetchFolders();
        }}
        onResourcesRefresh={refreshResources}
        isOnFolderPage={!!folderId}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">{children}</div>
    </div>
  );
}
