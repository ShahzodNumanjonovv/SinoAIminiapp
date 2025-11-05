import LangSwitch from "./LangSwitch";
import { useI18n } from "../i18n";

export default function Header() {
  const { t } = useI18n();
  return (
    <div className="sticky top-0 z-40 flex items-center justify-between bg-[#7f9d96] text-white px-4 py-3 rounded-b-2xl shadow">
      <div className="font-semibold">{t("app_title")}</div>
      <LangSwitch />
    </div>
  );
}