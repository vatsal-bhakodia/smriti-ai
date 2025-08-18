// /components/dashboard/studyreminder.tsx

"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AddReminderModal } from "./addremindermodal";
import type { StudyTime, Frequency } from "@/types";
import { BellRing, Edit, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useLocalStorageState } from "@/hooks/useLocalStorageState";

const formatFrequency = (frequency: Frequency): string => {
    if (frequency.type === 'daily') return 'Daily';
    if (frequency.type === 'custom') {
        if (frequency.days.length === 7) return 'Daily';
        if (frequency.days.join(',') === '1,2,3,4,5') return 'Weekdays';
        if (frequency.days.join(',') === '0,6') return 'Weekends';
        if (frequency.days.length === 0) return 'No days selected';
        const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        return frequency.days.map(d => dayMap[d]).join(', ');
    }
    return '';
};

export function StudyReminder() {
  const [studyTimes, setStudyTimes] = useLocalStorageState<StudyTime[]>('studyTimes', []);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingReminder, setEditingReminder] = React.useState<StudyTime | null>(null);

  const sortedReminders = React.useMemo(() => {
    return [...studyTimes].sort((a, b) => a.time.localeCompare(b.time));
  }, [studyTimes]);
  
  const handleSave = (reminder: StudyTime) => {
    // UPDATED: Added 'StudyTime' type to 'existing'
    const isDuplicate = studyTimes.some((existing: StudyTime) => {
        if (editingReminder && existing.id === editingReminder.id) return false;
        const sameTime = existing.time === reminder.time;
        const sameFreqType = existing.frequency.type === reminder.frequency.type;
        if (!sameTime || !sameFreqType) return false;
        if (reminder.frequency.type === 'daily') return true;
        if (reminder.frequency.type === 'custom' && existing.frequency.type === 'custom') {
            return JSON.stringify(existing.frequency.days) === JSON.stringify(reminder.frequency.days);
        }
        return false;
    });

    if (isDuplicate) {
        toast.error("A reminder with this time and frequency already exists.");
        return;
    }
    
    // UPDATED: Added 'StudyTime[]' type to 'prev' and 'StudyTime' to 'r'
    setStudyTimes((prev: StudyTime[]) => {
        const exists = prev.some((r: StudyTime) => r.id === reminder.id);
        const newTimes = exists ? prev.map((r: StudyTime) => r.id === reminder.id ? reminder : r) : [...prev, reminder];
        return newTimes;
    });

    toast.success(editingReminder ? "Reminder updated!" : "Reminder added!");
    setIsModalOpen(false);
  };

  // UPDATED: Added 'StudyTime[]' type to 'prev' and 'StudyTime' to 'r'
  const handleDelete = (id: string) => setStudyTimes((prev: StudyTime[]) => prev.filter((r: StudyTime) => r.id !== id));
  // UPDATED: Added 'StudyTime[]' type to 'prev' and 'StudyTime' to 'r'
  const handleToggle = (id: string, isEnabled: boolean) => setStudyTimes((prev: StudyTime[]) => prev.map((r: StudyTime) => r.id === id ? { ...r, isEnabled } : r));
  const handleAddNew = () => { setEditingReminder(null); setIsModalOpen(true); };
  const handleEdit = (reminder: StudyTime) => { setEditingReminder(reminder); setIsModalOpen(true); };

  return (
    <>
   <AddReminderModal isOpen={isModalOpen} setIsOpen={setIsModalOpen} onSave={handleSave} initialData={editingReminder} />

<Card className="rounded-xl shadow-sm hover:shadow-md transition-all light:bg-white light:border light:border-gray-200">
  <CardHeader className="flex flex-row items-start justify-between">
    <div>
      <CardTitle className="light:text-gray-900">Study Reminders</CardTitle>
      <CardDescription className="light:text-gray-700">Manage your study schedule and notifications.</CardDescription>
    </div>
    <Button onClick={handleAddNew}>+ Add New</Button>
  </CardHeader>

  <CardContent>
    <div className="space-y-4">
      {sortedReminders.length > 0 ? (
        sortedReminders.map((reminder) => (
          <div
            key={reminder.id}
            className="flex items-center justify-between p-3 bg-muted/50 light:bg-gray-100 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <div className="bg-background light:bg-gray-200 rounded-lg p-3">
                <BellRing
                  className={`h-6 w-6 ${
                    reminder.isEnabled
                      ? "text-primary light:text-lime-600"
                      : "text-muted-foreground light:text-gray-500"
                  }`}
                />
              </div>
              <div>
                <p className="text-lg font-semibold light:text-gray-900">
                  {new Date(`1970-01-01T${reminder.time}`).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                  })}
                </p>
                <p className="text-sm text-muted-foreground light:text-gray-600 capitalize">
                  {formatFrequency(reminder.frequency)} &bull; {reminder.method}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch
                checked={reminder.isEnabled}
                onCheckedChange={(checked: boolean) => handleToggle(reminder.id, checked)}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEdit(reminder)}
              >
                <Edit className="h-4 w-4 text-muted-foreground light:text-gray-600" />
              </Button>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="hover:bg-red-500/10">
                    <Trash2 className="h-4 w-4 text-muted-foreground hover:text-red-500 light:text-gray-600" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className="light:text-gray-900">Delete Reminder</AlertDialogTitle>
                    <AlertDialogDescription className="light:text-gray-700">
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleDelete(reminder.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        ))
      ) : (
        <div className="text-center text-muted-foreground light:text-gray-600 py-8 border-2 border-dashed rounded-lg light:border-gray-300">
          <p>You have no study reminders.</p>
          <p className="text-sm">Click "+ Add New" to create one.</p>
        </div>
      )}
    </div>
  </CardContent>
</Card>

    </>
  );
}