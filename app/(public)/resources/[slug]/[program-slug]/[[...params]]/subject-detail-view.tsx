"use client";

import { useState } from "react";
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
import Banner from "@/components/ads/Banner";

interface Subject {
  id: string;
  programId: string;
  code: string;
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
      <Download className="size-4 text-muted-foreground flex-shrink-0" />
    </button>
  );
}

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

  const toggleUnit = (index: number) => {
    setOpenUnits((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleTopic = (unitIndex: number, topicIndex: number) => {
    setCheckedTopics((prev) => ({
      ...prev,
      [unitIndex]: {
        ...prev[unitIndex],
        [topicIndex]: !prev[unitIndex]?.[topicIndex],
      },
    }));
  };

  const calculateProgress = (
    unitIndex: number,
    topics: string[] | string
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

  const getResourceUrl = (resource: StudyResource): string => {
    if (resource.storageType === "google_drive") {
      return `https://drive.google.com/file/d/${resource.link}/view?usp=drivesdk`;
    }
    return resource.link;
  };

  const getResourcePreviewUrl = (resource: StudyResource): string => {
    if (resource.storageType === "google_drive") {
      // Use preview URL for iframe embedding
      return `https://drive.google.com/file/d/${resource.link}/preview`;
    }
    return resource.link;
  };

  const hasLab = subject.practicalCredits && subject.practicalCredits > 0;
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
            <TabsList className="grid w-full grid-cols-6 mb-4">
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
                subject.syllabus.map((unit: any, index: number) => (
                  <Collapsible
                    key={index}
                    open={openUnits[index]}
                    onOpenChange={() => toggleUnit(index)}
                  >
                    <CollapsibleTrigger className="w-full">
                      <div className="flex items-center justify-between w-full p-4 bg-secondary hover:bg-secondary/90 rounded-md transition-colors">
                        <span className="font-semibold">
                          Unit {unit.unit || index + 1}
                        </span>
                        <ChevronDown
                          className={`size-5 transition-transform ${
                            openUnits[index] ? "transform rotate-180" : ""
                          }`}
                        />
                      </div>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="border border-t-0 rounded-b-md overflow-hidden">
                        {unit.topics && (
                          <>
                            <Progress
                              value={calculateProgress(index, unit.topics)}
                              className="h-2 rounded-none bg-transparent"
                            />
                            {/* Checkboxes */}
                            <div className="p-4 space-y-2">
                              {Array.isArray(unit.topics) ? (
                                unit.topics.map(
                                  (topic: string, idx: number) => (
                                    <label
                                      key={idx}
                                      className="p-2 border-2 border-muted-foreground/10 rounded-md flex items-center gap-4 text-white/70 cursor-pointer hover:text-foreground transition-colors"
                                    >
                                      <Checkbox
                                        checked={
                                          checkedTopics[index]?.[idx] || false
                                        }
                                        onCheckedChange={() =>
                                          toggleTopic(index, idx)
                                        }
                                      />
                                      <span>{topic}</span>
                                    </label>
                                  )
                                )
                              ) : (
                                <label className="flex items-center gap-2 text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                                  <Checkbox
                                    checked={checkedTopics[index]?.[0] || false}
                                    onCheckedChange={() =>
                                      toggleTopic(index, 0)
                                    }
                                  />
                                  <span>{unit.topics}</span>
                                </label>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No syllabus information available.
                </div>
              )}
            </TabsContent>

            {/* Lab Tab */}
            <TabsContent value="lab" className="space-y-3">
              {hasPracticalTopics ? (
                <div className="space-y-4">
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

                      return (
                        <div
                          key={index}
                          className="p-4 border rounded-md space-y-2"
                        >
                          <div className="font-semibold text-base">
                            Experiment {experimentNumber}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {objective}
                          </div>
                          {steps &&
                            Array.isArray(steps) &&
                            steps.length > 0 && (
                              <div className="mt-2 space-y-1">
                                <div className="text-xs font-medium text-muted-foreground">
                                  Steps:
                                </div>
                                <ul className="list-disc list-inside space-y-1 text-xs text-muted-foreground ml-2">
                                  {steps.map((step: any, stepIndex: number) => (
                                    <li key={stepIndex}>
                                      {typeof step === "string"
                                        ? step
                                        : step.description || step.step || step}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                        </div>
                      );
                    }
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
      <div className="flex flex-col gap-6">
        <Card className="max-h-fit">
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b">
              <span className="text-sm font-medium">Theory Code</span>
              <span className="text-sm text-muted-foreground">
                {subject.code}
              </span>
            </div>
            <div className="flex items-center justify-between border-b">
              <span className="text-sm font-medium">Theory Credits</span>
              <span className="text-sm text-muted-foreground">
                {subject.theoryCredits}
              </span>
            </div>
            {subject.practicalCredits && subject.practicalCredits > 0 && (
              <div className="flex items-center justify-between border-b">
                <span className="text-sm font-medium">Practical Credits</span>
                <span className="text-sm text-muted-foreground">
                  {subject.practicalCredits}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
        {/* banner ad */}
        <Card className="p-2">
          <Banner size="300x250" />
        </Card>
      </div>
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
