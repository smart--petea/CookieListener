CookieListener
==============

CookieListener

CookieListener is intended to add to jquery.cookie the posibility to listen the changes of cookie values. The listen period has a default value equal with 100ms. There are defined the functions:
1. jquery.cookie.onchange(cookie_name, callback, context)
    callback is a function that has only one parameter which is an object with next fields
      a. name - cookie name
      b. old  - old cookie value
      c. new  - new cookie value
2. jquery.cookie.offchange(cookie_name, callback, context)
    a. if callback is setted then the function will remove that callback from the listeners of this cookie name
    b. if callback is not setted then all listeners of this cookie will be removed
3. jquery.cookie.setInterval(period) - set the interval length in ms. By default this value is equal to 100ms.
