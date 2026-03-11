import { Metadata } from "next";
import fs from "fs";
import path from "path";

export const metadata: Metadata = {
  title: "TRYJOY 隐私政策",
  description: "TRYJOY 隐私政策",
};

export default function PrivacyPolicy() {
  const filePath = path.join(process.cwd(), "public", "TRYJOY隐私政策.html");
  const htmlContent = fs.readFileSync(filePath, "utf-8");

  return (
    <div
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
