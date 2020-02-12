
var loginProxy = require("loginProxy")
var proxyMgr = require("proxyMgr")
var App = require("App")
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
        App.eventMgr.on(loginDefine.event.event_Register, this.onRegisterAck, this)
    },

    onDisable (){
        App.eventMgr.offAllForTarget(this)
    },

    onClickBack:function(){
        uiTools.showLogin()
        uiTools.hideRegister()
    },
    
    
    onRegisterAck:function(event, data){
        console.log("onRegisterAck:", data)
        var obj = JSON.parse(data)

        if(obj.Code != 0){
            var tips = "注册失败，错误码是："+obj.Code
            uiTools.showPopDialog("", tips, 0, null, null)
        }else{
            uiTools.showPopDialog("", "注册成功", 0, null, null)
        }
    },

    onClickRegister:function(){
        var name = this.userEdit.string
        var password = md5(this.passwordEdit.string)
        var proxyObj = proxyMgr.getProxyObj(proxyName.PROXY_LOGIN)

        var proxyObj = proxyMgr.getProxyObj(proxyName.PROXY_LOGIN)
        if(proxyObj != null){
            proxyObj.registerReq(name, password,"127.0.0.1")
        }else{
            var tips = "服务器连接失败"
            uiTools.showPopDialog("", tips, 0, null, null)
        }
       
    },
});
