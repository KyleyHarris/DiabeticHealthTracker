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
            "sql": "DECLARE @MinDate DateTime\ndeclare @start datetime\nSET @Start =getutcdate()-3\nSET @MinDate  =CAST(FLOOR(CAST(GetUTCDate() AS float)) AS DATETIME)-90\nSELECT @MINDATE\nselect Amount, TimeTaken from WeightReading where TimeTaken > @mindate",
            "token": "5MrP1IR+sNI5wg1p73qTHNB9Z77MciINKZFxZNMj2jt1fOXQwl1VNtd+Gsx4KM2V0YhLMe/7pPZiQXsKbtMHycjBsNCItQGPY+7DOrF3FNE="
        }
        ,
          {});
        
    }
}


}
