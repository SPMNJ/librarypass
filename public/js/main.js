var url = "";
(function ($) {
    "use strict";
	$.ajaxSetup({
crossDomain: true,
	type: "GET",
	dataType: "jsonp",
});
    /*==================================================================
    [ Focus input ]*/


    /*==================================================================
    [ Validate ]*/
// Bind to the submit event of our form
$(document).on('submit',"#loginForm",function(event){
	event.preventDefault();
    $(".btn-loading").show();
	$(".login-form-btn").hide();
	var id = $("#studentid").val();
	studentid = id;
	$.ajax({
		url: url + "?type=login&id="+id , 		
});

	return false; 
});
$(document).on('submit',"#get-passes",function(event){
	event.preventDefault();
	console.log($(".selected").length)
	console.log($(".has-pass").length)
    $(".btn-loading").show();
	$(".login-form-btn").hide();
	if ($(".selected").length > 0 ){
		if ($(".selected").length == 1 && $(".has-pass").length == 0) {
			$.ajax({
		url: url + "?type=makepass&id="+getCookie("studentid")+"&pass="+$(".selected").attr("id"), 		
});
		}
		else {
			$("#passes-own").hide();
			$("#passes-own").children().remove("li");
			if($(".has-pass").length > 0){
				$(".has-pass").each(function () {
					$("#passes-own").append("<li>"+$(this).find(".block-title").html()+"</li>")
				});
				$("#passes-own").show();
			}
			$("#selected-passes").children().remove("li");
			$(".selected").each(function () {
				$("#selected-passes").append("<li>"+$(this).find(".block-title").html()+"</li>")			
			});
			$("#popup").fadeIn();
			$("#confirm-passes").fadeIn();
		}
	}
	else {
		console.log("ran")
		$("#info").removeClass();
		$("#info").append("<div class='warning'>Please select a pass!</div>");
		$("#info").fadeIn();
		$(".btn-loading").hide();
		$(".login-form-btn").show();
	}
	

	return false; 
});	
	
$(document).on('input','#studentid',function(){
        $('#info').hide();
		$('#info').html("");
        
});
$(document).on('click', ".pass-form-btn",function() {
	$('#info').hide();
	$("#info").html("");
	if (!($(this).parents(".block-content").hasClass("closed")) && !($(this).parents(".block-content").hasClass("has-pass"))){
		if($(this).parents(".block-content").hasClass("selected")){
			$(this).parents(".block-content").removeClass("selected");
		}
		else {
			$(this).parents(".block-content").addClass("selected");
	}
	}
	else if($(this).parents(".block-content").hasClass("has-pass")){
		JsBarcode("#show-pass",$(this).parents(".block-content").attr("pass-id"), {
			displayValue: false
		});
		$("#popup").fadeIn();
		$("#show-pass-container").fadeIn();
	}
});	
	/*==================================================================
    [ Show pass ]*/
$(document).on('click', "#confirm",function() {
	$("#popup").children().fadeOut();
	$("#popup").fadeOut();
	$(".selected").each(function () {
		$.ajax({
		url: url + "?type=makepass&id="+getCookie("studentid")+"&pass="+$(this).attr("id"), 		
		});
	});
});
$(document).on('click',"#cancel",function(){
	$("#popup").children().fadeOut();
	$("#popup").fadeOut();
	$(".btn-loading").hide();
		$(".login-form-btn").show();
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
function logout(){
	setCookie("studentid","",0)
	loadlogin();
}
function loadlogin(){
	$("#content").slideUp(1000, function() {
    	$("#content").parent().append('<div class="content-loading" style="display: none"><img src="images/Rolling-1s-200px.svg" alt="" height="100px" width="100px"></div>');
		$('.content-loading').fadeIn();
		$.ajax({
				url: window.url + "?type=loadpage&page=login" 
		});
	});
}
function loadpasses(){
	$("#content").slideUp(1000, function() {
    	$("#content").parent().append('<div class="content-loading" style="display: none"><img src="images/Rolling-1s-200px.svg" alt="" height="100px" width="100px"></div>');
		$('.content-loading').fadeIn();
		$.ajax({
								url: window.url + "?type=loadpage&page=pass&id=" + getCookie("studentid")  
							})
		
	});
}
function makepass(responce) {
	if (responce.status == 200) {
		var block = responce.message.split(":")[0]
		var pass = responce.message.split(":")[1]
		$("#passes").find("#"+block).removeClass("selected").addClass("has-pass").attr("pass-id",pass).find(".pass-text").html("SHOW PASS");
		$("#info").append("<div class='success'>Pass for Block "+block+" created successfully!</div>");
		$("#info").fadeIn();
				
	}
	else {
		$("#info").append("<div class='warning'>"+responce.message+"</div>")
	}
	$(".btn-loading").hide();
	$(".login-form-btn").show();
}

function loadpage(responce){
	if (responce.status == 200){
		$("#content").html(responce.message);
		setTimeout(function() {
		$(".content-loading").fadeOut().remove();
		$("#content").slideDown(1000);
							  },2000);
	}
}
function login(responce){
	$(".btn-loading").hide();
	$(".login-form-btn").show();
	if(responce.status === 200){
		setCookie("studentid",studentid,1);
		loadpasses();

	}
	else {
		studentid = null;
		$("#info").removeClass();
		$("#info").addClass("warning");
		$('#info').html("<strong>"+responce.message+"</strong>");
		$('#info').fadeIn();
	}
}
