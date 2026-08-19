import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { demos } from "../../demos";

export const dynamicParams = false;

const FRAMED = ["dotgrid", "hooks", "island", "rail", "palette"] as const;

export function generateStaticParams() {
  return FRAMED.map((name) => ({ name }));
}

export const metadata: Metadata = { robots: { index: false } };

type Props = { params: Promise<{ name: string }> };

export default async function PreviewPage({ params }: Props) {
  const { name } = await params;
  const Demo = demos[name];
  if (!Demo) notFound();
  return (
    <>
      <style>{`.site-header,.site-footer,.skip-link{display:none}body{padding:12px 28px}`}</style>
      <Demo />
    </>
  );
}
