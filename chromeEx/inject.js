// 接收来自后台的消息
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
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

