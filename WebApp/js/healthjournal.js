
var 
   diabeticHealthTracker={// stub singleton for adding all health Journal objects to
   // Project ID is required for communication with the API.     
   projectID:"154f9499-10a6-4363-9273-74025d4888b3" ,
   newQuery:function(){
       return new eta.query.builder(diabeticHealthTracker.projectID);
   
   }
   ,math:{
       round2dp:function(value){
        return Math.round(value * 100)/100;
       }
   }
}; 

function initDHTGoogleAuth(){
    // when publishing outside ETA, we need a proper client id for the domain.
    var clientId = null;
    if (window.location.hostname.toLowerCase() != 'entertheapi.azurewebsites.net')
      clientId = "812872826457-qh6dibaegvrvpm3hs316i0hb0kpjr18g.apps.googleusercontent.com";

    initGoogleAuth(clientId);
}