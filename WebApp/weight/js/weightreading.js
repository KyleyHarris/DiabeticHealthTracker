HealthJournal.WeightReadings = { 
Data:{
    GetRecentData: function(callback){
        var qry = HealthJournal.NewQuery();
        this.GetRecentView(qry);
        qry.Run(callback,
            HealthJournal.WeightReadings.Data.onMessageFailed);
    }
    ,AddReading:function(amount){
        // Send a message to the server that we just had a drink.
        var qry = HealthJournal.NewQuery();
        qry.Insert("WeightReading", ["Amount"],
        {"Amount":amount});
        this.GetRecentView(qry);
        qry.Run(HealthJournal.WeightReadings.Data.OnPageDataCallback,
                HealthJournal.WeightReadings.Data.onMessageFailed);
    }
    ,OnPageDataCallback:null // assign this callback function when the server returns data to display
    ,onMessageFailed:null // assign this callback function when the server returns data to display
    ,GetRecentView:function(aQuery){
        var dt = new Date();
        dt.setMonth(dt.getMonth()-3);
        // all local dates must be converted to sqlDate strings (which converts them to UTC time)
        aQuery.Select("RecentReadings",
        {
            "sql": "select Amount, TimeTaken \nfrom WeightReading \nwhere \nTimeTaken between @start and @end and _userid = @_userid order by TimeTaken desc",
            "token": "kKDBa5uRWr181PnT/KyUpBgQzO2p7Afv5rAebdluBWXwWAS8SDu0CnTemWs9/iha5Gs/VCmLFxdzCJWkxYQruhNiado5MZuxFOff/wnAcNE="
        }
        ,
          {"start":aQuery.Format.sqlDateTime(dt),
           "end":aQuery.Format.sqlDateTime(ETA.Utils.DateCeiling())});
        
    }
}


}
