function showSrc(callback) {
	var Ajax = function (url) {
		var Request = function () {
			var self = this;

			self.onDone = function() {};
			self.onFail = function() {};

			self.options = {
				method : "get"
			};

			self.options.url = url;

			self.done = function (callback) {
				self.onDone = callback;
			};

			self.fail = function (callback) {
				self.onFail = callback;
			};

			self.req = new XMLHttpRequest();

			self.req.open(self.options.method, self.options.url, true);

			self.req.onreadystatechange = function () {
				if (self.req.readyState !== 4) { return; }
				if (self.req.status !== 200 && self.req.status !== 304) { self.onFail(self.req.status); }
				else { self.onDone(self.req.responseText); }
			};

			self.req.send();
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

	var getSource = function(element) {
		new Ajax(element.src).done(function (data) {
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
	};

	var elems = getElementsByAttribute("data-showsrc", null, document.body, "script");
	var done = 0;
	for(var e = 0, len = elems.length; e < len; e += 1) {
		var element = elems[e];
		getSource(element);
	}

	var checkDone = function() {
		if (done === elems.length) {
			if (callback !== undefined) {
				callback();
			}
		}
	}
};
