function init() {
	getSearchTextbox().focus();
	populateOptions();
	initListeners();
}

function initListeners() {
	document.getElementById("close").addEventListener("click", function() {
		close();
	});
	getSearchTextbox().addEventListener("onkeypress", updateOptions);
	document.getElementById("form").addEventListener("submit", navigateToTab);
}

function updateOptions(textbox) {
	// TODO implement filtering of options
}

function navigateToTab() {
	// TODO go to selected tab
}

function populateOptions() {
	// TODO populate selection options with tabs
	chrome.tabs.query({}, function(tabs) {
		var list = document.getElementById("select");
		for (var i = 0; i < tabs.length; i++) {
			createListNode(list, tabs[i]);
		}
		list.getElementsByTagName("a")[0].className += " active";
	});
}

function createListNode(list, tab) {
	var item = document.createElement("a");
	item.className = "list-group-item";
	createTabText(item, tab);
	list.appendChild(item);
}

function createTabText(item, tab) {
	var t1 = document.createTextNode(tab.title + " (");
	item.appendChild(t1);
	var i = document.createElement("i");
	var t2 = document.createTextNode(tab.url);
	i.appendChild(t2);
	item.appendChild(i);
	var t3 = document.createTextNode(")");
	item.appendChild(t3);
}

function getSearchTextbox() {
	return document.getElementById("search");
}

document.addEventListener("DOMContentLoaded", init);