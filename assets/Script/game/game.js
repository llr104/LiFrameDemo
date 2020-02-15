
var uiTools = require("uiTools")
var App = require("App")
var gameDefine = require("gameDefine")
var gameProxy = require("gameProxy")
var proxyName = require("proxyName")
var proxyMgr = require("proxyMgr")

cc.Class({
    extends: cc.Component,

    properties: {
       scenePrefab:cc.Prefab,
       scrollContent:cc.Node,
       sceneIconNode:cc.Node,
       uiNode:cc.Node,
       idLab:cc.Label,
       nameLab:cc.Label,
    },

    onLoad () {

        this.sceneIconNode.active = false
        this._sceneNode = null
    },

    onEnable () {

        var pw = proxyMgr.getProxyObj(proxyName.PROXY_WORLD)
        if(pw){
           var obj = pw.getUser()
           if(obj){
                this.nameLab.string = obj.Name
                this.idLab.string = "Id:" + obj.Id
           }
        }
        
        App.eventMgr.on("sceneExit", this.sceneExit, this)
        App.eventMgr.on(gameDefine.event.event_game_proxyError, this.onProxyError, this)
        App.eventMgr.on(gameDefine.event.event_game_authError, this.onAuthError, this)
        App.eventMgr.on(gameDefine.event.event_game_netError, this.onNetError, this)
        
        App.eventMgr.on(gameDefine.event.event_enterGame, this.onEnterGame, this)
        App.eventMgr.on(gameDefine.event.event_heartBeat, this.onHeartBeat, this)
        App.eventMgr.on(gameDefine.event.event_logout, this.onLogout, this)
        App.eventMgr.on(gameDefine.event.event_sceneList, this.onSceneList, this)
        App.eventMgr.on(gameDefine.event.event_enterScene, this.onEnterScene, this)
        App.eventMgr.on(gameDefine.event.event_exitScene, this.onExitScene, this)
        App.eventMgr.on(gameDefine.event.event_scene, this.onScene, this)
        App.eventMgr.on(gameDefine.event.event_move, this.onMove, this)
        App.eventMgr.on(gameDefine.event.event_attack, this.onAttack, this)
        App.eventMgr.on(gameDefine.event.event_monster, this.onMonster, this)
        App.eventMgr.on(gameDefine.event.event_user, this.onUser, this)

        this.enter()

        this.schedule(this.updateHeartBeat, 5.0)
        this.updateHeartBeat()

    },

    onDisable (){
        console.log("onDisable")
        App.eventMgr.offAllForTarget(this)
        proxyMgr.removeProxy(proxyName.PROXY_GAME)
        this._proxy = null
        this.unscheduleAllCallbacks()
    },

    enter: function(){
        var curGameProxyStr = App.getData("curGameProxyStr");
        console.log("curGameProxyStr:", curGameProxyStr)
        var p = new gameProxy()
        p.setProxyStr(curGameProxyStr)
        proxyMgr.AddProxy(p)
        this._proxy = p

        var userId = App.getData("userId");
        this._proxy.enterGameReq(userId);

        console.log("enter uerId:", userId);
    },

    onProxyError: function(event){
        console.log("game onProxyError");
        let self = this;
        var tips = "游戏服务器连接异常，请重试！";
        uiTools.showPopDialog("", tips, 0, function(){
            var userId = App.getData("userId");
            self._proxy.enterGameReq(userId);
        }, null);
    },

    onAuthError: function(){
        console.log("game onAuthError");
        var tips = "session 失效，请重新登录！";
        uiTools.showPopDialog("", tips, 0, function(){
            uiTools.hideGame()
            uiTools.showLogin()
        }, null);
    },

    onNetError :function(){
        let self = this
        var tips = "网络连接异常，请重试！";
        uiTools.showPopDialog("", tips, 0, function(){
            self.enter()
        }, null);
    },
    
    onClickBack:function(){
        uiTools.showLobby()
        uiTools.hideGame()
    },

    updateHeartBeat:function(){
        this._proxy.heartBeatReq();
    },

    sceneExit: function(event, sceneId){
        this._proxy.exitSceneReq(sceneId)

        this.uiNode.active = true
        if (this._sceneNode != null){
            this._sceneNode.destroy()
        }

        this._sceneNode = null
    },

    onEnterGame:function(event, data){
        var obj = JSON.parse(data)
        if (obj.Code == 0){
            //var tips = "进入游戏成功"
            //uiTools.showPopDialog("", tips, 0, null, null)
            this._proxy.sceneListReq()
        }else{
            var tips = "进入游戏失败，错误码是："+obj.Code
            uiTools.showPopDialog("", tips, 0, null, null)
        }
    },

    onHeartBeat:function(event, data){
        console.log("onHeartBeat")
    },

    onLogout:function(event, data){
        uiTools.showLobby()
        uiTools.hideGame()
    },

    onSceneList:function(event, data){
        console.log("onSceneList:", data)

        var obj = JSON.parse(data);
        this.scrollContent.removeAllChildren()

        for (let index = 0; index < obj.sceneId.length; index++) {
            var icon = cc.instantiate(this.sceneIconNode)
            this.scrollContent.addChild(icon)
            icon.active = true
           
            const id = obj.sceneId[index];
            const name = obj.sceneName[index];

            icon.active = true;
            icon.getComponent("sceneItem").setName(name);
            icon.getComponent("sceneItem").setId(id);
        }

    },

    onEnterScene:function(event, data){
        console.log("onEnterScene:", data)
        var obj = JSON.parse(data)
        if (obj.Code == 0){

            if (this._sceneNode != null){
                this._sceneNode.active = true
                this.uiNode.active = false
                return
            }

            var width = this.node.width
            var height = this.node.height

            var node = cc.instantiate(this.scenePrefab)
            this.node.addChild(node)
            node.x = -width/2
            node.y = -height/2

            node.getComponent("gameScene").setSceneId(obj.sceneId)
            node.getComponent("gameScene").setSceneName(obj.sceneName)
            this._sceneNode = node
            this.uiNode.active = false

            //请求场景
            this._proxy.sceneReq(obj.sceneId)

        }else{
            var tips = "进入场景失败，错误码是："+obj.Code
            uiTools.showPopDialog("", tips, 0, null, null)
        }
    },

    onExitScene:function(event, data){
        var obj = JSON.parse(data)
        if (obj.Code == 0){
            this.uiNode.active = true
            if (this._sceneNode != null){
                this._sceneNode.destroy()
            }
            this._sceneNode = null
        }else{
            var tips = "退出场景失败，错误码是："+obj.Code
            uiTools.showPopDialog("", tips, 0, null, null)
        }
    },

    onScene:function(event, data){
        console.log("onScene:", data)
        if (this._sceneNode){
            this._sceneNode.getComponent("gameScene").loadPlayers()
            this._sceneNode.getComponent("gameScene").loadMonsters()
        }
    },

    onMove:function(event, data){
        //console.log("onMove:", data)
        var obj = JSON.parse(data)
        if (this._sceneNode){
            this._sceneNode.getComponent("gameScene").userMove(obj)
        }
    },

    onAttack:function(event, data){
        var obj = JSON.parse(data)
        if (this._sceneNode){
            this._sceneNode.getComponent("gameScene").userAttack(obj)
        }
    },


    onMonster:function(event, data){
        var obj = JSON.parse(data)
        if (this._sceneNode){
            this._sceneNode.getComponent("gameScene").monster(obj)
        }
    },

    onUser:function(event, data){
        var obj = JSON.parse(data)
        if (this._sceneNode){
            this._sceneNode.getComponent("gameScene").userChange(obj)
        }
    },
    

});
