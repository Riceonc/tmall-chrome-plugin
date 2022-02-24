const setting = {
    "tmall-table": ["词根总数", "词根"],
    "tmall-table2": ["去重词根", "次数"]
}
var rootClassName = '.jdl-btn-container-modal-tmall-sm'; // 根节点类名
// 用户信息
const user = class User {
    // 构造函数
    constructor() {};
    static userInfoKey = 'tmall_user_info'
    static set(value, timeout=0) {
        const data = {
            oData: value,
            timeout: timeout,
            sTime: new Date().valueOf()
        }
        localStorage.setItem(this.userInfoKey, JSON.stringify(data))
    }
    static get() {
        let storage = JSON.parse(localStorage.getItem(this.userInfoKey))
        if (!storage) {
            return null
        }
        let cTimeStamp = new Date().valueOf()
        if ((cTimeStamp - storage.sTime) > storage.timeout && (Number(storage.timeout) !== 0)) {
            return null
        }
        return storage.oData
    }
    static del() {
        localStorage.removeItem(this.userInfoKey)
    }
}

// 天猫词根分析
function tmallData () {
    const maskSelector = $('#mallSearch')
    if (maskSelector.length) {
        try {
            if (!$('.jdl-btn-container-modal-tmall-sm').length) {
                let breakButtonName = (!localStorage.tamll_breakup_words_status || localStorage.tamll_breakup_words_status === 'finish') ?
                    '词根拆分' : '标题拆分中'
                // let btn = user.get() ? "<div class='jdl-btn user-btn-tmall'>用户信息</div>" :
                //     "<div class='jdl-btn login-btn'>登录</div>"
                let breakBtn = "<div id='break-words-button' class='jdl-btn crawl-btn'>" + breakButtonName + "</div>"
                // 判断是否超时 => 显示按钮
                if (localStorage.break_timeout === "true") {
                    breakBtn = "<div id='continue-break-words' class='jdl-btn crawl-btn'>继续拆分</div>"
                }
                $('#J_CrumbSlideCon').append("<div class='jdl-btn-container-modal-tmall-sm'>" +
                    "<div class='jdl-name' style='min-width: 50px'>操作栏:</div>" +
                    breakBtn +
                    "<div class='jdl-btn hot-btn'>重新拆分</div>" +
                    // btn +
                    "</div>")

                $('#break-words-button').click((e) => {
                    crawlHandler()
                })
                $('.hot-btn').click((e) => {
                    reloadHandler(e)
                })
                $('.login-btn').on('click', () => loginHandler())
                $('.user-btn-tmall').on('click', () => userHandler())
                $('#continue-break-words').on('click', function () {
                    localStorage.bengin_break = new Date().valueOf()
                    localStorage.break_timeout = "false"
                    localStorage.tamll_breakup_words_status = 'breaking'
                })
            }
        } catch (e) {
            layer.closeAll("loading");
        }
    }
    breakWordsContinue()
}

