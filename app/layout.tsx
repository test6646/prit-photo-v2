import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CursorFollower from "@/components/CursorFollower"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>

        {/* Global smooth scrolling */}
        <SmoothScroll />
        <CursorFollower />

        {children}

      </body>
    </html>
  );
}