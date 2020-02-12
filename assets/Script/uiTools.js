var App = require("App")
var commonDefine = require("commonDefine")

var uiTools = {

};

uiTools.showPopDialog = function(title, text, type, sureFunc, cancelFunc){
    App.eventMgr.emit(commonDefine.showPopDialog, title, text, type, sureFunc, cancelFunc)
},

uiTools.showLogin = function(){
    App.eventMgr.emit(commonDefine.showLogin)
},

uiTools.hideLogin = function(){
    App.eventMgr.emit(commonDefine.hideLogin)
}

uiTools.showRegister = function(){
    App.eventMgr.emit(commonDefine.showRegister)
},

uiTools.hideRegister = function(){
    App.eventMgr.emit(commonDefine.hideRegister)
}

uiTools.showLobby = function(){
    App.eventMgr.emit(commonDefine.showLobby)
},

uiTools.hideLobby = function(){
    App.eventMgr.emit(commonDefine.hideLobby)
},

uiTools.showGame = function(gameId){
    App.eventMgr.emit(commonDefine.showGame)
},

uiTools.hideGame = function(){
    App.eventMgr.emit(commonDefine.hideGame)
}

module.exports = uiTools;