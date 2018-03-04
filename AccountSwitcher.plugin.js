//META{"name":"AccountSwitcher"}*//
var AccountSwitcher = function () {
	this.getName = function(){ return "Account Switcher"; }
	this.getDescription = function(){ return "Lets you switch between multiple Discord accounts."; }
	this.getVersion = function(){ return "0.0.1"; }
	this.getAuthor = function(){ return "Markg546"; }
	this.loadDatabase();
};
AccountSwitcher.prototype.load = function () {};
AccountSwitcher.prototype.start = function () {
	this.addButton();
};

AccountSwitcher.prototype.onMessage = function () {};
AccountSwitcher.prototype.onSwitch = function () {};
AccountSwitcher.prototype.observer = function (e) {};

AccountSwitcher.prototype.stop = function () {};
AccountSwitcher.prototype.unload = function () {};

AccountSwitcher.prototype.getSettingsPanel = function () {
	var self = this;
	var settings = $('<div class="form"></div>');
	settings.append('<h1 style="font-weight: bold">Account database:</h1>');

	var rowHtml = "";
	rowHtml += '<div class="control-group AccountSwitcher-inputgroup">';
	rowHtml += '	<input style="width: 40%;" type="text" name="name" placeholder="Name">';
	rowHtml += '	<input style="width: 40%;" type="text" name="data" placeholder="Token">';
	rowHtml += '</div><br>';

	for (var key in AccountSwitcher.keyStore) {
		if (!AccountSwitcher.keyStore.hasOwnProperty(key)) continue;
		var row = $(rowHtml);
		row.find('input[name="name"]').val(key);
		row.find('input[name="data"]').val(AccountSwitcher.keyStore[key]);
		settings.append(row);
	}
	var currentToken = window.localStorage.token
	settings.append(''+
		'<div class="control-group AccountSwitcher-inputgroup">'+
		'	<input style="width: 40%;" type="text" id="newname" name="name" placeholder="Name">'+
		'	<input style="width: 40%;" type="text" id="newtoken" name="data" placeholder="Token">'+
		'<button onClick="'+
		'$(\'#newname\').val(BetterAPI.getOwnName());'+
		'$(\'#newtoken\').val(\''+currentToken+'\');'+
		'">&lt;-</button>'+
		'</div><br>'+
	'');

	var addButton = $('<button type="button" class="btn btn-primary">Add Row</div>')
		.click(function() {
			$(this).before(rowHtml);
		});

	var saveButton = $('<button type="button" class="btn btn-primary">Save</div>')
		.click(function() {
			AccountSwitcher.keyStore = {};
			settings.find('.AccountSwitcher-inputgroup').each(function(i, el) {
				var $e = $(el);
				var key = $e.find('input[name="name"]').val();
				var data = $e.find('input[name="data"]').val();
				if (key.trim() === "" || data.trim() === "") return;
				AccountSwitcher.keyStore[key] = data;
			});

			self.saveDatabase();

			var $b = $(this).text('Saved!');
			setTimeout(function() {$b.text('Save');}, 1000);
		});

	settings.append(addButton);
	settings.append(saveButton);
	return settings;
};

AccountSwitcher.prototype.addButton = function() {
	var self = this;
	$(document).on("contextmenu", '.friends-icon', function(e){
		var _data = $("<div></div>");
		for (var key in AccountSwitcher.keyStore) {
			var _elem = $('<button onClick=\''+
				'BetterAPI.switchAccount("'+AccountSwitcher.keyStore[key]+'");'+
			'\'>'+key+'</button><br>');
			_data.append(_elem);
		}
		console.log(_data);
		Core.prototype.alert('Select a account to use.',''+
			'<div id="test"></div>'+
		'');
		$('#test').append(_data);
		return false;
	});
};
AccountSwitcher.prototype.saveDatabase = function() {
	window.localStorage.accounts = btoa(JSON.stringify(AccountSwitcher.keyStore));
};

AccountSwitcher.prototype.loadDatabase = function() {
	if (window.localStorage.hasOwnProperty("accounts")) {
		var data = window.localStorage.accounts;
		AccountSwitcher.keyStore = JSON.parse(atob(data));
	} else {
		AccountSwitcher.keyStore = {};
	}
};

try{exports.AccountSwitcher = AccountSwitcher;}catch(e){console.warn('AccountSwitcher: Using old BetterDiscord version, not exporting functions.')}