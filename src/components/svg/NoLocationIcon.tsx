import * as React from "react";
import { SVGProps, memo } from "react";
const NoLocationIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    stroke="currentColor"
    {...props}
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx={12} cy={10} r={3} />
  </svg>
);

export default memo(NoLocationIcon);
