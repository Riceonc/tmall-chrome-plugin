// 接收来自后台的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    // if(request.cmd == "finish"){
    //     localStorage.setItem("jdl_test",request["result"]);
    //     localStorage.setItem("jdl_signIn","1");
    //     sendResponse("ok");
    // }
});

//保存版本和插件代理机构信息到storage
var path = chrome.extension.getURL("manifest.json");
$.ajax({
    url: path,
    success: function (res) {
        var version = res.version;
        var dict = {"version":version};
        var path2 = chrome.extension.getURL("lib/sysUsersId.txt");
        $.ajax({
            url: path2,
            success:function(res) {
                var htmlobj = JSON.parse(res);
                dict["userIdAgent"] = htmlobj["userIdAgent"];
                dict["userIdOrg"] = htmlobj["userIdOrg"];
                localStorage.setItem("zsy_tools",JSON.stringify(dict));

            }
        });
    }
});

// 广告暂时注销start----------
// const userName = localStorage.getItem('jdl_user');
// $.ajax({
//     url:ajax_url + 'judingli/plugin/getAdvertisement',
//     type:'post',
//     data:JSON.stringify({userName:userName}),
//     contentType: "application/json",
//     success:res=>{
//         if(res.data == null){
//             return;
//         }else {
//             const content = res.data.content;
//             layer.open({
//                 type:1,
//                 title:false,
//                 closebBtn:0,
//                 area:['auto'],
//                 shadeClose:false,
//                 content:`<div style='background:rgba(255,255,255,1)'>${content}</div>`
//             })
//         }
//     }
// })
// end-----------------------------------



//新增用户
// function getUserInfo(){
//     var user_name = "";
//     var key = "//sycm.taobao.com/custom/menu/getViewMode.json"; //获取本地存储的Key
//     try{
//         let word = JSON.parse(localStorage.getItem(key)).split("|")[1];
//         word = JSON.parse(word)["value"]["_d"];
//         if($.cookie("sn") == undefined){
//             user_name = $.cookie("lgc").replace(/\\/g, "%");
//             user_name = unescape(user_name).split(':')[0];
//         }else{
//             user_name = $.cookie("sn").split(':')[0];
//         }
//         //定位店铺id
//         var dict = {
//             "sycm.taobao.com/portal/home":".ebase-Frame__title",
//             "sycm.taobao.com/ipoll":".current-shop-item-title",
//             "sycm.taobao.com/datawar":".ebase-ModernFrame__title",
//             "sycm.taobao.com/flow":".ebase-ModernFrame__title",
//             "sycm.taobao.com/cc":".ebase-Frame__title",
//             "sycm.taobao.com/bda":".current-shop-item-title",
//             "sycm.taobao.com/xsite":".ebase-Frame__title",
//             "sycm.taobao.com/qos":".ebase-Frame__title",
//             "sycm.taobao.com/fa":".ebase-Frame__title",
//             "sycm.taobao.com/mc":".ebase-Frame__title",
//             "sycm.taobao.com/adm":".ebase-Frame__title",
//             "sycm.taobao.com/college":".ebase-Frame__title"
//         };
//         var title = "";
//         for(var key in dict){
//             if(location.href.indexOf(key) != -1){
//                 title = $(dict[key]).text();
//                 break;
//             }
//         }
//         try{
//             var user_id = word["singleShops"].find(item => item.runAsUserName == title).runAsUserId;
//             var now_user_id = localStorage.getItem("jdl_userId");
//             if(user_id != now_user_id){
//                 localStorage.setItem("jdl_user",user_name);
//                 localStorage.setItem("jdl_userId",user_id);
//                 localStorage.setItem("jdl_signIn","0");
//                 localStorage.setItem("jdl_menu","");
//             }
//         }catch (e) {
//
//         }
//         var signIn = localStorage.getItem("jdl_signIn");
//
//         if(user_name != "" && signIn == "0"){
//             var path = chrome.extension.getURL("lib/sysUsersId.txt");
//             $.ajax({
//                 url: path,
//                 success:function(res) {
//                     var message = {"url":ajax_url,"signIn":signIn,"user_name":localStorage.getItem("jdl_user"),"org":res};
//                     chrome.runtime.sendMessage(message, function(response) {
//                     });
//                 }
//             });
//         }
//     }catch (e) {
//         // console.log(e);
//     }
// }
//获取用户信息

// var userTimer = window.setInterval(getUserInfo,2000);
