import "./globals.css";
import { I18nProvider } from "@/lib/i18n";
import Nav from "@/components/Nav";
import { getSession } from "@/lib/auth";
export const metadata = { title: "FarmSaathi — From Farmers, Directly to You." };
export default async function Root({ children }: { children: React.ReactNode }) {
  const s = await getSession();
  return <html lang="en"><body><I18nProvider><Nav role={s?.role ?? null} /><main className="mx-auto max-w-6xl px-4 py-6">{children}</main></I18nProvider></body></html>;
}
