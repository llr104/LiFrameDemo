
var proxyMgr = require("proxyMgr")
var gzip = require('gzip')
var convert = require("convert")
var CryptoJS = require("crypto")

let innet = {
    wssocket:null,
    url:""
}


const key = CryptoJS.enc.Utf8.parse("liFrameVeryGood!");
const iv = CryptoJS.enc.Utf8.parse('liFrameVeryGood!');

//解密方法
function Decrypt(word) {
    
    let encryptedHexStr = CryptoJS.enc.Hex.parse(word);
    let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);
    let decrypt = CryptoJS.AES.decrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding });
    
    let decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    //console.log("decrypt:", decrypt)
    //console.log("decryptedStr:", decryptedStr)
    return decryptedStr.toString();
    
}

//加密方法
function Encrypt(word) {
    
    let srcs = CryptoJS.enc.Utf8.parse(word);
    //console.log("srcs:", srcs)
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { iv: iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding });

    //console.log("Encrypt:", encrypted)
    //console.log("Encrypt:",  encrypted.ciphertext)

    return encrypted.ciphertext.toString()
    
}



let network = function(){
    
    this.connect = function(url){
        if (this.innet.wssocket && this.innet.wssocket.readyState<=1) {
            this.innet.wssocket.close()
        }
    
        var ws = new WebSocket(url)
        ws.binaryType = "arraybuffer";
        ws.onopen = this.onopen.bind(this)
        ws.onmessage = this.onmessage.bind(this)
        ws.onclose = this.onclose.bind(this)
        ws.onerror = this.onerror.bind(this)
    
        this.innet.url = url
        this.innet.wssocket = ws

        if (this.interval){
            clearInterval(this.interval)
        }

        if (this.checkTimer){
            clearInterval(this.checkTimer)
        }

        this.interval = setInterval(this.update.bind(this), 10)
        this.checkTimer = setInterval(this.check.bind(this), 2000)
    }

    this.update = function(){
        
        if(this.innet.wssocket == null){
            return
        }

        if (this.innet.wssocket.readyState == 1){
            if (this.msgArr.length>0){
                var msg = this.msgArr.pop()
                //console.log("send length:", msg.length)
                //console.log("send msg:", msg)
                this.innet.wssocket.send(msg)
            }
        }
    },

    this.check = function(){
        if(this.innet.wssocket == null || this.innet.wssocket.readyState != 1){
            this.connect(this.innet.url)
        }
    }

    this.send = function(msgName, proxyName, msgObj){

        var str = JSON.stringify(msgObj);
        var msg = msgName + "|" + proxyName + "|" + str
        //console.log("send:", msg)
        //console.log("before Encrypt msg:", msg, msg.length)
        msg = Encrypt(msg)
        //console.log("Encrypt msg:", msg, msg.length)
        var options = {
            level: 9,
            timestamp: parseInt(Date.now() / 1000, 10)
        };


        var data = gzip.zip(msg, options)
        var buffer = new ArrayBuffer(data.length);
		var intView = new Int8Array(buffer);
		for(var i = 0; i < intView.length; i++){
			intView[i]= data[i];
        }
        
        if (this.innet.wssocket){
            this.msgArr.push(intView)
        }
    }
    
    this.onopen = function(target){
        console.log("onopen:",target)
        
    }
    
    this.onmessage = function(msgevent){

        //console.log("msgevent:", msgevent)
        var r = msgevent.data instanceof ArrayBuffer
        var msg = null
        var zipLen = 0
        var originLen = 0

        if (r) {
            var ab = msgevent.data
            zipLen = ab.byteLength
           // console.log("onmessage bytes len:", ab.byteLength)
            var buf = [];
            var view = new Uint8Array(ab);
            
            
            for (var i = 0; i < ab.byteLength; ++i) {
                buf.push(view[i])
            }

            var undata = gzip.unzip(buf)
            msg = convert.byteToString(undata)

        }else{
            msg = msgevent.data
            zipLen = msg.length
            //console.log("onmessage text len:", msg.length)
        }
        originLen = msg.length
        //console.log("zip len:%d, origin Len:%d, %f", zipLen, originLen, zipLen/originLen)

        msg = Decrypt(msg)

        //console.log("message Decrypt msg:", msg)


        //解析协议
        var arr = msg.split("|")
        if(arr.length == 3){
            var msgName = arr[0]
            var proxy = arr[1]
            var msgdata = arr[2]
            var proxyArr = proxyMgr.getProxy(proxy)
            if (proxyArr.length == 0){
                console.log("not proxy:",proxy, msg)
            }else{
                //console.log("proxyArr:",proxyArr, msgName, proxy)
            }
            var isFound = false
            for (let index = 0; index < proxyArr.length; index++) {
                const proxyObj = proxyArr[index];
                var c = proxyObj.findCallBack(msgName)
                if (c != null){
                    c(msgdata)
                    isFound = true
                }
            }
            if (isFound == false){
                console.log("proxyArr %s，not found:", proxyArr, msgName)
            }

        }else{
            console.log("unkonw message:", msg)
        }

    }
    
    this.onclose = function(err){
        //console.log("close:",err)
    
    }
    
    this.onerror = function(err){
        //console.log("onerror:",err)
    }
}


network.getInstance = function(){
    if(!this.instance){
        this.instance = new network();
        this.instance.innet = innet
        this.instance.msgArr = new Array()
    }
    return this.instance;
}




module.exports = network.getInstance()