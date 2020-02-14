

let loginDefine = {

    netFunc:{
        loginReq: "EnterLogin.LoginReq",
        loginAck: "EnterLogin.LoginAck",
        registerReq: "EnterLogin.RegisterReq",
        registerAck: "EnterLogin.RegisterAck",
        distributeWorldReq: "EnterLogin.DistributeWorldReq",
        distributeWorldAck: "EnterLogin.DistributeWorldAck",
    },

    event:{
        event_login: "event_login",
        event_Register: "event_Register",
        event_distributeWorld: "event_distributeWorld",
        event_login_proxyError: "event_login_proxyError",
        event_login_authError: "event_login_authError",
        event_login_netError: "event_login_netError",
    },
}

module.exports = loginDefine;