
var App = require("App")
var commonDefine = require("commonDefine")
var uiTools = require("uiTools")

cc.Class({
    extends: cc.Component,

    properties: {
        mainNode:cc.Node,
        dialogNode:cc.Node,
        loginPrefab:cc.Prefab,
        registerPrefab:cc.Prefab,
        lobbyPrefab:cc.Prefab,
        gamePrefab:cc.Prefab,

    },

    onLoad () {
        
        App.eventMgr.on(commonDefine.showPopDialog, this.onShowPopDialog, this)
        App.eventMgr.on(commonDefine.showLogin, this.onShowLogin, this)
        App.eventMgr.on(commonDefine.hideLogin, this.onHideLogin, this)
        App.eventMgr.on(commonDefine.showRegister, this.onShowRegister, this)
        App.eventMgr.on(commonDefine.hideRegister, this.onHideRegister, this)

        App.eventMgr.on(commonDefine.showLobby, this.onShowLobby, this)
        App.eventMgr.on(commonDefine.hideLobby, this.onHideLobby, this)
        App.eventMgr.on(commonDefine.showGame, this.onShowGame, this)
        App.eventMgr.on(commonDefine.hideGame, this.onHideGame, this)


        this.dialogNode.active = false
        uiTools.showLogin()
    },

    onShowPopDialog:function(event, title, text, type, sureFunc, cancelFunc){
        this.dialogNode.active = true
        this.dialogNode.getComponent("popDialog").show(title, text, type, sureFunc, cancelFunc)
    },

    onShowLogin:function(){
        if(this._loginNode == null){
            var loginNode = cc.instantiate(this.loginPrefab)
            this.mainNode.addChild(loginNode)
            this._loginNode = loginNode
        }else{
            this._loginNode.active = true
        }
    },

    onHideLogin:function(){
        if(this._loginNode){
            this._loginNode.active = false
        }
    },

    onShowRegister:function(){
        if(this._registerNode == null){
            var registerNode = cc.instantiate(this.registerPrefab)
            this.mainNode.addChild(registerNode)
            this._registerNode = registerNode
        }else{
            this._registerNode.active = true
        }
    },

    onHideRegister:function(){
        if(this._registerNode){
            this._registerNode.active = false
        }
    },

    onShowLobby:function(){
        if(this._lobbyNode == null){
            var lobbyNode = cc.instantiate(this.lobbyPrefab)
            this.mainNode.addChild(lobbyNode)
            this._lobbyNode = lobbyNode
        }else{
            this._lobbyNode.active = true
        }
    },

    onHideLobby:function(){
        if(this._lobbyNode){
            this._lobbyNode.active = false
        }
    },

    onShowGame:function(event, gameId){
        if(this._gameNode == null){
            var gameNode = cc.instantiate(this.gamePrefab)
            this.mainNode.addChild(gameNode)
            this._gameNode = gameNode
        }else{
            this._gameNode.active = true
        }
    },

    onHideGame:function(){
        if(this._gameNode){
            this._gameNode.active = false
        }
    },

});
