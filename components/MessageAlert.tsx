"use client";
import { useAlertStore } from "@/store/alertStore";
import React from "react";

interface Prop {
  className?: string;
  title: string;
  message: "";
}
const MessageAlert = () => {
  const { alert, hideAlert } = useAlertStore();

  if (!alert.visible) return null;
  return (
    <div className="w-full flex p-3  flex-col bg-primary text-white">
      <span className="text-center mb-2 font-semibold">| {alert.title}</span>

      <span className="text-lg text-center">{alert.message}</span>
    </div>
  );
};

export default MessageAlert;
