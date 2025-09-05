// app/layout.tsx
import "@/styles/globals.css";

export const metadata = {
  title: "TaskFlow",
  description: "Task manager",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="min-h-screen bg-white">{children}</body>
    </html>
  );
}
