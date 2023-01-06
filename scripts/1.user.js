// ==UserScript==
// @name         zhyDaDa强力消杀
// @namespace    http://zhydada.github.io/
// @version      1.8.5
// @description  尝试改变一些看着不爽的广告之类, 把浏览器变得个性化一点.\n启用强力消杀功能, console调试报错便捷化\n基本做到了看到ad就删除, 主要的推广投放广告全部删除\n可能存在误删漏删的瑕疵, 调整字段后再刷新页面即可\n加入了调试模式的开关, 关闭后可以避免对其他脚本开发的干扰. 通过try-catch的大量使用已经将报错的可能降至最低
// @author       zhyDaDa

// @match        *://*/*
// @exclude      https://www.baidu.com/*

// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @icon         data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAkACQAAD/4QAiRXhpZgAATU0AKgAAAAgAAQESAAMAAAABAAEAAAAAAAD/2wBDAAIBAQIBAQICAgICAgICAwUDAwMDAwYEBAMFBwYHBwcGBwcICQsJCAgKCAcHCg0KCgsMDAwMBwkODw0MDgsMDAz/2wBDAQICAgMDAwYDAwYMCAcIDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAz/wAARCAAgACADASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9yL68aMTFZP3i7toZ9q55xk9hWLovi+6vtRjhurdrdZQQrbzywGcc+wP5Vf1U/Jc/Vv5msK/t5JfIaFo98Mqy/McA4zx+tfP0uG8HTcqNZt8+0m2nHfVWaT6bpnPnGbPBYulS05Grt/Mv634vubDUHhtbdrlYwN7bjwxGcfkQfxrb0+4kkWBnb5m27grZXPfB71ytlbyRtcNKybppmk+Vs4zjj8MVv6VJu+yjPRl/mK58Zw3RqSp0cJpyfFO7bloul7Xv2svuDJ82ljcZVpK3IldP5ianGzpdemW/ma53Wb99PtlePaxZ9vzDpwT/AErsZ4CzyK0bFSTxtrI8ReFTrFnHHCogZJA5JjPIwRj9R+VZ4HiinVxyWNhy0722bSXn1fyX+YZ1k8sbiIV7rlirNdWYujag+oWztJtVlfaNo68A+/rXRaT9+25/jX+Yqv4d8KnR7OSOdVuGeQuCIzwMAY/T9a1rW18uWMLCyhWGPl6V0YjijCU8ZNYenJwvZNKy6d9fvDJcnlgq9Su2uWSskt1sf//Z
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    const currentSite = window.location.href;
    window.zhyCount = 0;
    //核心消杀功能白名单(网址关键词)
    const WHITELIST_SITES = [
        "wall.alphacoders.com",
        "userscript.zone",
    ];
    //要删除的字段
    const ADS_STRINGS = [
        "-ad",
        "_ad",
        ".ad",
        "ad-",
        "ad_",
        "ad.",
        "ads-",
        "ads_",
        "ads.",
        "advert",
        "adplay",
        "carbonads",
        "bannerAd",
        "adBox",
        "adInner",
        "adinteract",
        "qrcode"
    ];
    //为了防止误伤, 需要剔除一些字段
    const INNOCENTS_LIST = [
        "ead",
        "pad",
        "bad",
        "load",
        "zhydada",
        "add",
        "load",
        "address",
        "download",
        "adopt",
        "-adv-"
    ];

    /*======================版本说明==========================*/
    /**
     * 大事记
     * 1.1  创世之初, deletEl横空出世
     * 1.2  攻克360图书馆
     * 1.3  大量使用try-catch将报错的可能降到最低
     *      调整了输出的信息, 使得调试更加便捷
     *      添加了防止多次启动的机制
     * 1.4  加入ad字段消杀系统, 强力清除
     *      加入了无辜者名单, 避免无差别攻击
     * 1.5  打败了道客巴巴, 完善函数的功能
     * 1.6  打败了豆丁
     *      对百度文库的各种文件类型进行暴力镇压, 使其最大化呈现
     * 1.7  sendLog优化, 通过提示方便问题根源查找
     *      针对一些名字里自带ad的网站禁用强力消杀功能
     *      更绚烂的控制台输出!
     *      屏蔽各种形式的动图(效果一般)
     *      提供开关
     * 1.8  对于带链接的动图进行屏蔽
     *      对主流的"左右"型排版做出调整
     *      对于百家号排版做出针对性调整
     *      修正删除父元素可能删除整个body的可能
     *      针对百度题库做出调整
     *      击败原创力文档(暂时还不能下载)
     *      各类文库再调整优化
     */

    /*======================函数定义==========================*/

    /**
     * 醒目的控制台输出
     * @param {"正在处理带有"|`对于 的针对性作业`} log 要打印到控制台的话
     * @param {"报错"|"警告"|"启动"|"提示"|"幽灵白"} color 字体颜色 可选项为["报错"|"警告"|"启动"|"提示"|"幽灵白"] 默认绿色
     * @param {20|24} fontSize 字体大小, 默认24, 提示为20
     */
    function sendLog(log, color, fontSize) {
        if (!GM_getValue("zhyDaDaFlag_No1_showMyLog")) return;
        let extra = '';
        switch (color) {
            case "报错":
                color = "red";
                break;
            case "警告":
                color = "#F2AB26";
                break;
            case "启动":
                color = "#A162F7";
                extra = "font-weight: bold;";
                break;
            case "提示":
                color = "#fdeff9";
                extra = "background: #4286f4;text-decoration: underline;";
                break;
            case "幽灵白":
                color = "ghostwhite";
                break;
            default:
                color = color || "#2ebf91";
                break;
        }

        fontSize = fontSize || 24;
        console.log('%c' + log, 'color: ' + color + ';font-size: ' + fontSize + 'px;' + extra);
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
        if (el.tagName == "HEAD" || el.tagName == "BODY") {
            sendLog("要删的是" + el.tagName + ", 还是算了吧", "警告", 24);
            return;
        }
        try {
            el.parentNode.removeChild(el);
            if (el.id) { sendLog("成功删除了id为" + el.id + "的元素\n本次运行累计消杀" + ++window.zhyCount + "个广告元素"); } else { sendLog("成功删除了class为" + el.className + "的元素\n本次运行累计消杀" + ++window.zhyCount + "个广告元素"); }
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
            let cate = "未知属性";
            if (el.className) cate = "className";
            else if (el.id) cate = "id";
            else if (el.title) cate = "title";
            sendLog("正在处理带有 " + el.className || el.id || el.title || "未知名称" + " 的 " + cate + " 中的所有元素", "提示", 20);
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
                } else if (a.style.zIndex > 9999999) {
                    sendLog("正在处理z-index过高的iframe", "提示", 20);
                    deletEl(a);
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
                        if (a.parentNode == $("body")[0]) {
                            sendLog("但由于父元素就是body, 仅删除自身", "警告", );
                            deletEl(a);
                        } else {
                            deletEl(a.parentNode);
                        }
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

    /**
     * 传入Canvas选择器, 返回对应的Data64
     * @param {*} canvas 对应Canvas的选择器
     * @returns 图片的Data64格式字符串
     */
    function convertCanvasToImage(canvas) {
        var image = new Image();
        image.src = canvas.toDataURL("image/png");
        return image;
    }

    /**
     * 单张图片下载
     * @param url 图像链接
     * @param downloadName 图片名称
     */
    const downloadImage = (url, downloadName) => {
        const link = document.createElement('a')
        link.setAttribute('download', downloadName)
        const image = new Image()
            // 添加时间戳，防止浏览器缓存图片
        image.src = url + '?timestamp=' + new Date().getTime()
            // 设置 crossOrigin 属性，解决图片跨域报错
        image.setAttribute('crossOrigin', 'Anonymous')
        image.onload = () => {
            link.href = getImageBase64(image)
            link.click()
        }
    }

    /**
     * 实现全部图片的预加载
     * 该功能尚未实现
     */
    function imgPreload() {
        window.setTimeout(function() {
            let Imgs = $("img");
            for (let i = 0; i < Imgs.length; i++) {
                const img = Imgs[i];
                let url = img.src;
                new Image().src = url;
                url = $(img).attr("data-src");
                new Image().src = url;
            }
        }, 800);
    }

    /* 无差别遮挡所有图片 */
    function hideAllPics() {
        let style = document.createElement('style');
        style.type = "text/css"; //设置统一样式
        style.innerHTML = "";
        // style.innerHTML += ".zhyDaDa_GIF_span{position: absolute;line-height: 1;box-sizing: border-box;padding: 50% 25%;left: 0;right: 0;top: 0;bottom: 0;background: rgba(120, 120, 120);border-radius: 6px 0 0 0;color: #d5d5d5;font-size: 12px;overflow: hidden;transform: scale(1.05);transition: all .3s ease-out;opacity: 1;text-align: center;margin: auto;}";
        // style.innerHTML += ".zhyDaDa_GIF_span:hover{opacity: 0;}";
        style.innerHTML += ".zhyDaDa-considered_GIF{opacity: 0;transition: all .3s ease-out;}";
        style.innerHTML += ".zhyDaDa-considered_GIF:hover{opacity: 1;}";
        document.querySelector('head').appendChild(style);
        let aaa = $("img").get();
        let bbb = $("div[src$='.png'],div[src$='.jpg'],div[src$='.gif'],div[src$='.wepg'],div[src$='.jpeg'],div[src$='.ico']").get();
        let c1 = $("*").get();

        function searchIframes(doc) {
            let imgList;
            doc.querySelectorAll('iframe').forEach(iframe => {
                try {
                    iframeDoc = iframe.contentDocument || iframe.contentWindow.document
                    imgList = imgList.concat(iframeDoc.querySelectorAll("*") || []) // or getBgImgs(iframeDoc)
                    imgList = imgList.concat(searchIframes(iframeDoc) || [])
                } catch (e) {
                    // 直接忽略错误的 iframe (e.g. cross-origin)
                }
            })
            return imgList;
        }
        let c2 = searchIframes(document);
        let ccc = c1.concat(c2);
        ccc = ccc.filter((e) => {
            if (!e) return false;
            if (e.tagName == "CANVAS") return true;
            let style = e.currentStyle || window.getComputedStyle(e, false);
            let s = style.backgroundImage.split(".");
            let key = s[s.length - 1].split('"')[0];
            switch (key) {
                case 'png':
                case 'jpg':
                case 'gif':
                case 'wepg':
                case 'jpeg':
                case 'ico':
                    return true;
            }
            if (!(e.src)) return false;
            s = e.src.split(".");
            key = s[s.length - 1].split('"')[0];
            switch (key) {
                case 'png':
                case 'jpg':
                case 'gif':
                case 'wepg':
                case 'jpeg':
                case 'ico':
                    return true;
            }
        });
        let zzz = aaa.concat(bbb, ccc);
        for (let a of zzz) {
            a.className += (a.className == '' ? "" : " ") + "zhyDaDa-considered_GIF"; //动图上加一个class
            // if (a.src.indexOf(".gif") >= 0) { //这里的 a 是一个动图element
            // let t = new Date;
            // let dt = t.getTime() % 1000000; //专属标识
            //a.style.opacity = 0; //动图变透明
            // let span = document.createElement("span");
            // span.className = "zhyDaDa_GIF_span"; //这个class用于设置样式
            // span.id = "zhyDaDa_GIF_span_" + dt; //span上有专属id
            // a.className += (a.className == '' ? "" : " ") + span.id; //动图上加一个专属class
            // span.innerText = "zhyDaDa动图屏蔽";
            // a.parentNode.appendChild(span);
            // a.parentNode.style.overflow = "hidden";
            // }
        }
    }

    /**
     * 模拟cmd中的sleep函数
     * @param {"number"} d deltaTime 即要等待的时间差 照旧以毫秒为单位
     */
    function sleep(d) {
        for (let t = Date.now(); Date.now() - t <= d;);
    }

    /*======================div:全局效果==========================*/

    //#region 设置菜单功能列表
    function logFunctionSwichOn() {
        GM_unregisterMenuCommand(GM_getValue("zhyDaDaFlag_No1_commandId2"));
        let ans = GM_registerMenuCommand(
            "✅调试模式开启中, 点击关闭",
            function() {
                GM_setValue("zhyDaDaFlag_No1_showMyLog", false);
                logFunctionSwichOff();
            }
        )
        return ans;
    }

    function logFunctionSwichOff() {
        GM_unregisterMenuCommand(GM_getValue("zhyDaDaFlag_No1_commandId1"));
        let ans = GM_registerMenuCommand(
            "❌调试模式已关闭, 点击开启",
            function() {
                GM_setValue("zhyDaDaFlag_No1_showMyLog", true);
                logFunctionSwichOn();
            }
        )
        return ans
    }
    if (GM_getValue("zhyDaDaFlag_No1_showMyLog")) GM_setValue("zhyDaDaFlag_No1_commandId1", logFunctionSwichOn());
    else GM_setValue("zhyDaDaFlag_No1_commandId2", logFunctionSwichOff());
    //#endregion

    //查看网址变动
    sendLog("跳转网址\n" + window.location.href);

    //#region 防止多次启动
    let deltaT = (new Date()) * 1 - GM_getValue("zhyDaDaFlag_No1_startTime");
    if (deltaT <= 3000) return;
    let ttt = (new Date()) * 1;
    GM_setValue("zhyDaDaFlag_No1_startTime", ttt);
    GM_setValue("zhyDaDaFlag_No1_startHref", window.location.href);
    console.log("%c\n###################\n##zhyDaDa 强力消杀##\n###################\n%c距离上次启动间隔了" + deltaT + "毫秒\n", "color: #fdeff9; font-weight: bold;background: #7F00FF;font-size:  32px;", "background:#E100FF;font-size: 22px;");
    //#endregion

    // 在调试模式下插入开关
    if (GM_getValue("zhyDaDaFlag_No1_showMyLog")) {
        let _style1 = `<style>#zhyDaDa_No1_Switch1 {top: calc(45vh) !important;left: 0 !important;width: 142px;height: 32px;padding: 6px !important;display: flex;position: fixed !important;opacity: 0.3;transition: .2s;z-index: 999999999999 !important;cursor: pointer;user-select: none !important;flex-direction: column;align-items: center;justify-content: center;box-sizing: content-box;border-radius: 0 10px 10px 0;transform-origin: center !important;transform: translateX(-8px);background-color: #eee;-webkit-tap-highlight-color: transparent;box-shadow: 1px 1px 3px 0px #aaa !important;color: #000 !important;font-size: 6px;text-indent: -86px;} #zhyDaDa_No1_Switch1:hover {opacity: 0.8;transform: translateX(-56.4px);text-indent: 50.8px;}</style>`,
            _html1 = `<div id="zhyDaDa_No1_Switch1">单击以暂停使用 zhyDaDa强力消杀生效中</div>`;
        let _style2 = `<style>#zhyDaDa_No1_Switch2 {top: calc(53vh) !important;left: 0 !important;width: 105px;height: 32px;padding: 6px !important;display: flex;position: fixed !important;opacity: 0.3;transition: .2s;z-index: 999999999999 !important;cursor: pointer;user-select: none !important;flex-direction: column;align-items: center;justify-content: center;box-sizing: content-box;border-radius: 0 10px 10px 0;transform-origin: center !important;transform: translateX(-8px);background-color: #eee;-webkit-tap-highlight-color: transparent;box-shadow: 1px 1px 3px 0px #aaa !important;color: #000 !important;font-size: 6px;text-indent: 4px;} #zhyDaDa_No1_Switch2:hover {opacity: 0.8;transform: translateX(0px);text-indent: -4px;}</style>`,
            _html2 = `<div id="zhyDaDa_No1_Switch2">一键屏蔽所有图片</div>`;
        document.documentElement.insertAdjacentHTML('beforeend', _style1 + _html1 + _style2 + _html2);
        $("#zhyDaDa_No1_Switch1")[0].onclick = () => {
            $("#zhyDaDa_No1_Switch1")[0].innerHTML = "刷新生效!";
            localStorage.setItem("zhyDaDa_No1_Switch_Flag1", localStorage.getItem("zhyDaDa_No1_Switch_Flag1") * 1 ? "0" : "1");
        }
        $("#zhyDaDa_No1_Switch2")[0].onclick = () => { hideAllPics(); }
        if (localStorage.getItem("zhyDaDa_No1_Switch_Flag1") * 1) {
            $("#zhyDaDa_No1_Switch1")[0].innerHTML = "单击以恢复使用 zhyDaDa强力消杀罢工中";
            return;
        }
    }

    //调整主流排版
    ! function() {
        window.setTimeout(() => {
            sendLog("尝试针对主流排版进行调整", "提示", 20);
            deletClass($("*[class*='sidebar'],*[id*='sidebar']").get());
            deletClass($("aside").get());
            // 先找到所有名字里有left和right的对子
            var left, right;
            if ($("div[id*='left'],div[class*='left']").length > 0 && $("div[id*='right'],div[class*='right']").length > 0) {
                left = $("div[id*='left'],div[class*='left']")
                right = $("div[id*='right'],div[class*='right']");
            } else if ($("div[id*='content'],div[class*='content']").length > 0 && $("div[id*='sidebar'],div[class*='sidebar'],div[id*='aside'],div[class*='aside']").length > 0) {
                left = $("div[id*='content'],div[class*='content']");
                right = $("div[id*='sidebar'],div[class*='sidebar'],div[id*='aside'],div[class*='aside']");
            } else if ($("div[id*='fl'],div[class*='fl']").length > 0 && $("div[id*='fr'],div[class*='fr']").length > 0) {
                left = $("div[id*='fl'],div[class*='fl']");
                right = $("div[id*='fr'],div[class*='fr']");
            } else { sendLog("本网站排版非主流, 无法调整", "警告", 24); return; }

            // 尝试调整: 左边的拉开, 右边的删掉
            try {
                for (let i = 0; i < left.length; i++) {
                    const l = left[i],
                        lp = l.parentNode;
                    if (lp.parentNode.tagName != "BODY" && lp.parentNode.parentNode.tagName != "BODY" && lp.parentNode.parentNode.parentNode.tagName != "BODY" && lp.parentNode.parentNode.parentNode.parentNode.tagName != "BODY" && lp.parentNode.parentNode.parentNode.parentNode.parentNode.tagName != "BODY") continue;
                    if ((lp.childElementCount == 2 || lp.childElementCount == 3) && lp.firstChild.tagName == "DIV" && lp.className.indexOf("hd") < 0 && lp.className.indexOf("head") < 0 && lp.className.indexOf("card") < 0 && lp.className.indexOf("log") < 0 && l.className.indexOf("log") < 0) {
                        l.style.width = "100%";
                    }
                }
                for (let i = 0; i < right.length; i++) {
                    const r = right[i],
                        rp = r.parentNode;
                    if (rp.parentNode.tagName != "BODY" && rp.parentNode.parentNode.tagName != "BODY" && rp.parentNode.parentNode.parentNode.tagName != "BODY" && rp.parentNode.parentNode.parentNode.parentNode.tagName != "BODY" && rp.parentNode.parentNode.parentNode.parentNode.parentNode.tagName != "BODY") continue;
                    if ((rp.childElementCount == 2 || rp.childElementCount == 3) && rp.firstChild.tagName == "DIV" && rp.className.indexOf("hd") < 0 && rp.className.indexOf("head") < 0 && rp.className.indexOf("card") < 0 && rp.className.indexOf("log") < 0 && r.className.indexOf("log") < 0) {
                        deletEl(r);
                    }
                }
                sendLog("主流排版调整成功!", "提示", 24);
            } catch {
                sendLog("排版调整失败, 可能出现状况!", "报错", 24);
            }
        }, 2400);
    }();
    //去除主流广告
    ! function() {
        //各大广告网站的植入式广告
        window.setInterval(() => {
            //删除adsbygoogle广告
            deletClass($(".adsbygoogle"));
            deletIframe("googleads");

            //删除百度推广广告
            {
                deletClass($(".gksxbd"));
                deletIframe("pos.baidu.com");
                let scripts = $("script").get();
                scripts = scripts.filter((e) => {
                    return e.src.indexOf("hm.baidu.com/hm.js") >= 0;
                })
                scripts.map((e) => {
                    deletEl(e.parentElement);
                })
            }

            //删除万维广告
            deletClass($(".wwads-cn"));
            deletIframe("wwads.cn");

            //聚胜万合
            deletIframe("show-g.mediav");

            //jucyAds
            deletIframe("adserver");
            deletIframe("juicyads");

            //淘宝
            deletHref("taobao");

            //思杰马克丁网盟
            // deletHref("makeding");

            //微信付款
            deletIframe("wxpay");

            //jg.awaliwa.com低俗手机游戏
            deletHref("awaliwa", true);

            //迅捷pdf
            deletHref("xunjiepdf", true);

            //豆瓣
            deletIframe("ad.doubanio");

            //包括豆丁在内的裸带ad字段的
            deletIframe("/ad/");

            //360搜索框
            deletHref("www.so.com", true);

            //一些小广告合集
            deletHref("dpaaz");
            deletHref("3311.run");
            deletHref("entertainment");
            deletHref("wangame");
            deletImg("downh5", 2);
            //deletImg("/ad-", 1);
            //deletImg("/ad/", 1);
            deletIframe("xuchuang");
            deletIframe("show-3.mediav.com");
        }, 1000);

        //去除直接出现的"广告"和"关闭广告"
        window.setInterval(() => {
            let aaa = $("span");
            for (let i = 0; i < aaa.length; i++) {
                let a = aaa[i];
                if (a.innerText == "广告") {
                    sendLog("这个span的内容就直接是广告, 删除其父元素", "提示", 20);
                    if (a.parentNode == $("body")[0]) {
                        sendLog("但由于父元素就是body, 仅删除自身", "警告", );
                        deletEl(a);
                    } else {
                        deletEl(a.parentNode);
                    }
                }
            }
            deletClass($("[title*='广告']"));
            deletClass($("[alt*='广告']"));
            let bbb = $("a");
            for (let i = 0; i < bbb.length; i++) {
                let b = bbb[i];
                if (b.innerText.indexOf("广告") >= 0) {
                    sendLog("这个a的内容带有'广告'二字, 删除其父元素", "提示", 20);
                    if (b.parentNode == $("body")[0]) {
                        sendLog("但由于父元素就是body, 仅删除自身", "警告", );
                        deletEl(b);
                    } else {
                        deletEl(b.parentNode);
                    }
                }
            }
        }, 1200);

        //a里的img带有.gif
        window.setInterval(() => {
            let ccc = $("a>img").get();
            ccc.map((c) => {
                if (c.src.indexOf(".gif") > 0 && c.parentNode.childElementCount == 1) {
                    sendLog("正在处理 带有链接的疑似动图的img的父元素", "提示", 20);
                    if (c.parentNode == $("body")[0]) {
                        sendLog("但由于父元素就是body, 仅删除自身", "警告", );
                        deletEl(c);
                    } else {
                        deletEl(c.parentNode);
                    }
                }
            })
        }, 800);

        //去除所有名字里带ads的div
        window.setInterval(() => {

            // 跳过特例网站
            for (let i = 0; i < WHITELIST_SITES.length; i++) {
                const s = WHITELIST_SITES[i];
                if (currentSite.indexOf(s) >= 0) return;
            }

            let arr_idName = [];
            let arr_className = [];
            let arr_idDelet = [];
            let arr_classDelet = [];
            let a1 = $("div").get(),
                a2 = $("span").get(),
                a3 = $("a").get();
            let aaa = a1.concat(a2, a3);

            //逐一扫描目标, 同时顺手做很多操作
            for (let i = 0; i < aaa.length; i++) {
                let a = aaa[i];
                arr_idName[i] = (a.id ? a.id : null);
                arr_className[i] = (a.classList.length > 0 ? a.classList : null);
                //顺手解决掉内容就是"广告"的元素
                if (a.innerText == "广告") {
                    sendLog("这个div的内容就直接是广告, 删除父元素", "提示", 20);
                    if (a.parentNode == $("body")[0]) {
                        sendLog("但由于父元素就是body, 仅删除自身", "警告", );
                        deletEl(a);
                    } else {
                        deletEl(a.parentNode);
                    }
                }
                //顺手解决z-index过高的元素
                if (a.style.zIndex > 9999999) {
                    sendLog("正在处理z-index过高的家伙", "提示", 20);
                    deletEl(a);
                }
            }

            //确定目标
            for (let i = 0; i < arr_idName.length; i++) {
                let idName = arr_idName[i];
                if (!idName) continue;
                for (let j = 0; j < ADS_STRINGS.length; j++) {
                    const the_string = ADS_STRINGS[j];
                    if (idName.indexOf(the_string) >= 0) {
                        arr_idDelet.push(idName);
                        break;
                    }
                }
            }
            for (let i = 0; i < arr_className.length; i++) { //这个循环获得一个class的list
                let className = arr_className[i];
                if (!className) continue;
                for (let j = 0; j < className.length; j++) { //这个循环获得list中的每一个值
                    let theClass = className[j]; //单个的class
                    for (let k = 0; k < ADS_STRINGS.length; k++) {
                        const the_string = ADS_STRINGS[k]; //正要比对的广告字段
                        if (theClass.indexOf(the_string) >= 0) {
                            arr_classDelet.push(theClass);
                            break;
                        }
                    }
                }
            }

            //剔除无辜者
            {
                let i, j, k;

                try {
                    for (i = 0; i < INNOCENTS_LIST.length; i++) {
                        const theString = INNOCENTS_LIST[i];
                        for (j = 0; j < arr_idDelet.length; j++) {
                            if (arr_idDelet[j].indexOf(theString) >= 0 || $("#" + arr_idDelet[j]).length > 0 && $("#" + arr_idDelet[j])[0].tagName == "BODY") arr_idDelet[j] = "null";
                        }
                        for (k = 0; k < arr_classDelet.length; k++) {
                            if (arr_classDelet[k].indexOf(theString) >= 0 || $("." + arr_classDelet[k]).length > 0 && $("." + arr_classDelet[k])[0].tagName == "BODY") arr_classDelet[k] = "null";
                        }
                    }
                } catch { sendLog("在剔除无辜者时遇到了麻烦, 可能是误伤的原因\n参数: i,j,k = " + i + ", " + j + ", " + k, "报错"); }
            }
            let tmp = [];
            for (let i = 0; i < arr_idDelet.length; i++) {
                const element = arr_idDelet[i];
                if (element != "null") tmp.push(element);
            }
            arr_idDelet = tmp;
            for (let i = 0; i < arr_classDelet.length; i++) {
                const element = arr_classDelet[i];
                if (element != "null") tmp.push(element);
            }
            arr_classDelet = tmp;

            //报告
            if (arr_idDelet.length > 0 && arr_classDelet.length > 0) sendLog("core循环消杀列表报告", "提示", 18);
            if (arr_idDelet.length > 0) sendLog("要消杀的id列表如下\n" + arr_idDelet.join("\t"), "#35D4C7", 20);
            if (arr_classDelet.length > 0) sendLog("要消杀的class列表如下\n" + arr_classDelet.join("\t"), "#35D4C7", 20);

            //启动删除作业
            try {
                if (arr_idDelet.length > 0) {
                    for (let j = 0; j < arr_idDelet.length; j++) {
                        let id = "#" + arr_idDelet[j];
                        sendLog("core循环中对id为 " + id + " 的消杀", "提示", 20);
                        if (!deletEl(document.getElementById(arr_idDelet[j]), false, "来自删除带ad字段的第一次尝试")) {
                            if (!deletEl($(id)[0], false, "来自删除带ad字段的第二次尝试")) {
                                try { deletEl($(id)[0][0], false, "来自删除带ad字段的第三次尝试 id数组\n现在的idDelet数组是:" + arr_idDelet + "\nid是:" + id); } catch { sendLog("有个叫" + arr_idDelet[j] + "的id实在删不掉qwq", "警告"); }
                            }
                        }
                    }
                }
                if (arr_classDelet.length > 0) {
                    for (let j = 0; j < arr_classDelet.length; j++) {
                        let theClass = "." + arr_classDelet[j];
                        sendLog("core循环中对class为 " + theClass + " 的消杀", "提示", 20);
                        deletClass($(theClass), false, "来自删除带ad字段的 class数组");
                    }
                }
            } catch { sendLog("在进行删除ad作业时发生了不可避免的错误, 可能导致部分广告残留", "报错"); }
        }, 1200);

    }()

    /*======================div:局部效果==========================*/

    //古诗文网
    if (currentSite.indexOf("gushiwen") >= 0) {
        let el1 = document.getElementById("threeWeixin"),
            el2 = document.getElementById("threeWeixin2"),
            el3 = document.getElementById("btmwx"),
            el4 = document.getElementsByClassName("right")[1];
        deletEl(el1);
        deletEl(el2);
        deletEl(el3);
        deletEl(el4);
        deletEl($(".jiucuo")[0]);

        $(".left")[1].style.width = '100%';
        $(".left p,.left a").css("font-size", '24px');
    }

    //userstyles 样式网站
    if (currentSite.indexOf("userstyles") >= 0) {
        window.setTimeout(function() {
            let el1 = document.getElementById("as_userscript");
            let el2 = document.getElementById("install_button");
            el2.innerHTML = el1.innerHTML;
        }, 3000);
    }

    //微信公众号文章
    if (currentSite.indexOf("mp.weixin.qq.com") >= 0) {
        window.setTimeout(function() {
            imgPreload();
            let el1 = document.getElementById("js_pc_qr_code"),
                el2 = document.getElementsByClassName("js_rich_media_area_primary_inner")[0],
                el3 = document.getElementById("js_content"),
                el4 = $(".rich_media_content img");
            if (!el2) {
                el2 = document.getElementsByClassName("rich_media_area_primary_inner")[0];
            }
            for (let i = 0; i < el4.length; i++) {
                const el = el4[i];
                el.style.transform = 'translateX(0%)';
            }
            $("h1")[0].style.color = "#191919";
            $("h1")[0].style.fontSize = "48px";
            $("h1")[0].style.background = "#CCDAEB";
            $("h1")[0].style.padding = "2px 2px 2px 16px";
            $("h1")[0].style.fontWeight = "bolder";

            el3.style.fontSize = '36px';
            el2.style.maxWidth = "none";
            $("#js_content>p").css("font-size", "42px");
            $("#js_content>p>span").css("font-size", "38px");
            $("#js_content>p>span").css("line-height", "45px");
            deletEl(el1);
        }, 1000);
    }

    //学科网
    if (currentSite.indexOf("www.zxxk") >= 0) {
        window.setTimeout(function() {
            window.onerror = function() {
                return true;
            }
            $(".limit")[0].click();
        }, 1200);
        window.setInterval(function() {
            console.clear();
        }, 1600);
        try {
            deletEl($("#mfbar")[0]);
        } catch {
            console.log("mfbar不存在");
            return true;
        }
        deletEl($(".resource-top")[0]);
        deletEl($(".header")[0]);
        deletEl($(".roof-bar")[0]);
        deletEl($(".res-side")[0]);
        deletEl($(".flex-head")[0]);
        deletEl($("#xkw-sidebar")[0]);
        window.onerror = function() {
            return true;
        }
    }

    //360个人图书馆
    if (currentSite.indexOf("www.360doc") >= 0) {
        FullScreenObj.init();
        window.setTimeout(function() {
            deletEl($("#registerOrLoginLayer")[0]);
            //deletEl($("body>div")[11]);
            $("#artfullscreen")[0].style.transform = "scale(1.35)";
            $("#artfullscreen")[0].style.zIndex = '9999999';
            $("#artfullscreen")[0].style.top = '100px';

            window.setTimeout(function() {
                let imgs = $('#artfullscreen img[doc360img-src]');
                for (let i = 0; i < imgs.length; i++) {
                    let t = $(imgs[i]);
                    let url = t.attr('doc360img-src');
                    let ghost = document.createElement('img');
                    ghost.baba = t;
                    $(t).removeAttr('doc360img-src');
                    $(ghost).bind('load', function() {
                        $(this).unbind('load');
                        $(this.baba).attr('src', ghost.src);
                        if (this.width >= 640 && (!$(this.baba).parents('a').length)) {
                            if (!this.baba.naturalWidth) {
                                this.baba.setAttribute('naturalWidth', this.width);
                                this.baba.setAttribute('naturalHeight', this.height)
                            }
                            $(this.baba).addClass('z-i_');
                            addClickOut(this.baba);
                        }
                    }).attr('src', url)
                }
            }, 800);
        }, 1600);
    }

    //知乎
    if (currentSite.indexOf("zhihu") >= 0) {
        window.setTimeout(function() {
            let el1 = $(".RelatedCommodities-title")[0].parentElement;
            deletEl(el1);
        }, 2400);
    }

    //考满分 托福背单词
    if (currentSite.indexOf("toefl.kmf") >= 0) {
        window.setTimeout(function() {
            $("body").keydown(function(e) {
                let string = $(".scroll-wrapall-overflow.g-clearfix")[0].style.left,
                    num = string.split("px")[0] / (-700);
                console.log('num: ', num);
                if (e.keyCode == 191) window.open($(".subject-answer-view")[num].href, '_blank');
            });

        }, 1200);
    }

    //百度文库 标准视图
    if (currentSite.indexOf("wenku.baidu.com/view") >= 0 && $(".tpl-xreader").length > 0) {

        window.setTimeout(function() {
            $("#app")[0].style.overflow = 'hidden';
            deletEl($("#app-right")[0]);
            deletEl($("#app-left")[0]);
            deletEl($("#app-top-right-tool")[0]);
            deletClass($(".tool-bar-wrap"));
            deletClass($(".page-icon-pos"));
            deletClass($(".header-wrapper"));
            deletClass($(".menubar"));
            deletClass($(".pc-cashier-card"));
            $(".center-wrapper")[0].style.width = "100%";
            $("#original-creader-root")[0].style.width = "";
            $(".reader-topbar-below")[0].style.height = "100%";
            $(".content-wrapper")[0].style.height = "100%";
            /*
            try {
                if ($(".read").length == 0) $(".read-all")[0].click();
                else {
                    sendLog("本篇文库可能要收费", "警告");
                    deletEl($("#app-reader-editor-below")[0]);
                }
            } catch { sendLog("本篇文库无需展开或展开按钮出现问题", "警告") }
            */

            if ($(".word").length > 0) {
                $("#original-creader-root")[0].style.scale = ".98";
                window.setInterval(function() {
                    let ccc = $("canvas");
                    for (let i = 0; i < ccc.length; i++) {
                        ccc[i].style = {};
                    }
                }, 1200);
            }
            if ($(".pdf").length > 0) {
                window.setInterval(function() {
                    let ccc = $(".pageNo>canvas");
                    for (let i = 0; i < ccc.length; i++) {
                        ccc[i].style = {};
                    }
                }, 1200);
            }
            if ($(".ppt").length > 0) {
                $(".reader-wrap")[0].style.width = "";
                $("#original-creader-root")[0].style.scale = "1";
                window.setInterval(function() {
                    let PPTNumCount = $("#reader-thumb")[0].childElementCount;
                    let aaa = $(".thumb-li>img");
                    let bbb = $(".pageNo");
                    for (let i = 0; i < PPTNumCount; i++) {
                        let a = aaa[i]; //a是缩略图的NODE
                        let b = bbb[i]; //b是显示的div(包括两个canvas和小广告横条)
                        b.innerHTML = a.parentNode.innerHTML.split("<span")[0];
                    }
                }, 2400);
            }

        }, 2000); //进门延时触发函数end

    }

    //百度文库 学术期刊
    if (currentSite.indexOf("wenku.baidu.com/view") >= 0 && $("#journal-view").length > 0) {

        window.setTimeout(() => {
            sendLog("对于 百度文库_学术期刊 的针对性作业", "提示", 20);
            deletClass($(".doc-btns-wrap"));
            deletClass($(".catalog"));
            $(".liter-head-fold-btn")[0].click();
            $("#journal-view")[0].style.width = "100%";
            $("#creader-root")[0].style.width = "100%";
            deletClass($(".small-btn-wrap"));
            $(".tool-bar-wrapper")[0].style.width = "100%";

        }, 2000);

        window.setInterval(() => {
            var canvas = $("canvas").get();
            for (let i = 0; i < canvas.length; i++) {
                const c = canvas[i];
                c.style.width = "100%";
                c.style.height = "";
            }
        }, 2000);
    }

    //脚本之家
    if (currentSite.indexOf("jb51.net") >= 0) {
        deletEl($("#header")[0]);
        deletEl($(".pt10 .clearfix")[0]);
        deletClass($(".lbd"));
        window.jb52Interval = setInterval(() => {
            if ($("span[class$='Pos']").length < 1) {
                clearInterval(jb52Interval);
                return;
            }
            deletClass($("span[class$='Pos']"));
        }, 1200);
        window.jb51Interval = setInterval(() => {
            if (deletEl($("#main .main-right")[0], true)) {
                try {
                    clearInterval(jb51Interval);
                    let el1 = $("#main .main-left")[0];
                    el1.style.width = "100%";
                    sendLog("版面修改完成");
                } catch { sendLog("脚本之家版面修改失败", "报错"); }
            }
        }, 2000);
    }

    //腾讯网
    if (currentSite.indexOf("new.qq.com/rain/a/") >= 0) {
        deletEl($("#RIGHT")[0]);
    }

    //游民星空
    if (currentSite.indexOf("gamersky.com/handbook") >= 0) {
        deletEl($("body > div.fixedCode")[0]);
        deletEl($("#adTips")[0]);
        deletEl($("body > div.Mid > div.Mid_top")[0]);
        deletEl($("body > div.Top.home > div.header")[0]);
        let aaa = $(".gs_strategy_collect")[0].innerHTML;
        $(".Mid2_R")[0].innerHTML = aaa;
        // $(".Mid")[0].style.width = "100%";
        // $(".Mid2")[0].style.width = "100%";
        // $(".Mid2_R")[0].style.left = "685px";
        window.setInterval(() => {
            try {
                $(".gsBackgroundClose")[0].click();
            } catch { sendLog("游民星空删除背景板失败", "报错"); }
        }, 500);
        // window.jb51Interval = setInterval(() => {
        //     if (deletEl($("#main .main-right")[0]), true) {
        //         try {
        //             clearInterval(jb51Interval);
        //             let el1 = $("#main .main-left")[0];
        //             el1.style.width = "100%";
        //             sendLog("版面修改完成");
        //         } catch {}
        //     }
        // }, 2000);
    }

    //业百科

    if (currentSite.indexOf("yebaike") >= 0) {
        window.setInterval(() => {
            deletClass($(".ny-ad"), false, "删除nyad");
        }, 500);
    }

    //bilibili
    if (currentSite.indexOf("bilibili.com/video") >= 0) {
        window.bilibiliInt = setInterval(() => {
            if ($(".ad-report").length < 1) {
                clearInterval(bilibiliInt)
            }
            deletClass($(".ad-report"), true);
        }, 500);
    }

    //搜狐
    if (currentSite.indexOf("sohu.com/a/") >= 0) {
        window.setInterval(() => {
            deletEl($("#right-side-bar")[0], true);
            deletEl($("#god_bottom_banner")[0], true);
            let body = $(".left.main")[0];
            //body.style.transform = 'scale(1.35)translate(60%, 16%)';
            //body.style.margin = "30px 0 0 72px";
            //body.style.top = "60px";
            body.style.width = "80%";
            let aaa = $("p>span");
            for (let i = 0; i < aaa.length; i++) {
                const a = aaa[i];
                a.style.fontSize = "36px";
            }

        }, 500);
    }

    //道客巴巴
    if (currentSite.indexOf("doc88.com/p") >= 0) {
        window.setTimeout(() => {
            try { $(".btn_fullscreen")[0].click(); } catch {; }
            deletEl($("#boxright")[0]);
            $("#boxleft")[0].width = "100%";
        }, 1200);
        window.docbabaInterval_2 = setInterval(() => {
            let h = $(".postil_page")[0].height;
            let w = $(".postil_page")[0].width;
            var canvas = $(".inner_page").get();
            for (let i = 0; i < canvas.length; i++) {
                const c = canvas[i];
                c.style.width = c.parentElement.clientWidth + "px";
                c.style.height = h / w * c.clientWidth + "px";
            }
        }, 1200);
        window.docbabaInterval_1 = setInterval(function() {
            let aaa = $("canvas.inner_page");
            for (let i = 0; i < aaa.length; i++) {
                const a = aaa[i];
                let parent = a.parentNode;
                if (parent.childElementCount > 3 && parent.lastChild.src.length > 8000) continue;
                if (parent.childElementCount > 3) parent.removeChild(parent.lastChild);
                let child = convertCanvasToImage(a);
                if (child.src.length < 8000) continue;
                child.className = "zhyDaDa_png";
                child.style.display = "none";
                parent.appendChild(child);
            }
            if ($(".zhyDaDa_png").length >= Number($("li.text")[0].lastChild.textContent.split(" / ")[1])) {
                //加载完毕
                $("#zhyDaDa_Notice")[0].innerHTML = "加载完了!<br>可以下载了!"
                $("#btndown1")[0].style.backgroundColor = "#ef9601";
                clearInterval(docbabaInterval_1);
                clearInterval(docbabaInterval_2);
            }
        }, 2000);
        window.setTimeout(() => {
            $("#btndown1")[0].parentNode.innerHTML = "<div class='btnmin3' id='zhyDaDa_Notice'></div>" + $("#btndown1")[0].parentNode.innerHTML;
            let notice = $("#zhyDaDa_Notice")[0];
            let btn = $("#btndown1")[0];

            notice.style.left = '-120px';
            notice.style.position = 'absolute';
            notice.style.width = '90px';
            notice.style.height = '80px';
            notice.style.backgroundColor = '#2F70E0';
            notice.style.color = 'ghostwhite';
            notice.style.fontWeight = '600';

            notice.innerText = "请手动浏览整个文档直到图片全部加载!";
            btn.style.backgroundColor = "grey";

            btn.onclick = function() {
                alert("开始下载");
                let bbb = $(".zhyDaDa_png");
                sendLog($(".zhyDaDa_png").length);
                for (let j = 0; j < bbb.length; j++) {
                    sleep(500);
                    const b = bbb[j];
                    let c = document.createElement("a");
                    c.download = "pic_" + (j + 101);
                    c.href = b.src;
                    c.click();
                }
            }
        }, 6000);
    }

    //堆糖
    if (currentSite.indexOf("duitang.com/blog") >= 0) {
        window.setInterval(() => {
            deletClass($(".blockUI"), true);
            $("#mdata")[0].style.zoom = '1.2';
        }, 1200);
    }

    //win7系统之家
    if (currentSite.indexOf("winwin7") >= 0) {
        window.setInterval(() => {
            deletClass($(".xgydbox"));
            deletClass($(".acmenu"));
            deletClass($("table"));
        }, 1200);
    }

    //豆丁
    if (currentSite.indexOf("docin") >= 0) {
        window.setTimeout(() => {
            $(".btn_fullscreen")[0].click();
        }, 1200);
        window.doudinInterval_1 = setInterval(function() {
            let aaa = document.getElementsByTagName("canvas");
            for (let i = 0; i < aaa.length; i++) {
                const a = aaa[i];
                let parent = a.parentNode;
                if (parent.childElementCount > 1 && parent.lastChild.src.length > 8000) continue;
                if (parent.childElementCount > 1) parent.removeChild(parent.lastChild);
                let child = convertCanvasToImage(a);
                child.className = "zhyDaDa_png";
                child.style.display = "none";
                parent.appendChild(child);
            }
            if (aaa.length >= $(".scrollLoading").length) {
                // 说明加载完了
                document.getElementsByClassName("tools_btns")[1].innerHTML = "加载完了!<br>可以下载了!";
                document.getElementsByClassName("tools_btns")[0].style.backgroundColor = "#f47402";
                clearInterval(doudinInterval_1);
            }
        }, 2000);
        window.setTimeout(() => {
            var aaa = document.querySelector(".reader_tools_bar_center");
            aaa.innerHTML = aaa.innerHTML + aaa.innerHTML;
            let btn2 = document.getElementsByClassName("tools_btns")[1];
            btn2.style.backgroundColor = "#FFBE00";
            btn2.style.fontSize = "13px";
            btn2.style.lineHeight = "22px";
            btn2.style.color = "black";
            btn2.style.fontWeight = '600';
            btn2.innerHTML = "请手动浏览整个文档<br>直到图片全部加载!";
            let btn = document.getElementsByClassName("tools_btns")[0];
            btn.parentNode.href = "";
            btn.parentNode.onclick = "";
            btn.onclick = function() {
                alert("开始下载图片");
                let bbb = document.getElementsByClassName("zhyDaDa_png");
                for (let j = 0; j < bbb.length; j++) {
                    sleep(500);
                    const b = bbb[j];
                    let c = document.createElement("a");
                    c.download = "pic_" + (j + 101);
                    c.href = b.src;
                    c.click();
                }
            }
            btn.innerHTML = "zhyDaDa下载";
            btn.style.backgroundColor = "grey";
            deletClass($(".no_more_mod"));
        }, 6000);
    }

    //3dm
    if (currentSite.indexOf("3dmgame") >= 0) {
        window.setInterval(() => {
            // sendLog("\/ - - - 3dm 针对性作业 开始 - - - \\", "启动", 30);
            deletClass($(".Content_R"));
            deletClass($(".index_bg_box"));
            deletIframe("about:blank");
            deletImg("http://www.baidu.com/cb.php?c=", 2);
            deletClass($(".addvide3000"));
            deletHref("https://www.3dmgame.com/app.html");
            // sendLog("\\ - - - 3dm 针对性作业 结束 - - - \/", "启动", 30);

            //$(".Content_L").css("width","100%");
        }, 1200);
    }

    //百度知道
    if (currentSite.indexOf("zhidao.baidu.com/question") >= 0) {
        window.setInterval(() => {
            deletEl($("#knowledge-answer")[0]);
        }, 2000);
    }

    //百度 百家号
    if (currentSite.indexOf("baijiahao.baidu.com/") >= 0) {
        window.baijiahao_interval = setInterval(() => {
            if (document.getElementById("app").firstChild.firstChild.children[1].firstChild.childElementCount < 2) {
                clearInterval(baijiahao_interval);
                return;
            }
            sendLog("对于百家号的针对性作业", "提示", 20);
            document.getElementById("app").firstChild.firstChild.children[1].firstChild.firstChild.style.width = "100%";
            deletEl(document.getElementById("app").firstChild.firstChild.children[1].firstChild.children[1], true);
        }, 2400);
    }

    //百度 题库
    if (currentSite.indexOf("easylearn.baidu.com/edu-page/") >= 0) {

        window.baidu2_interval = setInterval(() => {
            if ($(".vip-banner-cont").length > 0) {
                sendLog("对于百度题库的针对性作业", "提示", 20);
                deletEl($(".vip-banner-cont")[0], true)
                deletEl($(".shijuan-cont")[0]);
                deletEl($(".feedback-icon")[0]);
                window.setTimeout(() => {
                    document.getElementsByClassName("toogle-btn")[0].click();
                    setTimeout(() => { document.getElementsByClassName("see-answer")[0].click() }, 960);
                }, 1200);
                clearInterval(baidu2_interval);

            }
        }, 2400);
    }

    //原创力文档
    if (currentSite.indexOf("max.book118.com") >= 0) {
        window.setTimeout(() => {
            $(".zoom-full")[0].click();
            $("#btn_preview_remain")[0].click();
            deletEl($("#bar_download")[0]);
        }, 1200);
        window.yuanchuangliInterval_1 = setInterval(function() {
            let aaa = $(".webpreview-item>img");
            for (let i = 0; i < aaa.length; i++) {
                const a = aaa[i];
                if (a.className == "lazy" || a.src.length < 2) continue;
                a.className = "zhyDaDa_png";
            }
            if ($(".zhyDaDa_png").length >= Number($("span.counts")[0].innerText.split("/ ")[1])) {
                //加载完毕
                $("#hd_close")[0].innerHTML = "加载完了!可以下载了!"
                $("#hd_download")[0].style.backgroundColor = "#ef9601";
                clearInterval(yuanchuangliInterval_1);
            }
            deletClass($(".re"));
        }, 2000);
        window.setTimeout(() => {
            deletClass($(".re"));

            let notice = $("#hd_close")[0];
            let btn = $("#hd_download")[0];

            notice.style.width = '320px';
            notice.style.position = 'absolute';
            notice.style.right = '20px';

            notice.innerText = "请手动浏览整个文档直到图片全部加载!";
            btn.style.backgroundColor = "grey";

            btn.onclick = function() {
                alert("开始下载");
                let bbb = $(".zhyDaDa_png");
                sendLog($(".zhyDaDa_png").length);
                for (let j = 0; j < bbb.length; j++) {
                    sleep(500);
                    const b = bbb[j];
                    downloadImage(b.src, "pic_" + (101 + j));
                }
            }
        }, 6000);
    }

})();

