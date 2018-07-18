
var 
   diabeticHealthTracker={// stub singleton for adding all health Journal objects to
   // Project ID is required for communication with the API.     
   projectId:"154f9499-10a6-4363-9273-74025d4888b3" ,
             
   newQuery:function(){
       return new eta.query.builder(diabeticHealthTracker.projectId);
   
   }
   ,math:{
       round2dp:function(value){
        return Math.round(value * 100)/100;
       }
   }
}; 

eta.user.activeProject = 'dht_';