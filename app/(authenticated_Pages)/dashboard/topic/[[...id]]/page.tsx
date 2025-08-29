"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TopicHeader from "@/components/topic/TopicHeader";
import TopicModal from "@/components/topic/TopicModal";
import ResourceGrid from "@/components/topic/ResourceGrid";
import ResourceModal from "@/components/topic/ResourceModal";
import DeleteDialog from "@/components/topic/DeleteDialog";
import SearchBar from "@/components/topic/SearchBar";
import { useTopic } from "@/hooks/useTopic";
import { useResources } from "@/hooks/useResources";
import dynamic from "next/dynamic";
import TopicQuizProgress from "@/components/topic/TopicQuizProgress";

// Dynamically import the RichTextEditor for performance
const RichTextEditor = dynamic(() => import("@/components/notes/RichTextEditor"), { ssr: false });

export default function TopicPage({ params }: { params: any }) {
  const rawId = (use(params) as { id: string | string[] }).id;
  const id = Array.isArray(rawId) ? rawId[0] : rawId;
  const router = useRouter();

  const {
    topicId,
    topicName,
    setTopicName,
    topicModalOpen,
    setTopicModalOpen,
    editMode,
    handleSaveTopic,
    isLoading: isTopicLoading,
  } = useTopic(id);

  const {
    media,
    filteredMedia,
    search,
    setSearch,
    resourceModalOpen,
    setResourceModalOpen,
    newResourceType,
    setNewResourceType,
    youtubeUrl,
    setYoutubeUrl,
    pdfTitle,
    setPdfTitle,
    pdfFile,
    setPdfFile,
    notesTitle,
    setNotesTitle,
    notesContent,
    setNotesContent,
    handleAddResource,
    deleteDialogOpen,
    setDeleteDialogOpen,
    resourceToDelete,
    setResourceToDelete,
    handleDeleteResource,
    isLoading: isResourceLoading,
    isDeleting,
  } = useResources(id);

  const handleResourceClick = (item: any) => {
    router.push(`/dashboard/resource/${item.id}`);
  };

  const isLoading = isTopicLoading || isResourceLoading;

  const handleCancelModal = () => {
    if (!id) {
      router.push("/dashboard");
    }
    setTopicModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
      <TopicModal
        open={topicModalOpen}
        setOpen={setTopicModalOpen}
        topicName={topicName}
        setTopicName={setTopicName}
        editMode={editMode}
        onSave={handleSaveTopic}
        onCancel={handleCancelModal}
      />
      <div className="mb-6 flex items-center justify-between gap-4">
        <TopicHeader
          topicName={topicName}
          onClick={() => setTopicModalOpen(true)}
        />
        <Button onClick={() => setResourceModalOpen(true)} className="gap-2">
          <PlusCircle className="h-4 w-4" />
          Add Resource
        </Button>
      </div>
      <Tabs defaultValue="resources" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
          <TabsTrigger value="quiz-progress">Quiz Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="resources" className="mt-4">
          <ResourceModal
            open={resourceModalOpen}
            setOpen={setResourceModalOpen}
            resourceType={newResourceType}
            setResourceType={setNewResourceType}
            youtubeUrl={youtubeUrl}
            setYoutubeUrl={setYoutubeUrl}
            pdfTitle={pdfTitle}
            setPdfTitle={setPdfTitle}
            setPdfFile={setPdfFile}
            notesTitle={notesTitle}
            setNotesTitle={setNotesTitle}
            notesContent={notesContent}
            setNotesContent={setNotesContent}
            onAdd={handleAddResource}
            isLoading={isLoading}
            pdfFile={pdfFile}
          />
          <DeleteDialog
            open={deleteDialogOpen}
            onOpenChange={setDeleteDialogOpen}
            resourceTitle={resourceToDelete?.title || ""}
            onDelete={handleDeleteResource}
            isDeleting={isDeleting}
          />
          {media.length > 0 && (
            <SearchBar value={search} onChange={setSearch} />
          )}
          <ResourceGrid
            isLoading={isLoading}
            media={filteredMedia}
            onResourceClick={handleResourceClick}
            onDeleteClick={(item) => {
              setResourceToDelete(item);
              setDeleteDialogOpen(true);
            }}
          />
        </TabsContent>

        <TabsContent value="notes" className="mt-4">
           {id ? (
            <RichTextEditor topicId={id} />
            ) : (
              <p className="text-muted-foreground">Open a topic to write notes.</p>
            )}
        </TabsContent>

        {/* CHANGE: Added a guard to prevent rendering when id is missing */}
        <TabsContent value="quiz-progress" className="mt-4">
          {id ? (
            <TopicQuizProgress topicId={id} />
          ) : (
            <p className="text-center text-muted-foreground">
              Select a topic to view your quiz progress.
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}