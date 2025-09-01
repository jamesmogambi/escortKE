import { create } from "zustand";
import { persist } from "zustand/middleware";

type AlertType = "success" | "error" | "info" | "warning";

interface Alert {
  title?: string;
  message: string;
  type?: AlertType;
  visible: boolean;
}

interface AlertStore {
  alert: Alert;
  showAlert: (
    message: string,
    type?: AlertType,
    title?: string,
    duration?: number
  ) => void;
  hideAlert: () => void;
}

export const useAlertStore = create<AlertStore>()(
  persist(
    (set) => ({
      alert: {
        title: "Membership Renewal",
        message:
          "ATTENTION - if you encounter someone contacting you from different phone numbers, do not respond to anything. This is a scam. We will always inform you only from the phone number 773 923 336",
        type: "info",
        visible: true,
      },

      showAlert: (message, type = "info", title = "", duration = 3000) => {
        set({ alert: { message, type, title, visible: true } });

        // Auto-hide
        setTimeout(() => {
          set((state) => ({
            alert: { ...state.alert, visible: false },
          }));
        }, duration);
      },

      hideAlert: () => {
        set((state) => ({
          alert: { ...state.alert, visible: false },
        }));
      },
    }),
    {
      name: "alert-storage", // key in localStorage
      partialize: (state) => ({ alert: state.alert }), // only persist alert
    }
  )
);
