diabeticHealthTracker.TextJournal = { 
data:{
    GetRecentData: function(){
        var qry = diabeticHealthTracker.newQuery();
        this.GetRecentView(qry);
        return qry.run();
    }
    ,addNote:function(details){
        // Send a message to the server that we just had a drink.
        var qry = diabeticHealthTracker.newQuery();
        qry.insert({
            "sql": "insert Note (Details)",
            "token": "7lx+D70kTggLIDOaJuNphxo3CQ2Prwz5XbM4oJfoxjLik2weuR4fH7k1ONgU9P7YjtpiB4BUrasmKtv/Ebfl8PT5QS+eMK/FAkGPFUsgbtI="
        },
        {"Details":details});
        this.GetRecentView(qry);
        return qry.run();
    }
    ,onPageDataCallback:null // assign this callback function when the server returns data to display
    ,onMessageFailed:null // assign this callback function when the server returns data to display
    ,GetRecentView:function(aQuery){
        var dt = new Date();
        dt.setMonth(dt.getMonth()-3);
        // all local dates must be converted to sqlDate strings (which converts them to UTC time)
        aQuery.select("RecentNotes",
        {
            "sql": "select top 20 Details, TimeTaken \nfrom Note\nwhere \n _userid = @_userid order by TimeTaken desc",
            "token": "BJPAD9jnAiuOTJEmEmg0ZOrAY7ncaYj6O553EC67UqkdKX1IKVOvSLfupGuUQrSK6w/1n6hsxuru6rcVwbWhCDZ0eDgqLL8QTZjnIajJGXw="
        }
        ,
          {});
        
    }
}


}
