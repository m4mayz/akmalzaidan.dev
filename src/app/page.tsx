import { HomePage } from "@/components/pages/home-page";

export const dynamic = "force-static";

export default async function Page() {
    return <HomePage locale="en" />;
}
