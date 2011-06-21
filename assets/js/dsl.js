// the app method accepts a fn to invoke on init unobtrusively 
var run = function(application) {
    if (navigator.userAgent.indexOf('Browzr') > -1) {
        // blackberry
        setTimeout(application, 250)	
    } else {
        // attach to deviceready event, which is fired when phonegap is all good to go.
        x$(document).on('deviceready', application, false);
    }
}

// throw our settings into a lawnchair
, store = new Lawnchair({adaptor:'dom'})

// shows id passed
, display = function(id) {
    x$(["#welcome", "#map", "#settings"]).each(function(e, i) {
        var display = '#' + x$(e)[0].id === id ? 'block' : 'none';
        x$(e).css({ 'display':display })
    });
}

// reg a click to [id]_button, displays id (if it exists) and executes callback (if it exists)
, when = function(id, callback) {
    x$(id + '_button').on('touchstart', function () {
        if (x$(id).length > 0)
            display(id);
        if (callback)
            callback.call(this);
		return false;
    });
}

// gets the value of the setting from the ui
, ui = function(setting) {
    var radio = x$('#settings_form')[0][setting];
    for (var i = 0, l = radio.length; i < l; i++) {
        if (radio[i].checked)
            return radio[i].value;
    }
};


function getLocation() {

     // Error callback function telling the user that there was a problem retrieving GPS.

     var fail = function(error){

          if (navigator.notification.activityStop) navigator.notification.activityStop(); // only call this if the function exists as it is iPhone only.

          alert("Failed to get GPS location");

     };

     if(navigator.geolocation) {

          if (navigator.notification.activityStart) navigator.notification.activityStart(); // only call this if the function exists as it is iPhone only.

          // Success callback function that will grab coordinate information and display it in an alert.

          var suc = function(p) {

                if (navigator.notification.activityStop) navigator.notification.activityStop(); // only call this if the function exists as it is iPhone only.

                alert("Latitude:"+p.coords.latitude + " " + p.coords.longitude);

          };

          // Now make the PhoneGap JavaScript API call, passing in success and error callbacks as parameters, respectively.

          navigator.geolocation.getCurrentPosition(suc,fail);

     } else {

          fail();

     }

}




/*
    http://www.JSON.org/json2.js
    2010-03-20

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 ? '0' + n : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date ?
                    'Date(' + this[key] + ')' : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint evil: true, strict: false */

/*members "", "\b", "\t", "\n", "\f", "\r", "\"", JSON, "\\", apply,
    call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (!this.JSON) {
    this.JSON = {};
}

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear()   + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate())      + 'T' +
                 f(this.getUTCHours())     + ':' +
                 f(this.getUTCMinutes())   + ':' +
                 f(this.getUTCSeconds())   + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) ? String(value) : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0 ? '[]' :
                    gap ? '[\n' + gap +
                            partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                          '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    k = rep[i];
                    if (typeof k === 'string') {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (gap ? ': ' : ':') + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0 ? '{}' :
                gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                        mind + '}' : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/.
test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({'': j}, '') : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());


/*
 * PhoneGap is available under *either* the terms of the modified BSD license *or* the
 * MIT License (2008). See http://opensource.org/licenses/alphabetical for full text.
 * 
 * Copyright (c) 2005-2010, Nitobi Software Inc.
 * Copyright (c) 2010, IBM Corporation
 */
