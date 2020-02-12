

var network = require("network")
var gateProxy = require("gateProxy")
var loginProxy = require("loginProxy")
var worldProxy = require("worldProxy")
var proxyMgr = require("proxyMgr")
var App = require("App")
var gateDefine = require("gateDefine")
var loginDefine = require("loginDefine")
var proxyName = require("proxyName")
var uiTools = require("uiTools")
var md5 = require("md5")

cc.Class({
    extends: cc.Component,

    properties: {
       userEdit:cc.EditBox,
       passwordEdit:cc.EditBox
    },

    onEnable () {

        App.eventMgr.on(gateDefine.event.event_loginServer, this.onLoginServerAck, this)
        App.eventMgr.on(loginDefine.event.event_login, this.onLoginAck, this)
        App.eventMgr.on(loginDefine.event.event_distributeWorld, this.onDistributeWorldAck, this)
        App.eventMgr.on(loginDefine.event.event_login_proxyError, this.onProxyError, this)
        App.eventMgr.on(loginDefine.event.event_login_authError, this.onAuthError, this)


        var p = new gateProxy()
        proxyMgr.AddProxy(p)
        network.connect("ws://localhost:8000")
        p.gateLoginServerReq({})
    },

    onDisable (){
        App.eventMgr.offAllForTarget(this)
    },

    onProxyError: function(event){
        console.log("onProxyError");
        let self = this;
        var tips = "登录服务器连接异常，请重试！";
        uiTools.showPopDialog("", tips, 0, function(){
            
        }, null);
    },

    onAuthError: function(){
        console.log("onAuthError");
    },



    onLoginServerAck:function(event, data){
        console.log("onLoginServerAck:", data)
        var obj = JSON.parse(data)
        if (obj.Code == 0) {
            var p = new loginProxy()
            p.setProxyStr(obj.ServerInfo.ProxyName)
            proxyMgr.AddProxy(p)
            //uiTools.showPopDialog("", "连接成功", 0, null, null)
        }else{
            var tips = "获取登录服信息失败，错误码是："+obj.Code
            uiTools.showPopDialog("", tips, 0, null, null)
        }
    },

    onLoginAck:function(event, data){
        console.log("onLoginAck:", data)
        var obj = JSON.parse(data)
        if(obj.Code != 0){
            var tips = "登录失败，错误码是："+obj.Code
            uiTools.showPopDialog("", tips, 0, null, null)
        }else{

            App.setData("userId", obj.Id)
            App.setData("session", obj.Session)

            //登录成功, 然后请求world服
            var proxyObj = proxyMgr.getProxyObj(proxyName.PROXY_LOGIN)
            proxyObj.distributeWorldReq()

        }
    },


    onDistributeWorldAck:function(event, data){
        console.log("onDistributeWorldAck:", data)
        var obj = JSON.parse(data)
        if (obj.Code == 0){
            var p = new worldProxy()
            p.setProxyStr(obj.ServerInfo.ProxyName)
            proxyMgr.AddProxy(p)

            uiTools.hideLogin()
            uiTools.showLobby()
        }else{
            var tips = "获取大厅服务器失败"
            uiTools.showPopDialog("", tips, 0, null, null)
        }
    },

    onClickLogin:function(){

        var name = this.userEdit.string
        var password = md5(this.passwordEdit.string)
        console.log("password:", password)

        var proxyObj = proxyMgr.getProxyObj(proxyName.PROXY_LOGIN)
        if(proxyObj != null){
            proxyObj.loginReq(name, password,"127.0.0.1")
        }else{
            var tips = "服务器连接失败"
            uiTools.showPopDialog("", tips, 0, null, null)
        }
    },

    onClickRegister:function(){
        uiTools.hideLogin()
        uiTools.showRegister()
    }
});
