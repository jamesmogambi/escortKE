// components/LocationInitializer.tsx
"use client";

import { getRegions, getTowns } from "@/actions/location";
import { getAllCounties, getAllRegions } from "@/actions/region";
import { getVariantSettings } from "@/actions/variantsetting";
import { useFilterInputStore } from "@/app/girls/filterInputStore";
import { useVariantStore } from "@/store/variantStore";
import { useEffect } from "react";
// import { useLocationStore } from "@/stores/useLocationStore";

// Initialize and fetch locations data for filter inputs
const LocationInitializer = () => {
  const { setCounties, setRegions, setPractices } = useFilterInputStore();

  const {
    massage: massageVariants,
    setMassage,
    setBdsm,
    setPractices: setVariantPractices,
  } = useVariantStore();

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const [countiesRes, regionsRes, variantRes] = await Promise.all<any>([
          getAllCounties(),
          getAllRegions(),
          getVariantSettings(),
        ]);

        const practices = variantRes?.practices;
        console.log(
          "filter input responses",
          countiesRes,
          regionsRes,
          variantRes,
        );
        setCounties(countiesRes.data);
        setRegions(regionsRes.data);
        setMassage(variantRes?.massage || []);
        setPractices(practices);
        setBdsm(variantRes?.bdsm || []);
        setVariantPractices(practices);
      } catch (err) {
        console.error("Failed to fetch filterInput data:", err);
      }
    };

    fetchLocations();
  }, [setCounties, setRegions, setPractices]);

  return null;
};

export default LocationInitializer;
