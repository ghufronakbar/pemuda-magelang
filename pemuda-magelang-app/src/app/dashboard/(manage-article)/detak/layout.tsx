import { checkPermission } from "@/actions/user";
import { Role } from "@prisma/client";

export default async function LayoutArticle({
  children,
}: {
  children: React.ReactNode;
}) {
  await checkPermission([Role.admin, Role.superadmin]);

  return children;
}
