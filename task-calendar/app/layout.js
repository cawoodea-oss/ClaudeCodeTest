import "./globals.css";

export const metadata = {
  title: "Task Calendar",
  description: "Add tasks and schedule them to your calendar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
