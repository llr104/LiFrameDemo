

let worldDefine = {

    netFunc:{
        joinWorldReq: "EnterWorld.JoinWorldReq",
        joinWorldAck: "EnterWorld.JoinWorldAck",
        userInfoReq: "CommonWorld.UserInfoReq",
        userInfoAck: "CommonWorld.UserInfoAck",
        userLogoutReq: "CommonWorld.UserLogoutReq",
        userLogoutAck: "CommonWorld.UserLogoutAck",
        gameServersReq: "CommonWorld.GameServersReq",
        gameServersAck: "CommonWorld.GameServersAck",
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