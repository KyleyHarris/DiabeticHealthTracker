HealthJournal.SleepReadings = { 
Data:{
    GetRecentData: function(callback){
        var qry = HealthJournal.NewQuery();
        this.GetRecentView(qry);
        qry.Run(callback,
            HealthJournal.SleepReadings.Data.onMessageFailed);
    }
    ,AddReading:function(amount){
        // Send a message to the server that we just had a drink.
        var qry = HealthJournal.NewQuery();
        qry.Insert("Sleep", ["Hours"],
        {"Hours":amount});
        this.GetRecentView(qry);
        qry.Run(HealthJournal.SleepReadings.Data.OnPageDataCallback,
                HealthJournal.SleepReadings.Data.onMessageFailed);
    }
    ,OnPageDataCallback:null // assign this callback function when the server returns data to display
    ,onMessageFailed:null // assign this callback function when the server returns data to display
    ,GetRecentView:function(aQuery){
        var dt = new Date();
        dt.setMonth(dt.getMonth()-3);
        // all local dates must be converted to sqlDate strings (which converts them to UTC time)
        aQuery.Select("RecentReadings",
        {
            "sql": "select top 50 Hours, TimeTaken \nfrom Sleep \nwhere \n _userid = @_userid order by TimeTaken desc",
            "token": "cAa0FR1Iu5stmo5sTQlMhd5kNDe18PMMP6L7fEw7dJ8COAppCi5txYYIrDGKbmcWR8Ro/9mH7PXl/4mSzBorOAV4fPwrnMor1YoZhFZ8qTs="
        }
        ,
          {});
        
    }
}


}
