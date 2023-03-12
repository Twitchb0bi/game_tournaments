import React from "react";
import { Spinner } from "reactstrap";
import style from "./Loading.module.css";
function Loading({ allPage = false }) {
	return (
		<div className={allPage ? style.allPage : ""}>
			<Spinner className={style.spinner_lg} color="primary">
				loading...
			</Spinner>
		</div>
	);
}

export default Loading;
