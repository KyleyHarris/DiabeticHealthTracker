HealthJournal.SugarReadings = { // add water intake to the HealthJournal Singleton
Data:{
    unitType:1, 
    GetTodayData: function(callback){
        var qry = HealthJournal.NewQuery();
        this.GetTodayView(qry);
        qry.Run(callback,
            HealthJournal.SugarReadings.Data.onMessageFailed);
    }
    ,AddReading:function(amount){
        // Send a message to the server that we just had a drink.
        var qry = HealthJournal.NewQuery();
        qry.Insert("SugarReading", ["Amount"],
        {"Amount":amount});
        this.GetTodayView(qry);
        qry.Run(HealthJournal.SugarReadings.Data.OnPageDataCallback,
                HealthJournal.SugarReadings.Data.onMessageFailed);
    }
    ,OnPageDataCallback:null // assign this callback function when the server returns data to display
    ,onMessageFailed:null // assign this callback function when the server returns data to display
    ,GetTodayView:function(aQuery){
        // all local dates must be converted to sqlDate strings (which converts them to UTC time)
        aQuery.Select("RecentReadings",
        {
            "sql": "DECLARE @MinDate DateTime\nSET @MinDate  =CAST(FLOOR(CAST(GetUTCDate() AS float)) AS DATETIME)-5\nselect \n  Amount, \n  TimeTaken \nfrom \n  SugarReading \nwhere TimeTaken > CASE WHEN @start > @MinDate THEN @start ELSE @MinDate END\n and _userid = @_userid order by TimeTaken DESC",
            "token": "C+uZYpUINu7gZKpTB0XCCajGjjtoP7RfXEv9QfNG+G4MQzdTvQebECjvfYwoNCkndn76mz1ARYyKT7YTrlKaAl9PNGCzAUXTNdIUrYYN5qc="
        },
          {"start":aQuery.Format.sqlDateTime(ETA.Utils.AddDays(-3,ETA.Utils.DateFloor()))});

           aQuery.Select("hba1c",
           {
            "sql": "Select\n  CAST( Round((10.93 * (2.59 + Avg(Amount)) / 1.59) -23.5 , 0) as int) hba1c\nFrom\n  dboex4.SugarReading\nwhere TimeTaken >= DATEADD(month, -3, GETUTCDATE())\nand _userid = @_userid\n",
            "token": "8GFe9TSQ5UuF3Pk4z1TYqi6rXFOjkLH81g/p2pjpE49Dr42/YouJaCbKiOmrJ/P1j60Bx4UruiUfdeRK8Xdglgy90MNn4FNoSOMYkOHIuVk="
        },
        {});
        
    }
}


}
