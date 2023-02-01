import React from "react";
import { useNavigate } from "react-router-dom";

import style from "./CardGame.module.css";
export default function CardGame({ img, title, id }) {
	const navigate = useNavigate();
	const handleClickCard = () => {
		navigate(`/games/${id}`);
	};
	return (
		<div className={style.container_card} id={id} onClick={handleClickCard}>
			<img src={require("../../assets/images/" + img)} alt={title} className={style.img_card} />

			{/* <h3>{title}</h3> */}
		</div>
	);
}
