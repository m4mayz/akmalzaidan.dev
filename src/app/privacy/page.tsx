import type { Metadata } from "next";

import { PrivacyPage } from "@/components/pages/privacy-page";

export const metadata: Metadata = {
    title: "Privacy Policy - Akmal Zaidan",
    description:
        "Privacy policy for Akmal Zaidan's portfolio website, contact form, analytics, retention, and privacy rights.",
};

export default function Page() {
    return <PrivacyPage locale="en" />;
}
