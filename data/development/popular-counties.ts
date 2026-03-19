// counties.data.ts
export interface ICountyData {
  name: string;
  code: string;
}

export const POPULAR_COUNTIES: ICountyData[] = [
  { name: "Nairobi", code: "047" },
  { name: "Mombasa", code: "001" },
  { name: "Kiambu", code: "022" },
  { name: "Nakuru", code: "032" },
  { name: "Kisumu", code: "042" },
  { name: "Uasin Gishu", code: "027" },
  { name: "Meru", code: "012" },
  { name: "Machakos", code: "016" },
  { name: "Kakamega", code: "037" },
  { name: "Kisii", code: "045" },
  { name: "Kilifi", code: "003" },
  { name: "Kericho", code: "035" },
  { name: "Bungoma", code: "039" },
  { name: "Murang'a", code: "021" },
  { name: "Nyeri", code: "019" },
  { name: "Kajiado", code: "034" },
  { name: "Makueni", code: "017" },
  { name: "Turkana", code: "023" },
  { name: "Garissa", code: "007" },
  { name: "Narok", code: "033" },
];

export default POPULAR_COUNTIES;
