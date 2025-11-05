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
  "ph.chooseTime": "choose_time",

  // slots / actions / toasts
  "slots.title": "available_slots",
  "slots.loading": "loading_busy",
  "slots.empty": "no_slots",
  // backward-compat keys used in code
  "busy.loading": "loading_busy",
  "busy.empty": "no_slots",

  "actions.cancel": "cancel",
  "actions.bookNow": "book_now",
  "actions.sending": "sending",
  "actions.close": "close",

  "toast.booked.title": "booked_ok_title",
  "toast.booked.desc": "booked_ok_desc",

  // common / cards / home
  "nav.home": "go_home",
  "cards.experience": "experience",
  "cards.patients": "patients",
  "cards.book": "book_btn",
  "state.not_available": "not_available_yet",
  "state.loading": "loading",

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
  "cat.dermatolog": "dermatolog",
  "cat.endokrinolog": "endokrinolog",
  "cat.gastroenterolog": "gastroenterolog",
  "cat.terapevt": "terapevt",
  "cat.ginekolog": "ginekolog",
  "cat.nefrolog": "nefrolog",
  "cat.nevrolog": "nevrolog",
  "cat.dietolog": "dietolog",
  "cat.ortoped": "ortoped",
  "cat.osteopat": "osteopat",
  "cat.pediatr": "pediatr",
  "cat.proktolog": "proktolog",
  "cat.trikolog": "trikolog",
  "cat.urolog": "urolog",
  
  // tabs
  "tab.doctors": "tab_doctors",
  "tab.search": "tab_search",
  "tab.chat": "tab_chat",
  "tab.profile": "tab_profile",
  
  // profile/menu
  "profile.miniApp": "profile_mini_app",
  "profile.defaultUser": "profile_default_user",
  "menu.myBookings": "menu_my_bookings",
  "menu.language": "menu_language",
  "menu.openApp": "menu_open_app",
  "menu.privacy": "menu_privacy",
  "menu.shareApp": "menu_share_app",
  // search
  "search.title": "search_title",
  "search.name": "search_name",
  "search.speciality": "search_spec",
  "search.experience": "search_exp",
  "search.clinic": "search_clinic",
  "search.ph_name": "search_ph_name",
  "search.ph_spec": "search_ph_spec",
  "search.ph_clinic": "search_ph_clinic",
  "search.no_results": "search_no_results",
  "search.no_results_title": "search_no_results_title",
  "search.no_results_hint": "search_no_results_hint",
  // chat
  "chat.history": "chat_history",
  "chat.new": "chat_new",
  "chat.placeholder": "chat_ph",
  "chat.error": "chat_error",

  // confirm
  "confirm.cancel": "confirm_cancel",

  // errors
  "form.saveError": "save_error",
  "busy.error": "busy_error",
  "state.noBookings": "no_bookings",
  "state.soon": "soon",
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
    close: "Yopish",
    save_error: "Saqlashda xatolik yuz berdi",
    busy_error: "Slotlarni yuklashda xatolik yuz berdi",
    profile_rating: "Reyting",
    profile_workTime: "Ish vaqti",
    confirm_cancel: "Haqiqatan bekor qilasizmi?",

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
    loading: "Yuklanmoqda…",
    no_bookings: "Hozircha bronlar yo‘q",
    soon: "Tez orada",

    // Profile badges / extras
    rating: "Reyting",
    work_time: "Ish vaqti",

    // Categories
    cardiolog: "Kardiolog",
    dermatolog: "Dermatolog",
    endokrinolog: "Endokrinolog",
    gastroenterolog: "Gastroenterolog",
    ginekolog: "Ginekolog",
    nefrolog: "Nefrolog",
    nevrolog: "Nevrolog",
    dietolog: "Dietolog",
    ortoped: "Ortoped",
    osteopat: "Osteopat",
    pediatr: "Pediatr",
    proktolog: "Proktolog",
    terapevt: "Terapevt",
    trikolog: "Trikolog",
    urolog: "Urolog",
    
    // Tabs
    tab_doctors: "Shifokorlar",
    tab_search: "Qidiruv",
    tab_chat: "AI Chat",
    tab_profile: "Profil",

    // Profile/Menu
    profile_mini_app: "Mini App Profile",
    profile_default_user: "Telegram foydalanuvchi",
    menu_my_bookings: "Bronlarim",
    menu_language: "Til",
    menu_open_app: "Ochiladigan havola",
    menu_privacy: "Maxfiylik",
    menu_share_app: "Ulashish",

    // Search
    search_title: "Qidiruv",
    search_name: "Ism, familiya",
    search_spec: "Mutaxassislik",
    search_exp: "Tajriba",
    search_clinic: "Klinika",
    search_ph_name: "Doktor ismi...",
    search_ph_spec: "Mutaxassislik tanlang",
    search_ph_clinic: "Klinika nomi...",
    search_no_results: "Mos natija topilmadi",
    search_no_results_title: "Hech narsa topilmadi",
    search_no_results_hint: "Boshqa qidiruv so'zini sinab ko'ring",

    // Chat
    chat_history: "Tarix",
    chat_new: "Yangi suhbat",
    chat_ph: "Savol bering…",
    chat_error: "Xatolik yuz berdi",
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
    close: "Закрыть",
    save_error: "Ошибка при сохранении",
    busy_error: "Ошибка при загрузке слотов",
    profile_rating: "Рейтинг",
    profile_workTime: "Рабочее время",
    confirm_cancel: "Вы уверены, что хотите отменить?",

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
    loading: "Загрузка…",
    no_bookings: "Пока нет записей",
    soon: "Скоро",

    // Profile badges / extras
    rating: "Рейтинг",
    work_time: "Рабочее время",

    // Categories
    cardiolog: "Кардиолог",
    dermatolog: "Дерматолог",
    endokrinolog: "Эндокринолог",
    gastroenterolog: "Гастроэнтеролог",
    ginekolog: "Гинеколог",
    nefrolog: "Нефролог",
    nevrolog: "Невролог",
    dietolog: "Диетолог",
    ortoped: "Ортопед",
    osteopat: "Остеопат",
    pediatr: "Педиатр",
    proktolog: "Проктолог",
    terapevt: "Терапевт",
    trikolog: "Трихолог",
    urolog: "Уролог",
    
    // Tabs
    tab_doctors: "Врачи",
    tab_search: "Поиск",
    tab_chat: "AI Чат",
    tab_profile: "Профиль",

    // Profile/Menu
    profile_mini_app: "Профиль мини‑приложения",
    profile_default_user: "Пользователь Telegram",
    menu_my_bookings: "Мои записи",
    menu_language: "Язык",
    menu_open_app: "Открыть приложение",
    menu_privacy: "Конфиденциальность",
    menu_share_app: "Поделиться",

    // Search
    search_title: "Поиск",
    search_name: "Имя, фамилия",
    search_spec: "Специальность",
    search_exp: "Стаж",
    search_clinic: "Клиника",
    search_ph_name: "Имя врача...",
    search_ph_spec: "Выберите специальность",
    search_ph_clinic: "Название клиники...",
    search_no_results: "Совпадений не найдено",
    search_no_results_title: "Ничего не найдено",
    search_no_results_hint: "Попробуйте другой запрос",

    // Chat
    chat_history: "История",
    chat_new: "Новый чат",
    chat_ph: "Задайте вопрос…",
    chat_error: "Произошла ошибка",
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
