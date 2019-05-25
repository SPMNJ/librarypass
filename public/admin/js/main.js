var url = "https://script.google.com/macros/s/AKfycbzEpsrGBqMCm6Hddm3tSnNQjUmTi1kP7pnNPVzCjg6p/exec";

(function ($) {
    "use strict";
	$.ajaxSetup({
crossDomain: true,
	type: "GET",
	dataType: "jsonp",
});	
})(jQuery);

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires="+d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function loadpage(page){
	$("#loading").hide();
	$("#content").html(page.message);
	run();
}
function loadcontent(responce){
	$("#loading").hide();
	$(responce.selector).html(responce.message);
}