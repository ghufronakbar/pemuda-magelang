import { Role } from "@prisma/client";

const getLabel = (role: Role) => {
  switch (role) {
    case Role.superadmin:
      return "Superadmin";
    case Role.admin:
      return "Admin";
    case Role.user:
      return "User";
    default:
      return "User";
  }
};

export const roleEnum = {
  getLabel,
};
