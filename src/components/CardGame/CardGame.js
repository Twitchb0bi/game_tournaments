import React from "react";
import { useNavigate } from "react-router-dom";
import CustomTooltip from "../Tooltip/CustomTooltip";

import style from "./CardGame.module.css";
export default function CardGame({ img, title, id }) {
	const navigate = useNavigate();

	//Funzione che gestisce il click sulla card e che porta alla pagina dei tornei del gioco
	const handleClickCard = () => {
		navigate(`/games/${id}`);
	};
	return (
		<>
			<div className={style.container_card} id={title} onClick={handleClickCard}>
				<img src={require("../../assets/images/" + img)} alt={title} className={style.img_card} />

				{/* <h3>{title}</h3> */}
			</div>
			{/* <CustomTooltip id={title} title={title} /> */}
		</>
	);
}
