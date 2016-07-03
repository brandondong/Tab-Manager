chrome.commands.onCommand.addListener(function (command) {
	if (command === "open-tab-popup") {
		createTabPopup();
	} else if (command === "open-quick-access") {
		createQuickAccessPopup();
	}
});
