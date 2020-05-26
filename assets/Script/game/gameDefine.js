

let gameDefine = {

    netFunc:{
        enterGameReq: "enterGameReq",
        heartBeatReq: "heartBeatReq",
        logoutReq: "logoutReq",
        sceneListReq: "sceneListReq",
        enterSceneReq: "enterSceneReq",
        exitSceneReq: "exitSceneReq",
        sceneReq: "sceneReq",
        moveReq: "moveReq",
        movePush: "movePush",
        attackReq: "attackReq",
        attackPush: "attackPush",
        monsterPush: "monsterPush",
        userPush: "userPush",
    },

    event:{
        event_enterGame: "event_enterGame",
        event_heartBeat: "event_heartBeat",
        event_logout: "event_logout",
        event_enterScene: "event_enterScene",
        event_exitScene: "event_exitScene",
        event_scene: "event_scene",
        event_sceneList:"event_sceneList",
        event_move: "event_move",
        event_attack: "event_attack",
        event_monster: "event_monster",
        event_user: "event_user",
        event_game_proxyError: "event_game_proxyError",
        event_game_authError: "event_game_authError",
        event_game_netError: "event_game_netError"

    },
}

module.exports = gameDefine;