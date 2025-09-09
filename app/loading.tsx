import React from "react";

const loading = () => {
  return (
    <div>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/30 ">
        <span className="text-white/70 text-2xl font-semibold">Loading...</span>
      </div>
    </div>
  );
};

export default loading;
