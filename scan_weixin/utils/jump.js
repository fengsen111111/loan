export function navigateTo(url, data = {}) {
	if(data === true&&!uni.getStorageSync("userInfo")){
		return;
	}
	uni.navigateTo({
		url: `${url}?${getObjectKeys(data)
      .map(key => `${key}=${data[key]}`)
      .join('&')}`
	});
};
export function back() {
	uni.navigateBack();
}

export function cardUtil(card){
	if(card){
	return card.substr(0,5)+"****"+card.substr(card.length - 4);
	}
}

function getObjectKeys(obj) {
	return Object.keys(obj);
};