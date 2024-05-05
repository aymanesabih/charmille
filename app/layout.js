import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <script
        async
        src="//cdn.embedly.com/widgets/platform.js"
        charset="UTF-8"
      ></script>

      <body className={inter.className}>{children}</body>
    </html>
  );
}
