var baseProxy = require("baseProxy")
var proxyName = require("proxyName")
var gameDefine = require("gameDefine")
var App = require("App")

let gameProxy = cc.Class({
    extends:baseProxy,

    ctor: function () {
        this._proxyName = proxyName.PROXY_GAME;
    },

    onAdd: function () {
        this._super();

        this._sceneData = null
        this.callBack.set(gameDefine.netFunc.enterGameReq, this.enterGameAck.bind(this))
        this.callBack.set(gameDefine.netFunc.heartBeatReq, this.heartBeatAck.bind(this))
        this.callBack.set(gameDefine.netFunc.logoutReq, this.logoutAck.bind(this))
        this.callBack.set(gameDefine.netFunc.enterSceneReq, this.enterSceneAck.bind(this))
        this.callBack.set(gameDefine.netFunc.exitSceneReq, this.exitSceneAck.bind(this))
        this.callBack.set(gameDefine.netFunc.sceneListReq, this.sceneListAck.bind(this))
        this.callBack.set(gameDefine.netFunc.sceneReq, this.sceneAck.bind(this))
        this.callBack.set(gameDefine.netFunc.movePush, this.movePush.bind(this))
        this.callBack.set(gameDefine.netFunc.monsterPush, this.monsterPush.bind(this))
        this.callBack.set(gameDefine.netFunc.attackPush, this.attackPush.bind(this))
        this.callBack.set(gameDefine.netFunc.userPush, this.userPush.bind(this))
        
        
    },

    onProxyError: function(){
        App.eventMgr.emit(gameDefine.event.event_game_proxyError, null)
    },

    onAuthError: function(){
        App.eventMgr.emit(gameDefine.event.event_game_authError, null)
    },

    networkError: function(){
        App.eventMgr.emit(gameDefine.event.event_game_netError, null)
    },


    onRemove: function () {
        this._super()
    },

    getSceneData:function(){
        return this._sceneData
    },

    enterGameReq: function(userId){
        console.log("gateProxy enterGameReq");
        var obj = {}
        obj.UserId = userId
        this.sendProto(gameDefine.netFunc.enterGameReq, obj)
    },

    enterGameAck: function(data){
        console.log("enterGameAck:", data)
        App.eventMgr.emit(gameDefine.event.event_enterGame, data)
    },

    heartBeatReq: function(){
        var obj = {}
        obj.clientTimeStamp = new Date().getTime()
        this.sendProto(gameDefine.netFunc.heartBeatReq, obj)
    },

    heartBeatAck: function(data){
        App.eventMgr.emit(gameDefine.event.event_heartBeat, data)
    },

    logoutReq: function(){
        var obj = {}
        this.sendProto(gameDefine.netFunc.logoutReq, obj)
    },

    logoutAck: function(data){
        App.eventMgr.emit(gameDefine.event.event_logout, data)
    },

    sceneListReq: function(){
        var obj = {}
        this.sendProto(gameDefine.netFunc.sceneListReq, obj)
    },

    sceneListAck: function(data){
        App.eventMgr.emit(gameDefine.event.event_sceneList, data)
    },

    enterSceneReq: function(sceneId){
        var obj = {}
        obj.sceneId = sceneId
        console.log("enterSceneReq:", sceneId)
        this.sendProto(gameDefine.netFunc.enterSceneReq, obj)
    },

    enterSceneAck: function(data){
        console.log("enterSceneAck:", data)
        App.eventMgr.emit(gameDefine.event.event_enterScene, data)
    },

    exitSceneReq: function(sceneId){
        var obj = {}
        obj.sceneId = sceneId
        console.log("exitSceneReq:", obj)
        this.sendProto(gameDefine.netFunc.exitSceneReq, obj)
    },

    exitSceneAck: function(data){
        console.log("exitSceneAck:", data)
        App.eventMgr.emit(gameDefine.event.event_exitScene, data)
    },

    sceneReq: function(sceneId){
        var obj = {}
        obj.sceneId = sceneId
        this.sendProto(gameDefine.netFunc.sceneReq, obj)
    },

    sceneAck: function(data){
        var obj = JSON.parse(data)
        this._sceneData = {}
        
        var players = obj.players
        this._sceneData.players = new Map()
        for (const key in players) {
            var player = players[key]
            this._sceneData.players.set(player.userId, player)
        }

        var monsters = obj.monsters
        this._sceneData.monsters = new Map()
        for (const key in monsters) {
            var monster = monsters[key]
            this._sceneData.monsters.set(monster.Id, monster)
        }

        App.eventMgr.emit(gameDefine.event.event_scene, data)
    },

    moveReq: function(userId, sx, sy, tox, toy){
        var obj = {}
        obj.userId = userId
        obj.sx = parseInt(sx)
        obj.sy = parseInt(sy)
        obj.tx = parseInt(tox)
        obj.ty = parseInt(toy)

        //console.log("moveReq:", obj)
        this.sendProto(gameDefine.netFunc.moveReq, obj)
    },

    movePush: function(data){
        App.eventMgr.emit(gameDefine.event.event_move, data)
    },

    attackReq: function(userId, monsterId, hurt){
        var obj = {}
        obj.userId = userId
        obj.monsterId = monsterId
        obj.hurt = hurt

        console.log("attackReq:", obj)
        this.sendProto(gameDefine.netFunc.attackReq, obj)
    },

    attackPush: function(data){
        console.log("attackPush:", data)
        var obj = JSON.parse(data)
        if(obj.monsterHp <= 0){
            if(this._sceneData){
                this._sceneData.monsters.delete(obj.monsterId)
            }
        }

        App.eventMgr.emit(gameDefine.event.event_attack, data)
    },

    monsterPush: function(data){
        var obj = JSON.parse(data)
        console.log("monsterPush:", data)
        if(this._sceneData){
            var monsters = obj.monsters
            for (const key in monsters) {
                var monster = monsters[key]
                this._sceneData.monsters.set(monster.Id, monster)
            }
        }
        App.eventMgr.emit(gameDefine.event.event_monster, data)
    },

    userPush: function(data){
        console.log("userPush:", data)
        var obj = JSON.parse(data)

        if(this._sceneData){
            var players = obj.players
            this._sceneData.players = new Map()
            for (const key in players) {
                var player = players[key]
                this._sceneData.players.set(player.userId, player)
            }
        }

        App.eventMgr.emit(gameDefine.event.event_user, data)
    },

});


module.exports = gameProxy