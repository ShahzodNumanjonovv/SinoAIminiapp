import { Doctor, Slot } from "./types";

export const categories = [
  { id: "general", name: "Reyting", available: 12, icon: "steth" },
  { id: "oculist", name: "Oculist", available: 8, icon: "eye" },
  { id: "neuro", name: "Neurologist", available: 6, icon: "brain" },
  { id: "cardio", name: "Cardiologist", available: 10, icon: "heart" },
  { id: "derma", name: "Dermatologist", available: 15, icon: "hand" }
];

export const doctors: Doctor[] = [
  {
    id: "d1",
    firstName: "Michael",
    lastName: "Johnson",
    speciality: "Reyting",
    rating: 5.0,
    reviews: 420,
    experienceYears: 15,
    patients: 2100,
    clinic: "Orzu Medical Center",
    avatar: "https://i.pravatar.cc/160?img=12"
  },
  {
    id: "d2",
    firstName: "Emily",
    lastName: "Rodriguez",
    speciality: "Oculist",
    rating: 4.9,
    reviews: 180,
    experienceYears: 10,
    patients: 1500,
    clinic: "Vision Care Center",
    avatar: "https://i.pravatar.cc/160?img=5"
  },
  {
    id: "d3",
    firstName: "Lisa",
    lastName: "Thompson",
    speciality: "Neurologist",
    rating: 5.0,
    reviews: 210,
    experienceYears: 14,
    patients: 1200,
    clinic: "Neuro Wellness Institute",
    avatar: "https://i.pravatar.cc/160?img=7"
  }
];

export const slots: Slot[] = [
  { label: "08:00 - 08:30", from: "08:00", to: "08:30" },
  { label: "08:30 - 09:00", from: "08:30", to: "09:00" },
  { label: "09:00 - 09:30", from: "09:00", to: "09:30" },
  { label: "09:30 - 10:00", from: "09:30", to: "10:00" },
  { label: "10:00 - 10:30", from: "10:00", to: "10:30" },
  { label: "10:30 - 11:00", from: "10:30", to: "11:00" },
  { label: "11:00 - 11:30", from: "11:00", to: "11:30" },

  // tushlikdan keyin
  { label: "13:00 - 13:30", from: "13:00", to: "13:30" },
  { label: "13:30 - 14:00", from: "13:30", to: "14:00" },
  { label: "14:00 - 14:30", from: "14:00", to: "14:30" },
  { label: "14:30 - 15:00", from: "14:30", to: "15:00" },
  { label: "15:00 - 15:30", from: "15:00", to: "15:30" },
  { label: "15:30 - 16:00", from: "15:30", to: "16:00" },
  { label: "16:00 - 16:30", from: "16:00", to: "16:30" },
  
];