function crawlHandler(finish=false) {
    let html = '<div style="background: #EBEEF3;display: flex;justify-content: space-around">' +
        '<div style="width: 24.73vw">' +
        '<div class="tmall-operate">' +
        '<button id="clear" class="tmall-button-light" style="margin-left: 20px">' +
        '<span>清除所有数据</span>' +
        '</button>' +
        '<div style="display: flex;margin-left: 20px;min-width: 15%">'+
        '<button id="breakup" class="tmall-button-dark"  >' +
        '<span>拆分词根</span>' +
        '</button>'+
        '<button id="edit" class="tmall-button-dark" style="margin-left: 20px;display: none" >' +
        '<span>修改</span>' +
        '</button>'+
        '</div>' +
        '</div>' +
        '<div class="tmall-editor">' +
        '<div class="editor-title">标题</div>' +
        '<div id="title-area" style="height: 630px; background: rgba(255,255,255,1);display: flex">' +
        '<textarea id="index-num" wrap="off" cols="1" disabled></textarea>' +
        '<textarea id="tmall-textarea"   wrap="off"></textarea>'+
        '</div>'+
        '</div>' +
        '</div>' +
        '<div style="width: 41.57vw">' +
            '<div class="tmall-operate" style="justify-content: space-between">' +
                '<div style="display: flex">' +
                    '<button id="copyWords" class="tmall-button-dark" style="margin-left: 20px">复制已拆分词</button>' +
                    '<button id="exportWords" class="tmall-button-light" style="margin-left: 20px">导出已拆分词</button>' +
                '</div>' +
                '<div style="margin-right:20px;color: #0CC79A;font-weight: bold;font-size: 14px;font-family: Segoe UI;display: flex">' +
                    '<span style="min-width: 40px">已拆分词根</span>' +
                    '<div class="breaking-process" style="margin-left: 7px"></div>' +
                '</div>' +
            '</div>' +
            '<div style="padding-top: 10px; padding-bottom: 10px">' +
            '<table id="tmall-table">' +
                '<thead>' +
                '<tr>' +
                    '<th class="tmall-columns">序号</th>' +
                    '<th class="tmall-columns">词根总数</th>' +
                    '<th class="tmall-columns" style="text-align: center">词根</th>' +
                    '</tr>' +
                '</thead>' +
                '</table>' +
            '</div>' +
        '</div>' +
        '<div style="width: 20vw;">' +
            '<div class="tmall-operate">' +
                '<button id="copyNum" class="tmall-button-dark" style="margin-left: 20px">复制去重词根</button>' +
                '<button id="exportNum" class="tmall-button-light" style="margin-left: 20px">导出去重词根</button>' +
            '</div>' +
            '<div style="padding-top: 10px;">' +
            '<table id="tmall-table2">' +
            '<thead id="tmall-table2-t">' +
            '<tr>' +
            '<th class="tmall-columns">去重词根</th>' +
            '<th class="tmall-columns">次数</th>' +
            '</tr>' +
            '</thead>' +
            '</table>' +
            '</div>' +
        '</div>' +
        '</div>'

    var limitWords = ["包邮", "官方"]
    var tmallIndex = layer.open({
        id: 'tmall',
        type: 1,
        skin: 'tmall-layer',
        closeBtn: 1,
        fixed: false,
        title: ['词根分析',"background:white;"],
        shade: 0.5,
        shadeClose: true,
        content: html,
        area: ['90%', '800px'],
        zIndex: layer.zIndex,
        success: () => {
            if (finish) {
                parent.layer.open({
                    title: '提示',
                    content: '词根拆分已完成'
                });
            }
            if (localStorage.tmall_words){
                let titleArray = JSON.parse(localStorage.tmall_words)
                $('#tmall-textarea')[0].value = titleArray.join('\n')
                let num = ""
                if (titleArray.length === 1 && titleArray[0] === "") {
                    titleArray = []
                }
                for (let line in titleArray) {
                    let index = Number(line)+ 1
                    num +=  index + '\n'
                }
                $('#index-num')[0].value = num
            }
            // 标题滚动条同步------------------------------------------------------
            $("#tmall-textarea").scroll(function(){
                $("#index-num").scrollTop($(this).scrollTop()); // 纵向滚动条
            });
            $("#index-num").scroll(function(){
                $("#tmall-textarea").scrollTop($(this).scrollTop());
            });
            // ------------------------------------------------------------------
            $('#tmall-textarea').on('keyup', function () {
                let titleLine = $(this).val().split('\n')
                let num = ""
                if (titleLine.length === 1 && titleLine[0] === "") {
                    titleLine = []
                }
                for (let line in titleLine) {
                    let index = Number(line)+ 1
                    num +=  index + '\n'
                }
                $('#index-num')[0].value = num
            })
            // 监听鼠标粘贴
            $('#tmall-textarea').on({
                paste: function () {
                    setTimeout(() => {
                        let titleLine = $(this).val().split('\n')
                        let num = ""
                        if (titleLine.length === 1 && titleLine[0] === "") {
                            titleLine = []
                        }
                        for (let line in titleLine) {
                            let index = Number(line)+ 1
                            num +=  index + '\n'
                        }
                        $('#index-num')[0].value = num
                    }, 500)
                }
            })
            // ---------------------------表格渲染---------------------------------------
            const breaken_words = localStorage.breaken_words ? JSON.parse(localStorage.breaken_words) : {}
            const tmall_words = localStorage.tmall_words ? JSON.parse(localStorage.tmall_words) : []
            const brokenNum = Object.keys(breaken_words).length ? breaken_words.breakWords.length : 0
            const wordsNum = tmall_words.length
            // let percent = Math.ceil(brokenNum/wordsNum).toFixed(2) * 100 + '%'
            $('.breaking-process').append(
                '<span style="font-weight: 400;margin-left: 8px">' + brokenNum + '/' + wordsNum + '</span>')
            let wordsData = []
            let sumData = []
            let allTitleWords = []
            let allWords = {}
            if (breaken_words.breakWords && breaken_words.breakWords.length) {
                breaken_words.breakWords.forEach((i) => {
                    let h = ''
                    let titleWordsMap = {}
                    // 未拆分出的词根直接显示原标题，计入统计数据
                    if (!i.breakWords.length) {
                        i.breakWords = [i.word]
                    }
                    i.breakWords.forEach(w => {
                        // 统计一个标题的词根
                        if (Object.keys(titleWordsMap).indexOf(w) === -1) {
                            titleWordsMap[w] = 1
                        }
                        h += '<div class="word-tag">' + w + '</div>'
                    })
                    allTitleWords.push(titleWordsMap)
                    // 词根拆分表格数据拼装
                    wordsData.push({
                        num: i.breakWords.length,
                        words: h,
                        wordsList: i.breakWords,
                        title: i.word
                    })
                })
            }
            // 统计每个标题词根出现的次数
            allTitleWords.forEach(item => {
                for (let key in item) {
                    if (Object.keys(allWords).indexOf(key) === -1) {
                        allWords[key] = 1
                    }else {
                        allWords[key] += 1
                    }
                }
            })
            var table = $('#tmall-table').DataTable({
                retrieve: true,
                language: {
                    infoEmpty: "",
                    emptyTable: "表中数据为空",
                },
                autoWidth: true,
                paging: false,
                search: false,
                searching: false,
                ordering: false,
                scrollY: '625px',
                columns: [
                    {data: null,
                        render:function(data,type,row,meta) {
                            return meta.row + 1 +
                                meta.settings._iDisplayStart;
                        },
                        className: 'tmall-cell-index'
                    },
                    {data: "num", className: 'tmall-cell-cg'},
                    {data: "words", className: 'tmall-break-cell'}
                ],
                data: wordsData
            })
            // 设置表格可以横向滚动
            $('.dataTables_scroll')[0].style.overflowX = "auto"
            $('.dataTables_scrollBody')[0].style.overflow = ""
            $('.dataTables_scrollHead')[0].style.overflow = ""
            createBreakWordsCopy('tmall-table', wordsData)
            $('#tmall-table_info')[0].textContent = ''
            $('#tmall-table tbody')[0].childNodes.forEach(item => {
                $(item)[0].style.background = '#ffffff'
            })

            for (let i in allWords) {
                sumData.push({
                    word: i,
                    num: allWords[i]
                })
            }
            var table2 =  $('#tmall-table2').DataTable({
                retrieve: true,
                language: {
                    lengthMenu: "显示行数:_MENU_",
                    info: "",
                    infoEmpty: "",
                    emptyTable: "表中数据为空",
                },
                autoWidth: true,
                paging: false,
                search: false,
                searching: false,
                columnDefs: [{ orderable: false, targets: 0 }],
                scrollY: '625px',
                order: [ 1, 'desc' ],
                columns: [
                    {data: "word",  "width": "50%", className: 'tmall-cell'},
                    {data: "num", className: 'tmall-cell'}
                ],
                data: sumData
            })
            createCopy('tmall-table2', sumData)
            $('#tmall-table2_info')[0].textContent = ''
            $('#tmall-table2 tbody')[0].childNodes.forEach(item => {
                $(item)[0].style.background = '#ffffff'
            })
            // 当文本不符合校验时显示修改按钮 处理事件
            $('#edit').on('click', function () {
                onEditBreakWords()
            })
            // -------------------------------------------------------------------------
            // 拆分词根
            $('#breakup').on('click', function () {
                var allWords = $('#tmall-textarea')[0].value
                if (!allWords) {
                    return layer.open({
                        title: '提示',
                        content: '请添加词根'
                    });
                }
                var wordList = allWords.split('\n')
                // 删除末尾空字符串元素
                !wordList.slice(-1)[0] && wordList.pop()
                if (wordList.length > 51) {
                    return layer.msg('一次最多拆解50个标题，请将需要拆解的标题控制在50个以内')
                }

                let checkFlag = true
                let illegalWords = []
                wordList.forEach(word => {
                    if (word.length > 60) {
                        checkFlag = false
                        illegalWords.push({
                            word: word,
                            class: "title-length"
                        })
                    } else if(limitWords.find(i => {return word.indexOf(i) !== -1})) {
                        checkFlag = false
                        illegalWords.push({
                            word: word,
                            class: "title-limit-words"
                        })
                    } else {
                        illegalWords.push({
                            word: word,
                            class: ""
                        })
                    }

                })
                if (!checkFlag) {
                    $('#tmall-textarea')[0].style.display = "none"
                    let displayHtml = "<div id='display' class='tmall-limit-area' style='overflow-Y:scroll'>"
                    let msg = ''
                    let s_words = limitWords.join(',')
                    illegalWords.forEach(i => {
                        if (i.class === 'title-limit-words') {
                            msg = "红色词根会影响拆分功能，请将红色词根删除，特殊词根包括（"+ s_words +"）"
                        }
                        if (i.class === 'title-length') {
                            msg = "黄色标题字数超过60个，请将标题字数控制在60字以内"
                        }
                        displayHtml += '<p style="min-height: 21px" class="' + i.class + '">'+ i.word || '' +'</p>'
                    })
                    displayHtml += "</div>"
                    $('#title-area').append(displayHtml)
                    $("#display").scroll(function(){
                        $("#index-num").scrollTop($(this).scrollTop()); // 纵向滚动条
                    });
                    $("#index-num").scrollTop(0)
                    // $("#index-num").scroll(function(){
                    //     $("#display").scrollTop($(this).scrollTop());
                    // });
                    $('#breakup').attr({'disabled': 'disabled'})
                    $('#edit')[0].style.display = 'block'
                    return layer.msg(msg)
                }
                localStorage.removeItem('tmall_words')
                localStorage.removeItem('tamll_breakup_words_status')
                localStorage.removeItem('breaken_words')
                localStorage.tmall_words = JSON.stringify(wordList)
                updateBeginBreakWordsTime()
                localStorage.tamll_breakup_words_status = 'breaking'
                // breakWordsContinue(true)
            })
            // 清除词根数据
            $('#clear').on('click', function () {
                $('#tmall-textarea')[0].value = ''
                $('#index-num')[0].value = ''
                onEditBreakWords()
                // $($('.breaking-process')[0].childNodes[0].childNodes[0])[0].style.width = '0.01%'
                $($('.breaking-process')[0].childNodes[0])[0].innerHTML = '0/0'
                table.clear().draw();
                table2.clear().draw();
                localStorage.removeItem('tmall_words')
                localStorage.removeItem('tamll_breakup_words_status')
                localStorage.removeItem('breaken_words')
            })
            // 拆分词
            $('#exportWords').on('click', function () {
                var sheet = XLSX.utils.table_to_sheet($("#export_tmall-table")[0]);
                openDownloadDialog(sheet2blob(sheet), "拆分词导出数据.xlsx");
            })
            $('#exportNum').on('click', function () {
                var sheet = XLSX.utils.table_to_sheet($("#export_tmall-table2")[0]);
                openDownloadDialog(sheet2blob(sheet), "去重词根导出数据.xlsx");
            })
            // 复制拆分
            $('#copyWords').on('click', function () {

                new ClipboardJS($("#clone_tmall-table")[0], {
                    text: function () {
                        return $("#clone_tmall-table").html();
                    },
                });
                $("#clone_tmall-table").click();
                layer.msg("复制成功")
            })
            // 复制统计
            $('#copyNum').on('click', function () {
                new ClipboardJS($("#clone_tmall-table2")[0], {
                    text: function () {
                        return $("#clone_tmall-table2").html();
                    },
                });
                $("#clone_tmall-table2").click();
                layer.msg("复制成功")
            })
        },
        end: () => {
            layer.close(tmallIndex)
        }
    })

}

