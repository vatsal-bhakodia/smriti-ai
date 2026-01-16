import { generateMetadataUtil } from "@/utils/generateMetadata";

export const metadata = generateMetadataUtil({
  title: "GGSIPU Result Login | Check IPU Results",
  description:
    "Login to check your GGSIPU (IPU) results. Enter your enrollment number and password to view your semester results, CGPA, and SGPA.",
  keywords: [
    "GGSIPU result login",
    "IPU result login",
    "GGSIPU login",
    "IPU login",
  ],
  url: "https://www.smriti.live/result/login",
});

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
