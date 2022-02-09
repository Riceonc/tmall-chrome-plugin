function loadOptions(o) {
    for (var t = 0; t < o.length; t++) if (location.href.includes(o[t].host)) {
        loadCss(o[t].css.local.map(function (o) {
            return chrome.extension.getURL(o)
        })), loadCss(o[t].css.remote)
        var e = []
        o[t].js.local["in"] && (e = e.concat(o[t].js.local["in"].map(function (o) {
            return chrome.extension.getURL(o)
        }))), o[t].js.remote["in"] && (e = e.concat(o[t].js.remote["in"])), loadJsIn(e)
        var n = []
        o[t].js.local.out && (n = n.concat(o[t].js.local.out.map(function (o) {
            return chrome.extension.getURL(o)
        }))), o[t].js.remote.out && (n = n.concat(o[t].js.remote.out)), loadJsOut(n)
        break
    }
}

function loadCss(o) {
    if (o) for (var t = 0; t < o.length; t++) {
        var e = document.createElement("link")
        e.type = "text/css", e.rel = "stylesheet", e.href = o[t], document.head.appendChild(e)
    }
}

function loadJsIn(o) {
    return o && 0 != o.length ? new Promise(function (t, e) {
        var n = function i(e) {
            var n = o[e], s = document.createElement("script")
            s.type = "text/javascript", s.onload = function () {
                e++, e === o.length ? t() : i(e), this.parentNode.removeChild(this)
            }, s.src = n, s.charset = "UTF-8", document.documentElement.append(s)
            }
        n(0)
    }) : void 0
}

function loadJsOut(urls) {
    urls && Promise.all(urls.map(function (o) {
        return fetch(o).then(function (o) {
            return o.text()
        })
    })).then(function (res) {
        for (var i = 0; i < res.length; i++) {
            eval(res[i])
        }
    })
}

var jsList = [
    {
        "host":"sycm.taobao.com",
        "css":{
            "local":["css/layer.css","css/datatables.min.css","css/colReorder.dataTables.min.css","css/buttons.dataTables.min.css","css/jquery.dad.css"],
            "remote":["https://obs-petplant-server.obs.cn-north-1.myhuaweicloud.com/zsy/init.css"]
        },
        "js":{
            "local":{
                "in":["lib/jquery.min.js","lib/jquery.cookie.js","layer/layer.js","lib/crypto-js.min.js",
                    "lib/datatables.min.js","lib/dataTables.colReorder.min.js",
                    "lib/dataTables.buttons.min.js","lib/jquery.table2excel.min.js",
                   "lib/clipboard.min.js","lib/jquery.dad.min.js","lib/xlsx.core.min.js","lib/jsencrypt.min.js"],
                "out":[]
            },
            "remote":{
                "in":["https://obs-petplant-server.obs.cn-north-1.myhuaweicloud.com/zsy/vendor-core.js"],
                "out":[]
            }

        }
    }
];

loadOptions(jsList);