function reloadHandler() {
    localStorage.removeItem('tmall_words')
    localStorage.removeItem('tamll_breakup_words_status')
    localStorage.removeItem('breaken_words')
    localStorage.break_timeout = "false"
    updateBeginBreakWordsTime()
    crawlHandler()
}

function loginHandler() {
    let localUrl = encodeURI(location.href)
    let html = "<div data-v-216e1476=\"\" class=\"\">" +
        "<iframe data-v-216e1476=\"\" src=\"https://login.taobao.com/member/login.jhtml?style=mini&amp;newMini2=true&amp;enup=0&amp;qrlogin=1&amp;keyLogin=true&amp;sub=true&amp;css_style=hudongcheng&amp;redirectURL="+localUrl+"\" class=\"iframe\" style=\"width: 350px; height: 370px;\"></iframe>" +
        "<div class=\"el-loading-mask\" style=\"display: none;\"><" +
        "div class=\"el-loading-spinner\">" +
        "</div>" +
        "</div>" +
        "</div>"
    layer.open({
        id: 'login',
        type: 1,
        title: ['登录',"background:white;"],
        area: [],
        content: html,
        yes: function () {
            if (!$('#loginName')[0].value) {
                return layer.msg('请输入店铺名称')
            }
            login($('#loginName')[0].value)
        },
        success: () => {
        }
    })
}

