// src/i18n.tsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Lang = "uz" | "ru";
type Dict = Record<string, string>;
type Packs = Record<Lang, Dict>;

/**
 * Nuqtali kalitlarni (title.bookVisit, form.firstName, ph.firstName, …)
 * biz ishlatayotgan tekis (flat) lug‘atdagi kalitlarga bog‘laymiz.
 */
const ALIASES: Record<string, string> = {
  // titles
  "title.bookVisit": "book_title",
  "title.withDoctor": "with_doctor",

  // form fields
  "form.firstName": "patient_name",
  "form.lastNameOptional": "last_name",
  "form.phone": "phone",
  "form.date": "date",
  "form.gender": "gender",

  // gender
  "gender.male": "male",
  "gender.female": "female",

  // placeholders (oldin literal chiqib qolgandi)
  "ph.firstName": "ph_firstName",
  "ph.lastName": "ph_lastName",
  "ph.phone": "ph_phone",

  // slots / actions / toasts
  "slots.title": "available_slots",
  "slots.loading": "loading_busy",
  "slots.empty": "no_slots",

  "actions.cancel": "cancel",
  "actions.bookNow": "book_now",
  "actions.sending": "sending",

  "toast.booked.title": "booked_ok_title",
  "toast.booked.desc": "booked_ok_desc",

  // common / cards / home
  "nav.home": "go_home",
  "cards.experience": "experience",
  "cards.patients": "patients",
  "cards.book": "book_btn",
  "state.not_available": "not_available_yet",

    // counters / doctors
  "cards.doctors": "doctor_many",
  

  // profile badges / extras (ekranda ko‘rinadigan ba’zi label’lar)
  "profile.rating": "rating",
  "profile.workTime": "work_time",
  "cards.patients.caption": "patients_caption",
  "profile.workTimeValue":"workTimeValue",
    // “Davolangan bemorlar” kabi ost sarlavha

  // categories
  "cat.cardiolog": "cardiolog",
  "cat.terapevt": "terapevt",
  "cat.ginekolog": "ginekolog",
  "cat.urolog": "urolog",
  
};

const packs: Packs = {
  uz: {
    app_title: "SinoAI",

    // Titles
    book_title: "Shifokor qabuliga yozilish",
    with_doctor: "bilan",

    // Form
    patient_name: "Ismingiz",
    last_name: "Familiya (ixtiyoriy)",
    phone: "Telefon raqam",
    date: "Sana",
    gender: "Jinsi",
    male: "Erkak",
    female: "Ayol",

    // Placeholders
    ph_firstName: "Ism",
    ph_lastName: "Familiya",
    ph_phone: "+998 90 123 45 67",
    workTimeValue: "Dush–Jum: 8:30 AM – 16:30 PM",

    // Slots & actions
    
    available_slots: "Mavjud vaqtlar",
    loading_busy: "Band slotlar yuklanmoqda…",
    no_slots: "Bu kunda bo‘sh vaqt yo‘q. Boshqa kunni tanlang.",
    choose_time: "Vaqtni tanlang",
    cancel: "Bekor qilish",
    book_now: "Bron qilish",
    sending: "Yuborilmoqda…",
    profile_rating: "Reyting",
    profile_workTime: "Ish vaqti",

    // Toasts
    booked_ok_title: "Bron qabul qilindi!",
    booked_ok_desc: "Qabul vaqti saqlandi. Operator tez orada bog‘lanadi.",

    // Common / cards / home
    doctor_one: "Shifokor",
    doctor_many: "Shifokorlar", 
    doctors: "Shifokor",
    go_home: "Bosh sahifa",
    years: "yil",
    years_plus: "yil+",
    experience: "Tajriba",
    patients: "Bemorlar", // “1.2k patients” matnida “patients” yozuvi qoladi (raqam — dinamik)
    patients_caption: "Davolangan bemorlar",
    book_btn: "Shifokor qabuliga yozilish",
    not_available_yet: "Hozircha mavjud emas",

    // Profile badges / extras
    rating: "Reyting",
    work_time: "Ish vaqti",

    // Categories
    cardiolog: "Kardiolog",
    terapevt: "Terapevt",
    ginekolog: "Ginekolog",
    urolog: "Urolog",
  },

  ru: {
    app_title: "SinoAI",

    // Titles
    book_title: "Запись к врачу",
    with_doctor: "с",

    // Form
    doctors: "Врач",
    patient_name: "Имя",
    last_name: "Фамилия (необязательно)",
    phone: "Номер телефона",
    date: "Дата",
    gender: "Пол",
    male: "Мужчина",
    female: "Женщина",

    // Placeholders
    ph_firstName: "Имя",
    ph_lastName: "Фамилия",
    ph_phone: "+7 900 000-00-00",
    workTimeValue:  "Пн–Пт: 8:30–16:30",
    // Slots & actions
    available_slots: "Доступные слоты",
    loading_busy: "Загрузка занятых слотов…",
    no_slots: "На этот день нет свободного времени. Выберите другую дату.",
    choose_time: "Выберите время",
    cancel: "Отмена",
    book_now: "Записаться",
    sending: "Отправка…",
    profile_rating: "Рейтинг",
    profile_workTime: "Рабочее время",

    // Toasts
    booked_ok_title: "Заявка принята!",
    booked_ok_desc: "Время сохранено. Оператор свяжется с вами.",

    // Common / cards / home
    doctor_one: "врач",
    doctor_many: "врачей",
    go_home: "На главную",
    years: "лет",
    years_plus: "лет+",
    experience: "Стаж",
    patients: "пациентов",
    patients_caption: "Долеченные пациенты", // yoki “Пациентов” desangiz ham bo‘ladi
    book_btn: "Записаться на прием",
    not_available_yet: "Пока недоступно",

    // Profile badges / extras
    rating: "Рейтинг",
    work_time: "Рабочее время",

    // Categories
    cardiolog: "Кардиолог",
    terapevt: "Терапевт",
    ginekolog: "Гинеколог",
    urolog: "Уролог",
  },
};

function detectInitial(): Lang {
  if (typeof window === "undefined") return "uz";
  try {
    const saved = localStorage.getItem("lang") as Lang | null;
    if (saved === "uz" || saved === "ru") return saved;
  } catch {}
  const nav = (typeof navigator !== "undefined" ? navigator.language : "uz").toLowerCase();
  return nav.startsWith("ru") ? "ru" : "uz";
}

type Ctx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string };
const I18nCtx = createContext<Ctx | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>(detectInitial());

  useEffect(() => {
    try {
      localStorage.setItem("lang", lang);
    } catch {}
  }, [lang]);

  const setLang = (l: Lang) => setLangState(l);

  /**
   * Tarjimon:
   * 1) nuqtali kalitni ALIASES orqali flat kalitga o‘giradi;
   * 2) pack’da topilsa — qiymatni qaytaradi, bo‘lmasa o‘sha kalitning o‘zi chiqadi.
   */
  const t = (key: string) => {
    const flat = ALIASES[key] ?? key;
    return packs[lang][flat] ?? flat;
  };

  const value = useMemo(() => ({ lang, setLang, t }), [lang]);
  return <I18nCtx.Provider value={value}>{children}</I18nCtx.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nCtx);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}