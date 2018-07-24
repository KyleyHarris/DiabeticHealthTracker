
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
   ,convert:{
    stringToFloat:function(v) {
    var value = parseFloat(v);
    if (isNaN(value)) {
      return 0;
    }
    return value;
   }}
}; 

//this line is very important for project segregation and should be unique
//throughout the system. use the project PublicName is reccomended
//this is used to prefix login information etc in storage and 
//allows the site to run on a standalone system or in the enter the api eco system
eta.user.load('dht_');

(function ()
{
    if (typeof Object.defineProperty === 'function')
    {
        try { Object.defineProperty(Array.prototype, 'sortBy', { value: sb }); } catch (e)
        {
            // do nothing
        }
    }
    if (!Array.prototype.sortBy) Array.prototype.sortBy = sb;

    function sb(f)
    {
        for (var i = this.length; i;)
        {
            var o = this[--i];
            this[i] = [].concat(f.call(o, o, i), o);
        }
        this.sort(function (a, b)
        {
            for (var i = 0, len = a.length; i < len; ++i)
            {
                if (a[i] !== b[i]) return a[i] < b[i] ? -1 : 1;
            }
            return 0;
        });
        for (var i1 = this.length; i1;)
        {
            this[--i1] = this[i1][this[i1].length - 1];
        }
        return this;
    }
})();