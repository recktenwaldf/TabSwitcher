
/*
    Default
    ========================

    @file      : TabSwitcher.js
    @version   : 1
    @author    : Ivo Sturm
    @date      : Tue, 31 May 2016
    @copyright : First Consulting
    @license   : Apache v3

    Documentation
    ========================
    20160531 - First version includes the usage of an attribute of the context object and a microflow to set the active pane of a tab container.
*/

// Required module list. Remove unnecessary modules, you can always get them back from the boilerplate.
define([
    "dojo/_base/declare",
	"dojo/NodeList-traverse",
    "mxui/widget/_WidgetBase",
	"mxui/dom",
	"dojo/dom-style",
	"dijit/registry"
], function(declare, NodeList, _WidgetBase, dom, domStyle, registry) {
    "use strict";

    // Declare widget's prototype.
    return declare("TabSwitcher.widget.TabSwitcher", [ _WidgetBase ], {

		// Parameters configured in the Modeler.
		tabclass : '',
		tabAttribute : '',
		tabMicroflow: "",
		
		_tabContainer : null,
		_hasStarted : false,
		_tabIndex : 0,
		
		// dojo.declare.constructor is called to construct the widget instance. Implement to initialize non-primitive properties.
		constructor: function() {

		},
		postCreate: function () {
			
			this.source = "";
			if (this.tabMicroflow && this.tabAttribute){
				if (this.enableLogging){
					console.error('TabSwitcher widget ill-configured. Choose either Microflow or Attribute as source');
				}
				this.source = 'Error';
			} else if (this.tabMicroflow) {
				this.source = 'Microflow';			
			} else {
				this.source = 'Attribute';
			}	
			
			this.actLoaded();
		},
				
		update : function(obj, callback) {

			if (this.enableLogging){
				console.log("TabSwitcher widget: Searching for tab pane index: " + this.tabAttribute);
			}
			if (obj){
				this.subscribe({
					guid : obj.getGuid(),
					callback : this.objChanged
				});
			
				this.contextGUID = obj.getGuid();
				
				if (this.contextGUID) {
					if (this.source === 'Microflow') {
						if (this.enableLogging){
							console.log('TabSwitcher widget: Source=Microflow');
						}
						mx.data.action({
							params: {
								applyto: "selection",
								actionname: this.tabMicroflow,
								guids: [this.contextGUID]
							},
							callback: dojo.hitch(this, function (result) {
								this.selectTab(result);
							}),
							error: function(error) {
								console.log(error.description);
							}
						}, this);
					} else if (this.source === 'Attribute') {
						if (this.enableLogging){
							console.log('TabSwitcher widget: Source=Attribute');
							console.log('TabSwitcher widget: AttributeName='+this.tabAttribute);
						}
						var missingAttrs = false, index = 0;
						if (!obj.has(this.tabAttribute)) {
							missingAttrs = true;
						} else {
							index = obj.get(this.tabAttribute);
						}
						if (this.enableLogging){
							console.log("TabSwitcher widget: Tab Pane Index: " + this.tabAttribute + (missingAttrs ? " is missing " : "") + " Tab Pane Index value: " + index );
						}
						this.selectTab(index);
						
					}
				}
			}		

			typeof(callback) == "function" && callback();
		},
		
		getTab : function ( _tabIndex ) {
			var gototab = null;
			this._tabContainer = dijit.byNode(dojo.query("."+this.tabclass)[0]);

			var tablist = this._tabContainer.getChildren();
			
			if( _tabIndex == null ) 
				_tabIndex = 0;
			if (this.enableLogging){
				console.log("Tabswitcher widget: Searching for tab index: " + _tabIndex);
			}
			
			if (tablist.length > 0 ) {
				if( _tabIndex >= tablist.length ) {
					_tabIndex = tablist.length - 1;
					if (this.enableLogging){
						console.debug("TabSwitcher widget: Setting tab index to: " + _tabIndex);
					}
				}
				
				gototab = tablist[_tabIndex];
	
			}
			return gototab;
		},

		selectTab : function (index) {
			var tab = this.getTab(index);
			if (tab) {
				
				/*var res = [];
				for(var m in this._tabContainer) {
					if(typeof this._tabContainer[m] == "function") {
						res.push(m)
					}
				}*/
				this._tabContainer.showTab(tab);

			}
		},
		
		objChanged : function (objId) {
			mx.data.get({
				guid : objId,
				callback : this.update
			}, this);
		},

		uninitialize : function(){
		}
    });
});

require(["TabSwitcher/widget/TabSwitcher"], function() {
    "use strict";
});