function onEditBreakWords() {
    $('#display').remove()
    $('#tmall-textarea')[0].style.display = "block"
    $('#edit')[0].style.display = 'none'
    $('#breakup').removeAttr('disabled')
}
// 随机数字字符串
function randomStr(len=10) {
    var chars = '0123456789'
    let maxPos = chars.length
    var str = ''
    for (let i = 0; i < len; i ++) {
        str += chars.charAt(Math.floor(Math.random() * maxPos))
    }
    return str
}

// 词根拆分器
/**
 * 函数说明： 词根拆分器是在外层定时器控制下自动运行，切勿自行调用！！！
 * 否则会影响业务数据，造成数据混乱！！！！
 * **/
function breakWordsContinue () {
    if ($('#baxia-punish').length){
        return location.reload()
    }
    const tmallWords = localStorage.tmall_words ? JSON.parse(localStorage.tmall_words) : []
    let storage = localStorage.breaken_words ? JSON.parse(localStorage.breaken_words) : {breakWords:[]}
    let isTimeOut = (new Date().valueOf() - localStorage.bengin_break) > 300000 && tmallWords.length && (storage.breakWords.length !== tmallWords.length) // 距离开始时间大于五分钟则超时
    if (localStorage.tamll_breakup_words_status === 'finish' || !localStorage.tamll_breakup_words_status || isTimeOut){
        if (isTimeOut) {
            $(rootClassName).children().eq(1).replaceWith("<div id='continue-break-words' class='jdl-btn crawl-btn'>继续拆分</div>")
            $('#continue-break-words').on('click', function () {
                localStorage.bengin_break = new Date().valueOf()
                localStorage.break_timeout = "false"
                localStorage.tamll_breakup_words_status = 'breaking'
            })
            localStorage.break_timeout = 'true'
            localStorage.tamll_breakup_words_status = 'finish'
        }else {
            localStorage.break_timeout = 'false'
        }
        if ($('#break-words-button').length) {
            $('#break-words-button')[0].textContent = '词根拆分'
        }
        layer.closeAll("loading");
        return
    }
    layer.load(3,{
        shade: [0.1,'#fff'], //0.1透明度的白色背景
        content:'拆分中...'
    });
    if (tmallWords.length !== storage.breakWords.length) {
        updateBeginBreakWordsTime()
        let item = storage.breakWords[storage.executionIndex]
        let search = item && (item.word + ' ' + item.suffix)
        if (search === $('#mq')[0].value && !item.breakWords.length && $('.nrt em').length) {
            wordsPropEditor(item, storage)
        } else {
            let suffix = randomStr()
            let index = 0
            let word = tmallWords[0]
            if (item) {
                index = item.index + 1
                word =  tmallWords[item.index + 1]
            }
            const broken_words = {
                index: index,
                breakWords: [],
                word: word,
                suffix: suffix // 词根后缀，随机字符串
            }
            storage.breakWords.push(broken_words)
            storage.executionIndex = index
            localStorage.breaken_words = JSON.stringify(storage)
            $('#mq')[0].value = tmallWords[index] + ' ' + suffix
            $('.mallSearch-input button')[0].click()
        }
    }else {
        let item = storage.breakWords[storage.executionIndex]
        wordsPropEditor(item, storage)
        localStorage.tamll_breakup_words_status = 'finish'
        if ( $('#break-words-button').length) {
            $('#break-words-button')[0].textContent = '词根拆分'
        }
        layer.closeAll("loading");
        setTimeout(() =>{
            crawlHandler(true)
        }, 1000)

    }
}

