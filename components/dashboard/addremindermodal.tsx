// /components/dashboard/addremindermodal.tsx

"use client";

import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox"; // Import Checkbox
import type { StudyTime, Frequency } from "@/types";

type StudyTimeInput = Omit<StudyTime, 'id'>;

interface AddReminderModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onSave: (reminder: StudyTime) => void;
  initialData?: StudyTime | null;
}

const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function AddReminderModal({ isOpen, setIsOpen, onSave, initialData }: AddReminderModalProps) {
  const [time, setTime] = React.useState("19:00");
  const [frequency, setFrequency] = React.useState<Frequency>({ type: 'daily' });
  const [method, setMethod] = React.useState<StudyTime['method']>("site");
  const isEditMode = !!initialData;

  React.useEffect(() => {
    if (initialData && isOpen) {
      setTime(initialData.time);
      setFrequency(initialData.frequency);
      setMethod(initialData.method);
    } else if (!isEditMode && isOpen) {
      // Reset form on "Add New"
      setTime("19:00");
      setFrequency({ type: 'daily' });
      setMethod("site");
    }
  }, [initialData, isOpen]);
  
  const handleDayToggle = (dayIndex: number) => {
    setFrequency(prev => {
      const currentDays = (prev.type === 'custom' && prev.days) || [];
      const newDays = currentDays.includes(dayIndex)
        ? currentDays.filter(d => d !== dayIndex)
        : [...currentDays, dayIndex].sort((a,b) => a-b);
      return { type: 'custom', days: newDays };
    });
  };

  const handleSubmit = () => {
    if (frequency.type === 'custom' && frequency.days.length === 0) {
      toast.error("Please select at least one day for custom frequency.");
      return;
    }

    const reminderData: StudyTimeInput = {
      time,
      frequency,
      method,
      isEnabled: initialData?.isEnabled ?? true,
    };
    const finalReminder: StudyTime = { ...reminderData, id: initialData?.id || crypto.randomUUID() };
    
    onSave(finalReminder);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
  <DialogContent className="sm:max-w-[425px] light:bg-white light:text-gray-900 dark:bg-background dark:text-white">
    <DialogHeader>
      <DialogTitle className="light:text-gray-900 dark:text-white">
        {isEditMode ? 'Edit Reminder' : 'Set Study Time'}
      </DialogTitle>
      <DialogDescription className="light:text-gray-700 dark:text-gray-300">
        {isEditMode
          ? 'Update the details for your study reminder.'
          : 'Add a new study reminder to your schedule.'}
      </DialogDescription>
    </DialogHeader>

    <div className="grid gap-6 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="time" className="text-right light:text-gray-900 dark:text-white">
          Time
        </Label>
        <Input
          id="time"
          type="time"
          value={time}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTime(e.target.value)}
          className="col-span-3 dark-time-picker light:bg-white light:text-gray-900 light:border-gray-300"
        />
      </div>

      <div className="grid grid-cols-4 items-start gap-4">
        <Label htmlFor="frequency" className="text-right pt-2 light:text-gray-900 dark:text-white">
          Frequency
        </Label>
        <div className="col-span-3 space-y-3">
          <Select
            value={frequency.type}
            onValueChange={(type) =>
              setFrequency({ type: type as 'daily' | 'custom', days: [] })
            }
          >
            <SelectTrigger className="light:bg-white light:text-gray-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="light:bg-white light:text-gray-900">
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>

          {frequency.type === 'custom' && (
            <div className="grid grid-cols-7 gap-1 text-center items-center pt-1">
              {daysOfWeek.map((day, index) => (
                <div key={day} className="flex flex-col items-center justify-center gap-2">
                  <Label
                    htmlFor={`day-${index}`}
                    className="text-xs text-muted-foreground light:text-gray-700 dark:text-gray-300"
                  >
                    {day}
                  </Label>
                  <Checkbox
                    id={`day-${index}`}
                    checked={frequency.days.includes(index)}
                    onCheckedChange={() => handleDayToggle(index)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="method" className="text-right light:text-gray-900 dark:text-white">
          Notify Via
        </Label>
        <RadioGroup
          value={method}
          onValueChange={(value) => setMethod(value as StudyTime['method'])}
          className="col-span-3 flex items-center space-x-4"
        >
          <div className="flex items-center space-x-1.5">
            <RadioGroupItem value="site" id="r1" />
            <Label htmlFor="r1" className="light:text-gray-900 dark:text-white">Site</Label>
          </div>
          <div className="flex items-center space-x-1.5">
            <RadioGroupItem value="mail" id="r2" />
            <Label htmlFor="r2" className="light:text-gray-900 dark:text-white">Mail</Label>
          </div>
          <div className="flex items-center space-x-1.5">
            <RadioGroupItem value="whatsapp" id="r3" />
            <Label htmlFor="r3" className="light:text-gray-900 dark:text-white">WhatsApp</Label>
          </div>
        </RadioGroup>
      </div>
    </div>

    <DialogFooter>
      <Button className="light:bg-gray-200 light:text-gray-900 dark:bg-gray-700 dark:text-white" variant="outline" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button className="light:bg-lime-500 light:text-white dark:bg-lime-600 dark:text-white" onClick={handleSubmit}>
        Save Changes
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

  );
}