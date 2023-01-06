// ==UserScript==
// @name         zhyDaDa华理超星网课助手
// @namespace    http://zhydada.github.io/
// @version      1.4
// @description  针对老式超星平台, 点开没有播放的视频, 按原速刷视频, 视频放完继续, 还没有处理bug
// @author       zhyDaDa

// @match        *://mooc.s.ecust.edu.cn/*

// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAkACQAAD/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAEAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAgACADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9yL68aMTFZP3i7toZ9q55xk9hWLovi+6vtRjhurdrdZQQrbzywGcc+wP5Vf1U/Jc/Vv5msK/t5JfIaFo98Mqy/McA4zx+tfP0uG8HTcqNZt8+0m2nHfVWaT6bpnPnGbPBYulS05Grt/Mv634vubDUHhtbdrlYwN7bjwxGcfkQfxrb0+4kkWBnb5m27grZXPfB71ytlbyRtcNKybppmk+Vs4zjj8MVv6VJu+yjPRl/mK58Zw3RqSp0cJpyfFO7bloul7Xv2svuDJ82ljcZVpK3IldP5ianGzpdemW/ma53Wb99PtlePaxZ9vzDpwT/AErsZ4CzyK0bFSTxtrI8ReFTrFnHHCogZJA5JjPIwRj9R+VZ4HiinVxyWNhy0722bSXn1fyX+YZ1k8sbiIV7rlirNdWYujag+oWztJtVlfaNo68A+/rXRaT9+25/jX+Yqv4d8KnR7OSOdVuGeQuCIzwMAY/T9a1rW18uWMLCyhWGPl6V0YjijCU8ZNYenJwvZNKy6d9fvDJcnlgq9Su2uWSskt1sf//Z
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    /**
     * 1.0 视频基本操作
     * 1.1 寻找猎物
     * 1.2 确保在看到绿色勾勾出现再跳
     * 1.3 自动判断视频有没有放过, 只挑没放过的视频看
     * 1.4 克服浏览器禁止自动播放的限制, 尽力剔除bug
     */
    //#region /*======================div:函数定义==========================*/

    /**
     * 醒目的控制台输出
     * @param {"string"} log 要打印到控制台的话
     * @param {"报错"|"警告"|"启动"|"提示"|"幽灵白"} color 字体颜色 可选项为["报错"|"警告"|"启动"|"提示"|"幽灵白"] 默认绿色
     * @param {"int"} fontSize 字体大小, 默认24
     */
    function sendLog(log, color, fontSize) {
        switch (color) {
            case "报错":
                color = "red";
                break;
            case "警告":
                color = "#F2AB26";
                break;
            case "启动":
                color = "#A162F7";
                break;
            case "提示":
                color = "#35D4C7";
                break;
            case "幽灵白":
                color = "ghostwhite";
                break;
            default:
                color = color || "#43bb88";
                break;
        }

        fontSize = fontSize || 24;
        console.log('%c' + log, 'color: ' + color + ';font-size: ' + fontSize + 'px;font-weight: bold;');//text-decoration: underline;
    }

    /**
     * 删除单个jQuery元素
     * @param el 要删除的元素
     * @param doNotLog 不要发送错误信息, false
     * @param logSender 错误信息发送来源以及可能的原因, false
     * @returns 成功返回true, 失败返回false
     */
    function deletEl(el, doNotLog, logSender) {
        let logSender_inner = logSender ? "\n" + logSender : "";
        try {
            el.parentNode.removeChild(el);
            if (el.id) { sendLog("成功删除了id为" + el.id + "的元素\n本次运行累计消杀" + ++window.zhyCount + "个广告元素"); }
            else { sendLog("成功删除了class为" + el.className + "的元素\n本次运行累计消杀" + ++window.zhyCount + "个广告元素"); }
        } catch {
            if (doNotLog) return false;
            if (el) {
                sendLog("目标元素: " + el + "有问题" + logSender_inner, "警告");
            } else {
                sendLog("消杀失败, 目标元素不存在" + logSender_inner, "警告");
            }
            return false;
        }
        return true;
    }

    /**
     * 调用deletEl函数删除一整个Class, 如果Class数量为0或不存在, 就会在控制台报错
     * @param classNode 要删除的Class选择器
     * @param doNotLog 默认false, true代表不发送错误消息
     * @param logSender 附加消息
     * @returns void
     */
    function deletClass(classNode, doNotLog, logSender) {
        doNotLog = doNotLog || false;
        let logSender_inner = logSender ? "\n" + logSender : "";
        let len = classNode.length;
        if (len = 0 || !classNode) {
            if (doNotLog) return;
            sendLog("Class不存在" + logSender_inner, "警告");
            return;
        }
        for (let i = 0; i < classNode.length; i++) {
            const el = classNode[i];
            sendLog("正在处理带有 " + el.className + " 的一整个Class", "提示", 20);
            deletEl(el, doNotLog, logSender);
        }
    }

    /**
     * 删除src含有对应字段的网址的iframe框架
     * @param {"about:blank"} string 要删除的iframe框架对应地址中包含的字段
     */
    function deletIframe(string) {
        let aaa = $("iframe");
        try {
            for (let i = 0; i < aaa.length; i++) {
                let a = aaa[i];
                if (a.src.indexOf(string) >= 0) {
                    sendLog("正在处理带有 " + string + " 的Iframe", "提示", 20);
                    deletEl(a, false, "在处理带有" + string + "字段的iframe时出错");
                }
            }
        } catch { sendLog("在处理带有" + string + "字段的iframe时出错", "报错") }
    }

    /**
     * 删除含有对应字段的网址的href链接
     * @param {"string"} string 要删除的href对应地址中包含的字段
     * @param {"bool"} alsoItsParent 填true表示删他们的父级元素
     */
    function deletHref(string, alsoItsParent) {
        let aaa = $("a");
        let flag = alsoItsParent || false;
        try {
            for (let i = 0; i < aaa.length; i++) {
                let a = aaa[i];
                if (a.href.indexOf(string) >= 0) {
                    if (alsoItsParent) {
                        sendLog("正在处理带有 " + string + " 的href链接的父元素", "提示", 20);
                        deletEl(a.parentNode);
                        continue;
                    }
                    sendLog("正在处理带有 " + string + " 的href链接", "提示", 20);
                    deletEl(a);
                }
            }
        } catch { sendLog("在删除带有" + string + "字段的a链接标签时发生错误", "报错"); }
    }

    /**
     * 删除含有对应字段的网址的src图片
     * @param {"string"} string 要删除的图片对应地址src中包含的字段
     * @param {"int"} Parents 表示删他们的父级元素的层数, 0代表ta自己
     */
    function deletImg(string, Parents) {
        let aaa = $("img");
        try {
            for (let i = 0; i < aaa.length; i++) {
                let a = aaa[i];
                if (a.src.indexOf(string) >= 0) {
                    if (Parents == 0) {
                        sendLog("正在处理带有 " + string + " 的Img图片", "提示", 20);
                        deletEl(a);
                        continue;
                    }
                    let b = "a";
                    for (let j = 0; j < Parents; j++) {
                        b += ".parentNode";
                    }
                    b = "deletEl(" + b + ",false,'在删除带有" + string + "字段的img图片标签时发生错误')";
                    sendLog("正在处理带有 " + string + " 的Img图片的第" + Parents + "个父元素", "提示", 20);
                    eval(b);
                }
            }
        } catch { sendLog("在删除带有" + string + "字段的img图片标签时发生错误", "报错"); }
    }

    var deepCopy = function (source, isArray) {
        var result = {};
        if (isArray) var result = [];
        for (var key in source) {
            if (Object.prototype.toString.call(source[key]) === '[object Object]') {
                result[key] = deepCopy(source[key])
            } if (Object.prototype.toString.call(source[key]) === '[object Array]') {
                result[key] = deepCopy(source[key], 1)
            } else {
                result[key] = source[key]
            }
        }
        return result;
    }

    /**
     * 模拟cmd中的sleep函数
     * @param {"number"} d deltaTime 即要等待的时间差 照旧以毫秒为单位
     */
    function sleep(d) {
        for (let t = Date.now(); Date.now() - t <= d;);
    }
    //#endregion
    /*======================div:全局效果==========================*/

    //#region 防止多次启动
    let deltaT = (new Date()) * 1 - GM_getValue("zhyDaDaFlag_No4_startTime");
    if (deltaT <= 32000) return;
    let ttt = (new Date()) * 1;
    GM_setValue("zhyDaDaFlag_No4_startTime", ttt);
    sendLog("\n###################\n##zhyDaDa 网课助手##\n###################\n距离上次启动间隔了" + deltaT + "毫秒\n", "启动", 32);

    window.onerror = (e) => { console.log("%cFuck!\n" + e.toString(), "font-size:4px;"); return true; }
    for (let i = 0; i < $("iframe").length; i++) {
        let a = $("iframe")[i];
        a.contentWindow.onerror = (e) => { console.log("%cFuck!\n" + e.toString(), "font-size:4px;"); return true; }
    }
    //#endregion

    function findPray() {
        try {
            let redTags = $(".orange01").get();
            let blankTags = $(".noJob").get();
            let Tags = redTags.concat(blankTags);
            // let len = Tags.length;
            // let ran = (Math.random() * len + 1) >> 0;
            if (Tags.length < 1) {
                alert("所有任务点已完成, 按确定键或手动关闭页面");
                let a = document.createElement("a");
                a.href = "javascript:window.opener=null;window.open('','_self');window.close();";
                a.click();
            }
            let pray = Tags[0];
            pray.parentNode.firstElementChild.click();
        } catch { console.log("找不到猎物了"); }
    }

    function checkGreen() {
        try {
            let focus = $(".currents>span")[1];
            if (focus.classList[1] == "blue") return true;
            else return false;
        } catch { sendLog("视频列表有点问题", "警告", 12); }
    }

    window.setInterval(() => {
        if (checkGreen()) findPray();
        try {
            let video_containers = deepCopy($("iframe")[0].contentWindow.document.getElementsByClassName("ans-attach-ct"), true);
            // 剔除已经看完的视频
            let red_containers = video_containers.filter((value) => {
                if (value.classList.length < 2) return true;
            });
            var videos = red_containers.map((value) => {
                return value.lastElementChild.contentWindow.document.querySelector("video");
            })
            var len = videos.length;
        }
        catch { sendLog("找不到视频Node", "警告", 12); }
        let passFlag = false;
        for (let i = 0; i < len; i++) {
            try {
                let video = videos[i]
                if (video.ended) {
                    continue;
                }
                if (passFlag) break;
                video.volume = 0;
                video.playbackRate = 1.25;
                video.pause = () => { return true };
                video.play();

                passFlag = true;
            } catch { continue; }
        }
    }, 3000);


})();