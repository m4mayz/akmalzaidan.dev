import type { Metadata } from "next";

import { PrivacyPage } from "@/components/pages/privacy-page";
import { getPrivacyData, getSiteData } from "@/lib/content";

const site = getSiteData("en");
const privacy = getPrivacyData("en");

export const metadata: Metadata = {
    title: `${privacy.title} - ${site.name}`,
    description:
        "How this portfolio handles contact messages, hosting, analytics, retention, and privacy rights.",
};

export default function Page() {
    return <PrivacyPage locale="en" />;
}
