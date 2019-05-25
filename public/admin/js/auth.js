var db = firebase.firestore();
db.settings({
  timestampsInSnapshots: true
});
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
	  db.collection("admins").doc("admins").get().then(function(doc){
	  var data= doc.data()
	  var test = false;
	  for (var i = 0;i < data.email.length; i++){
		  if (user.email == data.email[i]){
			  db.collection("admins").doc("key").get().then(function(doc2) {
				  console.log(doc2.data().key);
				  setCookie("key",doc2.data().key,1);
			  })
			  test = true;
			  break;
			  
		  }
	  }
	  if (!test){
		  firebase.auth().signOut();
		  user.delete();
		 window.location = "https://rv-media-passes.firebaseapp.com"
	  }
	  else {
		  var page = get("page");
		  if(page == undefined){
			  page = "dashboard";
		  }
		  $.ajax({
			  url: window.url+"?type=loadpage&page="+page+"&key="+getCookie("key")
		  });
	  }
	  });
  } else {
    var provider = new firebase.auth.GoogleAuthProvider();
	firebase.auth().signInWithRedirect(provider);
  }
firebase.auth().getRedirectResult().then(function(result) {
  if (result.credential) {
    // This gives you a Google Access Token. You can use it to access the Google API.
    var token = result.credential.accessToken;
    // ...
  }
  // The signed-in user info.
  var user = result.user;
}).catch(function(error) {
  		 window.location = "https://rv-media-passes.firebaseapp.com"

});
});
function get(name){
   if(name=(new RegExp('[?&]'+encodeURIComponent(name)+'=([^&]*)')).exec(location.search))
      return decodeURIComponent(name[1]);
}