(function($) {
	if ( $ !== jQuery ) {
		throw new Error("jQuery is not connected"); 
	}

	if( ! $.cookie ) {
		throw new Error("jQuery.cookie is not connected");
	}

	/* var */ $cookie = $.cookie, //store original cookie
		refresh_interval = 1000, //to refresh every 100 ms
		change_callbacks = {},
		change_vals = {};
	
	CookieStorage = $.cookie = function() {
		var args = Array.prototype.slice.call(arguments);

		if(args.length >= 2) {
			//the setter case
			var cookie_name = args[0],
				old_val = $cookie.call($, cookie_name),
				new_val = args[1];

				old_val != new_val && change_trigger(cookie_name, old_val, new_val); 
		}

		return $cookie.apply($, args);
	}

	$.extend(CookieStorage, $cookie);


	CookieStorage.onchange = function (cookie_name, callback, context) {
		var cookie_callbacks = change_callbacks[cookie_name] = change_callbacks[cookie_name] || [];

		cookie_callbacks.push({
			callback: callback,
			context: context || null,
		});

		//store cookie val
		change_vals[cookie_name] = $cookie.call($, cookie_name);
	}


	/* intern functions */
	function check_cookie() {
		var cookie_name, old_val, new_val;
		for(cookie_name in change_vals) {
			old_val = change_vals[cookie_name];
			new_val = $cookie.call($, cookie_name);
			old_val != new_val && change_trigger(cookie_name, old_val, new_val);
		};
	}

	setInterval(check_cookie, refresh_interval);

	function change_trigger(cookie_name, old_val, new_val) {
		if( ! (change_callbacks[cookie_name] instanceof Array) ) {
			return;
		};  

		change_vals[cookie_name] = new_val;

		var eve = {
			name: cookie_name,
			old : old_val,
			new : new_val,
		};

		
		$(change_callbacks[cookie_name]).each(function(_, record) {
			record.callback.call(record.context, eve);
		});
	}

	CookieStorage.offchange = function(cookie_name, callback, context) {
		var callbacks = change_callbacks[cookie_name];
		if( ! callbacks ) {
			return ;
		}

		if( ! callback ) {
			//remove all listeners for this cookie
			callbacks.splice(0);
			return;
		}

		context = context || null;

		if( ! $.isFunction(callback)) {
			throw new Error("callback must be a function");
		}

		var i;
		for( i in change_callbacks[cookie_name] ) {
			if(callbacks[i].callback === callback && callbacks[i].context === context) {
				callbacks.splice(i, 1);
			}
		}
	}

})(jQuery)
