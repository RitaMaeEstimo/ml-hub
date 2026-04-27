import "./globals.css";

export const metadata = {
  title: "ML Hub",
  description: "Machine learning article publishing platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
