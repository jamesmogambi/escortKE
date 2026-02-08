import { getSimpleFeaturedEscorts } from "@/actions/list-escort";
import React from "react";
import GirlList from "./GirlList";

const NotFoundList = async () => {
  const { data, count, success, error } = await getSimpleFeaturedEscorts(20);

  return (
    <div>
      <GirlList girls={data} className="max-w-6xl" />
    </div>
  );
};

export default NotFoundList;
