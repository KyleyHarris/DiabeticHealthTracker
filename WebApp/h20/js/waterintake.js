HealthJournal.WaterIntake = { // add water intake to the HealthJournal Singleton
Data:{
    GetTodayData: function(callback){
        var qry = HealthJournal.NewQuery();
        this.GetTodayView(qry);
        qry.Run(callback,
            HealthJournal.WaterIntake.Data.onMessageFailed);
    }
    ,AddFluid:function(amountInMilliLitres, timeOfDayFinished, waterTypeId){
        // Send a message to the server that we just had a drink.
        var qry = HealthJournal.NewQuery();
        var params = {"Volume_mls":amountInMilliLitres,"FinishedConsumingAt":qry.Format.sqlDateTime(timeOfDayFinished)};
        var fields=["Volume_mls","FinishedConsumingAt","WaterTypeId"];
        if(waterTypeId) {
          params.WaterTypeId = waterTypeId;
          
        }else
        {
            fields = ["Volume_mls","FinishedConsumingAt"]
        }
        qry.Insert("WaterBasedFluid", fields,
        params);
        this.GetTodayView(qry);
        qry.Run(HealthJournal.WaterIntake.Data.onFluidHistoryReceived,
                HealthJournal.WaterIntake.Data.onMessageFailed);
    }
    ,AddWaterType:function(aName){
        var qry = HealthJournal.NewQuery();
        qry.Insert("WaterFluidType", ["Name"],
        {"Name":aName});
        this.GetTodayView(qry);
        qry.Run(HealthJournal.WaterIntake.Data.onFluidHistoryReceived,
            HealthJournal.WaterIntake.Data.onMessageFailed);
    }
    ,onFluidHistoryReceived:null // assign this callback function when the server returns data to display
    ,onMessageFailed:null // assign this callback function when the server returns data to display
    ,GetTodayView:function(aQuery){
        // all local dates must be converted to sqlDate strings (which converts them to UTC time)
        aQuery.Select("TodaysWater",
        {
            "sql": "DECLARE @MinDate DateTime\nSET @MinDate  =CAST(FLOOR(CAST(GetUTCDate() AS float)) AS DATETIME)-5\nselect \n  Volume_mls, \n  FinishedConsumingAt,\n  CASE WHEN wt.Name is null then '' ELSE wt.Name END WaterType\nfrom WaterBasedFluid w\nleft join WaterFluidType wt on (wt._Id = w.WaterTypeId)\nwhere \n  w.FinishedConsumingAt > CASE WHEN @start > @MinDate THEN @start ELSE @MinDate END and\n  w._userid = @_userid \norder by FinishedConsumingAt",
            "token": "Zwbv5KUxDHWeehSoSJdTWU7jcZ+Hl1lxNaDU3spNQNWtscNB1qSq3qkvw8rPz4JDNI+SMltA/OOfinSUQjkzTf7D3qG+6bnA+Cg+rvYSA/Y="
        },
          {"start":aQuery.Format.sqlDateTime(ETA.Utils.DateFloor()) });

        aQuery.Select("Settings",
        {
            "sql": "select  VolumePerDayTarget_mls from WaterBasedFluidSettings where _userId = @_userid",
            "token": "xrJ3r/GXq9MFNeBjCFMcuASxPZZ2sdzeLrNQpQ2GMrI6e/T66O/xPNeW/JHVsOkEGMOb7aVot0CWiuUoiwhw91XBjK3Q6+CBKQefts1H/vQ="
        },
          {});

        aQuery.Select("WaterType",
        {
            "sql": "select\n  _Id, \n  Name\nfrom WaterFluidType where _userId = @_userId order by Name",
            "token": "O1KOyMo2JyBZYPUQA7aNPXAfwg3kn2OZVo1nwqojuc3tbPtXL5cQ2xm6NILSKXgUYlKJe8tua0u6cUN1FFD/Z/us7XtUMAXv/5RG6VzKoZE="
        },{})
        
    }
}
,Settings: {
    UpdateDailyLimit:function(amountInMilliLitres){
        // Talk to the server and update the daily limit
        var qry = HealthJournal.NewQuery();
        qry.Update("WaterBasedFluidSettings", ["VolumePerDayTarget_mls"],"",
        {"VolumePerDayTarget_mls":amountInMilliLitres});
        HealthJournal.WaterIntake.Data.GetTodayView(qry);
        qry.Run(HealthJournal.WaterIntake.Data.onFluidHistoryReceived,
                HealthJournal.WaterIntake.Data.onMessageFailed);
    }
    ,AddDailyLimit:function(amountInMilliLitres){
        // Talk to the server and update the daily limit
        var qry = HealthJournal.NewQuery();
        qry.Insert("WaterBasedFluidSettings", ["VolumePerDayTarget_mls"],
        {"VolumePerDayTarget_mls":amountInMilliLitres});
        HealthJournal.WaterIntake.Data.GetTodayView(qry);
        qry.Run(HealthJournal.WaterIntake.Data.onFluidHistoryReceived,
                HealthJournal.WaterIntake.Data.onMessageFailed);
    }    
}

}


//