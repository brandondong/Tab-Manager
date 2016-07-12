const MAX_URL_LENGTH = 95;

const ELIPSES = "...";

function init() {
	getSearchTextbox().focus();
	populateOptions();
	initListeners();
}

function initListeners() {
	document.getElementById("close").addEventListener("click", function() {
		close();
	});
	getSearchTextbox().addEventListener("input", updateOptions);
	document.getElementById("form").addEventListener("submit", navigateToTab);
	document.onkeydown = handleKeys;
}

function updateOptions() {
	var value = getSearchTextbox().value.toLowerCase();
	var items = getListElement().getElementsByTagName("a");
	var hasActivated = false;
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		deactivateListItem(item);
		if (item.keyword.toLowerCase().indexOf(value) != -1) {
			item.style.display = "block";
			if (!hasActivated) {
				activateListItem(item);
				hasActivated = true;
			}
		} else {
			item.style.display = "none";
		}
	}
}

/**
 * Navigates to the selected tab and closes the popup
 */
function navigateToTab() {
	var items = getListElement().getElementsByTagName("a");
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		if (item.className.indexOf("active") != -1) {
			chrome.windows.update(item.windowId, {focused: true});
			chrome.tabs.update(item.tabId, {active: true});
			close();
			return;
		}
	}
}

/**
 * Populates the initial list of tabs to be displayed and selects the first item
 */
function populateOptions() {
	chrome.tabs.query({}, function(tabs) {
		var list = getListElement();
		for (var i = 0; i < tabs.length; i++) {
			createListNode(list, tabs[i]);
		}
		list.getElementsByTagName("a")[0].className += " active";
	});
}

function createListNode(list, tab) {
	var item = document.createElement("a");
	item.className = "list-group-item";
	item.tabId = tab.id;
	item.windowId = tab.windowId;
	item.keyword = tab.title + " (" + tab.url + ")";
	createImageIcon(item, tab);
	createTabText(item, tab);
	item.addEventListener("click", function() {
		updateActive(item);
	});
	item.addEventListener("dblclick", navigateToTab);
	list.appendChild(item);
}

function createRow(item, tab) {
	var row = document.createElement("div");
	row.className = "row";
	var c1 = document.createElement("div");
	c1.className = "col-sm-1";
	createImageIcon(c1, tab);
	row.appendChild(c1);
	var c2 = document.createElement("div");
	c2.className = "col-sm-11";
	createTabText(c2, tab);
	row.appendChild(c2);
	item.appendChild(row);
}

function createImageIcon(item, tab) {
	var icon = document.createElement("img");
	icon.setAttribute("src", tab.favIconUrl);
	icon.setAttribute("width", "16");
	icon.setAttribute("height", "16");
	item.appendChild(icon);
}

function createTabText(item, tab) {
	var t1 = document.createTextNode(tab.title + " (");
	item.appendChild(t1);
	var i = document.createElement("i");
	var url = tab.url;
	if (url.length > MAX_URL_LENGTH) {
		url = url.substring(0, MAX_URL_LENGTH - ELIPSES.length) + ELIPSES;
	}
	var t2 = document.createTextNode(url);
	i.appendChild(t2);
	item.appendChild(i);
	var t3 = document.createTextNode(")");
	item.appendChild(t3);
}

/**
 * Sets the selected list item as active and deactivates everything else
 */
function updateActive(sItem) {
	var items = getListElement().getElementsByTagName("a");
	for (var i = 0; i < items.length; i++) {
		var item = items[i];
		deactivateListItem(item);
		if (item == sItem) {
			activateListItem(item);
		}
	}
}

function handleKeys(e) {
	if (e.keyCode == "38") {
		moveSelectionUp();
	} else if (e.keyCode == "40") {
		moveSelectionDown();
	} else if (e.keyCode == "13") {
		navigateToTab();
	}
}

function moveSelectionUp() {
	moveSelection(0, function(i) {
		return i + 1;
	});
}

function moveSelectionDown() {
	moveSelection(getListElement().getElementsByTagName("a").length - 1, function(i){
		return i - 1;
	});
}

function moveSelection(start, next) {
	var items = getListElement().getElementsByTagName("a");
	var prev = null;
	for (var i = start; i < items.length && i >= 0; i = next(i)) {
		var item = items[i];
		if (item.style.display != "none") {
			if (item.className.indexOf("active") != -1) {
				if (prev != null) {
					deactivateListItem(item);
					activateListItem(prev);
					// TODO this should replace and select the search text
					prev.scrollIntoViewIfNeeded();
				}
				return;
			} else {
				prev = item;
			}
		}
	}
}

function activateListItem(item) {
	item.className += " active";
}

function deactivateListItem(item) {
	item.className = item.className.replace(" active", "");
}

function getSearchTextbox() {
	return document.getElementById("search");
}

function getListElement() {
	return document.getElementById("select");
}

document.addEventListener("DOMContentLoaded", init);