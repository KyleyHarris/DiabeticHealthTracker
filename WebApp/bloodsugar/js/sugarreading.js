diabeticHealthTracker.sugarReadings = { // add water intake to the diabeticHealthTracker Singleton
data:{
    unitType:1, 
    getTodayData: function(callback){
        var qry = diabeticHealthTracker.newQuery();
        this.getTodayView(qry);
        qry.Run(callback,
            diabeticHealthTracker.sugarReadings.data.onMessageFailed);
    }
    ,addReading:function(amount){
        // Send a message to the server that we just had a drink.
        var qry = diabeticHealthTracker.newQuery();
        qry.insert("SugarReading", ["Amount"],
        {"Amount":amount});
        this.getTodayView(qry);
        qry.Run(diabeticHealthTracker.sugarReadings.data.onPageDataCallback,
                diabeticHealthTracker.sugarReadings.data.onMessageFailed);
    }
    ,onPageDataCallback:null // assign this callback function when the server returns data to display
    ,onMessageFailed:null // assign this callback function when the server returns data to display
    ,getTodayView:function(aQuery){
        // all local dates must be converted to sqlDate strings (which converts them to UTC time)
        aQuery.select("RecentReadings",
        {
            "sql": "DECLARE @MinDate DateTime\nSET @MinDate  =CAST(FLOOR(CAST(GetUTCDate() AS float)) AS DATETIME)-5\nselect \n  Amount, \n  TimeTaken \nfrom \n  SugarReading \nwhere TimeTaken > CASE WHEN @start > @MinDate THEN @start ELSE @MinDate END\n and _userid = @_userid order by TimeTaken DESC",
            "token": "C+uZYpUINu7gZKpTB0XCCajGjjtoP7RfXEv9QfNG+G4MQzdTvQebECjvfYwoNCkndn76mz1ARYyKT7YTrlKaAl9PNGCzAUXTNdIUrYYN5qc="
        },
          {"start":aQuery.format.sqlDateTime(eta.utils.addDays(-3,eta.utils.dateFloor()))});

           aQuery.select("hba1c",
           {
            "sql": "Select\n  CAST( Round((10.93 * (2.59 + Avg(Amount)) / 1.59) -23.5 , 0) as int) hba1c\nFrom\n  dboex4.SugarReading\nwhere TimeTaken >= DATEADD(month, -3, GETUTCDATE())\nand _userid = @_userid\n",
            "token": "8GFe9TSQ5UuF3Pk4z1TYqi6rXFOjkLH81g/p2pjpE49Dr42/YouJaCbKiOmrJ/P1j60Bx4UruiUfdeRK8Xdglgy90MNn4FNoSOMYkOHIuVk="
        },
        {});
        
    }
}


}
