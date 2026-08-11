import { useTranslations } from "next-intl";

export default function HomePage() {
  const t = useTranslations("HomePage");

  return (
    <main className="flex min-h-screen items-center justify-center">
      <h1 className="text-2xl font-medium">{t("title")}</h1>
    </main>
  );
}
