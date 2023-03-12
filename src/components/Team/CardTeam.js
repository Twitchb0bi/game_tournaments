import React from "react";
import style from "./cardTeam.module.css";

export default function CardTeam({ team, handleClick, cardSelected }) {
	return (
		<div
			key={team._id}
			onClick={() => {
				handleClick(team);
			}}
			className={
				cardSelected?._id && team?._id && cardSelected._id == team._id
					? style.selected + " " + style.container_recent_match
					: style.container_recent_match
			}>
			<img src={team.background} width={300} height={200} />
			<div className={style.container_result_match}>
				<h5 className={""}>$ {team.earnings}</h5>
			</div>
			<div className={style.container_info_team}>
				<h4 className="mb-0">{team.name}</h4>
				<div className={style.container_score_team}>
					<p className="green">{team.win + " W"} </p> <span className="ml-5 mr-5">/</span>
					<p className="ml-5 red">{" " + team.lose + " L"}</p>
				</div>
			</div>
		</div>
	);
}
