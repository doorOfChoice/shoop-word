/**
 * 高亮文本
 * @param data
 */
function highlight(data) {
    var nodes = $("body");
    if(nodes.length) {
        for(var i = 0; i < nodes.length; ++i) {
            var node = $(nodes[i]);
            var html = node.html();
            var r    = conversion(html, 'span', ['shower-f'], data);
            node.html(r);
        }
    }
}

/**
 * 根据设置判断是否渲染
 * @param userSettings
 */
function render(data) {
    var userSettings = data.userSettings;
    var words = data.words;
    if(userSettings) {
        var url = window.location.href;
        if(userSettings.isOpenRender) {
            for(var i = 0; i < userSettings.urls.length; ++i) {
                var active = userSettings.urls[i].active;
                var regexString = userSettings.urls[i].text;
                if(regexString.trim().length !== 0 && active){
                    regexString = '^' + regexString + '$';
                    var regex = new RegExp(regexString);
                    if(regex.test(url)) {
                        return;
                    }
                }

            }
            highlight(words);
        }
    }
}

chrome.storage.local.get(null, function(data) {
    render(data);
});

