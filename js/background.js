/**
 * 
 * @param {*} params 
 *
 *      word : {
 *          name : string,
 *          ttl : int,
 *          count : int,
 *          createDate : int,
 *          updateDate : int,
 *          urls : {
 *              url : integer,
 *          }
 *      }
 * 用于保存字母到浏览器的缓存中，必要的时候可以同步到服务器
 * 可能会用到params.selectionText
 */
function saveword(params) {
    var key = params.selectionText.toLowerCase();
    var newv = {
        name : key,
        ttl : 0,
        count : 0,
        createDate : Date.parse(new Date()),
        updateDate : Date.parse(new Date()),
        urls : {

        }
    };
    chrome.storage.local.get(null, function (data) {
        var words = data.words;
        if(!words)
            words = {};
        var oldv = words[key];
        if(oldv) {
            oldv.ttl = 0;
            oldv.updateDate = Date.parse(new Date());
        }else {
            oldv = newv;
        }
        words[key] = oldv;
        chrome.storage.local.set({words : words}, function() {
            chrome.notifications.create(null, {
                type: 'basic',
                iconUrl: 'icon.png',
                title: '成功了',
                message: '保存了单词：' + key
            });
        });
    });

}


chrome.contextMenus.create({
    title : "保存 %s",
    contexts : ['selection'],
    onclick : saveword
});


