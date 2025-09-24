import { Footer } from "@/components/custom/footer";
import { Navbar } from "@/components/custom/navbar";

export const LandingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full min-h-screen bg-gray-50 text-foreground">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
};
