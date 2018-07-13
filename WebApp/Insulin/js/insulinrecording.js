HealthJournal.InsulinRecordings = { // add water intake to the HealthJournal Singleton
Data:{
    GetTodayData: function(callback){
        var qry = HealthJournal.NewQuery();
        this.GetTodayView(qry);
        qry.Run(callback,
            HealthJournal.InsulinRecordings.Data.onMessageFailed);
    }
    ,AddInsulinType:function(aName){
        var qry = HealthJournal.NewQuery();
        qry.Insert("InsulinType", ["Name"],
        {"Name":aName});
        this.GetTodayView(qry);
        qry.Run(HealthJournal.InsulinRecordings.Data.onRecordingsHistoryReceived,
                HealthJournal.InsulinRecordings.Data.onMessageFailed);
    }
    ,AddRecording:function(amount, insulinTypeId){
        // Send a message to the server that we just had a drink.
        var qry = HealthJournal.NewQuery();
        qry.Insert("InsulinRecording", ["Amount", "InsulinTypeId"],
        {"Amount":amount,InsulinTypeId:insulinTypeId});
        this.GetTodayView(qry);
        qry.Run(HealthJournal.InsulinRecordings.Data.onRecordingsHistoryReceived,
                HealthJournal.InsulinRecordings.Data.onMessageFailed);
    }
    ,onRecordingsHistoryReceived:null // assign this callback function when the server returns data to display
    ,onMessageFailed:null // assign this callback function when the server returns data to display
    ,GetTodayView:function(aQuery){
        // all local dates must be converted to sqlDate strings (which converts them to UTC time)
        aQuery.Select("TodaysRecordings",
        {
            "sql": "select\n  Amount, \n  it.Name InsulinType_Name,\n  TimeTaken\nfrom InsulinRecording ir\n  left join InsulinType it on (it._id = ir.InsulinTypeId)\nwhere TimeTaken between @start and @end\nand ir._userId = @_userId\nOrder By TimeTaken",
            "token": "ySqzvRWjpXl/MdSIV0LqHItMgr1N73T8mPZPSDcD2xwNjadBkBATItMfe8mviCxmTyCHmzOIDX4exlbxvWSPc4tf+9qCvC8339rKZ1bD+F4="
        }        ,
          {"start":aQuery.Format.sqlDateTime(ETA.Utils.DateFloor()),
           "end":aQuery.Format.sqlDateTime(ETA.Utils.DateCeiling())});
        aQuery.Select("InsulinType",
        {
            "sql": "select\n  _Id, \n  Name\nfrom InsulinType where _userId = @_userId",
            "token": "lAuHeDFHFQvA3GpHrMpsUHsn93jr/c3LbN6Ahw3c5N2508BWtXWeM8bcFFpQl7C8O0LsnweFRdnblVnkhKHVhAfL1ZhqktYfJIAH0qCJF7k="
        },{})
        
    }
}


}
