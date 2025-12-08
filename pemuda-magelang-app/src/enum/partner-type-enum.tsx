import { PartnerTypeEnum } from "@prisma/client";

const getLabel = (type: PartnerTypeEnum) => {
  switch (type) {
    case PartnerTypeEnum.supported:
      return "Didukung / Sponsor";
    case PartnerTypeEnum.media:
      return "Media Partner";
    case PartnerTypeEnum.collaborator:
      return "Kolaborator Partner";
    default:
      return "Tidak diketahui";
  }
};

export const partnerTypeEnum = {
  getLabel,
};
