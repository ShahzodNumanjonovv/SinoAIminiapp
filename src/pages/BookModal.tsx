// src/pages/BookModal.tsx
import { useEffect, useMemo, useState } from "react";
import { Doctor } from "../types";
import { slots } from "../data";
import Select from "../components/Select";
import { getBusySlots, holdAppointment, bookAppointmentWithHold } from "../lib/api";
import SuccessModal from "../components/SuccessModal";
import { useI18n } from "../i18n"; // ⬅️ i18n hook (t, lang)
import { addRequest } from "../lib/requests";
import { getTelegramUser } from "../lib/telegram";

type Gender = "MALE" | "FEMALE" | undefined;

export default function BookModal({
  doctor,
  onClose,
}: {
  doctor: Doctor;
  onClose: () => void;
}) {
  const { t } = useI18n();

  // ---- form states
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState<Gender>();

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const [date, setDate] = useState<string>(todayStr);

  // Select string value bilan ishlaydi (label bilan)
  const [selectedSlotLabel, setSelectedSlotLabel] = useState<string>(slots[0].label);
  const currentSlot = useMemo(
    () => slots.find((s) => s.label === selectedSlotLabel),
    [selectedSlotLabel]
  );

  // ---- availability state
  const [busy, setBusy] = useState<Set<string>>(new Set());
  const [loadingBusy, setLoadingBusy] = useState<boolean>(false);
  const [busyError, setBusyError] = useState<string>("");

  // Sana yoki doktor o‘zgarganda band slotlarni olib kelish
  useEffect(() => {
    let stop = false;

    (async () => {
      setLoadingBusy(true);
      setBusyError("");
      try {
        const arr = await getBusySlots(doctor.id, date); // ['10:00', '10:30', ...]
        if (!stop) setBusy(new Set(arr));
      } catch (e) {
        console.error("getBusySlots failed:", e);
        if (!stop) {
          setBusy(new Set());
          setBusyError(t("busy.error")); // ⬅️ i18n
        }
      } finally {
        if (!stop) setLoadingBusy(false);
      }
    })();

    return () => {
      stop = true;
    };
  }, [doctor.id, date, t]);

  // Faqat bo‘sh slotlarni ko‘rsatamiz (busy dagilar umuman chiqmaydi)
  const freeSlots = useMemo(
    () => slots.filter((s) => !busy.has(s.from)),
    [busy]
  );

  // Select opsiyalari
  const options = useMemo(
    () => freeSlots.map((s) => ({ label: s.label, value: s.label })),
    [freeSlots]
  );

  // Tanlangan label free listdan chiqib qolsa — birinchisini tanlaymiz
  useEffect(() => {
    if (freeSlots.length === 0) return;
    const exists = freeSlots.some((s) => s.label === selectedSlotLabel);
    if (!exists) setSelectedSlotLabel(freeSlots[0].label);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [freeSlots]);

  // ---- submit
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const submitDisabled =
    submitting ||
    !firstName.trim() ||
    !phone.trim() ||
    !currentSlot ||
    freeSlots.length === 0;

  const onSubmit = async () => {
    if (!currentSlot) return;

    try {
      setSubmitting(true);

      // 1) Hold the slot
      const hold = await holdAppointment({
        doctorId: doctor.id,
        date,
        from: currentSlot.from,
        to: currentSlot.to,
      });

      // 2) Book using holdId
      const tg = getTelegramUser();
      const appt = await bookAppointmentWithHold({
        holdId: hold.holdId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        gender,
        ...(tg?.id ? { tgUserId: tg.id } : {}),
      });

      // ✅ Alert o‘rniga animatsion modal
      // Local requests feed — until CRM profile is ready
      addRequest({
        id: String((appt as any)?.id ?? hold.holdId ?? Date.now()),
        doctorId: doctor.id,
        doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
        date,
        from: currentSlot.from,
        to: currentSlot.to,
        status: "BOOKED",
        createdAt: new Date().toISOString(),
      });
      setShowSuccess(true);
    } catch (e: any) {
      console.error("hold/book failed:", e);
      alert(e?.message || t("form.saveError"));
      // Refresh busy slots in case state changed
      try {
        const arr = await getBusySlots(doctor.id, date);
        setBusy(new Set(arr));
      } catch {}
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="space-y-4">
        <div className="text-lg font-semibold">{t("title.bookVisit")}</div>
        <div className="muted">
          {t("title.withDoctor")} {doctor.firstName} {doctor.lastName}
        </div>

        <label className="block">
          <div className="muted">{t("form.firstName")}</div>
          <input
            className="w-full card px-4 py-3"
            placeholder={t("ph.firstName")}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </label>

        <label className="block">
          <div className="muted">{t("form.lastNameOptional")}</div>
          <input
            className="w-full card px-4 py-3"
            placeholder={t("ph.lastName")}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </label>

        <label className="block">
          <div className="muted">{t("form.phone")}</div>
          <input
            className="w-full card px-4 py-3"
            inputMode="tel"
            placeholder={t("ph.phone")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>

        <label className="block">
          <div className="muted">{t("form.date")}</div>
          <input
            className="w-full card px-4 py-3"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>

        <div>
          <div className="muted mb-2">{t("form.gender")}</div>
          <div className="flex gap-3">
            <button
              onClick={() => setGender("MALE")}
              className={"card px-4 py-2 " + (gender === "MALE" ? "ring-2 ring-brand" : "")}
            >
              {t("gender.male")}
            </button>
            <button
              onClick={() => setGender("FEMALE")}
              className={"card px-4 py-2 " + (gender === "FEMALE" ? "ring-2 ring-brand" : "")}
            >
              {t("gender.female")}
            </button>
          </div>
        </div>

        <label className="block">
          <div className="muted mb-2">{t("slots.title")}</div>

          {loadingBusy ? (
            <div className="card px-4 py-3 text-sm text-slate-500">
              {t("busy.loading")}
            </div>
          ) : freeSlots.length === 0 ? (
            <div className="card px-4 py-3 text-center text-sm text-slate-500">
              {t("busy.empty")}
            </div>
          ) : (
            <Select
              options={options}
              value={selectedSlotLabel}
              onChange={(v) => setSelectedSlotLabel(v)}
              placeholder={t("ph.chooseTime")}
              className="w-full"
            />
          )}

          {busyError && <div className="mt-2 text-xs text-amber-600">{busyError}</div>}
        </label>

        <div className="flex gap-3">
          <button onClick={onClose} className="card px-4 py-3 grow">
            {t("actions.cancel")}
          </button>
          <button onClick={onSubmit} disabled={submitDisabled} className="btn-primary grow">
            {submitting ? t("actions.sending") : t("actions.bookNow")}
          </button>
        </div>
      </div>

      {/* ✅ Animatsion success */}
      <SuccessModal
        show={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          onClose();
        }}
      />
    </>
  );
}
