export const ID_INSTANCE_PATTERN = {
	value: /^\d{6,15}$/,
	message: 'idInstance состоит только из цифр'
}

export const API_URL_PATTERN = {
	value: /^https:\/\/([a-z0-9-]+\.)*green-?api\.com\/?$/i,
	message: 'Ожидается адрес вида https://1234.api.greenapi.com из личного кабинета'
}
