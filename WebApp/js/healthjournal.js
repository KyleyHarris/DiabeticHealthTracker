
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

//this line is very important for project segregation and should be unique
//throughout the system. use the project PublicName is reccomended
//this is used to prefix login information etc in storage and 
//allows the site to run on a standalone system or in the enter the api eco system
eta.user.load('dht_');