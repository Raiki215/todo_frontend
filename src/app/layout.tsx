import "@/styles/globals.css";
import { AuthThemeProvider } from "@/hooks/useAuthTheme";

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
      <body className="min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden">
        <AuthThemeProvider>{children}</AuthThemeProvider>
      </body>
    </html>
  );
}
