diabeticHealthTracker.WeightReadings = { 
data:{
    GetRecentData: function(){
        var qry = diabeticHealthTracker.newQuery();
        this.GetRecentView(qry);
        return qry.run();
    }
    ,addReading:function(amount){
        // Send a message to the server that we just had a drink.
        var qry = diabeticHealthTracker.newQuery();
        qry.insert({
            "sql": "insert WeightReading (Amount)",
            "token": "Kvt+Q6RA5ZAsOBmdCXimNQ0JSKrfcN+k1O0gjHWhdEH9BV0hAyaLmYJNySw7p4HN/AUuzFLLzVItKM5LvQAT6bik013WVJEgNAvnenfSo84="
        },
        {"Amount":amount});
        this.GetRecentView(qry);
        return qry.run();
    }
    ,onPageDataCallback:null // assign this callback function when the server returns data to display
    ,onMessageFailed:null // assign this callback function when the server returns data to display
    ,GetRecentView:function(aQuery){
        // all local dates must be converted to sqlDate strings (which converts them to UTC time)
        aQuery.select("RecentReadings",
        {
            "sql": "DECLARE @MinDate DateTime\nSET @MinDate  =CAST(FLOOR(CAST(GetUTCDate() AS float)) AS DATETIME)-90\nselect Amount, TimeTaken from WeightReading where TimeTaken > @mindate",
            "token": "liHMGTlZulk9uiFDhTOUZQf+0DiWdJPDD9Ccn7ofMi9mwMpwUJISNl29uKH2cgOE6dLJykEK5ZTDk4v3O+59seFs5fcd/m8Bb3vw3JBWGcA="
        }
        ,
          {});
        
    }
}


}
