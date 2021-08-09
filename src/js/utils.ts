export function removeInvalidChar(text: string | null): string {
	if (text == null) {
		return '';
	}
	return text
		// 空白文字を半角空白に変換
		.replace(/\s/g, " ")
		// 制御コードとファイル名に使用できない「\ / : * ? " < > |」を削除
		// eslint-disable-next-line no-control-regex
		.replace(/[\u0000-\u001f\u007f\\/:*?"<>|]/g, '')
		.trim();
}

export function zeroPadding(value: number, length: number): string {
	return `00000000${value}`.slice(-length);
}

export function formatSeconds(seconds: number): string {
	let minutes = seconds;
	if (seconds > 3600) {
		minutes = seconds % 3600;
	}
	let timeText = `${zeroPadding(Math.floor(minutes / 60), 2)}:${zeroPadding(minutes % 60, 2)}`;
	if (seconds > 3600) {
		timeText = `${Math.floor(seconds / 3600)}:${timeText}`;
	}
	if (timeText.startsWith('0')) {
		timeText = timeText.substring(1);
	}
	return timeText;
}