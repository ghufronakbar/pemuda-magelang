import { Separator } from "@/components/ui/separator";

export const TalentBio = ({ bio }: { bio: string | null }) => {
  return (
    <div className="w-full">
      <div className="prose prose-neutral text-sm">
        <p className="whitespace-pre-wrap">
          {bio || "Deskripsi tidak tersedia"}
        </p>
      </div>
      <div className="my-8">
        <Separator />
      </div>
    </div>
  );
};
