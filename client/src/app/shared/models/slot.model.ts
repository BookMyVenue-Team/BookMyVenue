// src/app/shared/models/slot.model.ts
export interface TimeSlot {
  id: number;
  label: string;
  startTime: string;
  endTime: string;
  duration: string;
  available: boolean;
  surcharge: number;
}