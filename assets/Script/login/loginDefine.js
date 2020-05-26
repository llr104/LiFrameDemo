

let loginDefine = {

    netFunc:{
        loginReq: "EnterLogin.LoginReq",
        registerReq: "EnterLogin.RegisterReq",
        distributeWorldReq: "EnterLogin.DistributeWorldReq",
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