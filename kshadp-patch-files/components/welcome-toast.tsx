"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function WelcomeToast() {
  useEffect(() => {
    // Ignore if screen height is too small
    if (window.innerHeight < 650) return;
    // Use cookie version "3" so visitors who saw the old Vercel-branded
    // toast get this updated message on their next visit.
    if (!document.cookie.includes("welcome-toast=3")) {
      toast("Welcome to KSHADP", {
        id: "welcome-toast",
        duration: 5000,
        onDismiss: () => {
          document.cookie =
            "welcome-toast=3; max-age=31536000; path=/";
        },
        description:
          "Men's shapewear, underwear & loungewear. Free shipping on orders over $150.",
      });
    }
  }, []);

  return null;
}