// 词根修改赋值
function wordsPropEditor (item, storage) {
    var words = []
    if ($('.nrt em').length) {
        words = $('.nrt em')[0].firstChild.data.replace(/^“|”/g, '').split(" ")
        // 删除末尾元素空格
        !words.slice(-1)[0] && words.pop()
        // 删除头元素空格
        !words[0] && words.splice(0, 1)
        words.splice(words.findIndex(i => i === item.suffix), 1)
    }
    item.breakWords = words
    localStorage.breaken_words = JSON.stringify(storage)
}

// 创建克隆导出副本
function createCopy (id, data) {
    if ($("#clone_" + id).length > 0) {
        //克隆空间已经存在 清空
        $("#clone_" + id).empty();
    } else {
        $("body").append(
            "<div id='clone_" + id + "' style='display:none;'></div>"
        );
    }
    if ($("#export_" + id).length > 0) {
        //导出空间已经存在 清空
        $("#export_" + id).empty();
    } else {
        $("body").append(
            "<div id='export_" + id + "' style='display:none;'></div>"
        );
    }
    $("#clone_" + id).append("<table><thead></thead><tbody></tbody></table>");
    $("#export_" + id).append(
        "<table><thead></thead><tbody></tbody></table>"
    );
    var copy_table = $("#clone_" + id + " table");
    var export_table = $("#export_" + id + " table");
    copy_table.find("thead").append("<tr></tr>");
    export_table.find("thead").append("<tr></tr>");
    setting[id].forEach(i => {
        copy_table
            .find("thead tr:first")
            .append("<th>" + i + "</th>");
        export_table
            .find("thead tr:first")
            .append("<th>" + i + "</th>");
    })
    for (var i = 0; i < data.length; i++) {
        var copy_tr = "<tr>";
        var export_tr = "<tr>";
        copy_tr += "<td>" + String(Object.values(data[i])[0]) + "</td><td>" + String(Object.values(data[i])[1]) + "</td>";
        export_tr += "<td>" + String(Object.values(data[i])[0]) + "</td><td>" + String(Object.values(data[i])[1]) + "</td>";
        copy_tr += "</tr>";
        export_tr += "</tr>";
        copy_table.find("tbody").append(copy_tr);
        export_table.find("tbody").append(export_tr);
    }
}

