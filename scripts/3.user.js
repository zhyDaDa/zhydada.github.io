// ==UserScript==
// @name         zhyDaDa_华理网络自动登录
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  针对华理网络pc/phone端登陆的自动化脚本
// @author       zhyDaDa

// @match        *://*/*

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
    const currentSite = window.location.href;

    /**
     * 模拟cmd中的sleep函数
     * @param {"number"} d deltaTime 即要等待的时间差 照旧以毫秒为单位
     */
    function sleep(d) {
        for (let t = Date.now(); Date.now() - t <= d;);
    }

    /* div:华理网络自动登录 */
    if (currentSite.indexOf("srun_portal_pc.php") >= 0 || currentSite.indexOf("srun_portal_phone.php") >= 0) {

        if (!localStorage.getItem("zhyDaDa_EcustWeb_Auto_Login_Username") || !localStorage.getItem("zhyDaDa_EcustWeb_Auto_Login_Password")) {
            alert("第一次使用需要设定学号和密码, 请尽量不要输错!");
            alert("如果输入错误, 清空浏览器缓存以重新设定");
            alert("也可以在控制台输入'localStorage.clear()'");
            while (!localStorage.getItem("zhyDaDa_EcustWeb_Auto_Login_Username")) {
                // 初始化
                let u = prompt("请输入您的学号");
                if (!Number(u)) {
                    alert("输入的应当是数字, 请重新输入");
                    continue;
                }
                localStorage.setItem("zhyDaDa_EcustWeb_Auto_Login_Username", Number(u));
            }
            while (!localStorage.getItem("zhyDaDa_EcustWeb_Auto_Login_Password")) {
                // 初始化
                let p = prompt("请输入您的密码");
                if (p != prompt("请再次输入以确认输入正确")) {
                    alert("两次输入的密码不一致, 请重新输入");
                    continue;
                }
                localStorage.setItem("zhyDaDa_EcustWeb_Auto_Login_Password", p);
            }
        }
        if (currentSite.indexOf("srun_portal_pc.php") >= 0) {
            window.setTimeout(() => {
                $("#username")[0].value = localStorage.getItem("zhyDaDa_EcustWeb_Auto_Login_Username");
                $("#password")[0].value = localStorage.getItem("zhyDaDa_EcustWeb_Auto_Login_Password");
                $("input[value='登录']")[0].click();
                sleep(200);
                let a = document.createElement("a");
                a.href = "javascript:window.opener=null;window.open('','_self');window.close();";
                a.click();

            }, 800);
        }
        else if (currentSite.indexOf("srun_portal_phone.php") >= 0) {
            window.setTimeout(() => {
                console.log("zhyDaDa报告: 已经进入自动阶段, 若无下文则说明程序有误");
                try {
                    $("input[name='username']")[0].value = localStorage.getItem("zhyDaDa_EcustWeb_Auto_Login_Username");
                    $("input[name='password']")[0].value = localStorage.getItem("zhyDaDa_EcustWeb_Auto_Login_Password");
                    $("input[type='submit']")[0].click();                    
                } catch  {
                    console.log("选择器有误!");
                    return;
                }
                sleep(200);
                try {
                    let a = document.createElement("a");
                    a.href = "javascript:window.opener=null;window.open('','_self');window.close();";
                    a.click();                    
                } catch {
                    console.log("自动退出机制有误!");
                }
            }, 800);
        }
    }

})();