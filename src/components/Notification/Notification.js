import { faCircle, faCircleNotch, faCloudArrowDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const successNotification = (message) => {
	toast.success(message, {
		position: "top-right",
		autoClose: 2000,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
	});
};
export const errorNotification = (message) => {
	toast.error(message, {
		position: "top-right",
		autoClose: false,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
	});
};
export const warningNotification = (message) => {
	toast.warning(message, {
		position: "top-right",
		autoClose: 7500,
		hideProgressBar: false,
		closeOnClick: true,
		pauseOnHover: true,
		draggable: true,
		progress: undefined,
	});
};
export const infoNotification = (message) => {
	let id = toast.info(message, {
		position: "top-right",
		autoClose: 1500,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: false,
		draggable: true,
		icon: <FontAwesomeIcon icon={faCloudArrowDown} color={"#427bf5"} />,
		progress: undefined,
	});
	return id;
};
export const messageNotification = (message) => {
	let id = toast.info(message, {
		position: "top-right",
		autoClose: 1500,
		hideProgressBar: true,
		closeOnClick: true,
		pauseOnHover: false,
		draggable: true,
		progress: undefined,
	});
	return id;
};
export const loadingNotification = (message) => {
	let id = toast.info(message, {
		position: "top-right",
		hideProgressBar: true,
		pauseOnHover: false,
		icon: <FontAwesomeIcon icon={faCircleNotch} color={"#427bf5"} className={"rotating"} />,
		progress: undefined,
	});
	return id;
};
