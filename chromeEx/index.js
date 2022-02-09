/**
 * Created by mr.tie on 2020/6/25.
 */
// chrome extension中不能使用console.log
// 所以，需要通过发送请求给后台脚本的方式来打印日志
const log = (...args) => chrome.extension.sendRequest({
    tabId: chrome.devtools.tabId,
    args
});
// 注册回调，每一个http请求响应后，都触发该回调
chrome.devtools.network.onRequestFinished.addListener(async (...args) => {
    try {
        const [{
            // 请求的类型，查询参数，以及url
            request: { method, queryString, url },

            // 该方法可用于获取响应体
            getContent,
        }] = args;
        if(url.indexOf("https://sycm.taobao.com/mc/v2/mq/mkt/rank/shop/hotsale.json") != -1){
            // log(method, queryString, url);
            // 将callback转为await promise
            // warn: content在getContent回调函数中，而不是getContent的返回值
            const content = await new Promise((res, rej) => getContent(res));
            log(content,"jdl_shop_hotsale");
        }
        if(url.indexOf("https://sycm.taobao.com/mc/v2/mq/mkt/rank/shop/hotsearch.json") != -1){
            // log(method, queryString, url);
            // 将callback转为await promise
            // warn: content在getContent回调函数中，而不是getContent的返回值
            const content = await new Promise((res, rej) => getContent(res));
            log(content,"jdl_shop_hotsearch");
        }

    } catch (err) {
        log(err.stack || err.toString());
    }
});
