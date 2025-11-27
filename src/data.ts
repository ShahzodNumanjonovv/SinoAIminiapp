import { Doctor } from "./types";

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
    // reviews: 420,
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
    experienceYears: 14,
    patients: 1200,
    clinic: "Neuro Wellness Institute",
    avatar: "https://i.pravatar.cc/160?img=7"
  }
];