// 创建词根克隆导出副本
function createBreakWordsCopy (id, data) {
    let trList = []
    for (let item in data) {
        if(data[item].wordsList.length > trList.length) {
            trList = []
            for (let index in data[item].wordsList) {
                let x = Number(index) + 1
                trList.push("词根" + x)
            }
        }
    }
    trList.splice(0,0,'标题','词根总数')
    if ($("#clone_" + id).length > 0) {
        //克隆空间已经存在 清空
        $("#clone_" + id).empty();
    } else {
        $("body").append(
            "<div id='clone_" + id + "' style='display:none;'></div>"
        );
    }
    if ($("#export_" + id).length > 0) {
        //导出空间已经存在 清空
        $("#export_" + id).empty();
    } else {
        $("body").append(
            "<div id='export_" + id + "' style='display:none;'></div>"
        );
    }
    $("#clone_" + id).append("<table><thead></thead><tbody></tbody></table>");
    $("#export_" + id).append(
        "<table><thead></thead><tbody></tbody></table>"
    );
    var copy_table = $("#clone_" + id + " table");
    var export_table = $("#export_" + id + " table");
    copy_table.find("thead").append("<tr></tr>");
    export_table.find("thead").append("<tr></tr>");

    trList.forEach(i => {
        copy_table
            .find("thead tr:first")
            .append("<th>" + i + "</th>");
        export_table
            .find("thead tr:first")
            .append("<th>" + i + "</th>");
    })
    for (var i = 0; i < data.length; i++) {
        var copy_tr = "<tr>";
        var export_tr = "<tr>";
        copy_tr += "<td>" + data[i]["title"] + "</td><td>" + data[i]["num"] + "</td>";
        for (let j = 0; j < (trList.length -2); j++) {
            copy_tr+= "<td>" + (data[i]["wordsList"][j] || '')+ "</td>"
        }
        export_tr += "<td>" + data[i]["title"] + "</td><td>" + data[i]["num"] + "</td>";
        for (let j = 0; j < (trList.length -2); j++) {
            export_tr+= "<td>" + (data[i]["wordsList"][j] || '')+ "</td>"
        }
        copy_tr += "</tr>";
        export_tr += "</tr>";
        copy_table.find("tbody").append(copy_tr);
        export_table.find("tbody").append(export_tr);
    }
}

