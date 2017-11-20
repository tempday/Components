~function(e, t) {
    function s(e, t) {
        return new s.fun.init(e, t);
    }
    function i(e) {
        var t = "";
        for (var s in e) t += s + "=" + e[s] + "&";
        return t = t.replace(/&+$/, "");
    }
    function n(e) {
        var t = {
            type: "get",
            url: "",
            async: !0,
            cache: !1,
            data: {},
            success: function() {},
            beforeSend: function() {},
            complete: function() {}
        };
        e = e || {};
        for (var s in t) t[s] = void 0 === e[s] ? t[s] : e[s];
        return t;
    }
    s.fun = {
        name: "document manipulation set",
        init: function(e, t) {
            this.elems = [], this.count = 0, this.tempElems = [], this.isChaining = !1, this.parent = null, 
            this.children = [], this.source = [], this.elemStack = [], this.getElems(e, t);
        },
        getElems: function(e, i) {
            if (this.elems = [], "string" == typeof i && (i = this.getElems(i).elems[0]), this.elems = [], 
            i && 1 === i.nodeType || (i && 1 !== i.nodeType && 9 !== i.nodeType && console.error("Docms tips:getElems() invalid origin"), 
            i = t), void 0 == e || "" == e) return this;
            if ("object" == typeof e) e instanceof s.fun.init ? this.elems = e.elems : 1 === e.nodeType || 9 === e.nodeType ? this.elems[0] = e : e.length > 0 && (this.elems = e); else {
                if ("string" != typeof e) return this;
                if (/^#[^\s\.\#]+$/.test(e) && t.getElementById(e.replace("#", "")) && (this.elems[0] = t.getElementById(e.replace("#", ""))), 
                /^!?[A-z]+[1-6]?$|^\*$/.test(e) && (this.elems = i.getElementsByTagName(e)), /^([A-z]+[1-6]?)?\.[^\s]+$/.test(e)) {
                    var n, l, r = e.match(/^([A-z]+[1-6]?)|\.|[^\s\.]+$/g);
                    if (3 == r.length) {
                        n = i.getElementsByTagName(r[0]), l = s.regOfIndStr(r[2]);
                        for (h = 0; h < n.length; h++) l.test(n[h].className) && this.elems.push(n[h]);
                    } else if (2 == r.length) if (t.getElementsByClassName) this.elems = i.getElementsByClassName(r[1]); else {
                        n = i.getElementsByTagName("*"), l = s.regOfIndStr(r[1]);
                        for (var h = 0; h < n.length; h++) l.test(n[h].className) && this.elems.push(n[h]);
                    }
                }
            }
            return this.resetElems(), this;
        },
        resetElems: function(e) {
            if (e && (this.elems = e), this.count > this.elems.length) for (t = 0; t < this.count - this.elems.length; t++) delete this[this.count - 1 - t];
            this.count = this.elems.length;
            try {
                this.elems = Array.prototype.slice.call(this.elems);
                for (t = 0; t < this.elems.length; this[t] = this.elems[t++]) ;
            } catch (e) {
                for (var t = 0, s = []; t < this.elems.length; t++) this[t] = this.elems[t], s.push(this.elems[t]);
                this.elems = s, s = null;
            }
            this.elems[0] ? (this.parent = this.elems[0].parentNode, this.children = this.elems[0].children) : (this.parent = null, 
            this.children = []);
        },
        getByAttr: function(e, i, n) {
            this.isChaining ? this.tempElems = this.elems : this.tempElems = this.source = this.elems, 
            this.isChaining = !0, i = i || "";
            var l, r = this.elems[0] || t, h = [], o = s.regOfIndStr(i), m = [], c = [];
            n = n || "*", h = s.fun.getElems(n, r).elems;
            for (var a = 0; a < h.length; a++) (l = "class" == e ? h[a].className : h[a].getAttribute(e)) && ((l = l.replace(/^\s*|\s*$/g, "")) && m.push(h[a]), 
            "class" == e ? i && o.test(l) && c.push(h[a]) : l == i && c.push(h[a]));
            return i ? this.resetElems(c) : this.resetElems(m), this;
        },
        addClass: function(e) {
            if (this.elems.length) for (var t = 0; t < this.elems.length; t++) this.elems[t].className = "" == this.elems[t].className ? e : this.elems[t].className + " " + e;
            return this;
        },
        removeClass: function(e) {
            var t = s.regOfIndStr(e, "g");
            if (this.elems.length) for (var i = 0; i < this.elems.length; i++) this.elems[i].className = this.elems[i].className.replace(t, "").replace(/^\s*|\s*$/g, "");
            return this;
        },
        addEvent: function(e, t, s) {
            if (s = s || !1, this.elems.length) for (var i = 0; i < this.elems.length; i++) this.elems[i].addEventListener ? this.elems[i].addEventListener(e, t, s) : this.elems[i].attachEvent && this.elems[i].attachEvent("on" + e, t);
        },
        isElems: function() {},
        fetch: function(e) {
            if (void 0 == e || e >= this.elems.length) throw new RangeError("Docms tips:fetch() n is out of index.");
            return this.isChaining ? this.tempElems = this.elems : this.tempElems = this.source = this.elems, 
            this.elems = [], this.elems[0] = this.isChaining ? this.tempElems[e] : this.source[e], 
            this.isChaining = !0, this.resetElems(), this;
        },
        sup: function(e) {
            if (!this.elems.length) return this;
            this.isChaining ? this.tempElems = this.elems : this.tempElems = this.source = this.elems, 
            this.elems = [], this.elems[0] = this.isChaining ? this.tempElems[0] : this.source[0], 
            this.isChaining = !0, e = e || 0;
            do {
                this.elems[0] = this.elems[0].parentNode;
            } while (e--);
            return this.resetElems(), this;
        },
        sub: function(e) {
            return this.elems.length ? (this.isChaining ? this.tempElems = this.elems : this.tempElems = this.source = this.elems, 
            "string" == typeof e && e ? this.elems = s.elemsFilter(this.elems[0].children, e) : "number" == typeof e ? (this.elems = [], 
            this.elems[0] = this.tempElems[0].children[e]) : this.elems = this.elems[0].children, 
            this.isChaining = !0, this.resetElems(), this) : this;
        },
        all: function(e, t) {
            if (!this.elems.length) return this;
            if (arguments.length) for (var i = 0, n = "", l = !1; i < arguments.length; i++) "string" == typeof arguments[i] && (n = arguments[i]), 
            "boolean" == typeof arguments[i] && (l = arguments[i]);
            e = n, t = l, this.isChaining ? this.tempElems = this.elems : this.tempElems = this.source = this.elems, 
            this.isChaining = !0;
            for (var r, h = [], i = 0; i < this.elems.length; i++) r = [], r = this.elems[i].getElementsByTagName("*"), 
            e && (r = s.elemsFilter(r, e)), e || (r = s.arrConvert(r)), h = h.concat(r);
            return t && (h = this.elems.concat(h)), this.elems = h, this.resetElems(), this;
        },
        me: function() {
            return this.isChaining && (this.isChaining = !1, this.tempElems = [], this.elems = this.source, 
            this.resetElems()), this;
        },
        hasAttr: function(e, t) {
            if (!this.elems.length) return this;
            this.isChaining = !0, this.tempElems = this.elems, t = t || "";
            for (var i, n = s.regOfIndStr(t), l = [], r = [], h = 0; h < this.elems.length; h++) (i = "class" == e ? this.elems[h].className : this.elems[h].getAttribute(e)) && ((i = i.replace(/^\s*|\s*$/g, "")) && l.push(this.elems[h]), 
            "class" == e ? t && n.test(i) && r.push(this.elems[h]) : i == t && r.push(this.elems[h]));
            return this.elems = [], t ? this.resetElems(r) : this.resetElems(l), this;
        },
        each: function(e) {
            for (var t = 0; t < this.elems.length; t++) this.elems[t].fun = e, this.elems[t].fun(t, this.elems[t]);
            return this;
        },
        css: function(e, t) {
            var s = /height|width|margin|padding|font|left|right|top|bottom/;
            if ("object" == typeof e) {
                for (var i in e) s.test(i) && "number" == typeof e[i] && 0 != e[i] && (e[i] += "px"), 
                "opacity" == i && (this.elems[0].style.filter = "alpha(opacity=" + 100 * e[i] + ")"), 
                this.elems[0].style[i] = e[i];
                return this;
            }
            return t ? "string" == typeof e ? ("opacity" == e && (this.elems[0].style.filter = "alpha(opacity=" + 100 * t + ")"), 
            this.elems[0].style[e] = t, this) : s.test(e) && "number" == typeof t && 0 != t ? (this.elems[0].style[e] = t + "px", 
            this) : void 0 : window.getComputedStyle ? e ? window.getComputedStyle(this.elems[0], null)[e] : window.getComputedStyle(this.elems[0], null) : e ? this.elems[0].currentStyle[e] : this.elems[0].currentStyle;
        },
        height: function(e) {
            return e = e || 0, this.elems[e].offsetHeight;
        },
        width: function(e) {
            return e = e || 0, this.elems[e].offsetWidth;
        },
        html: function(e) {
            return void 0 != e ? (this.elems[0].innerHTML = e, this) : this.elems[0].innerHTML;
        },
        val: function(e) {
            return void 0 != e ? (this.elems[0].value = e, this) : this.elems[0].value;
        }
    }, s.getEventSrc = function(t) {
        t = 1 == t ? t : 0;
        var s = e.event || arguments.callee.caller.arguments[0], i = s.srcElement || s.target;
        return t ? i : s;
    }, s.isArray = function(e) {
        return Array.isArray ? Array.isArray(e) : "[object Array]" === Object.prototype.toString.call(e);
    }, s.regOfIndStr = function(e, t) {
        if (t = t || "", t = t.replace(/\s/g, "").toLowerCase(), /[^gims]/i.test(t)) throw new TypeError("Docms tips:regOfIndStr() Invalid RegExp [" + t + "]");
        return new RegExp("^" + e + "$|^" + e + "(?=\\s)|(?:\\s)" + e + "(?=\\s+)|(?:\\s)" + e + "$", t);
    }, s.query = function(e, s, i) {
        return i = i || !0, s && 1 === s.nodeType || (s && 1 !== s.nodeType && 9 !== s.nodeType && console.error("getElems() error: invalid parentArg"), 
        s = t), i ? s.querySelectorAll(e) : s.querySelector(e);
    }, s.index = function(e) {
        e instanceof s.fun.init && (e = e[0]);
        for (var t = e.parentNode.children, i = 0; i < t.length; i++) if (e == t[i]) return i;
        return -1;
    }, s.getCss = function(e, t) {
        return window.getComputedStyle ? t ? window.getComputedStyle(e, null)[t] : window.getComputedStyle(e, null) : t ? e.currentStyle[t] : e.currentStyle;
    }, s.wTop = function(e) {
        if (e) return window.scrollTo(s.wLeft(), e), s.wTop();
        var t = [];
        return document.documentElement && (t[t.length] = document.documentElement.scrollTop || 0), 
        document.body && (t[t.length] = document.body.scrollTop || 0), t[t.length] = window.scrollY || 0, 
        Math.max.apply(this, t);
    }, s.wLeft = function(e) {
        if (e) return window.scrollTo(e, s.wTop()), s.wLeft();
        var t = [];
        return document.documentElement && (t[t.length] = document.documentElement.scrollLeft || 0), 
        document.body && (t[t.length] = document.body.scrollLeft || 0), t[t.length] = window.scrollX || 0, 
        Math.max.apply(this, t);
    }, s.wHeight = function() {
        return document.documentElement.clientHeight;
    }, s.wWidth = function() {
        return document.documentElement.clientWidth;
    }, s.formatSelector = function(e) {
        if ("string" != typeof e) throw new TypeError("Docms tips:formatSelector()" + e);
        var t = {
            sn: null,
            type: null,
            t: null,
            m: null,
            n: null
        }, s = e.match(/#|\.|([A-z]+[1-6]?)+/g);
        return 1 == s.length ? (t.sn = 0, t.type = "tag", t.t = e.toUpperCase()) : 2 == s.length ? ("#" == s[0] ? (t.sn = 1, 
        t.type = "id") : "." == s[0] && (t.sn = 3, t.type = "class"), t.m = s[0], t.n = s[1]) : 3 == s.length && ("#" == s[1] ? (t.sn = 2, 
        t.type = "id") : "." == s[1] && (t.sn = 4, t.type = "class"), t.t = s[0].toUpperCase(), 
        t.m = s[1], t.n = s[2]), t;
    }, s.elemsFilter = function(e, t) {
        if (e instanceof s.fun.init && (e = e.elems), e.length && "string" == typeof t && t) {
            var i = s.formatSelector(t);
            "class" == i.type && (reg = s.regOfIndStr(i.n));
            for (var n = [], l = 0; l < e.length; l++) {
                if ("id" == i.type && e[l].id == i.n) {
                    n.push(e[l]);
                    break;
                }
                if ("class" == i.type && reg.test(e[l].className)) {
                    if (i.t) {
                        e[l].nodeName == i.t && n.push(e[l]);
                        continue;
                    }
                    n.push(e[l]);
                } else "tag" == i.type && e[l].nodeName == i.t && n.push(e[l]);
            }
            return n;
        }
        return console.info("Docms tips:testElems() invalid elemsArr+exp"), [];
    }, s.arrConvert = function(e) {
        try {
            e = Array.prototype.slice.call(e);
        } catch (i) {
            for (var t = 0, s = []; t < e.length; t++) s[t] = e[t];
            e = s;
        }
        return e;
    }, s.ajax = function(e) {
        e = n(e);
        var t = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("microsoft.XMLHTTP"), s = /post/i.test(e.type);
        e.data = i(e.data), s || (e.url += (e.url.indexOf("?") > -1 ? "&" : "?") + (e.cache ? "" : new Date().getTime() + "=1") + "&" + e.data), 
        t.open(e.type, e.url, e.async), s && t.setRequestHeader("content-type", "application/x-www-form-urlencoded"), 
        "function" == typeof e.beforeSend && e.beforeSend(), t.send(e.data), t.onreadystatechange = function() {
            4 == t.readyState && ("function" == typeof e.complete && e.complete(t.status, t), 
            "function" == typeof e.success && e.success(t.responseText, t));
        };
    }, s.prototype = s.fun, s.fun.init.prototype = s.prototype, DM = e.Docms = s;
}(window, document), Function.prototype.bind || (Function.prototype.bind = function(e) {
    if ("function" != typeof this) throw new TypeError("Function.prototype.bind");
    var t = Array.prototype.slice.call(arguments, 1), s = this, i = function() {}, n = function() {
        return s.apply(this instanceof i && e ? this : e, t.concat(Array.prototype.slice.call(arguments)));
    };
    return i.prototype = this.prototype, n.prototype = new i(), n;
});