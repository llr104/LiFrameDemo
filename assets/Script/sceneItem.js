
var gameProxy = require("gameProxy")
var proxyName = require("proxyName")
var proxyMgr = require("proxyMgr")

cc.Class({
    extends: cc.Component,

    properties: {
        nameLab:cc.Label
    },

    onEnable () {
        this._proxy = proxyMgr.getProxyObj(proxyName.PROXY_GAME)
    },

    onDisable (){
        this._proxy = null
    },


    setName:function(name){
        this.nameLab.string = name
    },

    setId:function(id){
        this._id = id
    },

    onClickScene:function(){
        this._proxy.enterSceneReq(this._id)
    },
});
