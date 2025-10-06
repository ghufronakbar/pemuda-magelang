import { getAppData } from "@/actions/app-data";
import RichTextStyles from "@/components/editor/rich-text-styles";

export default async function TermsPage() {
  const appData = await getAppData();
  return (
    <div className="w-full">
      <section className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">Ketentuan Layanan</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              Ketentuan penggunaan layanan dan kebijakan yang berlaku di platform kami.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-card text-card-foreground rounded-2xl border shadow-sm p-6 sm:p-10">
          <RichTextStyles content={appData.pageTerms} />
        </div>
      </section>
    </div>
  );
}
