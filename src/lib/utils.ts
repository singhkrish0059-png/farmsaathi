export const wa = (phone: string, name: string) =>
  `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(
    `Hello, I found your product on FarmSaathi. I am interested in your ${name}. Is it currently available?`
  )}`;
