"use client";

import Script from "next/script";

const CONTAINER_ID = "container-19c919b01f025488b9f14b8e02d4b474";
const SCRIPT_SRC =
  "https://pl28487572.effectivegatecpm.com/19c919b01f025488b9f14b8e02d4b474/invoke.js";

export default function NativeBanner() {
  return (
    <>
      <Script async data-cfasync="false" src={SCRIPT_SRC} />
      <div className="max-w-2xl mx-auto min-h-[172px]" id={CONTAINER_ID}></div>
    </>
  );
}
