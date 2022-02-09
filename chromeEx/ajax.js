// let insertContent ='<script>\n' +
//     '            (function () {\n' +
//     '                var XHR = XMLHttpRequest.prototype;\n' +
//     '                var open = XHR.open;\n' +
//     '                var send = XHR.send;\n' +
//     '                XHR.open = function(method, url) {\n' +
//     '                    this._method = method;\n' +
//     '                    this._url = url;\n' +
//     '                    return open.apply(this, arguments);\n' +
//     '                };\n' +
//     '                XHR.send = function(postData) {\n' +
//     'console.log("xhrUrl:  "+this._url); '+
//     '                    this.addEventListener(\'load\', function() {\n' +
//     '                        if (this._url.toString().indexOf("https://")!==(-1)){\n' +
//     '                            window.postMessage({"responseText":this.responseText,"url":this._url},"*");\n' +
//     '                        }\n' +
//     '                    });\n' +
//     '                    return send.apply(this, arguments);\n' +
//     '                };\n' +
//     '            })();\n' +
//     '            </script>';
// $('html').prepend(insertContent);

