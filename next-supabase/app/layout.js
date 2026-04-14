import "./globals.css";

export const metadata = {
  title: "Next Supabase Todo",
  description: "Standardized hackctl todo template",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
