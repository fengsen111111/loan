export function dateFormat(date, formatter, isPad = true) {
	date = new Date(date);
	formatter = formatNormalize(formatter);
	const dateInfo = {
		year: date.getFullYear(),
		month: date.getMonth() + 1,
		date: date.getDate(),
		hour: date.getHours(),
		minute: date.getMinutes(),
		second: date.getSeconds()
	}
	dateInfo.yyyy = dateInfo.year.toString();
	dateInfo.MM = dateInfo.month.toString();
	dateInfo.dd = dateInfo.date.toString();
	dateInfo.HH = dateInfo.hour.toString();
	dateInfo.mm = dateInfo.minute.toString();
	dateInfo.ss = dateInfo.second.toString();

	function _pad(prop, len) {
		dateInfo[prop] = dateInfo[prop].padStart(len, "0");
	}
	if (isPad) {
		_pad("yyyy", 4);
		_pad("MM", 2);
		_pad("dd", 2);
		_pad("HH", 2);
		_pad("mm", 2);
		_pad("ss", 2);
	}
	return formatter(dateInfo)
}

function formatNormalize(formatter) {
	if (typeof formatter === "function") {
		return formatter;
	}
	if (typeof formatter !== "string") {
		throw new TypeError("formatter is not a string or method")
	}
	if (formatter === "date") {
		formatter = "yyyy-MM-dd"
	} else if (formatter === "datetime") {
		formatter = "yyyy-MM-dd HH:mm:ss"
	}
	return (dateInfo) => {
		const {
			yyyy,
			MM,
			dd,
			HH,
			mm,
			ss
		} = dateInfo;
		return formatter.replaceAll("yyyy", yyyy).replaceAll("MM", MM).replaceAll("dd", dd).replaceAll("HH", HH)
			.replaceAll("mm", mm).replaceAll("ss", ss);
	};
}