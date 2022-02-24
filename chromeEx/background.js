function validateUrl(url){
    if (typeof url !== 'string'){
        return false;
    }
    return url.indexOf('undefined') === -1;
}

const reqPrefix = {
    "https://sycm.taobao.com/mc/live/ci/": {
        title: '市场',
        mod: '监控看板'
    },
    "https://sycm.taobao.com/mc/ci/": {
        title: '市场',
        mod: '监控看板',
        suffix: '/monitor/list.json'
    },
    "https://sycm.taobao.com/mc/ci": {
        title: '市场',
        mod: '市场排行',
        suffix: '/trend.json'
    },
    "https://sycm.taobao.com/mc/mq/supply/mkt/sea/price.json": {
        title: '市场',
        mod: '市场大盘'
    },
    "https://sycm.taobao.com/mc/mq/supply/mkt/sea/cate.json": {
        title: '市场',
        mod: '市场大盘'
    },
    "https://sycm.taobao.com/mc/mq/supply/mkt/trend/cate.json": {
        title: '市场',
        mod: '市场大盘'
    },
    "https://sycm.taobao.com/mc/mq/supply/mkt/trend/self.json": {
        title: '市场',
        mod: '市场大盘'
    },
    "https://sycm.taobao.com/mc/mq/supply/mkt/trend/cycle.json": {
        title: '市场',
        mod: '市场大盘'
    },
    "https://sycm.taobao.com/mc/mq/mkt/rank/": {
        title: '市场',
        mod: '市场排行'
    },
    "https://sycm.taobao.com/mc/searchword/propertyTrend.json": {
        title: '市场',
        mod: '搜索分析'
    },
    "https://sycm.taobao.com/mc/searchword/relatedHotWord.json": {
        title: '市场',
        mod: '搜索分析'
    },
    "https://sycm.taobao.com/mc/industry/": {
        title: '市场',
        mod: '搜索排行'
    }
};

// 监听ajax请求，记录，并过滤url中是否含有非法值进行拦截
// onBeforeRequest 状态下的请求才可被拦截
chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
        if (details.initiator === 'https://sycm.taobao.com' && details.type === 'xmlhttprequest'){
            // 拦截非法url
            if (!validateUrl(details.url)){
                const warn = {
                        warnLevel: '警告',
                        warnMenu: '',
                        content: ''
                };
                for (let key in reqPrefix) {
                    if (details.url.indexOf(key) !== -1) {
                        warn.content = '非法url请求：' + details.url;
                        // 当url重复时 用suffix 区分模块
                        if (details.url.indexOf(reqPrefix[key].suffix) !== -1) {
                            warn.warnMenu = reqPrefix[key].title + '-' + reqPrefix[key].mod
                        }else {
                            warn.warnMenu = reqPrefix[key].title + '-' + reqPrefix[key].mod
                        }
                    }
                }
                $.ajax({
                    type: 'POST',
                    url: 'https://www.zhishuya.com/h5/judingli/plugin/addWarning',
                    contentType: "application/json",
                    data: JSON.stringify(warn)
                });
                return {cancel: true}
            }
            // chrome.storage.local.clear()
            // 存储访问记录url，使用chrome.storage
            // chrome.storage在插件中作用全局, 但是存储是有限制的
            // TODO 存储达到最大限制后需要处理
            for(let key in reqPrefix) {
                if (details.url.indexOf(key) !== -1) {
                    chrome.storage.local.get('jdl-access-records', function (result) {
                            if(result['jdl-access-records']){
                                if (result['jdl-access-records'].indexOf(details.url) === -1){
                                    result['jdl-access-records'].push(details.url);
                                    chrome.storage.local.set({'jdl-access-records': result['jdl-access-records']})
                                }
                            }else{
                                chrome.storage.local.set({'jdl-access-records':[details.url]})
                            }
                    })
                }
            }


            // chrome.storage.local.getBytesInUse('jdl-access-records', function(bytes){
            // });
        }
    },
    {urls:["<all_urls>"]},  //监听页面请求,你也可以通过*来匹配。
    ["blocking"]
);


chrome.runtime.onMessage.addListener(function(request, sender, sendResponse)
{
    // var response = request;
    // var user_name = response.user_name;
    // var htmlobj = JSON.parse(response.org);
    // var ajax_url = response.url;
    // $.ajax({
    //     url: ajax_url + "judingli/plugin/newSoftUser",
    //     contentType:"application/json",
    //     type:"post",
    //     data:JSON.stringify({
    //         "userName": user_name
    //     }),
    //     success: function (res) {
    //         //绑定关系
    //         var send_data = {"userName":user_name};
    //         if(htmlobj["userIdAgent"] != "null"){
    //             send_data["userIdAgent"] = parseInt(htmlobj["userIdAgent"])
    //         }
    //         if(htmlobj["userIdOrg"] != "null"){
    //             send_data["userIdOrg"] = parseInt(htmlobj["userIdOrg"])
    //         }
    //         $.ajax({
    //             url: ajax_url + "judingli/plugin/binding",
    //             contentType:"application/json",
    //             type:"post",
    //             data:JSON.stringify(send_data),
    //             success: function (res) {
    //                 //判断是否内测用户
    //                 $.ajax({
    //                     url: ajax_url + "judingli/plugin/isTestUser",
    //                     contentType:"application/json",
    //                     type:"post",
    //                     data:JSON.stringify({
    //                         "userName": user_name
    //                     }),
    //                     success: function (res) {
    //                         // sendResponse(JSON.stringify({"cmd":"finish","result":res.data.result}));
    //                         sendMessageToContentScript({cmd:'finish',result:res.data.result}, function(response)
    //                         {
    //                             console.log('来自content的回复：'+response);
    //                         });
    //                     }});
    //             }
    //         });
    //     }});
});

