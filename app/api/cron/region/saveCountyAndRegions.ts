// import { sql } from "@/db"; // assuming your Neon export lives here

import { sql } from "@/lib/neon";

async function saveCountyAndRegions(countyName: string, regionNames: string[]) {
  // Insert or fetch county
  const countyRes = await sql`
    INSERT INTO counties (name)
    VALUES (${countyName})
    ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
    RETURNING id
  `;
  const countyId = countyRes[0].id;

  // Insert regions
  for (const regionName of regionNames) {
    await sql`
      INSERT INTO regions (name, region_id)
      VALUES (${regionName}, ${countyId})
      ON CONFLICT (name) DO NOTHING
    `;
  }
}

export async function saveCountiesAndRegions(
  countiesWithRegions: { county: string; regions: string[] }[]
) {
  for (const { county, regions } of countiesWithRegions) {
    await saveCountyAndRegions(county, regions);
  }
}

export const insertRegions = async (values: [string, number][]) => {
  const sanitized = values
    .map(
      ([region, countyId]) => `('${region.replace(/'/g, "''")}', ${countyId})`
    )
    .join(", ");

  return sql.unsafe(`
    INSERT INTO regions (name, county_id)
    VALUES ${sanitized}
    ON CONFLICT (name) DO NOTHING
  `);
};
