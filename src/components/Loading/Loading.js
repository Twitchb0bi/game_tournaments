import React from "react";
import { Spinner } from "reactstrap";
import style from "./Loading.module.css";
function Loading() {
	return (
		<div>
			<Spinner className={style.spinner_lg} color="primary">
				loading...
			</Spinner>
		</div>
	);
}

export default Loading;
