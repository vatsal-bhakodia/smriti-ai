import NativeBanner from "@/components/ads/NativeBanner";

export default function ResultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <NativeBanner />
    </>
  );
}
