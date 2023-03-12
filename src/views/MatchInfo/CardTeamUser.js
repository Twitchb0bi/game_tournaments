import React from "react";
import { useNavigate } from "react-router-dom";
import style from "./MatchInfo.module.css";

export default function CardTeamUser({
	background,
	earnings,
	name,
	win,
	lose,
	components = [],
	icon,
}) {
	const navigate = useNavigate();
	const showUser = (id) => {
		navigate("/profile", { state: { _id: id } });
	};
	return (
		<div className={style.container_team_user}>
			<img src={background} className={style.img} width={300} height={200} />
			<div className={style.container_team_name}>
				<h5 className={""}>{name}</h5>
			</div>
			<div className={style.container_score}>
				<div className={style.container_score_team}>
					<p className="green">{win + " W"} </p> <span className="ml-5 mr-5 text-white">/</span>
					<p className="ml-5 red">{" " + lose + " L"}</p>
				</div>
			</div>
			<div className={style.container_info_team}>
				{components.map((player) => (
					<div key={player._id} className={style.row_user}>
						<h4 className="mb-0 underline_user pointer" onClick={() => showUser(player._id)}>
							{player.username}
						</h4>
						<div className={style.container_icon_game}>
							<img src={icon} width={24} height={24} />
							<h5 className={style.in_game_username}>{player.gameAccount[0]?.username}</h5>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
