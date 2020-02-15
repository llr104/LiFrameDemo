var network = require("network")
var gzip = require('gzip')

let baseProxy = cc.Class({

    properties: {
        
    },

    ctor: function () {
        this.proxystr = ""
        this.callBack = new Map()
    },

    onAdd: function () {
        this.callBack.set("proxyError", this.proxyError.bind(this))
        this.callBack.set("authError", this.authError.bind(this))
    },

    onRemove: function () {
        //退出代理
        //this.sendProto("gate.ExitProxy", {})
    },

    onProxyError: function(){
        console.log("base onProxyError")
    },

    onAuthError: function(){
        console.log("base onAuthError")
    },


    networkError: function(){
        console.log("base networkError")
    },

    getProxyName: function(){
        return this._proxyName
    },
    
    setProxyStr: function(proxystr){
        this.proxystr = proxystr
    },

    getProxyStr: function(){
        return this.proxystr
    },

    findCallBack: function(msgName){
        if (this.callBack.has(msgName)){
            return this.callBack.get(msgName)
        }else{
            return null
        }
    },

    sendProto: function(msgName, msgObj){
        network.send(msgName, this.proxystr, msgObj)
    },

    proxyError: function(){
        this.onProxyError()
    },

    authError: function(){
        this.onAuthError()
    },



});


module.exports = baseProxy