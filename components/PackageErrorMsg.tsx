import React from "react";

export default function PackageErrorMsg() {
  return (
    <p className="mt-2 text-xs text-warning">
      This feature is not included in your current subscription package. To
      enable this feature, please consider purchasing an additional subscription
      pack.
    </p>
  );
}