function updateBeginBreakWordsTime (){
    return localStorage.bengin_break = new Date().valueOf()
}

// 登录
function login (userName) {
    if (localStorage.zsy_tools) {
        var version = JSON.parse(localStorage.zsy_tools).version
    } else {
        layer.msg("功能异常");
    }
    const data = {
        userName: userName,
        versionNumber:version
    }
    $.ajax({
        url: ajax_url + "judingli/plugin/getSoftUserOfficial",
        contentType: "application/json",
        type: "post",
        // async: false,
        data: JSON.stringify(data),
        success: function (res) {
            if (!res.data) {
                return layer.msg('店铺名不正确')
            }
            if (res.code == 100001) {
                //参数不全
                layer.msg("网络开小差了,请刷新重试");
            }
            let userState = res["data"]["userStatus"];
             if (userState === 5) {
                layer.confirm(
                    "插件版本已经更新,请点击按钮前往下载",
                    {
                        btn: ["前往更新"], //按钮
                    },
                    function () {
                        window.open("http://www.zhishuya.com/download");
                    }
                );
                // resolve(0);
            } else {
                $($(rootClassName)[0].childNodes[3]).remove()
                $(rootClassName).append("<div class='jdl-btn user-btn-tmall'>用户信息</div>")
                $('.user-btn-tmall').click(() => userHandler())
                user.set(JSON.stringify(res["data"]))
                layer.close(layer.index)
            }
        },
    });
}

// 天猫外部登录
function externalLogin () {
    let value;
    if ($.cookie("_nk_")) {
         value = unescape($.cookie("_nk_").replace(/\\/g, "%"))
    } else {
        value = $.cookie('sn')
    }
    if (value) {
        // 切割出的店铺名带有冒号
        let storeName = value.split(":")[0]
        login(storeName)
    }else {
        if (user.get()) {
            user.del()
        }
    }
}
