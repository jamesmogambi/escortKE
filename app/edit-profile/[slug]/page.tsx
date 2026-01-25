import { getCurrentEscort } from "@/actions/escort";
import { Metadata } from "next";
import React from "react";
import EditEscortForm from "../EditProfileForm";

export const metadata: Metadata = {
  title: "Update Profile 💖 | EscortKE.com",
};
const page = async () => {
  const escort = await getCurrentEscort();

  console.log("escort profile", escort);
  if (!escort) {
    return (
      <div className="flex flex-1 items-center justify-center text-primary">
        No escort profile found
      </div>
    );
  }
  return (
    <div>
      <EditEscortForm initialData={escort} />
    </div>
  );
};

export default page;
