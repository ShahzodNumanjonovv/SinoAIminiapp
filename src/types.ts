// src/types.ts
export type Doctor = {
  id: string;
  firstName: string;
  lastName: string;
  speciality?: string;
  clinic?: string;
  // yangi:
  avatarUrl?: string;
  // eski nom bilan kelishi ehtimoli uchun:
  avatar?: string;

  experienceYears?: number;
  rating?: number;
  patients?: number;
  priceUZS?: number;
};
export type Slot = { label: string; from: string; to: string };
export type BookingPayload = {
  doctorId: string;
  date: string; // YYYY-MM-DD
  slot: Slot;
  name: string;
  phone: string;
  gender?: "male" | "female";
  tgUserId?: number;
};