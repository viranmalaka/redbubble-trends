import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Redbubble Trends</title>
        <script
          async
          type="text/javascript"
          src="https://ssl.gstatic.com/trends_nrtr/2578_RC01/embed_loader.js"
        ></script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
