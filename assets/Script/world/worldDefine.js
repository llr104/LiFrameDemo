

let worldDefine = {

    netFunc:{
        joinWorldReq: "EnterWorld.JoinWorldReq",
        joinWorldAck: "EnterWorld.JoinWorldAck",
        userInfoReq: "EnterWorld.UserInfoReq",
        userInfoAck: "EnterWorld.UserInfoAck",
        userLogoutReq: "EnterWorld.UserLogoutReq",
        userLogoutAck: "EnterWorld.UserLogoutAck",
        gameServersReq: "EnterWorld.GameServersReq",
        gameServersAck: "EnterWorld.GameServersAck",
    },

    event:{
        event_joinWorld: "event_joinWorld",
        event_userInfo: "event_userInfo",
        event_userLogout: "event_userLogout",
        event_gameServers: "event_gameServers",
        event_world_proxyError: "event_world_proxyError",
        event_world_authError: "event_world_authError",
        event_world_netError: "event_world_netError",
    },
}

module.exports = worldDefine;