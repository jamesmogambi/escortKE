// components/LocationInitializer.tsx
"use client";

import { getRegions, getTowns } from "@/actions/location";
import { getVariantSettings } from "@/actions/variantsetting";
import { useFilterInputStore } from "@/app/girls/filterInputStore";
import { useEffect } from "react";
// import { useLocationStore } from "@/stores/useLocationStore";

const LocationInitializer = () => {
  const { setRegions, setTowns, setPractices } = useFilterInputStore();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const [regionsRes, townsRes, variantRes] = await Promise.all<any>([
          getRegions(),
          getTowns(),
          getVariantSettings(),
        ]);

        // const [regions, towns, practices] = await Promise.all([
        //   regionsRes.json(),
        //   townsRes.json(),
        //   practicesRes.json(),
        // ]);

        const practices = variantRes?.practices;
        console.log("filter input responses", regionsRes, townsRes, variantRes);
        setRegions(regionsRes);
        setTowns(townsRes);
        setPractices(practices);
      } catch (err) {
        console.error("Failed to fetch filterInput data:", err);
      }
    };

    fetchLocations();
  }, [setRegions, setTowns, setPractices]);

  return null;
};

export default LocationInitializer;