/*
参考模板

if (re_###.test(currentSite)){
        window.setTimeout(function(){
            //function goes here...
        },3000);

        deletEl($"");
        deletEl($"");
        deletEl($"");
    }

360图书馆 原配的用来破解图片的函数
setTimeout(function() {
                var imgs = $('#artfullscreen img[doc360img-src]')
                  , wH = $('#artfullscreen').height()
                  , sT = $('#artfullscreen').scrollTop();
                for (var i = 0; i < imgs.length; i++) {
                    var t = $(imgs[i]);
                    var oT = t.offset().top
                      , tH = t.height() + oT
                      , trueSrc = t.attr('doc360img-src');
                    if (oT < wH && tH > 0) {
                        var ghost = document.createElement('img');
                        ghost.baba = t;
                        $(t).removeAttr('doc360img-src');
                        $(ghost).bind('load', function() {
                            $(this).unbind('load');
                            $(this.baba).attr('src', ghost.src);
                            if (isNotOwner && this.width > 300) {
                                if (max300w <= 0) {
                                    $(this.baba).hide().addClass('notshow__')
                                } else {
                                    $(this.baba).css('visibility', '');
                                    max300w -= 1
                                }
                            } else {
                                $(this.baba).css('visibility', '')
                            }
                            ;if (this.width >= 640 && (!$(this.baba).parents('a').length) && !$(this.baba).hasClass('notshow__')) {
                                if (!this.baba.naturalWidth) {
                                    this.baba.setAttribute('naturalWidth', this.width);
                                    this.baba.setAttribute('naturalHeight', this.height)
                                }
                                ;$(this.baba).addClass('z-i_');
                                addClickOut(this.baba)
                            }
                        }).attr('src', trueSrc)
                    }
                }
                ;$('.notshow__').remove()
            }, 50)

 */
/*
和网页斗智斗勇的经验/血与泪

//清除所有定时器
var time = setInterval(() => {
   console.log("hello world")
}, 10000);
for(var i = 1;i<=time;i++){
    clearInterval(i);
}

//摆平恶心的无关函数
function a() {console.log("fuck")}

//提取网页上所有元素的id, class等
$('*').each(function(i){
arr_tag[i]=$(this).get(0).tagName;
arr_id[i]=($(this).attr('id')? $(this).attr('id'): 'non');
arr_class[i]=($(this).attr('class')? $(this).attr('class'): 'non');
str +="</br>"+arr_tag[i]+" id='"+arr_id[i]+"' class='"+arr_class[i]+"'";
});
*/