import "./globals.css";

export const metadata = {
  title: "ML HUB",
  description: "Machine learning articles, community discussion, and curated link posts.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}