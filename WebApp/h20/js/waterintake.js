diabeticHealthTracker.WaterIntake = { // add water intake to the diabeticHealthTracker Singleton
data:{
    getTodayData: function(callback){
        var qry = diabeticHealthTracker.newQuery();
        this.getTodayView(qry);
        return qry.run(callback,
            diabeticHealthTracker.WaterIntake.data.onMessageFailed);
    }
    ,addFluid:function(amountInMilliLitres, timeOfDayFinished, waterTypeId){
        // Send a message to the server that we just had a drink.
        var qry = diabeticHealthTracker.newQuery();
        var params = {"Volume_mls":amountInMilliLitres,"FinishedConsumingAt":qry.format.sqlDateTime(timeOfDayFinished)};
        var fields=["Volume_mls","FinishedConsumingAt","WaterTypeId"];
        if(waterTypeId) {
          params.WaterTypeId = waterTypeId;
          
        }else
        {
            fields = ["Volume_mls","FinishedConsumingAt"]
        }
        qry.insert("WaterBasedFluid", fields,
        params);
        this.getTodayView(qry);
        return qry.run(diabeticHealthTracker.WaterIntake.data.onFluidHistoryReceived,
                diabeticHealthTracker.WaterIntake.data.onMessageFailed);
    }
    ,addWaterType:function(aName){
        var qry = diabeticHealthTracker.newQuery();
        qry.insert("WaterFluidType", ["Name"],
        {"Name":aName});
        this.getTodayView(qry);
        return qry.run(diabeticHealthTracker.WaterIntake.data.onFluidHistoryReceived,
            diabeticHealthTracker.WaterIntake.data.onMessageFailed);
    }
    ,onFluidHistoryReceived:null // assign this callback function when the server returns data to display
    ,onMessageFailed:null // assign this callback function when the server returns data to display
    ,getTodayView:function(aQuery){
        // all local dates must be converted to sqlDate strings (which converts them to UTC time)
        aQuery.select("TodaysWater",
        {
            "sql": "DECLARE @MinDate DateTime\nSET @MinDate  =CAST(FLOOR(CAST(GetUTCDate() AS float)) AS DATETIME)-5\nselect \n  Volume_mls, \n  FinishedConsumingAt,\n  CASE WHEN wt.Name is null then '' ELSE wt.Name END WaterType\nfrom WaterBasedFluid w\nleft join WaterFluidType wt on (wt._Id = w.WaterTypeId)\nwhere \n  w.FinishedConsumingAt > CASE WHEN @start > @MinDate THEN @start ELSE @MinDate END and\n  w._userid = @_userid \norder by FinishedConsumingAt",
            "token": "Zwbv5KUxDHWeehSoSJdTWU7jcZ+Hl1lxNaDU3spNQNWtscNB1qSq3qkvw8rPz4JDNI+SMltA/OOfinSUQjkzTf7D3qG+6bnA+Cg+rvYSA/Y="
        },
          {"start":aQuery.format.sqlDateTime(eta.utils.dateFloor()) });

        aQuery.select("Settings",
        {
            "sql": "select  VolumePerDayTarget_mls from WaterBasedFluidSettings where _userId = @_userid",
            "token": "xrJ3r/GXq9MFNeBjCFMcuASxPZZ2sdzeLrNQpQ2GMrI6e/T66O/xPNeW/JHVsOkEGMOb7aVot0CWiuUoiwhw91XBjK3Q6+CBKQefts1H/vQ="
        },
          {});

        aQuery.select("WaterType",
        {
            "sql": "select\n  _Id, \n  Name\nfrom WaterFluidType where _userId = @_userId order by Name",
            "token": "O1KOyMo2JyBZYPUQA7aNPXAfwg3kn2OZVo1nwqojuc3tbPtXL5cQ2xm6NILSKXgUYlKJe8tua0u6cUN1FFD/Z/us7XtUMAXv/5RG6VzKoZE="
        },{})
        
    }
}
,Settings: {
    UpdateDailyLimit:function(amountInMilliLitres){
        // Talk to the server and update the daily limit
        var qry = diabeticHealthTracker.newQuery();
        qry.update("WaterBasedFluidSettings", ["VolumePerDayTarget_mls"],"",
        {"VolumePerDayTarget_mls":amountInMilliLitres});
        diabeticHealthTracker.WaterIntake.data.getTodayView(qry);
        return qry.run(diabeticHealthTracker.WaterIntake.data.onFluidHistoryReceived,
                diabeticHealthTracker.WaterIntake.data.onMessageFailed);
    }
    ,addDailyLimit:function(amountInMilliLitres){
        // Talk to the server and update the daily limit
        var qry = diabeticHealthTracker.newQuery();
        qry.insert("WaterBasedFluidSettings", ["VolumePerDayTarget_mls"],
        {"VolumePerDayTarget_mls":amountInMilliLitres});
        diabeticHealthTracker.WaterIntake.data.getTodayView(qry);
        return qry.run(diabeticHealthTracker.WaterIntake.data.onFluidHistoryReceived,
                diabeticHealthTracker.WaterIntake.data.onMessageFailed);
    }    
}

}


//