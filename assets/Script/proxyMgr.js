let proxyMgr = function(){
    
    this.proxyMap = new Map()
    this.AddProxy = function(proxyObj){
        var name = proxyObj.getProxyName()
        if (this.proxyMap.has(name)){
            var proxy = this.proxyMap.get(name)
            proxy.setProxyStr(proxyObj.getProxyStr())
        }else{
            this.proxyMap.set(name, proxyObj)
            proxyObj.onAdd()
        }
    }

    this.removeProxy = function(proxyName){
        //console.log("removeProxy:",proxyName, this.proxyMap)
        if (this.proxyMap.has(proxyName)){
            var proxyObj = this.proxyMap.get(proxyName)
            console.log("removeProxy:",proxyName)
            proxyObj.onRemove()
            this.proxyMap.delete(proxyName)
        }
    },

    this.getProxy = function(proxy){
        //console.log("getProxy:", this.proxyMap)
        var arr = []

        for (let [key, v] of this.proxyMap.entries()) {
            var s = v.getProxyStr()
            if (s == proxy){
                arr.push(v)
            }
        }

        return arr
    },

    this.getAllProxy = function(){
        var arr = []

        for (let [key, v] of this.proxyMap.entries()) {
            arr.push(v)
        }

        return arr
    },

    this.getProxyObj = function(proxyName){
        //console.log("getProxyObj:", this.proxyMap, this.proxyMap.get(proxyName), proxyName)
        return this.proxyMap.get(proxyName)
    }
}

proxyMgr.getInstance = function(){
    if(!this.instance){
        this.instance = new proxyMgr();
    }
    return this.instance;
}


module.exports = proxyMgr.getInstance()