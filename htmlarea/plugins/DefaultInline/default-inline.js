/***************************************************************
*  Copyright notice
*
*  (c) 2007 Stanislas Rolland <stanislas.rolland(arobas)fructifor.ca>
*  All rights reserved
*
*  This script is part of the TYPO3 project. The TYPO3 project is
*  free software; you can redistribute it and/or modify
*  it under the terms of the GNU General Public License as published by
*  the Free Software Foundation; either version 2 of the License, or
*  (at your option) any later version.
*
*  The GNU General Public License can be found at
*  http://www.gnu.org/copyleft/gpl.html.
*  A copy is found in the textfile GPL.txt and important notices to the license
*  from the author is found in LICENSE.txt distributed with these scripts.
*
*
*  This script is distributed in the hope that it will be useful,
*  but WITHOUT ANY WARRANTY; without even the implied warranty of
*  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*  GNU General Public License for more details.
*
*
*  This copyright notice MUST APPEAR in all copies of the script!
***************************************************************/
/*
 * Default Inline Plugin for TYPO3 htmlArea RTE
 *
 * TYPO3 SVN ID: $Id$
 */
DefaultInline = HTMLArea.plugin.extend({
		
	constructor : function(editor, pluginName) {
		this.base(editor, pluginName);
	},
	
	/*
	 * This function gets called by the class constructor
	 */
	configurePlugin : function (editor) {
		
		/*
		 * Registering plugin "About" information
		 */
		var pluginInformation = {
			version		: "1.0",
			developer	: "Stanislas Rolland",
			developerUrl	: "http://www.fructifor.ca/",
			copyrightOwner	: "Stanislas Rolland",
			sponsor		: "Fructifor Inc.",
			sponsorUrl	: "http://www.fructifor.ca/",
			license		: "GPL"
		};
		this.registerPluginInformation(pluginInformation);
		
		/*
		 * Registering the buttons
		 */
		var buttonList = DefaultInline.buttonList;
		var n = buttonList.length;
		for (var i = 0; i < n; ++i) {
			var button = buttonList[i];
			buttonId = button[0];
			var buttonConfiguration = {
				id		: buttonId,
				tooltip		: this.localize(buttonId + "-Tooltip"),
				textMode	: false,
				action		: "onButtonPress",
				context		: button[1]
			};
			this.registerButton(buttonConfiguration);
		}
		
		/*
		 * Registering the hotkeys
		 */
		for (var hotKey in DefaultInline.hotKeyList) {
			if (DefaultInline.hotKeyList.hasOwnProperty(hotKey)) {
				var hotKeyConfiguration = {
					id	: hotKey,
					action	: "onHotKey"
				};
			this.registerHotKey(hotKeyConfiguration);
			}
		}
		
		return true;
	 },
	 
	/*
	 * This function gets called when some inline element button was pressed.
	 */
	onButtonPress : function (editor, buttonId, UI, param) {
		editor.focusEditor();
		try {
			editor._doc.execCommand(buttonId, UI, param);
		}
		catch(e) {
			this.appendToLog("onButtonPress", e + "\n\nby execCommand(" + buttonId + ");");
		}
		editor.updateToolbar();
		return false;
	},
	
	/*
	 * This function gets called when some hot key is pressed
	 */
	onHotKey : function(editor, key) {
		if (DefaultInline.hotKeyList[key] && this.editor._toolbarObjects[DefaultInline.hotKeyList[key]]) {
			var toolbarObject = this.editor._toolbarObjects[DefaultInline.hotKeyList[key]];
			var toolbarHTMLObject = document.getElementById(toolbarObject.elementId);
			if (!toolbarHTMLObject.disabled) {
				return this.onButtonPress(this.editor, DefaultInline.hotKeyList[key]);
			}
		} else {
			return true;
		}
	},
	
	/*
	 * This function gets called when the toolbar is updated
	 */
	onUpdateToolbar : function () {
		var editor = this.editor;
		var buttonList = DefaultInline.buttonList;
		var buttonId, button, n = buttonList.length, commandState;
		for (var i = 0; i < n; ++i) {
			buttonId = buttonList[i][0];
			button = editor._toolbarObjects[buttonId];
			commandState = false;
			if ((editor._editMode != "textmode")) {
				try {
					commandState = editor._doc.queryCommandState(buttonId);
				} catch(e) {
					commandState = false;
				}
			}
			button.state("active", commandState);
		}
	}
});

/* The list of buttons added by this plugin */
DefaultInline.buttonList = [
	["Bold", null],
	["Italic", null],
	["StrikeThrough", null],
	["Subscript", null],
	["Superscript", null],
	["Underline", null]
];

/* The list of hotkeys handled by this plugin */
DefaultInline.hotKeyList = {
	b : "Bold",
	i : "Italic",
	s : "StrikeThrough",
	u : "Underline"
};

