"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronDown, Maximize2, Download } from "lucide-react";

interface Subject {
  id: string;
  programId: string;
  theoryCode: string;
  practicalCode: string | null;
  name: string;
  slug: string;
  theoryCredits: number;
  practicalCredits: number | null;
  syllabus: any;
  practicalTopics: any;
  createdAt: string;
}

interface StudyResource {
  id: string;
  subjectId: string;
  name: string;
  type: "notes" | "pyq" | "books" | "practical";
  storageType: "google_drive" | "cloudinary" | "url";
  link: string;
  createdAt: string;
}

interface SubjectDetailViewProps {
  subject: Subject;
  resources: {
    notes: StudyResource[];
    pyq: StudyResource[];
    books: StudyResource[];
    practical: StudyResource[];
  };
}

// Reusable Resource Button Component
interface ResourceButtonProps {
  resource: StudyResource;
  onClick: () => void;
}

function ResourceButton({ resource, onClick }: ResourceButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-between gap-2 p-3 border rounded-md hover:bg-accent transition-colors text-left w-full"
    >
      <span className="text-sm flex-1">{resource.name}</span>
      <Download className="size-4 text-muted-foreground shrink-0" />
    </button>
  );
}

// LocalStorage key prefix for progress
const PROGRESS_STORAGE_KEY = "smriti_subject_progress_";