var PhoneGap=PhoneGap||(function(){PhoneGap={};PhoneGap.Channel=function(type){this.type=type;this.handlers={};this.guid=0;this.fired=false;this.enabled=true};PhoneGap.Channel.prototype.subscribe=function(f,c,g){if(f==null){return}var func=f;if(typeof c=="object"&&f instanceof Function){func=PhoneGap.close(c,f)}g=g||func.observer_guid||f.observer_guid||this.guid++;func.observer_guid=g;f.observer_guid=g;this.handlers[g]=func;return g};PhoneGap.Channel.prototype.subscribeOnce=function(f,c){var g=null;var _this=this;var m=function(){f.apply(c||null,arguments);_this.unsubscribe(g)};if(this.fired){if(typeof c=="object"&&f instanceof Function){f=PhoneGap.close(c,f)}f.apply(this,this.fireArgs)}else{g=this.subscribe(m)}return g};PhoneGap.Channel.prototype.unsubscribe=function(g){if(g instanceof Function){g=g.observer_guid}this.handlers[g]=null;delete this.handlers[g]};PhoneGap.Channel.prototype.fire=function(e){if(this.enabled){var fail=false;for(var item in this.handlers){var handler=this.handlers[item];if(handler instanceof Function){var rv=(handler.apply(this,arguments)==false);fail=fail||rv}}this.fired=true;this.fireArgs=arguments;return !fail}return true};PhoneGap.Channel.join=function(h,c){var i=c.length;var len=i;var f=function(){if(!(--i)){h()}};for(var j=0;j<len;j++){(!c[j].fired?c[j].subscribeOnce(f):i--)}if(!i){h()}};PhoneGap.onDOMContentLoaded=new PhoneGap.Channel("onDOMContentLoaded");PhoneGap.onNativeReady=new PhoneGap.Channel("onNativeReady");PhoneGap.onPhoneGapInit=new PhoneGap.Channel("onPhoneGapInit");PhoneGap.onPhoneGapReady=new PhoneGap.Channel("onPhoneGapReady");PhoneGap.onPhoneGapInfoReady=new PhoneGap.Channel("onPhoneGapInfoReady");PhoneGap.onResume=new PhoneGap.Channel("onResume");PhoneGap.onPause=new PhoneGap.Channel("onPause");PhoneGap.onDeviceReady=new PhoneGap.Channel("onDeviceReady");PhoneGap.deviceReadyChannelsArray=[PhoneGap.onPhoneGapReady,PhoneGap.onPhoneGapInfoReady];PhoneGap.deviceReadyChannelsMap={};PhoneGap.waitForInitialization=function(feature){var channel;if(feature){channel=new PhoneGap.Channel(feature);PhoneGap.deviceReadyChannelsMap[feature]=channel;PhoneGap.deviceReadyChannelsArray.push(channel)}};PhoneGap.initializationComplete=function(feature){var channel=PhoneGap.deviceReadyChannelsMap[feature];if(channel){channel.fire()}};PhoneGap.Channel.join(function(){PhoneGap.onPhoneGapInit.fire();PhoneGap.onPhoneGapReady.fire();PhoneGap.Channel.join(function(){PhoneGap.onDeviceReady.fire();PhoneGap.onResume.fire()},PhoneGap.deviceReadyChannelsArray)},[PhoneGap.onDOMContentLoaded,PhoneGap.onNativeReady]);document.addEventListener("DOMContentLoaded",function(){PhoneGap.onDOMContentLoaded.fire()},false);PhoneGap.m_document_addEventListener=document.addEventListener;document.addEventListener=function(evt,handler,capture){var e=evt.toLowerCase();if(e=="deviceready"){PhoneGap.onDeviceReady.subscribeOnce(handler)}else{if(e=="resume"){PhoneGap.onResume.subscribe(handler);if(PhoneGap.onResume.fired&&handler instanceof Function){handler()}}else{if(e=="pause"){PhoneGap.onPause.subscribe(handler)}else{PhoneGap.m_document_addEventListener.call(document,evt,handler,capture)}}}};blackberry.app.event.onForeground(function(){PhoneGap.onResume.fire();phonegap.PluginManager.resume()});blackberry.app.event.onBackground(function(){PhoneGap.onPause.fire();phonegap.PluginManager.pause()});blackberry.app.event.onExit(function(){PhoneGap.onPause.fire();phonegap.PluginManager.destroy();blackberry.app.exit()});PhoneGap.addConstructor=function(func){PhoneGap.onPhoneGapInit.subscribeOnce(function(){try{func()}catch(e){if(typeof(debug.log)=="function"){debug.log("Failed to run constructor: "+debug.processMessage(e))}else{alert("Failed to run constructor: "+e.message)}}})};if(!window.plugins){window.plugins={}}PhoneGap.addPlugin=function(name,obj){if(!window.plugins[name]){window.plugins[name]=obj}else{console.log("Plugin "+name+" already exists.")}};PhoneGap.callbackId=0;PhoneGap.callbacks={};PhoneGap.callbackStatus={NO_RESULT:0,OK:1,CLASS_NOT_FOUND_EXCEPTION:2,ILLEGAL_ACCESS_EXCEPTION:3,INSTANTIATION_EXCEPTION:4,MALFORMED_URL_EXCEPTION:5,IO_EXCEPTION:6,INVALID_ACTION:7,JSON_EXCEPTION:8,ERROR:9};PhoneGap.callbackSuccess=function(callbackId,args){if(PhoneGap.callbacks[callbackId]){if(args.status==PhoneGap.callbackStatus.OK){try{if(PhoneGap.callbacks[callbackId].success){PhoneGap.callbacks[callbackId].success(args.message)}}catch(e){console.log("Error in success callback: "+callbackId+" = "+e)}}if(!args.keepCallback){delete PhoneGap.callbacks[callbackId]}}};PhoneGap.callbackError=function(callbackId,args){if(PhoneGap.callbacks[callbackId]){try{if(PhoneGap.callbacks[callbackId].fail){PhoneGap.callbacks[callbackId].fail(args.message)}}catch(e){console.log("Error in error callback: "+callbackId+" = "+e)}if(!args.keepCallback){delete PhoneGap.callbacks[callbackId]}}};PhoneGap.exec=function(success,fail,service,action,args){try{var callbackId=service+PhoneGap.callbackId++;if(success||fail){PhoneGap.callbacks[callbackId]={success:success,fail:fail}}var r=""+phonegap.PluginManager.exec(service,action,callbackId,JSON.stringify(args),true);if(r.length>0){eval("var v="+r+";");if(v.status==PhoneGap.callbackStatus.OK){if(success){try{success(v.message)}catch(e){console.log("Error in success callback: "+callbackId+" = "+e)}if(!v.keepCallback){delete PhoneGap.callbacks[callbackId]}}return v.message}else{if(v.status==PhoneGap.callbackStatus.NO_RESULT){if(!v.keepCallback){delete PhoneGap.callbacks[callbackId]}}else{console.log("Error: Status="+r.status+" Message="+v.message);if(fail){try{fail(v.message)}catch(e){console.log("Error in error callback: "+callbackId+" = "+e)}if(!v.keepCallback){delete PhoneGap.callbacks[callbackId]}}return null}}}}catch(e){console.log("Error: "+e)}};PhoneGap.clone=function(obj){if(!obj){return obj}if(obj instanceof Array){var retVal=new Array();for(var i=0;i<obj.length;++i){retVal.push(PhoneGap.clone(obj[i]))}return retVal}if(obj instanceof Function){return obj}if(!(obj instanceof Object)){return obj}if(obj instanceof Date){return obj}retVal=new Object();for(i in obj){if(!(i in retVal)||retVal[i]!=obj[i]){retVal[i]=PhoneGap.clone(obj[i])}}return retVal};PhoneGap.close=function(context,func,params){if(typeof params==="undefined"){return function(){return func.apply(context,arguments)}}else{return function(){return func.apply(context,params)}}};PhoneGap.createUUID=function(){return PhoneGap.UUIDcreatePart(4)+"-"+PhoneGap.UUIDcreatePart(2)+"-"+PhoneGap.UUIDcreatePart(2)+"-"+PhoneGap.UUIDcreatePart(2)+"-"+PhoneGap.UUIDcreatePart(6)};PhoneGap.UUIDcreatePart=function(length){var uuidpart="";for(var i=0;i<length;i++){var uuidchar=parseInt((Math.random()*256)).toString(16);if(uuidchar.length==1){uuidchar="0"+uuidchar}uuidpart+=uuidchar}return uuidpart};PhoneGap.extend=(function(){var F=function(){};return function(Child,Parent){F.prototype=Parent.prototype;Child.prototype=new F();Child.__super__=Parent.prototype;Child.prototype.constructor=Child}}());return PhoneGap}());if(typeof _nativeReady!=="undefined"){PhoneGap.onNativeReady.fire()}(function(){if(typeof navigator.accelerometer!=="undefined"){return}function Acceleration(x,y,z){this.x=x;this.y=y;this.z=z;this.timestamp=new Date().getTime()}function Accelerometer(){this.lastAcceleration=null;this.timers={}}Accelerometer.prototype.getCurrentAcceleration=function(successCallback,errorCallback,options){if(typeof successCallback!=="function"){console.log("Accelerometer Error: successCallback is not a function");return}if(errorCallback&&(typeof errorCallback!=="function")){console.log("Accelerometer Error: errorCallback is not a function");return}PhoneGap.exec(successCallback,errorCallback,"Accelerometer","getAcceleration",[])};Accelerometer.prototype.watchAcceleration=function(successCallback,errorCallback,options){var frequency=(options!=undefined)?options.frequency:10000;if(typeof successCallback!="function"){console.log("Accelerometer Error: successCallback is not a function");return}if(errorCallback&&(typeof errorCallback!="function")){console.log("Accelerometer Error: errorCallback is not a function");return}PhoneGap.exec(function(timeout){if(timeout<(frequency+10000)){PhoneGap.exec(null,null,"Accelerometer","setTimeout",[frequency+10000])}},function(e){},"Accelerometer","getTimeout",[]);var id=PhoneGap.createUUID();navigator.accelerometer.timers[id]=setInterval(function(){PhoneGap.exec(successCallback,errorCallback,"Accelerometer","getAcceleration",[])},(frequency?frequency:1));return id};Accelerometer.prototype.clearWatch=function(id){if(id&&navigator.accelerometer.timers[id]!=undefined){clearInterval(navigator.accelerometer.timers[id]);delete navigator.accelerometer.timers[id]}};PhoneGap.addConstructor(function(){navigator.accelerometer=new Accelerometer()})}());var Camera=Camera||(function(){var DestinationType={DATA_URL:0,FILE_URI:1};var PictureSourceType={PHOTOLIBRARY:0,CAMERA:1,SAVEDPHOTOALBUM:2};function Camera(){}Camera.prototype.DestinationType=DestinationType;Camera.prototype.PictureSourceType=PictureSourceType;Camera.prototype.getPicture=function(successCallback,errorCallback,options){if(typeof successCallback!="function"){console.log("Camera Error: successCallback is not a function");return}if(errorCallback&&(typeof errorCallback!="function")){console.log("Camera Error: errorCallback is not a function");return}var quality=80;if(options.quality){quality=options.quality}var destinationType=DestinationType.DATA_URL;if(options.destinationType){destinationType=options.destinationType}var sourceType=PictureSourceType.CAMERA;if(typeof options.sourceType=="number"){sourceType=options.sourceType}PhoneGap.exec(successCallback,errorCallback,"Camera","takePicture",[quality,destinationType,sourceType])};PhoneGap.addConstructor(function(){navigator.camera=new Camera()});return{DestinationType:DestinationType,PictureSourceType:PictureSourceType}}());phonegap.Logger.enable();if(typeof console=="undefined"){console={}}console.log=function(msg){phonegap.Logger.log(""+msg)};var ContactError=function(code){this.code=code};ContactError.UNKNOWN_ERROR=0;ContactError.INVALID_ARGUMENT_ERROR=1;ContactError.NOT_FOUND_ERROR=2;ContactError.TIMEOUT_ERROR=3;ContactError.PENDING_OPERATION_ERROR=4;ContactError.IO_ERROR=5;ContactError.NOT_SUPPORTED_ERROR=6;ContactError.PERMISSION_DENIED_ERROR=20;var ContactName=function(formatted,familyName,givenName,middle,prefix,suffix){this.formatted=formatted||null;this.familyName=familyName||null;this.givenName=givenName||null;this.middleName=middle||null;this.honorificPrefix=prefix||null;this.honorificSuffix=suffix||null};var ContactField=function(type,value,pref){this.type=type||null;this.value=value||null;this.pref=pref||false};var ContactAddress=function(formatted,streetAddress,locality,region,postalCode,country){this.formatted=formatted||null;this.streetAddress=streetAddress||null;this.locality=locality||null;this.region=region||null;this.postalCode=postalCode||null;this.country=country||null};var ContactOrganization=function(name,dept,title){this.name=name||null;this.department=dept||null;this.title=title||null};var Contact=Contact||(function(){function Contact(id,displayName,name,nickname,phoneNumbers,emails,addresses,ims,organizations,revision,birthday,gender,note,photos,categories,urls,timezone){this.id=id||null;this.displayName=displayName||null;this.name=name||null;this.nickname=nickname||null;this.phoneNumbers=phoneNumbers||null;this.emails=emails||null;this.addresses=addresses||null;this.ims=ims||null;this.organizations=organizations||null;this.revision=revision||null;this.birthday=birthday||null;this.gender=gender||null;this.note=note||null;this.photos=photos||null;this.categories=categories||null;this.urls=urls||null;this.timezone=timezone}Contact.prototype.save=function(success,fail){try{this.id=saveToDevice(this);if(success){success(this)}}catch(e){console.log("Error saving contact: "+e);if(fail){fail(new ContactError(ContactError.UNKNOWN_ERROR))}}};Contact.prototype.remove=function(success,fail){try{var bbContact=null;if(this.id){bbContact=findByUniqueId(this.id)}if(bbContact){console.log("removing contact: "+bbContact.uid);bbContact.remove();if(success){success(this)}}else{if(fail){fail(new ContactError(ContactError.NOT_FOUND_ERROR))}}}catch(e){console.log("Error removing contact "+this.id+": "+e);if(fail){fail(new ContactError(ContactError.UNKNOWN_ERROR))}}};Contact.prototype.clone=function(){var clonedContact=PhoneGap.clone(this);clonedContact.id=null;return clonedContact};var findByUniqueId=function(uid){if(!uid){return null}var bbContacts=blackberry.pim.Contact.find(new blackberry.find.FilterExpression("uid","==",uid));return bbContacts[0]||null};var saveToDevice=function(contact){if(!contact){return}var bbContact=null;var update=false;if(contact.id){bbContact=findByUniqueId(contact.id)}if(!bbContact){bbContact=new blackberry.pim.Contact()}else{update=true}if(contact.name!==null){if(contact.name.givenName!==null){bbContact.firstName=contact.name.givenName}if(contact.name.familyName!==null){bbContact.lastName=contact.name.familyName}if(contact.name.honorificPrefix!==null){bbContact.title=contact.name.honorificPrefix}}if(contact.displayName!==null){bbContact.user1=contact.displayName}if(contact.note!==null){bbContact.note=contact.note}if(contact.birthday!==null){if(contact.birthday instanceof Date){bbContact.birthday=contact.birthday}else{var bday=contact.birthday.toString();bbContact.birthday=(bday.length>0)?new Date(bday):""}}if(contact.emails&&contact.emails instanceof Array){if(update){bbContact.email1="";bbContact.email2="";bbContact.email3=""}var email=null;for(var i=0;i<contact.emails.length;i+=1){email=contact.emails[i];if(!email||!email.value){continue}if(bbContact.email1===""){bbContact.email1=email.value}else{if(bbContact.email2===""){bbContact.email2=email.value}else{if(bbContact.email3===""){bbContact.email3=email.value}}}}}if(contact.phoneNumbers&&contact.phoneNumbers instanceof Array){if(update){bbContact.homePhone="";bbContact.homePhone2="";bbContact.workPhone="";bbContact.workPhone2="";bbContact.mobilePhone="";bbContact.faxPhone="";bbContact.pagerPhone="";bbContact.otherPhone=""}var type=null;var number=null;for(var i=0;i<contact.phoneNumbers.length;i+=1){if(!contact.phoneNumbers[i]||!contact.phoneNumbers[i].value){continue}type=contact.phoneNumbers[i].type;number=contact.phoneNumbers[i].value;if(type==="home"){if(bbContact.homePhone===""){bbContact.homePhone=number}else{if(bbContact.homePhone2===""){bbContact.homePhone2=number}}}else{if(type==="work"){if(bbContact.workPhone===""){bbContact.workPhone=number}else{if(bbContact.workPhone2===""){bbContact.workPhone2=number}}}else{if(type==="mobile"&&bbContact.mobilePhone===""){bbContact.mobilePhone=number}else{if(type==="fax"&&bbContact.faxPhone===""){bbContact.faxPhone=number}else{if(type==="pager"&&bbContact.pagerPhone===""){bbContact.pagerPhone=number}else{if(bbContact.otherPhone===""){bbContact.otherPhone=number}}}}}}}}if(contact.addresses&&contact.addresses instanceof Array){if(update){bbContact.homeAddress=null;bbContact.workAddress=null}var address=null;var bbHomeAddress=null;var bbWorkAddress=null;for(var i=0;i<contact.addresses.length;i+=1){address=contact.addresses[i];if(!address||address instanceof ContactAddress===false){continue}if(bbHomeAddress===null){bbHomeAddress=createBlackBerryAddress(address);bbContact.homeAddress=bbHomeAddress}else{if(bbWorkAddress===null){bbWorkAddress=createBlackBerryAddress(address);bbContact.workAddress=bbWorkAddress}}}}if(contact.urls&&contact.urls instanceof Array){if(update){bbContact.webpage=""}var url=null;for(var i=0;i<contact.urls.length;i+=1){url=contact.urls[i];if(!url||!url.value){continue}if(bbContact.webpage===""){bbContact.webpage=url.value;break}}}if(contact.organizations&&contact.organizations instanceof Array){if(update){bbContact.company=""}var org=null;for(var i=0;i<contact.organizations.length;i+=1){org=contact.organizations[i];if(!org){continue}if(bbContact.company===""){bbContact.company=org.name||"";bbContact.jobTitle=org.title||"";break}}}if(contact.categories&&contact.categories instanceof Array){bbContact.categories=[];var category=null;for(var i=0;i<contact.categories.length;i+=1){category=contact.categories[i];if(typeof category=="string"){bbContact.categories.push(category)}}}bbContact.save();if(contact.photos&&contact.photos instanceof Array){var photo=null;for(var i=0;i<contact.photos.length;i+=1){photo=contact.photos[i];if(!photo||!photo.value){continue}PhoneGap.exec(function(){},function(e){console.log("Contact.setPicture failed:"+e)},"Contact","setPicture",[bbContact.uid,photo.type,photo.value]);break}}return bbContact.uid};var createBlackBerryAddress=function(address){var bbAddress=new blackberry.pim.Address();if(!address){return bbAddress}bbAddress.address1=address.streetAddress||"";bbAddress.city=address.locality||"";bbAddress.stateProvince=address.region||"";bbAddress.zipPostal=address.postalCode||"";bbAddress.country=address.country||"";return bbAddress};return Contact}());var ContactFindOptions=function(filter,multiple,updatedSince){this.filter=filter||"";this.multiple=multiple||true;this.updatedSince=updatedSince||""};(function(){if(navigator.service&&typeof navigator.service.contacts!=="undefined"){return}var Contacts=function(){};Contacts.prototype.create=function(properties){var contact=new Contact();for(var i in properties){if(contact[i]!=="undefined"){contact[i]=properties[i]}}return contact};Contacts.prototype.find=function(fields,success,fail,options){var numContacts=-1;var filter=null;if(options){if(options.multiple===false){numContacts=1}filter=options.filter}var filterExpression=buildFilterExpression(fields,filter);var bbContacts=blackberry.pim.Contact.find(filterExpression,null,numContacts);var contacts=[];for(var i in bbContacts){if(bbContacts[i]){contacts.push(createContact(bbContacts[i],fields))}}if(success&&success instanceof Function){success(contacts)}else{console.log("Error invoking Contacts.find success callback.")}};var fieldMappings={id:"uid",displayName:"user1",name:["title","firstName","lastName"],"name.formatted":["title","firstName","lastName"],"name.givenName":"firstName","name.familyName":"lastName","name.honorificPrefix":"title",phoneNumbers:["faxPhone","homePhone","homePhone2","mobilePhone","pagerPhone","otherPhone","workPhone","workPhone2"],"phoneNumbers.value":["faxPhone","homePhone","homePhone2","mobilePhone","pagerPhone","otherPhone","workPhone","workPhone2"],emails:["email1","email2","email3"],addresses:["homeAddress.address1","homeAddress.address2","homeAddress.city","homeAddress.stateProvince","homeAddress.zipPostal","homeAddress.country","workAddress.address1","workAddress.address2","workAddress.city","workAddress.stateProvince","workAddress.zipPostal","workAddress.country"],"addresses.formatted":["homeAddress.address1","homeAddress.address2","homeAddress.city","homeAddress.stateProvince","homeAddress.zipPostal","homeAddress.country","workAddress.address1","workAddress.address2","workAddress.city","workAddress.stateProvince","workAddress.zipPostal","workAddress.country"],"addresses.streetAddress":["homeAddress.address1","homeAddress.address2","workAddress.address1","workAddress.address2"],"addresses.locality":["homeAddress.city","workAddress.city"],"addresses.region":["homeAddress.stateProvince","workAddress.stateProvince"],"addresses.country":["homeAddress.country","workAddress.country"],organizations:["company","jobTitle"],"organizations.name":"company","organizations.title":"jobTitle",birthday:"birthday",note:"note",categories:"categories",urls:"webpage","urls.value":"webpage"};var buildFilterExpression=function(fields,filter){if(!filter||filter===""){return null}var ciFilter="";for(var i=0;i<filter.length;i++){ciFilter=ciFilter+"["+filter[i].toLowerCase()+filter[i].toUpperCase()+"]"}filter=".*"+ciFilter+".*";var filterExpression=null;if(fields&&fields instanceof Array){var fe=null;for(var i in fields){if(!fields[i]){continue}var bbFields=fieldMappings[fields[i]];if(!bbFields){continue}for(var j in bbFields){fe=new blackberry.find.FilterExpression(bbFields[j],"REGEX",filter);if(filterExpression===null){filterExpression=fe}else{filterExpression=new blackberry.find.FilterExpression(filterExpression,"OR",fe)}}}}return filterExpression};var createContact=function(bbContact,fields){if(!bbContact){return null}var contact=new Contact(bbContact.uid,bbContact.user1);if(!fields){return contact}for(var i in fields){var field=fields[i];if(!field){continue}if(field.indexOf("name")===0){var formattedName=bbContact.title+" "+bbContact.firstName+" "+bbContact.lastName;contact.name=new ContactName(formattedName,bbContact.lastName,bbContact.firstName,null,bbContact.title,null)}else{if(field.indexOf("phoneNumbers")===0){var phoneNumbers=[];if(bbContact.homePhone){phoneNumbers.push(new ContactField("home",bbContact.homePhone))}if(bbContact.homePhone2){phoneNumbers.push(new ContactField("home",bbContact.homePhone2))}if(bbContact.workPhone){phoneNumbers.push(new ContactField("work",bbContact.workPhone))}if(bbContact.workPhone2){phoneNumbers.push(new ContactField("work",bbContact.workPhone2))}if(bbContact.mobilePhone){phoneNumbers.push(new ContactField("mobile",bbContact.mobilePhone))}if(bbContact.faxPhone){phoneNumbers.push(new ContactField("fax",bbContact.faxPhone))}if(bbContact.pagerPhone){phoneNumbers.push(new ContactField("pager",bbContact.pagerPhone))}if(bbContact.otherPhone){phoneNumbers.push(new ContactField("other",bbContact.otherPhone))}contact.phoneNumbers=phoneNumbers}else{if(field.indexOf("emails")===0){var emails=[];if(bbContact.email1){emails.push(new ContactField(null,bbContact.email1,null))}if(bbContact.email2){emails.push(new ContactField(null,bbContact.email2,null))}if(bbContact.email3){emails.push(new ContactField(null,bbContact.email3,null))}contact.emails=emails}else{if(field.indexOf("addresses")===0){var addresses=[];if(bbContact.homeAddress){addresses.push(createContactAddress(bbContact.homeAddress))}if(bbContact.workAddress){addresses.push(createContactAddress(bbContact.workAddress))}contact.addresses=addresses}else{if(field.indexOf("birthday")===0){contact.birthday=bbContact.birthday}else{if(field.indexOf("note")===0){contact.note=bbContact.note}else{if(field.indexOf("organizations")===0){var organizations=[];if(bbContact.company||bbContact.jobTitle){organizations.push(new ContactOrganization(bbContact.company,null,bbContact.jobTitle))}contact.organizations=organizations}else{if(field.indexOf("categories")===0){contact.categories=bbContact.categories}else{if(field.indexOf("urls")===0){var urls=[];if(bbContact.webpage){urls.push(new ContactField(null,bbContact.webpage))}contact.urls=urls}else{if(field.indexOf("photos")===0){var photos=[];if(bbContact.picture){photos.push(new ContactField("base64",bbContact.picture))}contact.photos=photos}}}}}}}}}}}return contact};var createContactAddress=function(bbAddress){if(!bbAddress||bbAddress instanceof blackberry.pim.Address===false){return null}var address1=bbAddress.address1||"";var address2=bbAddress.address2||"";var streetAddress=address1+", "+address2;var locality=bbAddress.city||"";var region=bbAddress.stateProvince||"";var postalCode=bbAddress.zipPostal||"";var country=bbAddress.country||"";var formatted=streetAddress+", "+locality+", "+region+", "+postalCode+", "+country;return new ContactAddress(formatted,streetAddress,locality,region,postalCode,country)};PhoneGap.addConstructor(function(){if(typeof navigator.service==="undefined"){navigator.service={}}navigator.service.contacts=new Contacts()})}());(function(){function Device(){this.platform=phonegap.device.platform;this.version=blackberry.system.softwareVersion;this.name=blackberry.system.model;this.uuid=phonegap.device.uuid;this.phonegap=phonegap.device.phonegap}PhoneGap.addConstructor(function(){window.device=new Device();if(typeof navigator.device==="undefined"){navigator.device={}}for(var key in window.device){navigator.device[key]=window.device[key]}PhoneGap.onPhoneGapInfoReady.fire()})}());function FileError(){this.code=null}FileError.NOT_FOUND_ERR=1;FileError.SECURITY_ERR=2;FileError.ABORT_ERR=3;FileError.NOT_READABLE_ERR=4;FileError.ENCODING_ERR=5;FileError.NO_MODIFICATION_ALLOWED_ERR=6;FileError.INVALID_STATE_ERR=7;FileError.SYNTAX_ERR=8;FileError.INVALID_MODIFICATION_ERR=9;FileError.QUOTA_EXCEEDED_ERR=10;FileError.TYPE_MISMATCH_ERR=11;FileError.PATH_EXISTS_ERR=12;(function(){if(typeof navigator.fileMgr!=="undefined"){return}function FileMgr(){}FileMgr.prototype.getFreeDiskSpace=function(filePath){return blackberry.io.dir.getFreeSpaceForRoot(filePath)};FileMgr.prototype.testFileExists=function(fullPath){return blackberry.io.file.exists(fullPath)};FileMgr.prototype.testDirectoryExists=function(fullPath){return blackberry.io.dir.exists(fullPath)};FileMgr.prototype.readAsText=function(fileName,encoding,successCallback,errorCallback){PhoneGap.exec(successCallback,errorCallback,"File","readAsText",[fileName,encoding])};FileMgr.prototype.readAsDataURL=function(fileName,successCallback,errorCallback){PhoneGap.exec(successCallback,errorCallback,"File","readAsDataURL",[fileName])};FileMgr.prototype.write=function(fileName,data,position,successCallback,errorCallback){PhoneGap.exec(successCallback,errorCallback,"File","write",[fileName,data,position])};FileMgr.prototype.truncate=function(fileName,size,successCallback,errorCallback){PhoneGap.exec(successCallback,errorCallback,"File","truncate",[fileName,size])};PhoneGap.addConstructor(function(){navigator.fileMgr=new FileMgr()})}());var FileReader=FileReader||(function(){function FileReader(){this.fileName="";this.readyState=0;this.result=null;this.error=null;this.onloadstart=null;this.onprogress=null;this.onload=null;this.onerror=null;this.onloadend=null;this.onabort=null}FileReader.EMPTY=0;FileReader.LOADING=1;FileReader.DONE=2;FileReader.prototype.abort=function(){var event;this.readyState=FileReader.DONE;this.result=null;var error=new FileError();error.code=error.ABORT_ERR;this.error=error;if(typeof this.onerror=="function"){event={type:"error",target:this};this.onerror(event)}if(typeof this.onabort=="function"){event={type:"abort",target:this};this.onabort(event)}if(typeof this.onloadend=="function"){event={type:"loadend",target:this};this.onloadend(event)}};FileReader.prototype.readAsText=function(file,encoding){var event;var enc=encoding?encoding:"UTF-8";this.readyState=FileReader.LOADING;if(typeof this.onloadstart=="function"){event={type:"loadstart",target:this};this.onloadstart(event)}this.fileName=file.fullPath;var me=this;navigator.fileMgr.readAsText(file.fullPath,enc,function(result){if(me.readyState===FileReader.DONE){return}me.result=result;if(typeof me.onload=="function"){event={type:"load",target:me};me.onload(event)}me.readyState=FileReader.DONE;if(typeof me.onloadend=="function"){event={type:"loadend",target:me};me.onloadend(event)}},function(error){if(me.readyState===FileReader.DONE){return}var err=new FileError();err.code=error;me.error=err;me.result=null;if(typeof me.onerror=="function"){event={type:"error",target:me};me.onerror(event)}me.readyState=FileReader.DONE;if(typeof me.onloadend=="function"){event={type:"loadend",target:me};me.onloadend(event)}})};FileReader.prototype.readAsDataURL=function(file){var event;this.readyState=FileReader.LOADING;if(typeof this.onloadstart=="function"){event={type:"loadstart",target:this};this.onloadstart(event)}this.fileName=file.fullPath;var me=this;navigator.fileMgr.readAsDataURL(file.fullPath,function(result){if(me.readyState===FileReader.DONE){return}me.result=result;if(typeof me.onload=="function"){event={type:"load",target:me};me.onload(event)}me.readyState=FileReader.DONE;if(typeof me.onloadend=="function"){event={type:"loadend",target:me};me.onloadend(event)}},function(error){if(me.readyState===FileReader.DONE){return}var err=new FileError();err.code=error;me.error=err;me.result=null;if(typeof me.onerror=="function"){event={type:"error",target:me};me.onerror(event)}me.readyState=FileReader.DONE;if(typeof me.onloadend=="function"){event={type:"loadend",target:me};me.onloadend(event)}})};return FileReader}());var FileWriter=FileWriter||(function(){function FileWriter(file){this.fileName=file.fullPath||null;this.length=file.size||0;this.position=0;this.readyState=0;this.error=null;this.onwritestart=null;this.onprogress=null;this.onwrite=null;this.onwriteend=null;this.onabort=null;this.onerror=null}FileWriter.INIT=0;FileWriter.WRITING=1;FileWriter.DONE=2;FileWriter.prototype.abort=function(){var event;if(this.readyState===FileWriter.DONE||this.readyState===FileWriter.INIT){throw FileError.INVALID_STATE_ERR}var error=new FileError();error.code=error.ABORT_ERR;this.error=error;if(typeof this.onerror=="function"){event={type:"error",target:this};this.onerror(event)}if(typeof this.onabort=="function"){event={type:"abort",target:this};this.onabort(event)}this.readyState=FileWriter.DONE;if(typeof this.writeend=="function"){event={type:"writeend",target:this};this.writeend(event)}};FileWriter.prototype.seek=function(offset){if(this.readyState===FileWriter.WRITING){throw FileError.INVALID_STATE_ERR}if(!offset){return}if(offset>this.length){this.position=this.length}else{if(offset<0){this.position=Math.max(offset+this.length,0)}else{this.position=offset}}};FileWriter.prototype.truncate=function(size){var event;if(this.readyState===FileWriter.WRITING){throw FileError.INVALID_STATE_ERR}this.readyState=FileWriter.WRITING;if(typeof this.onwritestart=="function"){event={type:"writestart",target:this};this.onwritestart(event)}var me=this;navigator.fileMgr.truncate(this.fileName,size,function(result){if(me.readyState===FileWriter.DONE){return}me.length=result;me.position=Math.min(me.position,result);if(typeof me.onwrite=="function"){event={type:"write",target:me};me.onwrite(event)}me.readyState=FileWriter.DONE;if(typeof me.onwriteend=="function"){event={type:"writeend",target:me};me.onwriteend(event)}},function(error){if(me.readyState===FileWriter.DONE){return}var err=new FileError();err.code=error;me.error=err;if(typeof me.onerror=="function"){event={type:"error",target:me};me.onerror(event)}me.readyState=FileWriter.DONE;if(typeof me.onwriteend=="function"){event={type:"writeend",target:me};me.onwriteend(event)}})};FileWriter.prototype.write=function(data){var event;if(this.readyState===FileWriter.WRITING){throw FileError.INVALID_STATE_ERR}this.readyState=FileWriter.WRITING;if(typeof this.onwritestart=="function"){event={type:"writestart",target:this};this.onwritestart(event)}var me=this;navigator.fileMgr.write(this.fileName,data,this.position,function(result){if(me.readyState===FileWriter.DONE){return}me.length=Math.max(me.length,me.position+result);me.position+=result;if(typeof me.onwrite=="function"){event={type:"write",target:me};me.onwrite(event)}me.readyState=FileWriter.DONE;if(typeof me.onwriteend=="function"){event={type:"writeend",target:me};me.onwriteend(event)}},function(error){if(me.readyState===FileWriter.DONE){return}var err=new FileError();err.code=error;me.error=err;if(typeof me.onerror=="function"){event={type:"error",target:me};me.onerror(event)}me.readyState=FileWriter.DONE;if(typeof me.onwriteend=="function"){event={type:"writeend",target:me};me.onwriteend(event)}})};return FileWriter}());var Entry=Entry||(function(){function Entry(entry){if(!(this instanceof Entry)){return new Entry(entry)}this.isFile=(entry&&entry.isFile===true)?true:false;this.isDirectory=(entry&&entry.isDirectory===true)?true:false;this.name=(entry&&entry.name)||"";this.fullPath=(entry&&entry.fullPath)||""}Entry.prototype.getMetadata=function(successCallback,errorCallback){var success=function(lastModified){var metadata=new Metadata();metadata.modificationTime=new Date(lastModified);if(typeof successCallback==="function"){successCallback(metadata)}},fail=function(error){LocalFileSystem.onError(error,errorCallback)};PhoneGap.exec(success,fail,"File","getMetadata",[this.fullPath])};Entry.prototype.moveTo=function(parent,newName,successCallback,errorCallback){var srcPath=this.fullPath,name=newName||this.name,dstPath,success=function(entry){var result;if(entry){result=(entry.isDirectory)?new DirectoryEntry(entry):new FileEntry(entry);try{successCallback(result)}catch(e){console.log("Error invoking callback: "+e)}}else{fail(FileError.NOT_FOUND_ERR)}},fail=function(error){LocalFileSystem.onError(error,errorCallback)};if(!parent){fail(FileError.NOT_FOUND_ERR);return}PhoneGap.exec(success,fail,"File","moveTo",[srcPath,parent.fullPath,name])};Entry.prototype.copyTo=function(parent,newName,successCallback,errorCallback){var srcPath=this.fullPath,name=newName||this.name,success=function(entry){var result;if(entry){result=(entry.isDirectory)?new DirectoryEntry(entry):new FileEntry(entry);try{successCallback(result)}catch(e){console.log("Error invoking callback: "+e)}}else{fail(FileError.NOT_FOUND_ERR)}},fail=function(error){LocalFileSystem.onError(error,errorCallback)};if(!parent){fail(FileError.NOT_FOUND_ERR);return}PhoneGap.exec(success,fail,"File","copyTo",[srcPath,parent.fullPath,name])};Entry.prototype.toURI=function(mimeType,successCallback,errorCallback){return this.fullPath};Entry.prototype.remove=function(successCallback,errorCallback){var path=this.fullPath,contents=[];if(blackberry.io.file.exists(path)){try{blackberry.io.file.deleteFile(path);if(typeof successCallback==="function"){successCallback()}}catch(e){LocalFileSystem.onError(FileError.INVALID_MODIFICATION_ERR,errorCallback)}}else{if(blackberry.io.dir.exists(path)){if(LocalFileSystem.isFileSystemRoot(path)){LocalFileSystem.onError(FileError.NO_MODIFICATION_ALLOWED_ERR,errorCallback)}else{contents=blackberry.io.dir.listFiles(path);if(contents.length!==0){LocalFileSystem.onError(FileError.INVALID_MODIFICATION_ERR,errorCallback)}else{try{blackberry.io.dir.deleteDirectory(path,false);if(typeof successCallback==="function"){successCallback()}}catch(e){LocalFileSystem.onError(FileError.NO_MODIFICATION_ALLOWED_ERR,errorCallback)}}}}else{LocalFileSystem.onError(FileError.NOT_FOUND_ERR,errorCallback)}}};Entry.prototype.getParent=function(successCallback,errorCallback){var that=this;try{window.requestFileSystem(LocalFileSystem.TEMPORARY,0,function(fileSystem){if(fileSystem.root.fullPath===that.fullPath){successCallback(fileSystem.root)}else{window.resolveLocalFileSystemURI(blackberry.io.dir.getParentDirectory(that.fullPath),successCallback,errorCallback)}},function(error){LocalFileSystem.onError(error,errorCallback)})}catch(e){LocalFileSystem.onError(FileError.NOT_FOUND_ERR,errorCallback)}};return Entry}());var DirectoryEntry=DirectoryEntry||(function(){function DirectoryEntry(entry){DirectoryEntry.__super__.constructor.apply(this,arguments)}PhoneGap.extend(DirectoryEntry,Entry);DirectoryEntry.prototype.getFile=function(path,options,successCallback,errorCallback){var create=(options&&options.create===true)?true:false,exclusive=(options&&options.exclusive===true)?true:false,exists,createEntry=function(){var path_parts=path.split("/"),name=path_parts[path_parts.length-1],fileEntry=new FileEntry({name:name,isDirectory:false,isFile:true,fullPath:path});if(typeof successCallback==="function"){successCallback(fileEntry)}};if(!path){LocalFileSystem.onError(FileError.ENCODING_ERR,errorCallback);return}else{if(path.indexOf(this.fullPath)!==0){path=this.fullPath+"/"+path}}try{exists=blackberry.io.file.exists(path)}catch(e){LocalFileSystem.onError(FileError.ENCODING_ERR,errorCallback);return}if(exists){if(create&&exclusive){LocalFileSystem.onError(FileError.PATH_EXISTS_ERR,errorCallback)}else{createEntry()}}else{if(blackberry.io.dir.exists(path)){LocalFileSystem.onError(FileError.TYPE_MISMATCH_ERR,errorCallback)}else{if(create){navigator.fileMgr.write(path,"",0,function(result){createEntry()},function(error){LocalFileSystem.onError(error,errorCallback)})}else{LocalFileSystem.onError(FileError.NOT_FOUND_ERR,errorCallback)}}}};DirectoryEntry.prototype.getDirectory=function(path,options,successCallback,errorCallback){var create=(options&&options.create===true)?true:false,exclusive=(options&&options.exclusive===true)?true:false,exists,createEntry=function(){var path_parts=path.split("/"),name=path_parts[path_parts.length-1],dirEntry=new DirectoryEntry({name:name,isDirectory:true,isFile:false,fullPath:path});if(typeof successCallback==="function"){successCallback(dirEntry)}};if(!path){LocalFileSystem.onError(FileError.ENCODING_ERR,errorCallback);return}else{if(path.indexOf(this.fullPath)!==0){path=this.fullPath+"/"+path}}try{exists=blackberry.io.dir.exists(path)}catch(e){LocalFileSystem.onError(FileError.ENCODING_ERR,errorCallback);return}if(exists){if(create&&exclusive){LocalFileSystem.onError(FileError.PATH_EXISTS_ERR,errorCallback)}else{createEntry()}}else{if(blackberry.io.file.exists(path)){LocalFileSystem.onError(FileError.TYPE_MISMATCH_ERR,errorCallback)}else{if(create){try{var dirPath=path;if(dirPath.substr(-1)!=="/"){dirPath+="/"}blackberry.io.dir.createNewDir(dirPath);createEntry()}catch(e){LocalFileSystem.onError(FileError.NOT_FOUND_ERR,errorCallback)}}else{LocalFileSystem.onError(FileError.NOT_FOUND_ERR,errorCallback)}}}};DirectoryEntry.prototype.removeRecursively=function(successCallback,errorCallback){var path=this.fullPath;if(blackberry.io.dir.exists(path)){if(LocalFileSystem.isFileSystemRoot(path)){LocalFileSystem.onError(FileError.NO_MODIFICATION_ALLOWED_ERR,errorCallback)}else{try{blackberry.io.dir.deleteDirectory(path,true);if(typeof successCallback==="function"){successCallback()}}catch(e){console.log(e);LocalFileSystem.onError(FileError.NO_MODIFICATION_ALLOWED_ERR,errorCallback)}}}else{if(blackberry.io.file.exists(path)){LocalFileSystem.onError(FileError.TYPE_MISMATCH_ERR,errorCallback)}else{LocalFileSystem.onError(FileError.NOT_FOUND_ERR,errorCallback)}}};function DirectoryReader(path){this.path=path||null}DirectoryEntry.prototype.createReader=function(){return new DirectoryReader(this.fullPath)};DirectoryReader.prototype.readEntries=function(successCallback,errorCallback){var path=this.path,createEntries=function(array){var entries,entry,num_entries,i,name,result=[];try{entries=JSON.parse(array)}catch(e){console.log("unable to parse JSON: "+e);LocalFileSystem.onError(FileError.SYNTAX_ERR,errorCallback);return}if(/\/$/.test(path)===false){path+="/"}for(i=0,num_entries=entries.length;i<num_entries;i+=1){name=entries[i];if(/\/$/.test(name)===true){name=name.substring(0,name.length-1);entry=new DirectoryEntry({name:name,fullPath:path+name,isFile:false,isDirectory:true})}else{entry=new FileEntry({name:name,fullPath:path+name,isFile:true,isDirectory:false})}result.push(entry)}try{successCallback(result)}catch(e){console.log("Error invoking callback: "+e)}};if(!blackberry.io.dir.exists(path)){LocalFileSystem.onError(FileError.NOT_FOUND_ERR,errorCallback);return}PhoneGap.exec(createEntries,errorCallback,"File","readEntries",[path])};return DirectoryEntry}());var FileEntry=FileEntry||(function(){function FileEntry(entry){FileEntry.__super__.constructor.apply(this,arguments)}PhoneGap.extend(FileEntry,Entry);FileEntry.prototype.createWriter=function(successCallback,errorCallback){var writer;this.file(function(file){try{writer=new FileWriter(file);successCallback(writer)}catch(e){console.log("Error invoking callback: "+e)}},errorCallback)};FileEntry.prototype.file=function(successCallback,errorCallback){var properties,file;if(blackberry.io.file.exists(this.fullPath)){properties=blackberry.io.file.getFileProperties(this.fullPath);file=new File();file.name=this.name;file.fullPath=this.fullPath;file.type=properties.mimeType;file.lastModifiedDate=properties.dateModified;file.size=properties.size;try{successCallback(file)}catch(e){console.log("Error invoking callback: "+e)}}else{if(blackberry.io.dir.exists(this.fullPath)){LocalFileSystem.onError(FileError.TYPE_MISMATCH_ERR,errorCallback)}else{LocalFileSystem.onError(FileError.NOT_FOUND_ERR,errorCallback)}}};return FileEntry}());function FileSystem(){this.name=null;this.root=null}function Metadata(){this.modificationTime=null}function Flags(create,exclusive){this.create=create||false;this.exclusive=exclusive||false}var File=(function(){function File(){this.name=null;this.fullPath=null;this.type=null;this.lastModifiedDate=null;this.size=0}return File}());var LocalFileSystem=LocalFileSystem||(function(){var LocalFileSystem={TEMPORARY:0,PERSISTENT:1};LocalFileSystem.onError=function(error,errorCallback){var err=new FileError();err.code=error;try{errorCallback(err)}catch(e){console.log("Error invoking callback: "+e)}};LocalFileSystem.isFileSystemRoot=function(path){return PhoneGap.exec(null,null,"File","isFileSystemRoot",[path])};var _requestFileSystem=function(type,size,successCallback,errorCallback){var success=function(file_system){var result;if(file_system){result={name:file_system.name||null};result.root=new DirectoryEntry(file_system.root);try{successCallback(result)}catch(e){console.log("Error invoking callback: "+e)}}else{fail(FileError.NOT_FOUND_ERR)}},fail=function(error){LocalFileSystem.onError(error,errorCallback)};PhoneGap.exec(success,fail,"File","requestFileSystem",[type,size])};var _resolveLocalFileSystemURI=function(uri,successCallback,errorCallback){var success=function(entry){var result;if(entry){result=(entry.isDirectory)?new DirectoryEntry(entry):new FileEntry(entry);try{successCallback(result)}catch(e){console.log("Error invoking callback: "+e)}}else{fail(FileError.NOT_FOUND_ERR)}};var fail=function(error){LocalFileSystem.onError(error,errorCallback)};PhoneGap.exec(success,fail,"File","resolveLocalFileSystemURI",[uri])};PhoneGap.addConstructor(function(){if(typeof window.requestFileSystem==="undefined"){window.requestFileSystem=_requestFileSystem}if(typeof window.resolveLocalFileSystemURI==="undefined"){window.resolveLocalFileSystemURI=_resolveLocalFileSystemURI}});return LocalFileSystem}());function FileUploadOptions(fileKey,fileName,mimeType,params){this.fileKey=fileKey||null;this.fileName=fileName||null;this.mimeType=mimeType||null;this.params=params||null}function FileTransferError(){this.code=null}FileTransferError.FILE_NOT_FOUND_ERR=1;FileTransferError.INVALID_URL_ERR=2;FileTransferError.CONNECTION_ERR=3;var FileTransfer=FileTransfer||(function(){function FileTransfer(){}FileTransfer.prototype.upload=function(filePath,server,successCallback,errorCallback,options){var fileKey=null;var fileName=null;var mimeType=null;var params=null;if(options){fileKey=options.fileKey;fileName=options.fileName;mimeType=options.mimeType;params=options.params}var fail=function(error){var err=new FileTransferError();err.code=error;if(typeof errorCallback==="function"){errorCallback(err)}};PhoneGap.exec(successCallback,fail,"FileTransfer","upload",[filePath,server,fileKey,fileName,mimeType,params])};function FileUploadResult(){this.bytesSent=0;this.responseCode=null;this.response=null}return FileTransfer}());function PositionError(code,message){this.code=code;this.message=message}PositionError.PERMISSION_DENIED=1;PositionError.POSITION_UNAVAILABLE=2;PositionError.TIMEOUT=3;var Geolocation=Geolocation||(function(){function Geolocation(){this.lastPosition=null;this.listeners={}}Geolocation.prototype.getCurrentPosition=function(successCallback,errorCallback,options){var id="global";if(navigator._geo.listeners[id]){console.log("Geolocation Error: Still waiting for previous getCurrentPosition() request.");try{errorCallback(new PositionError(PositionError.TIMEOUT,"Geolocation Error: Still waiting for previous getCurrentPosition() request."))}catch(e){}return}var maximumAge=0;var timeout=3600000;var enableHighAccuracy=false;if(options){if(options.maximumAge&&(options.maximumAge>0)){maximumAge=options.maximumAge}if(options.enableHighAccuracy){enableHighAccuracy=options.enableHighAccuracy}if(options.timeout){timeout=(options.timeout<0)?0:options.timeout}}navigator._geo.listeners[id]={success:successCallback,fail:errorCallback};PhoneGap.exec(null,errorCallback,"Geolocation","getCurrentPosition",[id,maximumAge,timeout,enableHighAccuracy])};Geolocation.prototype.watchPosition=function(successCallback,errorCallback,options){var maximumAge=0;var timeout=10000;var enableHighAccuracy=false;if(options){if(options.maximumAge&&(options.maximumAge>0)){maximumAge=options.maximumAge}if(options.enableHighAccuracy){enableHighAccuracy=options.enableHighAccuracy}if(options.timeout){timeout=(options.timeout<0)?0:options.timeout}}var id=PhoneGap.createUUID();navigator._geo.listeners[id]={success:successCallback,fail:errorCallback};PhoneGap.exec(null,errorCallback,"Geolocation","watchPosition",[id,maximumAge,timeout,enableHighAccuracy]);return id};Geolocation.prototype.success=function(id,result){var p=result.message;var coords=new Coordinates(p.latitude,p.longitude,p.altitude,p.accuracy,p.heading,p.speed,p.alt_accuracy);var loc=new Position(coords,p.timestamp);try{navigator._geo.lastPosition=loc;navigator._geo.listeners[id].success(loc)}catch(e){console.log("Geolocation Error: Error calling success callback function.")}if(id=="global"){delete navigator._geo.listeners.global}};Geolocation.prototype.fail=function(id,result){var code=result.status;var msg=result.message;try{navigator._geo.listeners[id].fail(new PositionError(code,msg))}catch(e){console.log("Geolocation Error: Error calling error callback function.")}if(id=="global"){delete navigator._geo.listeners.global}};Geolocation.prototype.clearWatch=function(id){PhoneGap.exec(null,null,"Geolocation","stop",[id]);delete navigator._geo.listeners[id]};var usingPhoneGap=false;var usePhoneGap=function(){if(usingPhoneGap){return}usingPhoneGap=true;navigator.geolocation.getCurrentPosition=navigator._geo.getCurrentPosition;navigator.geolocation.watchPosition=navigator._geo.watchPosition;navigator.geolocation.clearWatch=navigator._geo.clearWatch;navigator.geolocation.success=navigator._geo.success;navigator.geolocation.fail=navigator._geo.fail};PhoneGap.addConstructor(function(){navigator._geo=new Geolocation();if(typeof navigator.geolocation==="undefined"){navigator.geolocation=navigator._geo;usingPhoneGap=true}});return{usePhoneGap:usePhoneGap}}());function MediaFileDataError(){this.code=0}MediaFileDataError.UNKNOWN_ERROR=0;MediaFileDataError.TIMEOUT_ERROR=1;var MediaFile=MediaFile||(function(){function MediaFile(){MediaFile.__super__.constructor.apply(this,arguments)}PhoneGap.extend(MediaFile,File);function MediaFileData(){this.codecs=null;this.bitrate=0;this.height=0;this.width=0;this.duration=0}MediaFile.prototype.getFormatData=function(successCallback,errorCallback){try{successCallback(new MediaFileData())}catch(e){console.log("Unable to invoke success callback: "+e)}};return MediaFile}());function CaptureError(){this.code=0}CaptureError.CAPTURE_INTERNAL_ERR=0;CaptureError.CAPTURE_APPLICATION_BUSY=1;CaptureError.CAPTURE_INVALID_ARGUMENT=2;CaptureError.CAPTURE_NO_MEDIA_FILES=3;CaptureError.CAPTURE_NOT_SUPPORTED=20;function ConfigurationData(){this.type;this.height=0;this.width=0}function CaptureImageOptions(){this.limit=1;this.mode}function CaptureVideoOptions(){this.limit=1;this.duration;this.mode}function CaptureAudioOptions(){this.limit=1;this.duration;this.mode}(function(){if(navigator.device&&typeof navigator.device.capture!=="undefined"){return}var captureId="navigator.device.capture";function Capture(){var self=this,addCaptureModes=function(type,modes){self[type]=modes;if(typeof self.supportedAudioModes!=="undefined"&&typeof self.supportedImageModes!=="undefined"&&typeof self.supportedVideoModes!=="undefined"){PhoneGap.initializationComplete(captureId)}};PhoneGap.exec(function(modes){addCaptureModes("supportedAudioModes",parseArray(modes))},function(error){console.log("Unable to retrieve supported audio modes: "+error);addCaptureModes("supportedAudioModes",[])},"MediaCapture","getSupportedAudioModes",[]);PhoneGap.exec(function(modes){addCaptureModes("supportedImageModes",parseArray(modes))},function(error){console.log("Unable to retrieve supported image modes: "+error);addCaptureModes("supportedImageModes",[])},"MediaCapture","getSupportedImageModes",[]);PhoneGap.exec(function(modes){addCaptureModes("supportedVideoModes",parseArray(modes))},function(error){console.log("Unable to retrieve supported video modes: "+error);addCaptureModes("supportedVideoModes",[])},"MediaCapture","getSupportedVideoModes",[])}var parseArray=function(array){var result=[];try{result=JSON.parse(array)}catch(e){console.log("unable to parse JSON: "+e);return result}return result};var getMediaFiles=function(array){var mediaFiles=[],file,objs,obj,len,i,j;objs=parseArray(array);for(i=0;len=objs.length,i<len;i+=1){obj=objs[i];file=new MediaFile();for(j in obj){file[j]=obj[j]}mediaFiles.push(file)}return mediaFiles};Capture.onError=function(error,errorCallback){var err=new CaptureError();err.code=error;try{errorCallback(err)}catch(e){console.log("Error invoking callback: "+e)}};Capture.prototype.captureImage=function(successCallback,errorCallback,options){var limit=1,mode=null;if(options){if(typeof options.limit==="number"&&options.limit>limit){limit=options.limit}if(options.mode){mode=options.mode}}PhoneGap.exec(function(mediaFiles){successCallback(getMediaFiles(mediaFiles))},function(error){Capture.onError(error,errorCallback)},"MediaCapture","captureImage",[limit,mode])};Capture.prototype.captureVideo=function(successCallback,errorCallback,options){var limit=1,duration=0,mode=null;if(options){if(typeof options.limit==="number"&&options.limit>limit){limit=options.limit}if(typeof options.duration==="number"&&options.duration>0){duration=options.duration}if(options.mode){mode=options.mode}}PhoneGap.exec(function(mediaFiles){successCallback(getMediaFiles(mediaFiles))},function(error){Capture.onError(error,errorCallback)},"MediaCapture","captureVideo",[limit,duration,mode])};Capture.prototype.captureAudio=function(successCallback,errorCallback,options){var limit=1,duration=0,mode=null;if(options){if(typeof options.limit==="number"&&options.limit>limit){limit=options.limit}if(typeof options.duration==="number"&&options.duration>0){duration=options.duration}if(options.mode){mode=options.mode}}PhoneGap.exec(function(mediaFiles){successCallback(getMediaFiles(mediaFiles))},function(error){Capture.onError(error,errorCallback)},"MediaCapture","captureAudio",[limit,duration,mode])};Capture.prototype.cancelCaptures=function(){PhoneGap.exec(null,null,"MediaCapture","stopCaptures",[])};PhoneGap.addConstructor(function(){PhoneGap.waitForInitialization(captureId);navigator.device.capture=new Capture()})}());NetworkStatus={NOT_REACHABLE:0,REACHABLE_VIA_CARRIER_DATA_NETWORK:1,REACHABLE_VIA_WIFI_NETWORK:2};(function(){if(typeof navigator.network!=="undefined"){return}function Network(){this.lastReachability=null}Network.prototype.isReachable=function(uri,callback,options){var isIpAddress=false;if(options&&options.isIpAddress){isIpAddress=options.isIpAddress}PhoneGap.exec(callback,null,"Network Status","isReachable",[uri,isIpAddress])};PhoneGap.addConstructor(function(){navigator.network=new Network()})}());(function(){if(typeof navigator.notification!=="undefined"){return}function Notification(){}Notification.prototype.alert=function(message,completeCallback,title,buttonLabel){var _title=(title||"Alert");var _buttonLabel=(buttonLabel||"OK");PhoneGap.exec(completeCallback,null,"Notification","alert",[message,_title,_buttonLabel])};Notification.prototype.confirm=function(message,resultCallback,title,buttonLabels){var _title=(title||"Confirm");var _buttonLabels=(buttonLabels||"OK,Cancel");return PhoneGap.exec(resultCallback,null,"Notification","confirm",[message,_title,_buttonLabels])};Notification.prototype.vibrate=function(mills){PhoneGap.exec(null,null,"Notification","vibrate",[mills])};Notification.prototype.beep=function(count){PhoneGap.exec(null,null,"Notification","beep",[count])};PhoneGap.addConstructor(function(){navigator.notification=new Notification()})}());function Coordinates(lat,lng,alt,acc,head,vel,altacc){this.latitude=lat;this.longitude=lng;this.accuracy=acc;this.altitude=alt;this.heading=head;this.speed=vel;this.altitudeAccuracy=(altacc!="undefined")?altacc:null}function Position(coords,timestamp){this.coords=coords;this.timestamp=timestamp};