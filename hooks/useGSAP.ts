"use client";

import { useGSAP as useGSAPCore } from "@gsap/react";
import { gsap } from "@/lib/gsap";

// Re-export avec notre config
export const useGSAP = useGSAPCore;

export { gsap };
