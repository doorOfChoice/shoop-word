window.onload = function () {
    var vue = new Vue({
        el: '#vue-main',

        data: {
           isOpenRender : true,
           urls : [{text: "", active: true}]
        },

        created : function() {
            var _self = this;
            chrome.storage.local.get(null, function (r) {
                var result = r.userSettings;
                if(result) {
                    _self.isOpenRender = result.isOpenRender;
                    _self.urls = result.urls;
                }
            });
        },

        methods: {
            openRender : function () {
                this.isOpenRender = !this.isOpenRender;
            },

            appendUrl: function () {
                this.urls.push({text: "", active:true});
            },

            deleteUrl : function (index) {
                this.urls.splice(index, 1);
            },

            activeUrl : function(index) {
                this.urls[index].active =  !this.urls[index].active;
            },

            saveConfig: function () {
                var value = {
                    isOpenRender : this.isOpenRender,
                    urls : this.urls
                };
                chrome.storage.local.set({userSettings: value}, function () {
                    chrome.notifications.create(null, {
                        type: 'basic',
                        iconUrl: 'icon.png',
                        title : "Shoop",
                        message: '配置已保存'
                    });
                });
            },

            clearWords : function () {
                chrome.storage.local.set({words: {}});
            }
        }
    });
};

chrome.storage.local.get(null, function (data) {
    console.log(data);
});