export function SubjectDetailView({
  subject,
  resources,
}: SubjectDetailViewProps) {
  const [openUnits, setOpenUnits] = useState<Record<number, boolean>>({});
  const [checkedTopics, setCheckedTopics] = useState<
    Record<number, Record<number, boolean>>
  >({});
  const [selectedResource, setSelectedResource] =
    useState<StudyResource | null>(null);

  // Load progress from localStorage on mount
  useEffect(() => {
    const storageKey = `${PROGRESS_STORAGE_KEY}${subject.id}`;
    try {
      const savedProgress = localStorage.getItem(storageKey);
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        setCheckedTopics(parsed);
      }
    } catch (error) {
      console.error("Failed to load progress from localStorage:", error);
    }
  }, [subject.id]);

  // Save progress to localStorage whenever it changes
  const saveProgress = useCallback(
    (newProgress: Record<number, Record<number, boolean>>) => {
      const storageKey = `${PROGRESS_STORAGE_KEY}${subject.id}`;
      try {
        localStorage.setItem(storageKey, JSON.stringify(newProgress));
      } catch (error) {
        console.error("Failed to save progress to localStorage:", error);
      }
    },
    [subject.id],
  );

  const toggleUnit = (index: number) => {
    setOpenUnits((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleTopic = (unitIndex: number, topicIndex: number) => {
    setCheckedTopics((prev) => {
      const newState = {
        ...prev,
        [unitIndex]: {
          ...prev[unitIndex],
          [topicIndex]: !prev[unitIndex]?.[topicIndex],
        },
      };
      // Save to localStorage
      saveProgress(newState);
      return newState;
    });
  };

  const calculateProgress = (
    unitIndex: number,
    topics: string[] | string,
  ): number => {
    if (!topics) return 0;
    const topicsArray = Array.isArray(topics) ? topics : [topics];
    const totalTopics = topicsArray.length;
    if (totalTopics === 0) return 0;

    const checkedCount = topicsArray.reduce((count, _, idx) => {
      return count + (checkedTopics[unitIndex]?.[idx] ? 1 : 0);
    }, 0);

    return (checkedCount / totalTopics) * 100;
  };

  const getResourcePreviewUrl = (resource: StudyResource): string => {
    if (resource.storageType === "google_drive") {
      // Use preview URL for iframe embedding
      return `https://drive.google.com/file/d/${resource.link}/preview`;
    }
    return resource.link;
  };

  const hasLab =
    (subject.practicalCredits && subject.practicalCredits > 0) ||
    (subject.practicalTopics &&
      Array.isArray(subject.practicalTopics) &&
      subject.practicalTopics.length > 0);
  const hasSyllabus = subject.syllabus && Array.isArray(subject.syllabus);
  const hasPracticalTopics =
    subject.practicalTopics && Array.isArray(subject.practicalTopics);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Section: Main Content with Tabs */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">{subject.name}</CardTitle>
          <button className="p-2 hover:bg-accent rounded-md transition-colors">
            <Maximize2 className="size-4" />
          </button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="theory" className="w-full">
            <TabsList className="grid w-full h-full grid-cols-3 sm:grid-cols-6 mb-4">
              <TabsTrigger value="theory">Theory</TabsTrigger>
              <TabsTrigger value="lab" disabled={!hasLab}>
                Lab
              </TabsTrigger>
              <TabsTrigger
                value="notes"
                disabled={resources.notes.length === 0}
              >
                Notes
              </TabsTrigger>
              <TabsTrigger value="pyqs" disabled={resources.pyq.length === 0}>
                PYQs
              </TabsTrigger>
              <TabsTrigger
                value="books"
                disabled={resources.books.length === 0}
              >
                Books
              </TabsTrigger>
              <TabsTrigger
                value="practicals"
                disabled={resources.practical.length === 0}
              >
                Practicals
              </TabsTrigger>
            </TabsList>

            {/* Theory Tab */}
            <TabsContent value="theory" className="space-y-3">
              {hasSyllabus ? (
                subject.syllabus.map((unit: any, index: number) => {
                  const progress = calculateProgress(index, unit.topics);
                  const topicsArray = Array.isArray(unit.topics)
                    ? unit.topics
                    : [unit.topics];
                  const completedCount = topicsArray.reduce(
                    (count: number, _: any, idx: number) =>
                      count + (checkedTopics[index]?.[idx] ? 1 : 0),
                    0,
                  );

                  return (
                    <Collapsible
                      key={index}
                      open={openUnits[index]}
                      onOpenChange={() => toggleUnit(index)}
                    >
                      <CollapsibleTrigger className="w-full">
                        <div className="flex items-center justify-between w-full p-3 sm:p-4 bg-secondary hover:bg-secondary/90 rounded-md transition-colors group gap-2 sm:gap-3">
                          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                            <div className="size-8 sm:size-10 min-w-8 sm:min-w-10 shrink-0 rounded-lg bg-primary/10 flex items-center justify-center">
                              <span className="text-primary font-bold text-xs sm:text-sm">
                                {unit.unit || index + 1}
                              </span>
                            </div>
                            <div className="text-left min-w-0">
                              <div className="font-semibold text-sm truncate">
                                Unit {unit.unit || index + 1}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {completedCount} / {topicsArray.length} topics
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                            <div className="text-xs font-medium text-muted-foreground">
                              {Math.round(progress)}%
                            </div>
                            <ChevronDown className="size-4 sm:size-5 transition-transform group-data-[state=open]:rotate-180" />
                          </div>
                        </div>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="border border-t-0 rounded-b-md overflow-hidden">
                          <Progress
                            value={progress}
                            className="h-1.5 rounded-none"
                          />
                          <div className="p-4 space-y-2">
                            {Array.isArray(unit.topics) ? (
                              unit.topics.map((topic: string, idx: number) => (
                                <label
                                  key={idx}
                                  className="group/item p-3 border rounded-lg flex items-start gap-3 cursor-pointer hover:bg-accent/50 transition-all duration-200"
                                >
                                  <Checkbox
                                    checked={
                                      checkedTopics[index]?.[idx] || false
                                    }
                                    onCheckedChange={() =>
                                      toggleTopic(index, idx)
                                    }
                                    className="mt-0.5"
                                  />
                                  <span className="text-sm leading-relaxed flex-1">
                                    {topic}
                                  </span>
                                </label>
                              ))
                            ) : (
                              <label className="group/item p-3 border rounded-lg flex items-start gap-3 cursor-pointer hover:bg-accent/50 transition-all duration-200">
                                <Checkbox
                                  checked={checkedTopics[index]?.[0] || false}
                                  onCheckedChange={() => toggleTopic(index, 0)}
                                  className="mt-0.5"
                                />
                                <span className="text-sm leading-relaxed flex-1">
                                  {unit.topics}
                                </span>
                              </label>
                            )}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No syllabus information available.
                </div>
              )}
            </TabsContent>

            {/* Lab Tab */}
            <TabsContent value="lab" className="space-y-3">
              {hasPracticalTopics ? (
                <div className="space-y-3">
                  {subject.practicalTopics.map(
                    (experiment: any, index: number) => {
                      // Handle different data structures
                      const experimentNumber =
                        experiment.experiment || experiment.number || index + 1;
                      const objective =
                        experiment.aim?.objective ||
                        experiment.objective ||
                        (typeof experiment === "string"
                          ? experiment
                          : experiment.title ||
                            experiment.name ||
                            `Experiment ${experimentNumber}`);
                      const steps =
                        experiment.aim?.steps || experiment.steps || [];

                      // External link can be in aim object or at experiment level
                      const externalLink =
                        experiment.aim?.externalLinks ||
                        experiment.externalLinks ||
                        null;
                      const storageType =
                        experiment.aim?.storageType ||
                        experiment.storageType ||
                        null;

                      // Construct Google Drive embed URL from file ID
                      const getEmbedUrl = (fileId: string) => {
                        return `https://drive.google.com/file/d/${fileId}/preview`;
                      };

                      return (
                        <Collapsible key={index}>
                          <CollapsibleTrigger className="w-full">
                            <div className="flex items-center justify-between w-full p-3 sm:p-4 bg-secondary hover:bg-secondary/90 rounded-md transition-colors group gap-2 sm:gap-3">
                              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                <div className="size-8 min-w-8 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                                  {experimentNumber}
                                </div>
                                <div className="text-left min-w-0">
                                  <div className="font-semibold text-sm">
                                    Experiment {experimentNumber}
                                  </div>
                                  <div className="text-xs text-muted-foreground line-clamp-1">
                                    {objective}
                                  </div>
                                </div>
                              </div>
                              <ChevronDown className="size-4 sm:size-5 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
                            </div>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <div className="border border-t-0 rounded-b-md p-4 space-y-4">
                              {/* Objective */}
                              <div>
                                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                  Objective
                                </div>
                                <p className="text-sm leading-relaxed">
                                  {objective}
                                </p>
                              </div>

                              {/* Steps */}
                              {steps &&
                                Array.isArray(steps) &&
                                steps.length > 0 && (
                                  <div>
                                    <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                      Steps
                                    </div>
                                    <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                                      {steps.map(
                                        (step: any, stepIndex: number) => (
                                          <li
                                            key={stepIndex}
                                            className="leading-relaxed"
                                          >
                                            {typeof step === "string"
                                              ? step
                                              : step.description ||
                                                step.step ||
                                                step}
                                          </li>
                                        ),
                                      )}
                                    </ol>
                                  </div>
                                )}

                              {/* Resources */}
                              {externalLink && (
                                <div>
                                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                                    Resources
                                  </div>
                                  <div className="rounded-lg overflow-hidden border bg-card">
                                    <iframe
                                      src={
                                        storageType === "google_drive"
                                          ? getEmbedUrl(externalLink)
                                          : externalLink
                                      }
                                      className="w-full h-[500px]"
                                      allow="autoplay"
                                      allowFullScreen
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      );
                    },
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No practical topics available.
                </div>
              )}
            </TabsContent>

            {/* Notes Tab */}
            <TabsContent value="notes" className="space-y-2">
              {resources.notes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {resources.notes.map((resource) => (
                    <ResourceButton
                      key={resource.id}
                      resource={resource}
                      onClick={() => setSelectedResource(resource)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No notes available.
                </div>
              )}
            </TabsContent>

            {/* PYQs Tab */}
            <TabsContent value="pyqs" className="space-y-2">
              {resources.pyq.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {resources.pyq.map((resource) => (
                    <ResourceButton
                      key={resource.id}
                      resource={resource}
                      onClick={() => setSelectedResource(resource)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No PYQs available.
                </div>
              )}
            </TabsContent>

            {/* Books Tab */}
            <TabsContent value="books" className="space-y-2">
              {resources.books.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {resources.books.map((resource) => (
                    <ResourceButton
                      key={resource.id}
                      resource={resource}
                      onClick={() => setSelectedResource(resource)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No books available.
                </div>
              )}
            </TabsContent>

            {/* Practicals Tab */}
            <TabsContent value="practicals" className="space-y-2">
              {resources.practical.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {resources.practical.map((resource) => (
                    <ResourceButton
                      key={resource.id}
                      resource={resource}
                      onClick={() => setSelectedResource(resource)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No practicals available.
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Right Section: Subject Details Card */}
      <Card className="max-h-fit">
        <CardHeader>
          <CardTitle className="text-xl">Subject Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 py-2 border-b">
            <span className="text-sm font-medium w-32">Theory Code</span>
            <span className="text-sm text-muted-foreground">
              {subject.theoryCode}
            </span>
          </div>
          <div className="flex items-center justify-between flex-wrap gap-2 py-2 border-b">
            <span className="text-sm font-medium w-32">Theory Credits</span>
            <span className="text-sm text-muted-foreground">
              {subject.theoryCredits}
            </span>
          </div>
          {subject.practicalCode && (
            <div className="flex items-center justify-between flex-wrap gap-2 py-2 border-b">
              <span className="text-sm font-medium w-32">Practical Code</span>
              <span className="text-sm text-muted-foreground">
                {subject.practicalCode}
              </span>
            </div>
          )}
          {subject.practicalCredits && subject.practicalCredits > 0 && (
            <div className="flex items-center justify-between flex-wrap gap-2 py-2 border-b">
              <span className="text-sm font-medium w-32">
                Practical Credits
              </span>
              <span className="text-sm text-muted-foreground">
                {subject.practicalCredits}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resource Viewer Modal */}
      <Dialog
        open={selectedResource !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedResource(null);
        }}
      >
        <DialogContent className="sm:max-w-5xl w-full h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              {selectedResource?.name || "View Resource"}
            </DialogTitle>
          </DialogHeader>
          {selectedResource && (
            <iframe
              src={getResourcePreviewUrl(selectedResource)}
              className="w-full h-full"
              title={selectedResource.name}
              allow="fullscreen"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
