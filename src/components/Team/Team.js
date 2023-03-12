import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useNavigate } from "react-router-dom";
import CardTeam from "./CardTeam";
import style from "./team.module.css";

export default function Team({ team, handleClick, cardSelected, add = false }) {
	const navigate = useNavigate();
	//Funzione che gestisce la navigazione alla pagina di creazione di un team
	const handleAdd = () => {
		navigate("/createTeam", { state: { type: "create" } });
	};

	return (
		<div className={style.container_teams}>
			<div className={style.container_title_friends_list}>
				<h3 className="w100">Teams </h3>
				{add && <h3 className={style.container_max_team}>{team.length + " / 5"}</h3>}
			</div>
			<div className={style.container_cards_team}>
				{team.map((team) => (
					<CardTeam
						team={team}
						key={team._id}
						handleClick={handleClick}
						cardSelected={cardSelected}
					/>
				))}
				{!add && team.length === 0 && (
					<div className={style.container_no_team}>
						<h3>No Team found</h3>
					</div>
				)}
				{add && (
					<div className={style.container_add} onClick={handleAdd}>
						<FontAwesomeIcon icon={faPlus} color={"white"} size="2x" />
					</div>
				)}
			</div>
		</div>
	);
}
