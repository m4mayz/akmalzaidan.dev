import { revalidatePath } from "next/cache";

function getProductionRevalidateUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const secret = process.env.REVALIDATE_SECRET?.trim();

  if (!siteUrl || !secret) return null;

  const origin = /^https?:\/\//i.test(siteUrl) ? siteUrl : `https://${siteUrl}`;
  const url = new URL("/api/revalidate", origin);
  url.searchParams.set("secret", secret);

  return url;
}

export async function revalidateSite() {
  revalidatePath("/", "layout");

  const productionUrl = getProductionRevalidateUrl();
  if (!productionUrl) return { production: "skipped" };

  const response = await fetch(productionUrl, { cache: "no-store" });
  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `Production revalidate failed (${response.status}): ${message}`,
    );
  }

  return { production: "revalidated" };
}
