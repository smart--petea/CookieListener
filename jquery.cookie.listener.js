(function($) {
	//todo: rewrite removeCookie
	if ( $ !== jQuery ) {
		throw new Error("jQuery is not connected"); 
	}

	if( ! $.cookie ) {
		throw new Error("jQuery.cookie is not connected");
	}

	/* var */ $cookie = $.cookie, //store original cookie
		refresh_interval = 100, //to refresh every 100 ms
		callback_store = {},
		cookie_vals = {};
	
	CookieStorage = $.cookie = function() {
		var args = Array.prototype.slice.call(arguments);

		console.log('args: ', args);

		if(args.length >= 2) {
			//the setter case
			console.log('set cookie');
			var cookie_name = args[0],
				old_val = $cookie.call($, cookie_name),
				new_val = args[1];

				old_val != new_val && change_trigger(cookie_name, old_val, new_val); 
		}

		return $cookie.apply($, args);
	}

	$.extend(CookieStorage, $cookie);

	CookieStorage.trigger = function(cookie_name, event_name, event_obj) {
		if( ! (callback_store[cookie_name] && callback_store[cookie_name][event_name] instanceof Array) ) {
			return;
		};  
		
		$(callback_store[cookie_name][event_name]).each(function(_, record) {
			record.callback.call(record.context, event_obj);
		});
	}

	CookieStorage.on = function(cookie_name, event_name, callback, context) {
		//todo: verify params
		var cookie_callbacks = callback_store[cookie_name] = callback_store[cookie_name] || {};
		var event_callbacks = callback_store[cookie_name][event_name] = callback_store[cookie_name][event_name] || [];

		event_callbacks.push({
			callback: callback,
			context: context || null,
		});

		//store cookie val
		(cookie_name in cookie_vals)  && (cookie_vals[cookie_name] = $cookie.call($, cookie_name));
	}

	CookieStorage.off = function(event_name, callback, context) {
		//todo: must be implemented
		throw new Error('Not implemented');
	}

	/* events name */
	var change_event = "change";

	/* intern functions */
	function check_cookie() {
		console.log('check cookie');
		console.log('cookie vals: ', cookie_vals);
		$(cookie_vals).each(function(cookie_name, old_val) {
			var new_val = $cookie.call($, cookie_name);
			old_val != new_val && change_trigger(cookie_name, old_val, new_val);
		});
	}

	setInterval(check_cookie, refresh_interval);

	function change_trigger(cookie_name, old_val, new_val) {
			console.log('change trigger');
			var eve = {
				type: change_event,
				cookie: {
					name: cookie_name,
					old : old_val,
					new : new_val,
				},
			};

			CookieStorage.trigger(cookie_name, change_event, eve);
	}

})(jQuery)
