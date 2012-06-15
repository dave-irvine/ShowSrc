function showSrc(callback) {
    var Ajax = function (opts) {
        var XMLHttpFactories = [
            function () { return new XMLHttpRequest(); },
            function () { return new ActiveXObject("Msxml2.XMLHTTP"); },
            function () { return new ActiveXObject("Msxml3.XMLHTTP"); },
            function () { return new ActiveXObject("Microsoft.XMLHTTP"); }
        ], createXMLHTTPObject = function () {
            var xmlhttp = false, i;
            for (i = 0; i < XMLHttpFactories.length; i++) {
                try {
                    xmlhttp = XMLHttpFactories[i]();
                } catch (e) { xmlhttp = false; }
                if (xmlhttp !== false) { break; }
            }
            return xmlhttp;
        }, forEach = function(a,c) {
            var p;
            for(p in a) {
                if(a.hasOwnProperty(p)) { c(p); }
            }
        }, extend = function (to, from) {
            forEach(from, function(p) { to[p] = from[p]; });
            return to;
        }, queryString = function (obj) {
            var ret = "";
            forEach(obj, function(p) {
                if (ret !== "") { ret += "&"; }
                ret += p + "=" + obj[p];
            });
            return ret;
        }, Request = function () {
            var self = this;

            self.onDone = function() {};
            self.onFail = function() {};

            self.options = {
                method : "get"
            };

            extend(self.options, opts || {});

            self.done = function (callback) {
                self.onDone = callback;
            };

            self.fail = function (callback) {
                self.onFail = callback;
            };

            self.req = createXMLHTTPObject();

            if (self.options.method.toLowerCase() === "get") {
                if(self.options.data !== undefined) { self.options.url += ((self.options.url.indexOf("?") == -1) ? "?" : "&") + queryString(self.options.data); }
            }

            self.req.open(self.options.method, self.options.url, true);

            if (self.options.method.toLowerCase() === "post") {
                self.req.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                var data = "";
                forEach(self.options.data, function(p) {
                    data += p + "=" + self.options.data[p] + "&";
                });
                self.options.data = data.replace(/&+$/, '');
                self.req.setRequestHeader("Content-length", self.options.data.length);
                self.req.setRequestHeader("Connection", "close");
            }

            self.req.onreadystatechange = function () {
                if (self.req.readyState !== 4) { return; }
                if (self.req.status !== 200 && self.req.status !== 304) { self.onFail(self.req.status); }
                else { self.onDone(self.req.responseText); }
            };

            self.req.send(self.options.data);
        };

        return new Request();
    };

/*
	Borrowed from http://snipplr.com/view/28115/getelementsbyattribute/
	No licence attached.
*/
    var getElementsByAttribute = function( attrib, value, context_node, tag ) {
        var nodes = [];
        if ( context_node == null )
            context_node = this;
        if ( tag == null )
            tag = '*';
        var elems = context_node.getElementsByTagName(tag);

        for ( var i = 0; i < elems.length; i += 1 ) {
            if ( value ) {
                if ( elems[i].hasAttribute(attrib) && elems[i].getAttribute(attrib) == value )
                    nodes.push(elems[i]);
            } else {
                if ( elems[i].hasAttribute(attrib) )
                    nodes.push(elems[i]);
            }
        }
        return nodes;
    };

    var elems = getElementsByAttribute("data-showsrc", null, document.body, "script");
    var done = 0;
    for(var e = 0, len = elems.length; e < len; e += 1) {
        var element = elems[e];
        new Ajax({ url : element.src }).done(function (data) {
            var pre = document.createElement('pre');
            pre.innerHTML = data;
            pre.className = "prettyprint";
            pre.style.display = "none";
            element.parentNode.insertBefore(pre, element.nextSibling);
            var button = document.createElement('input');
            button.type = "button";
            button.value = "Show source";
            button.addEventListener('click', function() {
                if (button.value === "Show source") {
                    pre.style.display = "block";
                    button.value = "Hide source";
                }
                else {
                    pre.style.display = "none";
                    button.value = "Show source";
                }
            });
            element.parentNode.insertBefore(button, pre);
            done++;
            checkDone();
        });
    }

    var checkDone = function() {
        if (done === elems.length) {
            if (callback !== undefined) {
                callback();
            }
        }
    }
};
