
let eventMgr = require("eventMgr");
let App = cc.Class({

    ctor: function () {
        this.eventMgr = new eventMgr();
        this.dataMap = new Map()
    },

    getData:function(key){
        return this.dataMap[key]
    },

    setData:function(key, data){
        this.dataMap[key] = data
    }

});

App._instance = null;
App.getInstance = function () {
    if (App._instance == null) {
        App._instance = new App();
    }
    return App._instance;
};


module.exports = App.getInstance();