import { Navbar } from "@/components/navbar";
import { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";
import { KasadaClient } from "@/utils/kasada/kasada-client";

export const metadata: Metadata = {
  metadataBase: new URL(
    "https://ai-sdk-preview-internal-knowledge-base.vercel.app",
  ),
  title: "Internal Knowledge Base",
  description:
    "Preview of internal knowledge base using retrieval augmented generation and middleware from the AI SDK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <KasadaClient />
        <Toaster position="top-center" />
        <Navbar />
        {children}
      </body>
    </html>
  );
}
