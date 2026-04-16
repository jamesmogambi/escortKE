// components/LocationInitializer.tsx
"use client";

import { useFilterInputStore } from "@/app/girls/filterInputStore";
import { getAllLookupData } from "@/server-actions/lookup.action";
import { getAllCounties, getAllRegions } from "@/server-actions/region.action";
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
          getAllLookupData(),
        ]);

        const practices = variantRes?.data?.practices;
        // console.log(
        //   "filter input responses",
        //   countiesRes,
        //   regionsRes,
        //   variantRes,
        // );
        setCounties(countiesRes.data);
        setRegions(regionsRes.data);
        setMassage(variantRes?.data?.massage || []);
        setPractices(practices);
        setBdsm(variantRes?.data?.bdsm || []);
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
