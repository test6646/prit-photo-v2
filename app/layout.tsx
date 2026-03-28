import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CursorFollower from "@/components/CursorFollower";
import Loader from "@/components/Loader";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>

        <Loader />

        <SmoothScroll />
        <CursorFollower />

        {children}

      </body>
    </html>
  );
}