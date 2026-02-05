import * as React from "react"
import { SVGProps, memo } from "react"
const AddIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={18}
    height={18}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    {...props}
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export default memo(AddIcon)
