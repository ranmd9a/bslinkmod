import * as Utils from "./utils";

// const DEBUG = false;
const CLASS_NAME_MODDED = 'click-modded'; // 重複して click イベントを設定しないようにするためのフラグ
const SHOW_KEY = true; // key を検索結果および個別Mapページに表示するかどうか
const GET_MAP_DATA = true; // XMLHttpRequest で map データの取得をするかどうか

/** GET /maps/id/{id} のレスポンス定義 (使用するもののみ) */
interface IMapData {
	id: string;
	name: string;
	description: string;
	uploader: {[key: string]: any};
	metadata?: {
		bpm: string;
		duration: number;
		songName: string;
		songAuthorName: string;
		levelAuthorName: string;
	};
	stats?: {
		plays: number;
		downloads: number;
		upvotes: number;
		downvotes: number;
		score: number;
	}
}

/*
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
				mapper = Utils.removeInvalidChar(mapper);
				break;
			}
		}
	}
	return mapper;
}
*/

function getMapInfo(id: string): Promise<IMapData> {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.responseType = 'json';

		xhr.onload = function () {
			if (xhr.status === 200) {
				resolve(this.response);
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

/*
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
	const filename = `${id} (${Utils.removeInvalidChar(mapLink.textContent)} - ${mapper}).zip`;

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
*/
/*
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
*/

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

const myobserver = new MutationObserver(function (mutations: MutationRecord[]) {
	if (location.pathname != null && location.pathname.startsWith('/mappers')) {
		// Mapperページ
		return;
	}
	if (location.pathname != null && location.pathname.startsWith('/maps/')) {
		// Map個別ページ
		const id: string = location.pathname.substring(location.pathname.lastIndexOf('/') + 1);
		const cardHeader: Element | null = document.querySelector('div.card-header');
		if (cardHeader == null || cardHeader.classList.contains(CLASS_NAME_MODDED)) {
			return;
		}
		const listGroup: Element = document.querySelector('div.list-group') as Element;
		// const mapperLinks: NodeListOf<Element> = listGroup.querySelectorAll('a');
		// const mapper: string = getMapperName(mapperLinks, true);
		// const filename = `${id} (${Utils.removeInvalidChar(cardHeader.textContent)} - ${mapper}).zip`
		// addClickEventToMapPage(cardHeader, filename);

		cardHeader.classList.add(CLASS_NAME_MODDED);

		// listGroup に key を追加
		if (SHOW_KEY) {
			const keyElm = createListGroupItem('Key', id, 'modKeyElmId');
			listGroup.appendChild(keyElm);
		}
		if (GET_MAP_DATA) {
			// listGroup に Downloads を追加
			const downloadCountElm = createListGroupItem('Downloads', '-', 'modDownloadCountElmId');
			listGroup.appendChild(downloadCountElm);
			// listGroup に Duration を追加
			const durationElm = createListGroupItem('Duration', '-', 'modDurationElmId');
			listGroup.appendChild(durationElm);
			// listGroup に BPM を追加
			const bpmElm = createListGroupItem('BPM', '-', 'modBpmElmId');
			listGroup.appendChild(bpmElm);

			getMapInfo(id)
				.then((result: IMapData) => {
					// Downloads の値をセット
					const downloadCount = result?.stats?.downloads ?? 0;
					let elm = document.getElementById('modDownloadCountElmId');
					if (elm != null) {
						elm.textContent = downloadCount.toLocaleString();
					}
					// Duration の値をセット
					const duration = result?.metadata?.duration ?? 0;
					const durationText = Utils.formatSeconds(duration);
					elm = document.getElementById('modDurationElmId');
					if (elm != null) {
						elm.textContent = durationText;
					}
					// BPM の値をセット
					const bpm = result?.metadata?.bpm ?? 0;
					elm = document.getElementById('modBpmElmId');
					if (elm != null) {
						elm.textContent = `${bpm}`;
					}
				})
				.catch((error: any) => {
					console.error(error);
				})
		}
		return;
	}
	// 検索結果
	/*
	let moddedCount = 0;
	for (const mutation of mutations) {
		for (let i = 0; i < mutation.addedNodes.length; i++) {
			const addedNode = mutation.addedNodes[i];
			if (!(addedNode instanceof HTMLElement)) {
				continue;
			}
			if (!addedNode.classList.contains('search-results')) {
				continue;
			}
			const beatmaps: HTMLCollectionOf<Element> = addedNode.getElementsByClassName('beatmap')
			for (let i = 0; i < beatmaps.length; i++) {
				const beatmap = beatmaps[i];
				if (beatmap.classList.contains(CLASS_NAME_MODDED)) {
					// 2021/08/10時点では search-result 以下の要素を全部再作成しているらしく
					// classList にフラグ用の値を追加しても無駄だが、念のため判定。
					continue;
				}
				// addClickEventToSearchResult(beatmap);
				moddedCount++;
				beatmap.classList.add(CLASS_NAME_MODDED);
			}
		}
	}
	if (DEBUG) {
		console.log(`moddedCount: ${moddedCount}`);
	}
	*/
	/*
	const beatmaps: HTMLCollectionOf<Element> = document.getElementsByClassName('beatmap')
	for (let i = 0; i < beatmaps.length; i++) {
		const beatmap = beatmaps[i];
		if (beatmap.classList.contains(CLASS_NAME_MODDED)) {
			continue;
		}
		addClickEventToSearchResult(beatmap);
		beatmap.classList.add(CLASS_NAME_MODDED);
	}
	*/
})

const config = {
	attributes: false,
	childList: true,
	subtree: true,
	characterData: false
};

myobserver.observe(document, config);
