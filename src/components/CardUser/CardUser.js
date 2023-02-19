import React from "react";
import style from "./CardUser.module.css";
export default function CardUser({ avatar, position, userId, username, earnings, win, lose }) {
	return (
		<div className={style.card} key={userId}>
			{position !== 1 && <p className={style.card_header_rank}>{position}</p>}
			<div className={style.container_img_card}>
				{position === 1 && (
					<img
						width={50}
						height={50}
						src={require("../../assets/images/crown.png")}
						className={style.crown}
					/>
				)}
				<img src={avatar} width={64} height={64} className={"border-radius-10"} />
			</div>
			<p className={style.username}>{username}</p>
			<p className="text-white">€ {earnings}</p>
			<div className={style.card_header_avatar_username_earnings_stats}>
				<span className="green">{win + " W "}</span>
				<span className="text-white">/ </span>
				<span className="red">{lose + " L"}</span>
			</div>
		</div>
	);
}
