
var pageTimer = {};

var ajax_url = "https://www.zhishuya.com/h5/";
// var ajax_url = "https://www.cambrianer.cn/h5/";
function checkBtn(){
    if (location.href.indexOf("list.tmall.com") !== -1) {
        // 天猫词根
        tmallData();
        return true
    }
}

pageTimer["timer1"] = window.setInterval(checkBtn,1000);
// pageTimer["timer2"] = window.setInterval(checkData,1000);

// if(!localStorage.getItem("jdl_table_setting")){
//     //初始化jdl_table_setting
//     localStorage.setItem("jdl_table_setting",JSON.stringify(init_table));
//     table_setting = JSON.parse(JSON.stringify(init_table));
// }else{
//     //判断table_setting和init_table结构是否相同
//     //获取用户table设置
//     table_setting = JSON.parse(localStorage.getItem("jdl_table_setting"));
//     if(equalsObj(table_setting,init_table)){
//         //结构相同无需更新
//     }else{
//         //结构不同代表有更新，强制更新
//         table_setting = JSON.parse(JSON.stringify(init_table));
//     }
// }
localStorage.setItem('jdl_i18n', 'zh')
checkLang()

