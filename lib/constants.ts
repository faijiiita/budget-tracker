export const navbarItems = [
  { label: "Dashboard", link: "/" },
  { label: "Transactions", link: "/transactions" },
  { label: "Manage", link: "/manage" },
];

export type Currency = {
  value: string;
  label: string;
  locale: string;
};

export const currencies: Currency[] = [
  { value: "INR", label: "₹, Indian Rupee", locale: "en-IN" },
  { value: "USD", label: "$, US Dollar", locale: "en-US" },
  { value: "GBP", label: "£, Sterling Pound", locale: "en-GB" },
  { value: "EUR", label: "€, Euro", locale: "de-DE" },
  { value: "JPY", label: "¥, Japanese Yen", locale: "ja-JP" },
];
