var baseProxy = require("baseProxy")
var proxyName = require("proxyName")
var worldDefine = require("worldDefine")
var App = require("App")

let worldProxy = cc.Class({
    extends:baseProxy,

    ctor: function () {
        this._proxyName = proxyName.PROXY_WORLD;
    },

    onAdd: function () {
        this._super();
        this.callBack.set(worldDefine.netFunc.joinWorldReq, this.joinWorldAck.bind(this))
        this.callBack.set(worldDefine.netFunc.userInfoReq, this.userInfoAck.bind(this))
        this.callBack.set(worldDefine.netFunc.userLogoutReq, this.userLogoutAck.bind(this))
        this.callBack.set(worldDefine.netFunc.gameServersReq, this.gameServersAck.bind(this))
    },

    onRemove: function () {
        this._super();
    },

    onProxyError: function(){
        App.eventMgr.emit(worldDefine.event.event_world_proxyError, null)
    },

    onAuthError: function(){
        App.eventMgr.emit(worldDefine.event.event_world_authError, null)
    },

    networkError: function(){
        App.eventMgr.emit(worldDefine.event.event_world_netError, null)
    },


    getUser:function(){
        console.log("getUser:",this._userInfo)
        return this._userInfo
    },
    
    joinWorldReq: function(session, userId){
        console.log("joinWorldReq")
        var data = {}
        data.Session = session
        data.UserId = userId
        this.sendProto(worldDefine.netFunc.joinWorldReq, data)
    },

    joinWorldAck: function(data){
        console.log("joinWorldAck:", data)
        App.eventMgr.emit(worldDefine.event.event_joinWorld, data)
    },

    userInfoReq: function(userId){
        var data = {}
        data.UserId = userId
        this.sendProto(worldDefine.netFunc.userInfoReq, data)
    },

    userInfoAck: function(data){
        console.log("userInfoAck:", data)
        var obj = JSON.parse(data)
        if(obj.Code == 0){
            this._userInfo = obj.User
        }else{
            this._userInfo = null
        }

        App.eventMgr.emit(worldDefine.event.event_userInfo, data)
    },

    userLogoutReq: function(userId){
        var data = {}
        data.UserId = userId
        this.sendProto(worldDefine.netFunc.userLogoutReq, data)
    },

    userLogoutAck: function(data){
        App.eventMgr.emit(worldDefine.event.event_userLogout, data)
    },

    gameServersReq: function(userId){
        var data = {}
        data.UserId = userId
        this.sendProto(worldDefine.netFunc.gameServersReq, data)
    },

    gameServersAck: function(data){
        App.eventMgr.emit(worldDefine.event.event_gameServers, data)
    },

    
});


module.exports = worldProxy