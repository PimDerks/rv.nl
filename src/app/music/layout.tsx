import { SubNavigation } from "@/components/layout";

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <>
      <SubNavigation />
      {children}
    </>
  );
}
