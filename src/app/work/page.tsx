import { WorkIndexPage } from "@/components/pages/work-index-page";

export const dynamic = "force-static";

export default async function Page() {
    return <WorkIndexPage locale="en" />;
}
