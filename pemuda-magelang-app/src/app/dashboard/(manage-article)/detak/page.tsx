import { redirect } from "next/navigation";

export default async function RedirectArtikel() {
  redirect("/dashboard/manajemen-artikel");
}
