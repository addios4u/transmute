import { useTranslation } from "react-i18next";
import { Logo } from "./Logo";
import { BuyMeACoffee } from "./BuyMeACoffee";

export function Header() {
  const { t } = useTranslation();

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-bg-primary/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-3">
          <Logo size={28} />
          <div className="flex items-baseline gap-2">
            <h1 className="text-lg font-bold tracking-tight text-text-primary">
              {t("app.name")}
            </h1>
            <span className="hidden text-xs text-text-tertiary sm:inline">
              {t("app.tagline")}
            </span>
          </div>
        </div>
        <BuyMeACoffee />
      </div>
    </header>
  );
}
