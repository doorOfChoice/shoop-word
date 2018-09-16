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

chrome.storage.local.get(null, function(data) {
    highlight(data);
});

