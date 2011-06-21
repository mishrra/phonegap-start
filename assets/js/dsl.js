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

