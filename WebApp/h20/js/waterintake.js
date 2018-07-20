diabeticHealthTracker.WaterIntake = { // add water intake to the diabeticHealthTracker Singleton
data:{
    getTodayData: function(){
        var qry = diabeticHealthTracker.newQuery();
        this.getTodayView(qry);
        return qry.run();
    }
    ,addFluid:function(amountInMilliLitres, timeOfDayFinished, waterTypeId){
        // Send a message to the server that we just had a drink.
        if(!waterTypeId) waterTypeId = null; // makesure not undefined
        var qry = diabeticHealthTracker.newQuery();
        var params = {"Volume_mls":amountInMilliLitres,
          "FinishedConsumingAt":qry.format.sqlDateTime(timeOfDayFinished),
        WaterTypeId:waterTypeId};
        
        
        qry.insert({
            "sql": "insert WaterBasedFluid (Volume_mls,FinishedConsumingAt,WaterTypeId)",
            "token": "LKsNutQ00DK75dtLbrv5TdVTXuRpGcCylVtyYk5EPGhJDPGgp59Yl7CeJLrYnHn1FDfDE9kZrgnVTn8bpCsg+gMsWteuoTlWPFEwHiro7AY="
        },
        params);
        this.getTodayView(qry);
        return qry.run();
    }
    ,addWaterType:function(aName){
        var qry = diabeticHealthTracker.newQuery();
        qry.insert({
            "sql": "insert WaterFluidType (Name)",
            "token": "rHq2RPLDKjSQfEDA0Ejdzsld91wwef4J4Cri8unRb6PUwATNunNRvJmeMKUcS4E2w7Qaqiaswnu+rai09sw4R5vgHCmIa/1yAi4jLNh01Ws="
        },
        {"Name":aName});
        this.getTodayView(qry);
        return qry.run();
    }
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
    updateDailyLimit:function(amountInMilliLitres){
        // Talk to the server and update the daily limit
        var qry = diabeticHealthTracker.newQuery();
        qry.update({
            "sql": "update WaterBasedFluidSettings (VolumePerDayTarget_mls)",
            "token": "GMSMHDNRvy13OampKG4hD3PoL6mgD0qsR91OHLs1YbDm2BM6PglgQ4F38F4/UOp5WVlS9srq/X1i3Lm2i26HcOwROPXWLFhGM1DwoFfBq7s="
        },
        {"VolumePerDayTarget_mls":amountInMilliLitres});
        diabeticHealthTracker.WaterIntake.data.getTodayView(qry);
        return qry.run();
    }
    ,addDailyLimit:function(amountInMilliLitres){
        // Talk to the server and update the daily limit
        var qry = diabeticHealthTracker.newQuery();
        qry.insert({
            "sql": "insert WaterBasedFluidSettings (VolumePerDayTarget_mls)",
            "token": "V4PsJd8cR+PjTn5BxXHvPENedzfiu4hqskl7arkmS/BxsktaNZn1vuscu2N2k3mvdMCtm31gXKwwoimQzXVXam3oJWjYmqDJnI9ol/wOWSU="
        },
        {"VolumePerDayTarget_mls":amountInMilliLitres});
        diabeticHealthTracker.WaterIntake.data.getTodayView(qry);
        return qry.run();

        
    }    
}

}

//eta.comms.settings.apidomain = "http://localhost:60775/";
//