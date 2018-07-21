diabeticHealthTracker.InsulinRecordings = { // add water intake to the diabeticHealthTracker Singleton
data:{
    getTodayData: function(){
        var qry = diabeticHealthTracker.newQuery();
        this.getTodayView(qry);
        return qry.run();
    }
    ,addInsulinType:function(aName){
        var qry = diabeticHealthTracker.newQuery();
        qry.insert({
            "sql": "insert InsulinType (Name)",
            "token": "0T4wwU1HgVyY71GmMXmqNHk7wu656WqrWWacBES++NW4ih0f3lZDldIy4qKmx1TGET20zJBD1MqTrZL4ZjOVytY2jS7XkKMRSvHfx1YCTQ8="
        },
        {"Name":aName});
        this.getTodayView(qry);
        return qry.run();
    }
    ,addRecording:function(amount, insulinTypeId){
        // Send a message to the server that we just had a drink.
        var qry = diabeticHealthTracker.newQuery();
        qry.insert({
            "sql": "insert InsulinRecording (Amount,TimeTaken,InsulinTypeId)",
            "token": "AEBERGJ1Oz38xrJSPKcoGlSww8xtZmzoIjU+0M1NZPI9lMaaBRADaamtexoNnvaT+PX+iLVqYM0hGnilIuzBHFYPTAJYmAx9S8eX2LZjuEQ="
        },
        {"Amount":amount,InsulinTypeId:insulinTypeId, TimeTaken:qryActiveDate()});
        this.getTodayView(qry);
        return qry.run();
    }
    ,getTodayView:function(aQuery){
        // all local dates must be converted to sqlDate strings (which converts them to UTC time)
        aQuery.select("TodaysRecordings",
        {
            "sql": "DECLARE @MinDate DateTime\nSET @MinDate  =CAST(FLOOR(CAST(GetUTCDate() AS float)) AS DATETIME)-5\nselect\n  Amount, \n  it.Name InsulinType_Name,\n  TimeTaken\nfrom InsulinRecording ir\n  left join InsulinType it on (it._id = ir.InsulinTypeId)\nwhere TimeTaken > CASE WHEN @start > @MinDate THEN @start ELSE @MinDate END\n and ir._userid = @_userid order by TimeTaken DESC",
            "token": "Oz9xyYVQ+egfxwhf6EKzM+jK62s4/vCVh1SsrR77tKUNDveJ6aQs1V2ULvhxF7jOhH71z1/HzZkcUAN9R0usOAWxHv1XWHXKz+kjxw0NCi8="
          
        }      ,
        {"start":aQuery.format.sqlDateTime(eta.utils.addDays(-3,eta.utils.dateFloor()))});
        aQuery.select("InsulinType",
        {
            "sql": "select\n  _Id, \n  Name\nfrom InsulinType where _userId = @_userId",
            "token": "lAuHeDFHFQvA3GpHrMpsUHsn93jr/c3LbN6Ahw3c5N2508BWtXWeM8bcFFpQl7C8O0LsnweFRdnblVnkhKHVhAfL1ZhqktYfJIAH0qCJF7k="
        },{})
        
    }
}


}
