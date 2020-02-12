

cc.Class({
    extends: cc.Component,

    properties: {
        title:cc.Label,
        text:cc.Label,
        midBtn:cc.Button,
        leftBtn:cc.Button,
        rightBtn:cc.Button,
    },

    onLoad () {

    },

    show:function(title, text, type, sureFunc, cancelFunc){
        //console.log("title:", title)
        if(type == 0){
            this.leftBtn.node.active = false
            this.rightBtn.node.active = false
            this.midBtn.node.active = true
        }else if (type == 1){
            this.leftBtn.node.active = true
            this.rightBtn.node.active = true
            this.midBtn.node.active = false
        }

        if(title){
            this.title.string = title
        }else{
            this.title.string = "提示"
        }

        this.text.string = text
        this.sureFunc = sureFunc
        this.cancelFunc = cancelFunc

    },

    onClickSure:function(){
        if(this.sureFunc){
            this.sureFunc()
        }
        this.node.active = false
    },

    onClickCancel:function(){
        if(this.cancelFunc){
            this.cancelFunc()
        }
        this.node.active = false
    },
});
