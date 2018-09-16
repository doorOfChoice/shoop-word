/**
 * 
 * @param {*} params 
 * 
 * 用于保存字母到浏览器的缓存中，必要的时候可以同步到服务器
 * 可能会用到params.selectionText
 */
function saveword(params) {
    var key = params.selectionText;
    var value = {
        date : Date.parse(new Date()),
        word : key
    };

    chrome.storage.local.set({[key] : value}, function() {
        chrome.notifications.create(null, {
            type: 'basic',
            iconUrl: 'icon.png',
            title: '成功了',
            message: '保存了单词：' + key
        });
    });
}


// function translation(params) {
//     var key = params.selectionText;
//     chrome.storage.local.get(null, function(results) {
//         console.log(results);
//     });
// }

chrome.contextMenus.create({
    title : "保存 %s",
    contexts : ['selection'],
    onclick : saveword
});

// chrome.contextMenus.create({
//     title : "翻译",
//     contexts : ['selection'],
//     onclick : translation
// });

