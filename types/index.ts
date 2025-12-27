export type ResourceType = "VIDEO" | "PDF" | "TEXT";

export interface ResourceItem {
  id: string;
  title: string;
  type: ResourceType;
  url: string;
}

// Frequency type
export type Frequency = { type: "daily" } | { type: "custom"; days: number[] }; // 0 for Sunday, 1 for Monday, etc.

export type StudyTime = {
  id: string;
  time: string; // e.g., "19:00"
  //  Frequency type
  frequency: Frequency;
  //  Notify-via methods
  method: "site" | "mail" | "whatsapp";
  isEnabled: boolean;
};
