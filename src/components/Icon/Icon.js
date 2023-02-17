import React from "react";
import CustomTooltip from "../Tooltip/CustomTooltip";

export default function Icon({ src, width = 20, title, id }) {
	return (
		<div>
			<img src={src} id={id} width={width} alt={title} />
			<CustomTooltip title={title} id={id} />
		</div>
	);
}
