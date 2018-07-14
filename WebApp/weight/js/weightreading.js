diabeticHealthTracker.WeightReadings = { 
data:{
    GetRecentData: function(callback){
        var qry = diabeticHealthTracker.newQuery();
        this.GetRecentView(qry);
        qry.Run(callback,
            diabeticHealthTracker.WeightReadings.data.onMessageFailed);
    }
    ,addReading:function(amount){
        // Send a message to the server that we just had a drink.
        var qry = diabeticHealthTracker.newQuery();
        qry.insert("WeightReading", ["Amount"],
        {"Amount":amount});
        this.GetRecentView(qry);
        qry.Run(diabeticHealthTracker.WeightReadings.data.onPageDataCallback,
                diabeticHealthTracker.WeightReadings.data.onMessageFailed);
    }
    ,onPageDataCallback:null // assign this callback function when the server returns data to display
    ,onMessageFailed:null // assign this callback function when the server returns data to display
    ,GetRecentView:function(aQuery){
        var dt = new Date();
        dt.setMonth(dt.getMonth()-3);
        // all local dates must be converted to sqlDate strings (which converts them to UTC time)
        aQuery.select("RecentReadings",
        {
            "sql": "select Amount, TimeTaken \nfrom WeightReading \nwhere \nTimeTaken between @start and @end and _userid = @_userid order by TimeTaken desc",
            "token": "kKDBa5uRWr181PnT/KyUpBgQzO2p7Afv5rAebdluBWXwWAS8SDu0CnTemWs9/iha5Gs/VCmLFxdzCJWkxYQruhNiado5MZuxFOff/wnAcNE="
        }
        ,
          {"start":aQuery.format.sqlDateTime(dt),
           "end":aQuery.format.sqlDateTime(eta.utils.dateCeiling())});
        
    }
}


}
