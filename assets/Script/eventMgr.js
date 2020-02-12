
let eventMgr = cc.Class({
    _handlers: null,
    _curEvents: null,
    _curHandlers: null,

    ctor: function () {
        this._handlers = {};
        this._curEvents = [];
        this._curHandlers = [];
    },


    getHandlerTargetIndex: function (handlers, target) {
        var index = -1;
        for (var i = 0; i < handlers.length; i += 2) {
            if (handlers[i] == target) {
                index = i;
                break;
            }
        }
        return index;
    },

    on: function (event, callback, target) {
        if (event == null || callback == null || target == null) {
            if(event == null){
                console.warn("eventMgr.on event is null:", callback);
            }
            if(callback == null){
                console.warn("eventMgr.on callback is null");
            }
            if(target == null){
                console.warn("eventMgr.on target is null");
            }
            return;
        }
        var handlers = this._handlers[event] || [];
        this._handlers[event] = handlers;
        if (this.getHandlerTargetIndex(handlers, target) == -1) {
            handlers.push(target, callback);
        }
    },


    off: function (event, target) {
        if (event == null || target == null) {
            return;
        }
        var handlers = this._handlers[event];
        if (handlers == null) {
            return;
        }
        var index = this.getHandlerTargetIndex(handlers, target);
        if (index != -1) {
            handlers.splice(index, 2);
            if (handlers.length == 0) {
                //带标签清空了当前事件的所有回调
                delete this._handlers[event];
            }
        }
    },


    emit: function (event) {
        if (event == null) {
            console.warn("eventMgr.emit event is null");
            return;
        }

        var handlers = this._handlers[event];
        if (handlers == null) {
            return;
        }
        for (var i = 0; i < handlers.length; i += 2) {
            var target = handlers[i];
            var callback = handlers[i + 1];
            callback.apply(target, arguments);
        }
    },

    
    offAllForTarget: function (target) {
        if (target == null) {
            return;
        }
        var emptyKeys = [];
        for (var event in this._handlers) {
            var handlers = this._handlers[event];
            var index = this.getHandlerTargetIndex(handlers, target);
            if (index != -1) {
                handlers.splice(index, 2);
                if (handlers.length == 0) {
                    //带标签清空了当前事件的所有回调
                    emptyKeys.push(event);
                }
            }
        }
        for (var i = 0; i < emptyKeys.length; i++) {
            delete this._handlers[emptyKeys[i]];
        }
    }
});

module.exports = eventMgr;