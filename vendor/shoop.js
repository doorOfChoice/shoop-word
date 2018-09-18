function StringBuilder() {
    this.buffer = [];

    this.objType = 520999;

    this.append = function(param) {
        if(param.objType && param.objType === this.objType) {
            for(var i = 0; i < param.buffer.length; ++i) {
                this.buffer.push(param.buffer[i]);
            }
            return;
        }

        for(var i = 0; i < param.length; ++i) {
            this.buffer.push(param[i]);
        }
    };

    this.pop = function() {
        this.buffer.pop();
    };

    this.string = function() {
        return this.buffer.join("");
    };

    this.size = function() {
        return this.buffer.length;
    };

    this.clear = function() {
        this.buffer.splice(0, this.buffer.length);
    };

    this.equal = function(param) {
        if(param.length !== this.size())
            return false;
        for(var i = 0; i < param; ++i) {
            if(this.buffer[i] !== param[i])
                return false;
        }
        return true;
    };
}
/**
 *
 * @param text      源文件
 * @param node      新增节点类型
 * @param clazzname 新增节点类属性，数组 []
 * @param words
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
 * @returns {*}
 */
function conversion(text, node, clazzname, words) {
    //是否在尖锐括号里
    var inAngle   = false;
    //是否在字符串里
    var inString  = false;
    //字符串的分隔符
    var delimiter = '';
    //最终结果
    var buffer    = new StringBuilder();

    /**
     * 判断是否是空白字符
     * @param param
     *      StringBuilder 判断长度是否为0
     *      String        判断是否是空白字符
     * @returns {boolean}
     */
    var isSpace = function(param) {
        if(param.objType)
            return param.size() === 0;
        return param[0] === ' ' || param[0] === '\n' || param[0] === '\t' ;
    };

    /**
     * 判断分隔符
     * @param param
     * @returns {boolean}
     */
    var isDelimiter = function(param) {
        return !param.match(/[a-zA-Z]/);
    };

    /**
     * 构造节点
     * @param isHead 是否构造头
     * @returns {string}
     */
    var combineNode = function(isHead) {
        if(isHead) {
            var r = '<' + node;
            r += ' class="' + clazzname.join(' ') + '">';
            return r;
        }
        return '</' + node + '>';
    };

    /**
     * 判断相等
     * @param i
     * @param str 比较的字符串
     * @returns {boolean}
     */
    var equal = function(i, str) {
        for(var j = i, k = 0; j < i + str.length; ++j, ++k) {
            if(text[j] !== str[k])
                return false;
        }
        return true;
    };

    /**
     * 跳过以head为前缀，tail为后缀的字符串，
     * @param i
     * @param head
     * @param tail
     * @returns 跳过后指向的位置
     */
    var skip = function(i, head, tail) {
        if(equal(i, head)) {
            i += head.length;
            while(!equal(i, tail)) {
                ++i;
            }
            return i + tail.length;
        }
        return i;
    };

    var skipCollections = function (i, collections) {
        for(var j = 0; j < collections.length; j += 2) {
            var i0 = skip(i, collections[j], collections[j + 1]);
            if(i !== i0) {
                return i0;
            }
        }
        return i;
    };

    var coreRun = function() {
        var i = 0;
        var word = new StringBuilder();
        //填充自定义的dom节点
        var fill = function() {
            var exist = words[word.string().toLowerCase()];
            if(exist)
                buffer.append(combineNode(true));
            buffer.append(word);
            if(exist)
                buffer.append(combineNode(false));
            word.clear();
        };

        while(i < text.length) {
            var prev = text[i - 1];
            var cur = text[i];
            var next = text[i + 1];

            //直接复制某些前缀和后缀里面的内容
            var skipIndex = skipCollections(i, ["<!--", "-->","<script", "</script>"]);
            if(skipIndex !== i) {
                buffer.append(text.substring(i, skipIndex));
                i = skipIndex;
                continue;
            }

            buffer.append(cur);
            if(!inString && cur === '<') {
                inAngle = true;
            //fix bug: 需要InAngle，因为如果出现<p>I'm <a class="keyword"></a></p>, 里面有一个单引号，这样的话<a就不会计算入尖括号内
            }else if(inAngle && (cur === '"' || cur === '\'')) {
                if(!inString) {
                    inString = true;
                    delimiter = cur;
                }else {
                    if(cur === delimiter && prev !== "\\") {
                        inString = false;
                    }
                }
            }

            if(!inAngle) {
                if(!isDelimiter(cur)){
                   //如果说不是分隔符，说明就是可以保存的单词，则从buffer中弹出，加入word里面
                   buffer.pop();
                   word.append(cur);
                   //判断后面字符是否是分隔符，是的话将当前单词添加dom
                   if((!next || isDelimiter(next)) && !isSpace(word)) {
                        fill();
                    }
                }
            }
            //判断运行结束
            if(cur === '>' && !inString) {
                inAngle = false;
            }

            ++i;
        }
        return buffer.string();
    };

    
    return coreRun();
}


