/**
 * Dynamically displays the current popup shortcut
 */
function init() {
	chrome.commands.getAll(function(cmds) {
		var shortcut = document.getElementById("shortcut");
		shortcut.appendChild(document.createTextNode(cmds[0].shortcut));
	});
}

document.addEventListener("DOMContentLoaded", init);