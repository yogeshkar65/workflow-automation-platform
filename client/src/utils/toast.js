import { toast } from "react-toastify";

export const showSuccess = (msg) =>
  toast.success(msg, { position: "top-right" });

export const showError = (msg) =>
  toast.error(msg || "Something went wrong", {
    position: "top-right",
  });
