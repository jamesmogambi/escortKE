import { getAgencyEmployees } from "@/actions/business.action";
import GirlList from "@/components/GirlList";
import React from "react";

interface Prop {
  agencyId: string;
}

const CompanyGirls = async ({ agencyId }: Prop) => {
  const res = await getAgencyEmployees(agencyId);

  console.log("agency employees", res);
  return (
    <section className="">
      <h4 className="text-center mt-12  font-bold text-white text-2xl my-6">
        Girls from our company
      </h4>

      {/* render the employees */}
      <GirlList girls={(res.data as any) || []} />
    </section>
  );
};

export default CompanyGirls;
