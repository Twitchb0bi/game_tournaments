import React, { useState } from "react";
import { Tooltip } from "reactstrap";

export default function CustomTooltip({ title, placement = "bottom", id }) {
	const [tooltipOpen, setTooltipOpen] = useState(false);

	const toggle = () => setTooltipOpen(!tooltipOpen);
	return (
		<Tooltip placement={placement} isOpen={tooltipOpen} target={id} toggle={toggle}>
			{title}
		</Tooltip>
	);
}
