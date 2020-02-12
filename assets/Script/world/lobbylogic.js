
var proxyName = require("proxyName")
var proxyMgr = require("proxyMgr")
var worldDefine = require("worldDefine")
var uiTools = require("uiTools")
var App = require("App")


cc.Class({
    extends: cc.Component,

    properties: {
        idLab:cc.Label,
        nameLab:cc.Label,
        gameIconNode:cc.Node,
        scrollContent:cc.Node
    },

    onEnable (){

        this.gameIconNode.active = false
        App.eventMgr.on(worldDefine.event.event_joinWorld, this.onJoinWorldAck, this)
        App.eventMgr.on(worldDefine.event.event_userInfo, this.onUserInfoAck, this)
        App.eventMgr.on(worldDefine.event.event_userLogout, this.onUserLogoutAck, this)
        App.eventMgr.on(worldDefine.event.event_gameServers, this.onGameServersAck, this)
        App.eventMgr.on(worldDefine.event.event_world_proxyError, this.onProxyError, this)
        App.eventMgr.on(worldDefine.event.event_world_authError, this.onAuthError, this)

        var pl = proxyMgr.getProxyObj(proxyName.PROXY_LOGIN)
        var pw = proxyMgr.getProxyObj(proxyName.PROXY_WORLD)

        var s = pl.getSession()
        var id = pl.getUserId()
        pw.joinWorldReq(s, id)
        
    },

    onDisable () {
        App.eventMgr.offAllForTarget(this)
    },

    onProxyError: function(event){
        console.log("onProxyError");
        var tips = "大厅服务器连接异常，请重试！";
        uiTools.showPopDialog("", tips, 0, function(){
            var pl = proxyMgr.getProxyObj(proxyName.PROXY_LOGIN)
            var pw = proxyMgr.getProxyObj(proxyName.PROXY_WORLD)
    
            var s = pl.getSession()
            var id = pl.getUserId()
            pw.joinWorldReq(s, id)
        }, null);
    },

    onAuthError: function(){
        console.log("onAuthError");
        var tips = "session 失效，请重新登录！";
        uiTools.showPopDialog("", tips, 0, function(){
            uiTools.hideLobby()
            uiTools.showLogin()
        }, null);
    },


    onJoinWorldAck:function(event, data){
        var obj = JSON.parse(data)
        if(obj.Code == 0){
            //请求个人信息
            var pw = proxyMgr.getProxyObj(proxyName.PROXY_WORLD)
            pw.userInfoReq(data.UserId)
            
        }else{
            var tips = "进入大厅失败，错误码是："+obj.Code
            uiTools.showPopDialog("", tips, 0, null, null)
        }

    },

    onUserInfoAck: function(event, data){
        console.log("onUserInfoAck:", data)
        var obj = JSON.parse(data)
        if(obj.Code == 0){
            this.nameLab.string = obj.User.Name
            this.idLab.string = "Id:" + obj.User.Id
          
            var pw = proxyMgr.getProxyObj(proxyName.PROXY_WORLD)
            pw.gameServersReq(obj.User.Id)

        }else{
            var tips = "获取用户信息失败，错误码是："+obj.Code
            uiTools.showPopDialog("", tips, 0, null, null)
        }
    },

    onUserLogoutAck: function(event, data){
        console.log("onUserLogoutAck:", data)
    },

    onGameServersAck: function(event, data){
        console.log("onGameServersAck:", data)
        var obj = JSON.parse(data)
        if(obj.Code == 0){
            this.scrollContent.removeAllChildren()
            for (const key in obj.Servers) {
                var v = obj.Servers[key]
                var icon = cc.instantiate(this.gameIconNode)
                this.scrollContent.addChild(icon)
                icon.active = true
                icon.getChildByName("name").getComponent(cc.Label).string = v.Name
                icon.Proxy = v.ProxyName
            }
        }else{
            var tips = "获取有些列表信息失败，错误码是："+obj.Code
            uiTools.showPopDialog("", tips, 0, null, null)
        }
    },

    onClickBack: function(){
        var pw = proxyMgr.getProxyObj(proxyName.PROXY_WORLD)
        var u = pw.getUser()
        if(u){
            pw.userLogoutReq(u.Id)
        }else{
            pw.userLogoutReq(0)
        }
        
        uiTools.hideLobby()
        uiTools.showLogin()
    },

    onClickRefresh: function(){
        var pw = proxyMgr.getProxyObj(proxyName.PROXY_WORLD)
        var u = pw.getUser()
        //console.log("onClickRefresh:",u)
        pw.userInfoReq(u.Id)
    },

    onClickGameIcon:function(event){
        
        App.setData("curGameProxyStr", event.target.Proxy)
        //进入游戏
        uiTools.showGame()
        uiTools.hideLobby()
        
    }


});
