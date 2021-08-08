const CLASS_NAME_MODDED = 'click-modded'; // 重複して click イベントを設定しないようにするためのフラグ
const SHOW_KEY = true; // key を検索結果および個別Mapページに表示するかどうか
const GET_METADATA = false; // metadata の取得をするかどうか

function removeInvalidChar(text: string | null): string {
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

function zeroPadding(value: number, length: number): string {
	return `00000000${value}`.slice(-length);
}

function getMapperName(mapperLinks: NodeListOf<Element>, isMapPage = false): string {
	let mapper = '';
	if (mapperLinks != null && mapperLinks.length > 0) {
		for (let i = 0; i < mapperLinks.length; i++) {
			const mapperLink = mapperLinks[i];
			const href: string | null = mapperLink.getAttribute('href');
			if (href != null && href.startsWith('/profile/')) {
				if (isMapPage) {
					mapper = mapperLink.querySelector('span')?.textContent ?? '';
				}
				else {
					mapper = mapperLink.textContent ?? '';
				}
				mapper = removeInvalidChar(mapper);
				break;
			}
		}
	}
	return mapper;
}

function getMetaData(id: string): Promise<{ [key: string]: any }> {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.responseType = 'json';

		xhr.onload = function () {
			if (xhr.status === 200) {
				resolve(this.response?.metadata);
			}
			else {
				reject(new Error(xhr.statusText));
			}
		};
		const url = new URL(`/api/maps/id/${id}`, location.origin);
		xhr.open('GET', url.href);
		xhr.send();
	})
}

function addClickEventToSearchResult(beatmap: Element) {
	const downloadLink: HTMLElement = beatmap.querySelector('a[title="Download zip"]') as HTMLElement;
	if (downloadLink == null) {
		// ダウンロードリンクが見つからない
		return;
	}
	const mapLink = beatmap.querySelector('div.info a')
	if (mapLink == null) {
		// mapへのリンクが見つからない
		return;
	}
	const mapperLinks = beatmap.querySelectorAll('div.info p a');
	const mapper: string = getMapperName(mapperLinks);

	let id: string = mapLink.getAttribute('href') ?? '';
	id = id.substring(id.lastIndexOf('/') + 1);
	const filename = `${id} (${removeInvalidChar(mapLink.textContent)} - ${mapper}).zip`;

	downloadLink.onclick = (event: Event) => {
		event.preventDefault();
		chrome.runtime.sendMessage({
			url: downloadLink.getAttribute('href'),
			filename: filename
		});
	};

	if (SHOW_KEY) {
		// [Copy BSR]ボタンの下に key を表示
		const bsrLink: HTMLElement = beatmap.querySelector('a[title="Copy BSR"]') as HTMLElement;
		bsrLink?.appendChild(document.createElement('br'));
		bsrLink?.appendChild(document.createTextNode(id));
	}
}

function addClickEventToMapPage(cardHeader: Element, filename: string) {
	const downloadLink: HTMLElement = cardHeader.querySelector('a[title="Download zip"]') as HTMLElement;
	if (downloadLink == null) {
		// ダウンロードリンクが見つからない
		return;
	}
	downloadLink.onclick = (event: Event) => {
		event.preventDefault();
		chrome.runtime.sendMessage({
			url: downloadLink.getAttribute('href'),
			filename: filename
		});
	};
}

function createListGroupItem(title: string, value: string, id: string): Element {
	const keyElm = document.createElement('div');
	keyElm.classList.value = 'list-group-item d-flex justify-content-between';
	keyElm.textContent = title;
	const spanElm = document.createElement('span');
	spanElm.classList.value = 'text-truncate ml-4';
	spanElm.textContent = value;
	spanElm.id = id;
	keyElm.appendChild(spanElm);
	return keyElm;
}

const myobserver = new MutationObserver(function () {
	if (location.pathname != null && location.pathname.startsWith('/maps/')) {
		// Map個別ページ
		const id: string = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
		const cardHeader: Element | null = document.querySelector('div.card-header');
		if (cardHeader == null || cardHeader.classList.contains(CLASS_NAME_MODDED)) {
			return;
		}
		const listGroup: Element = document.querySelector('div.list-group') as Element;
		const mapperLinks: NodeListOf<Element> = listGroup.querySelectorAll('a');
		const mapper: string = getMapperName(mapperLinks, true);
		const filename = `${id} (${removeInvalidChar(cardHeader.textContent)} - ${mapper}).zip`
		addClickEventToMapPage(cardHeader, filename);

		cardHeader.classList.add(CLASS_NAME_MODDED);

		// listGroup に key を追加
		if (SHOW_KEY) {
			const keyElm = createListGroupItem('Key', id, 'modKeyElmId');
			listGroup.appendChild(keyElm);
		}
		if (GET_METADATA) {
			// listGroup に duration を追加
			const durationElm = createListGroupItem('Duration', '-', 'modDurationElmId');
			listGroup.appendChild(durationElm);

			getMetaData(id)
				.then((result: { [key: string]: any }) => {
					const duration = result?.duration ?? 0;
					let minutes = duration;
					if (duration > 3600) {
						minutes = duration % 3600;
					}
					let durationText = `${zeroPadding(Math.floor(minutes / 60), 2)}:${zeroPadding(minutes % 60, 2)}`;
					if (duration > 3600) {
						durationText = `${Math.floor(duration / 3600)}:${durationText}`;
					}
					if (durationText.startsWith('0')) {
						durationText = durationText.substring(1);
					}
					const elm = document.getElementById('modDurationElmId');
					if (elm != null) {
						elm.textContent = durationText;
					}
				})
				.catch((error: any) => {
					console.error(error);
				})
		}
		return;
	}
	// 検索結果
	const beatmaps: HTMLCollectionOf<Element> = document.getElementsByClassName('beatmap')
	for (let i = 0; i < beatmaps.length; i++) {
		const beatmap = beatmaps[i];
		if (beatmap.classList.contains(CLASS_NAME_MODDED)) {
			continue;
		}
		addClickEventToSearchResult(beatmap);
		beatmap.classList.add(CLASS_NAME_MODDED);
	}
})

const config = {
	attributes: false,
	childList: true,
	subtree: true,
	characterData: false
};

myobserver.observe(document, config);
