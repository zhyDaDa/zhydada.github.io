var modes = {
    names: [
        /* 模式对应名称的序列时要-1处理 */
        "经典",
        "加强",
        "障碍"
    ]
    
}

modes.start = function (modeNum) {
    switch (modeNum) {
        case 1:
            game.pool = [1, 2, 3, 4, 5, 6, 7];
            break;
        case 2:
            game.pool = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
            break;
        case 3:
            game.pool = [1, 2, 3, 4, 5, 6, 7];
            mode3();
            break;
        default:
            alert("The mode isn't defined;");
    }
}

function mode3() {
    for (var r = mapR - 1; r > (mapR + 1) / 2; r--){
        for (var c = 0; c < mapC; c++){
            map[r][c] = Math.random() < 0.5 ? 0 : 99;
        }
    }    
}