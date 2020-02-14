var baseProxy = require("baseProxy")
var proxyName = require("proxyName")
var loginDefine = require("loginDefine")
var App = require("App")

let loginProxy = cc.Class({
    extends:baseProxy,

    ctor: function () {
        this._session = ""
        this._userId = 0
        this._proxyName = proxyName.PROXY_LOGIN;
    },

    onAdd: function () {
        this._super();
        this.callBack.set(loginDefine.netFunc.loginAck, this.loginAck.bind(this))
        this.callBack.set(loginDefine.netFunc.registerAck, this.registerAck.bind(this))
        this.callBack.set(loginDefine.netFunc.distributeWorldAck, this.distributeWorldAck.bind(this))
    },

    onRemove: function () {
        this._super()
    },

    onProxyError: function(){
        App.eventMgr.emit(loginDefine.event.event_login_proxyError, null)
    },

    onAuthError: function(){
        App.eventMgr.emit(loginDefine.event.event_login_authError, null)
    },

    networkError: function(){
        //console.log("login networkError")
        App.eventMgr.emit(loginDefine.event.event_login_netError, null)
    },


    getSession: function(){
        return this._session
    },

    getUserId: function(){
        return this._userId
    },
    
    loginReq: function(name, password, ip){
        var obj = {}
        obj.Name = name
        obj.Password = password
        obj.Ip = ip
        this.sendProto(loginDefine.netFunc.loginReq, obj)
    },

    loginAck: function(data){
        //console.log("loginAck:",obj)
        var obj = JSON.parse(data)
        if(obj.Code == 0){
            this._session = obj.Session
            this._userId = obj.Id
        }else{
            this._session = ""
            this._userId = 0
        }

        App.eventMgr.emit(loginDefine.event.event_login, data)
    },

    registerReq: function(name, password, ip){
        var data = {}
        data.Name = name
        data.Password = password
        data.Ip = ip

        this.sendProto(loginDefine.netFunc.registerReq, data)
    },

    registerAck: function(data){
        //console.log("loginAck:",data)
        App.eventMgr.emit(loginDefine.event.event_Register, data)
        
    },

    distributeWorldReq: function(){
        console.log("distributeWorldReq")
        var data = {}
        data.CurTime = new Date().getTime()
        this.sendProto(loginDefine.netFunc.distributeWorldReq, data)
    },
    
    distributeWorldAck: function(data){
        //console.log("distributeWorldAck:",data)
        App.eventMgr.emit(loginDefine.event.event_distributeWorld, data)
    },

});


module.exports = loginProxy