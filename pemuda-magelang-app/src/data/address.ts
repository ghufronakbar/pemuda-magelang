export interface AddressData {
  subdistrict: string;
  villages: string[];
}

export const KOTA_MAGELANG_ADDRESS_DATA: AddressData[] = [
  {
    subdistrict: "Magelang Selatan",
    villages: [
      "Jurangombo Selatan",
      "Jurangombo Utara",
      "Magersari",
      "Rejowinangun Selatan",
      "Tidar Selatan",
      "Tidar Utara",
    ],
  },
  {
    subdistrict: "Magelang Tengah",
    villages: [
      "Cacaban",
      "Gelangan",
      "Kemirirejo",
      "Magelang",
      "Panjang",
      "Rejowinangun Utara",
    ],
  },
  {
    subdistrict: "Magelang Utara",
    villages: [
      "Kedungsari",
      "Kramat Selatan",
      "Kramat Utara",
      "Potrobangsan",
      "Wates",
    ],
  },
];
