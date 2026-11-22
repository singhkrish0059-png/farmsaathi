"use client";
import { createContext, useContext, useState, useEffect } from "react";
export const dict = {
  en: { home: "Home", browse: "Browse Products", fert: "Natural Fertilizers", sell: "Sell Products", how: "How It Works", about: "About",
    login: "Login", register: "Register", logout: "Logout", dashboard: "Dashboard", heroTitle: "Buy Directly From Farmers.",
    heroSub: "Discover fresh agricultural products directly from verified farmers — without middlemen.", search: "Search products, fertilizers, farmers...",
    verified: "Verified Farmer ✓", contact: "Contact Farmer", whatsapp: "WhatsApp Farmer", call: "Call Farmer", enquiry: "Send Enquiry",
    loading: "Loading products...", empty: "No products found. Try changing your filters.", error: "Something went wrong. Please try again.",
    pending: "Verification Pending", tagline: "From Farmers, Directly to You." },
  kn: { home: "ಮುಖಪುಟ", browse: "ಉತ್ಪನ್ನಗಳನ್ನು ನೋಡಿ", fert: "ನೈಸರ್ಗಿಕ ಗೊಬ್ಬರ", sell: "ಮಾರಾಟ ಮಾಡಿ", how: "ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ", about: "ನಮ್ಮ ಬಗ್ಗೆ",
    login: "ಲಾಗಿನ್", register: "ನೋಂದಣಿ", logout: "ಲಾಗ್ ಔಟ್", dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", heroTitle: "ರೈತರಿಂದ ನೇರವಾಗಿ ಖರೀದಿಸಿ.",
    heroSub: "ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ, ಪರಿಶೀಲಿತ ರೈತರಿಂದ ತಾಜಾ ಕೃಷಿ ಉತ್ಪನ್ನಗಳನ್ನು ಹುಡುಕಿ.", search: "ಉತ್ಪನ್ನ, ಗೊಬ್ಬರ, ರೈತರನ್ನು ಹುಡುಕಿ...",
    verified: "ಪರಿಶೀಲಿತ ರೈತ ✓", contact: "ರೈತರನ್ನು ಸಂಪರ್ಕಿಸಿ", whatsapp: "ವಾಟ್ಸಾಪ್ ಮಾಡಿ", call: "ಕರೆ ಮಾಡಿ", enquiry: "ವಿಚಾರಣೆ ಕಳುಹಿಸಿ",
    loading: "ಉತ್ಪನ್ನಗಳು ಲೋಡ್ ಆಗುತ್ತಿವೆ...", empty: "ಯಾವುದೇ ಉತ್ಪನ್ನ ಸಿಗಲಿಲ್ಲ. ಫಿಲ್ಟರ್ ಬದಲಿಸಿ ನೋಡಿ.", error: "ಏನೋ ತಪ್ಪಾಗಿದೆ. ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
    pending: "ಪರಿಶೀಲನೆ ಬಾಕಿ ಇದೆ", tagline: "ರೈತರಿಂದ ನೇರವಾಗಿ ನಿಮಗೆ." },
};
type L = keyof typeof dict; type K = keyof typeof dict.en;
const Ctx = createContext<{ lang: L; setLang: (l: L) => void; t: (k: K) => string }>({ lang: "en", setLang: () => {}, t: (k) => dict.en[k] });
export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setL] = useState<L>("en");
  useEffect(() => { const s = localStorage.getItem("lang") as L | null; if (s) setL(s); }, []);
  const setLang = (l: L) => { setL(l); localStorage.setItem("lang", l); };
  return <Ctx.Provider value={{ lang, setLang, t: (k) => dict[lang][k] ?? dict.en[k] }}>{children}</Ctx.Provider>;
}
export const useT = () => useContext(Ctx);
