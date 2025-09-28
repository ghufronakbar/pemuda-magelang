import { getAppData } from "@/actions/app-data";
import RichTextStyles from "@/components/editor/rich-text-styles";

export default async function TermsPage() {
  const appData = await getAppData();
  return (
    <section className={"mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-26"}>
      <RichTextStyles content={appData.pageTerms} />
    </section>
  );
}
