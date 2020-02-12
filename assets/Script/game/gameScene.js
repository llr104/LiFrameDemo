
var baseProxy = require("baseProxy")
var proxyName = require("proxyName")
var gameProxy = require("gameProxy")
var proxyMgr = require("proxyMgr")
var App = require("App")


cc.Class({
    extends: cc.Component,

    properties: {
        titleLab:cc.Label,
        heroPrefab:cc.Prefab,
        monsterPrefab:cc.Prefab,
        sceneBg:cc.Node,
        sceneFrames:[cc.SpriteFrame]
    },
     
    onLoad () {
        this._isAttack = false
        this._heroMap = new Map()
        this._monsterMap = new Map()
        this._proxy = proxyMgr.getProxyObj(proxyName.PROXY_GAME)
        this._myUserId = App.getData("userId")

    
        this.sceneBg.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.sceneBg.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
    },

    onEnable (){
        App.eventMgr.on("touchMonsterEnd", this.onTouchMonsterEnd, this)
    },

    onDisable (){
        App.eventMgr.offAllForTarget(this)
    },


    onTouchStart (event){
        this._isAttack = false
    },

    onTouchEnd (event){
        //console.log("onTouchEnd:", this._isAttack)
        if (this._isAttack){
            return
        }

        var t = event.getLocation()
        var myHero = this.getHeroByUserId(this._myUserId)

        if(myHero){
            this._proxy.moveReq(this._myUserId, myHero.x, myHero.y, t.x, t.y)
        }
    },



    onTouchMonsterEnd:function(event, monster){
        this._isAttack = false
        var hero = this.getHeroByUserId(this._myUserId)
        if(hero && monster){
            var l = hero.position.sub(monster.position).mag()
            var Id = monster.getComponent("monster").getId()
            if (l <=80){
                this._proxy.attackReq(this._myUserId, Id, 100)
                this._isAttack = true
                hero.getComponent("hero").heroAttackAni(monster.x, monster.y)
            }
        }
    },


    setSceneName (name){
        this.titleLab.string = name
    },

    setSceneId (sceneId){
        var index = sceneId%this.sceneFrames.length
        this.sceneBg.getComponent(cc.Sprite).spriteFrame = this.sceneFrames[index]
        this._sceneId = sceneId
    },

    getHeroByUserId(userId){
        //console.log("getHeroByUserId:", this._heroMap, userId)
        var hero = this._heroMap.get(userId)
        return hero
    },

    loadPlayers (){
        console.log("loadPlayers")
        //清空
        for (let [key, value] of this._heroMap) {
            value.destroy()
        }
        this._heroMap.clear()

        var data = this._proxy.getSceneData()
        //console.log("loadPlayers data:", data)

    
        if(data && data.players){
            for (let [key, player] of data.players) {
                //console.log("player:", player)
                var hero = cc.instantiate(this.heroPrefab)
                this.sceneBg.addChild(hero, 100)
                hero.getComponent("hero").setup(player.userId, player.x, player.y, player.name)
                this._heroMap.set(player.userId, hero)
            }

        }
    },

    loadMonsters (){
        //清空
        for (let [key, value] of this._monsterMap) {
            value.destroy()
        }
        this._monsterMap.clear()

        var data = this._proxy.getSceneData()
        if(data && data.monsters){

            for (let [key, monster] of data.monsters) {
                var node = cc.instantiate(this.monsterPrefab)
                //console.log("monster:", monster)
                this.sceneBg.addChild(node)
                node.getComponent("monster").setup(monster.Id, monster.x,
                     monster.y, monster.name, monster.level, monster.hp)
                this._monsterMap.set(monster.Id, node)
            }
           
        }
    },

    userMove(obj){
        var hero = this.getHeroByUserId(obj.userId)
        if (hero) {
            hero.getComponent("hero").runMove(obj.sx, obj.sy, obj.tx, obj.ty)
        }
    },

    userAttack(obj){

        var m = this._monsterMap.get(obj.monsterId)
        if (m) {
            if (obj.monsterHp<=0){
                m.destroy()
                this._monsterMap.delete(obj.monsterId)
            }else{
                m.getComponent("monster").sethp(obj.monsterHp)
            }
        }

    },

    monster(obj){

        for (const key in obj.monsters) {
            var monster = obj.monsters[key]
            var node = cc.instantiate(this.monsterPrefab)
            this.sceneBg.addChild(node)
            node.getComponent("monster").setup(monster.Id, monster.x,
                 monster.y, monster.name, monster.level, monster.hp)
            this._monsterMap.set(monster.Id, node)
        }
  
    },

    userChange(obj){
        this.loadPlayers()
    },

    onClickBack:function(){
        App.eventMgr.emit("sceneExit", this._sceneId)
    },
    

});
