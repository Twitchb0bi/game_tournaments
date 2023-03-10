import React from "react";
import Header from "../Header/Header";
import style from "./MainTemplate.module.css";
function MainTemplate({ children, navItems, logo }) {
	return (
		<>
			<Header logo={logo} navItems={navItems} />
			<div className={` ${style.container}`}>{children}</div>
			{/* <Footer courseName={footerCourseName} courseLink={footerCourseLink} navItems={navItems} /> */}
		</>
	);
}

export default MainTemplate;
