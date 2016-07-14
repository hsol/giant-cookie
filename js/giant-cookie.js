/*
 https://github.com/hsol/giant-cookie
 The MIT License (MIT) Copyright (c) 2016 HansolLim
 */
window.GiantCookie = function(config) {
    var _this = this;
    var pluses = /\+/g;

    var encode = function(s) {return _this.config.raw ? s : escape(s);}
    var decode = function(s) {return _this.config.raw ? s : unescape(s);}
    var stringifyCookieValue = function(value) {return encode(_this.config.json ? JSON.stringify(value) : String(value));}
    var extend = function(a, b){
        for(var key in b)
            if(b.hasOwnProperty(key))
                a[key] = b[key];
        return a;
    };
    function isFunction(functionToCheck) { var getType = {}; return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]'; }
    function parseCookieValue(s) {
        if (s.indexOf('"') === 0)
            s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
        try {
            s = decodeURIComponent(s.replace(pluses, ' '));
            return _this.config.json ? JSON.parse(s) : s;
        } catch(e) {}
    }
    function read(s, converter) {
        var value = _this.config.raw ? s : parseCookieValue(s);
        return isFunction(converter) ? converter(value) : value;
    }

    /**
     * 조건없이 쿠키 지우기
     * remove cookie without option
     *
     * @param string key
     */
    var removeCookie = function(key) {
        var t = new Date();
        t.setMilliseconds(t.getMilliseconds() + (-1 * 864e+5))
        document.cookie = [
            key, '=', '',
            '; expires=' + t
        ].join('');

        var cookies = document.cookie ? document.cookie.split('; ') : [];
        for (var i = 0; i < cookies.length; i++) {
            var parts = cookies[i].split('='),
                name = decode(parts.shift()),
                cookie = parts.join('=');
            if (key === name.substring(name.indexOf(name.split("_")[1]))) {
                document.cookie = [
                    name, '=', '',
                    '; expires=' + t
                ].join('');
            }
        }
    };

    _this.config = extend({json:true, max:4000, defaults:{}}, config);

    /**
     * 조건과 함께 쿠키 생성, 조회
     * set cookie with option and get cookie
     *
     * @param string key
     * @param object value 없을 경우 read
     * @param object option 없을 경우 read
     */
    _this.cookie = function (key, value, options) {
        var options = options || {};
        var cookies = [];
        if (arguments.length > 1 && !isFunction(value)) {
            removeCookie(key);

            var encodeKey = encode(key);
            var encodeValue = stringifyCookieValue(value);
            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setMilliseconds(t.getMilliseconds() + days * 864e+5);
            }
            if(value && encodeValue.length > _this.config.max) {
                for(var i = 0, idx = 0; i < encodeValue.length; i+=_this.config.max){
                    var pair = {}, name = "@"+idx+"_"+encodeKey;
                    pair[name] = encodeValue.slice(i, (++idx)*_this.config.max);
                    cookies.push(pair);
                    document.cookie = [
                        name, '=', pair[name],
                        options.expires ? '; expires=' + options.expires.toUTCString() : '',
                        options.path    ? '; path=' + options.path : '',
                        options.domain  ? '; domain=' + options.domain : '',
                        options.secure  ? '; secure' : ''
                    ].join('');
                }
            } else {
                cookies = document.cookie = [
                    encodeKey, '=', encodeValue,
                    options.expires ? '; expires=' + options.expires.toUTCString() : '',
                    options.path    ? '; path=' + options.path : '',
                    options.domain  ? '; domain=' + options.domain : '',
                    options.secure  ? '; secure' : ''
                ].join('');
            }
            return cookies;
        }

        var isCookieSplit = false;
        var result = key ? [] : {}, cookies = document.cookie ? document.cookie.split('; ') : [], i = 0, l = cookies.length;
        for (; i < l; i++) {
            var parts = cookies[i].split('='),
                name = decode(parts.shift()),
                cookie = parts.join('=');
            if (key === name) {
                try {
                    result = _this.config.json ? JSON.parse(decode(cookie)) : decode(cookie);
                } catch(exception) {
                    result = decode(cookie);
                }
                break;
            }
            if (key === name.substring(name.indexOf(name.split("_")[1]))) {
                result[parseInt(name.split("_")[0].replace("@",""))] = cookie;
                isCookieSplit = true;
            }
            if (!key && cookie !== undefined) {
                result[name] = typeof cookie === "string" ? decode(cookie) : read(cookie);
            }
        }
        if (isCookieSplit)
            result = _this.config.json ? (JSON.parse(decode(result.join("")))) : decode(result.join(""));

        return Array.isArray(result) ? (result.length > 0 ? result : "") : result;
    };

    /**
     * 쿠키 지우기
     * remove cookie
     *
     * @param string key
     */
    _this.removeCookie = function (key) {
        if(typeof _this.cookie(key) === "object" || _this.cookie(key).length > _this.config.max) {
            for(var idx = 0; _this.cookie("@"+idx+"_"+key) != ""; idx++) {
                _this.cookie(("@"+idx+"_"+key), null, { expires: -1 });
            }
        } else {
            _this.cookie(key, null, { expires: -1 });
        }
        return !_this.cookie(key);
    };
};

