import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import "./globals.css";
import { Inter, Raleway, Montserrat } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display : "swap",
});

const raleway = Raleway({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-raleway",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-montserrat",
});

export const metadata = {
  title: "Shyam Civil Construction",
  description: "Professional construction services",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${raleway.variable} ${montserrat.variable}`}>
      <body className="bg-white text-black min-h-screen" cz-shortcut-listen="true">
        <Navbar />
        <main>
          {children}
          <Footer />
        </main>
      </body>
    </html>
  );
}
