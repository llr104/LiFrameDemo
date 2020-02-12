
var App = require("App")
cc.Class({
    extends: cc.Component,

    properties: {
        nameLab:cc.Label,
        hpLab:cc.Label,
        levelLab:cc.Label,
        atlas: cc.SpriteAtlas,
        animation:cc.Animation,
    },

    onLoad () {

        console.log("hero load")
        let sps = this.atlas.getSpriteFrames();
        sps.sort( (a,b)=>{
            return Number(a.name)-Number(b.name)
        }) 

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

        this.animation.play("idle_2")
     
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this)
    },

    setup(id, x, y, name, level, hp){
        this._id = id
        this.nameLab.string = name
        this.node.x = x
        this.node.y = y
        //this.levelLab.string = "lv:" + level
        this.hpLab.string = "hp:"+ hp
    },

    sethp(hp){
        this.hpLab.string = "hp:"+ hp
    },


    onTouchEnd:function(){
        App.eventMgr.emit("touchMonsterEnd", this.node)
    },


    getId:function(){
        return this._id
    }

});
