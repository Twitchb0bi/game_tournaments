import React from "react";
import { useNavigate } from "react-router-dom";
import style from "./CardGame.module.css";
export default function CardGame({ img, title, id, background }) {
	const navigate = useNavigate();

	//Funzione che gestisce il click sulla card e che porta alla pagina dei tornei del gioco
	const handleClickCard = () => {
		navigate(`/games/${id}`, { state: { img: img, title: title, id: id, background: background } });
	};
	//require("../../assets/images/" + img)
	return (
		<div className={style.container_card_title}>
			<div className={style.container_card} id={title} onClick={handleClickCard}>
				<img src={img} alt={title} className={style.img_card} />
				{/* <h3>{title}</h3> */}
			</div>
			<h4 className={style.text_overflow}>{title}</h4>
			{/* <CustomTooltip id={title} title={title} /> */}
		</div>
	);
}
