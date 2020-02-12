
const Dir_Front = 0
const Dir_Back = 1
const Dir_Left = 2
const Dir_Right = 3

cc.Class({
    extends: cc.Component,

    properties: {
        nameLab:cc.Label,
        atlas: cc.SpriteAtlas,
        animation:cc.Animation,
        attackAni:cc.Animation,
    },

    onLoad () {
        this._dir = Dir_Right

        //console.log("this.attackAni:", this.attackAni)
        this.attackAni.node.active = false

        //console.log("hero load")
        let sps = this.atlas.getSpriteFrames();
        sps.sort( (a,b)=>{
            return Number(a.name)-Number(b.name)
        })
        
        
        //0:前, 1:往后, 2:左, 3:右
        let dirSp = sps.splice(0,4);
        for(let i=0;i<4;i++){
            let tempSp = dirSp[i];
            let clip = cc.AnimationClip.createWithSpriteFrames([tempSp],1);
            clip.wrapMode = cc.WrapMode.Default;
            clip.name = "idle_"+i;
            this.animation.addClip(clip);
        }


        let n = sps.length/4;
        for(let i=0;i<4;i++){
            let tempSp = sps.splice(0,n);

            //console.log("clip:", tempSp);
            let clip = cc.AnimationClip.createWithSpriteFrames(tempSp,n);
            clip.wrapMode = cc.WrapMode.Loop;
            clip.name = "move_"+i.toString();

            //console.log("clip:", clip)
            this.animation.addClip(clip);
        }
    
        this.animation.play("idle_3")

    },

    setup(userId, x, y, name){
        console.log("setup hero:", name, x, y)
        this.nameLab.string = name
        this.node.x = x
        this.node.y = y
    },

    runMove: function(sx, sy, tx, ty){
        this.attackAni.node.active = false
        this.animation.node.active = true
        this.node.stopAllActions()
        this.node.x = sx
        this.node.y = sy

        var s = new cc.Vec2(sx, sy)
        var t = new cc.Vec2(tx, ty)
        var l = s.sub(t).mag()

        var m = cc.moveTo(l/100, t)
        var c = cc.callFunc(this.moveEnd, this)
        var seq = cc.sequence([m,c])
        this.node.runAction(seq)

        if (sx>tx) {
            this.animation.play("move_2")
            this._dir = Dir_Left
        }else{
            this.animation.play("move_3")
            this._dir = Dir_Right
        }
    },

    moveEnd:function(){
        this.attackAni.node.active = false
        this.animation.node.active = true
        if (this._dir == Dir_Left){
            this.animation.play("idle_2")
        }else{
            this.animation.play("idle_3")
        }
    },

    heroAttackAni:function(tx, ty){
        this.animation.node.active = false
        this.attackAni.node.active = true
        this.attackAni.play()

        if (this.node.x>tx) {
            this.attackAni.node.scaleX = 1
            this._dir = Dir_Left
        }else{
            this.attackAni.node.scaleX = -1
            this._dir = Dir_Right
        }

        this.node.stopAllActions()
        var c = cc.callFunc(this.moveEnd, this)
        var d = cc.delayTime(0.5)
        var seq = cc.sequence([d,c])
        this.node.runAction(seq)
    }

});
