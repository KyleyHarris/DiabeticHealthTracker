diabeticHealthTracker.Food = { 
    data:{
        GetRecentData: function(callback){
            var qry = diabeticHealthTracker.newQuery();
            this.GetRecentView(qry);
            qry.Run(callback,
                diabeticHealthTracker.Food.data.onMessageFailed);
        }
        ,addFood:function(url){
            // Send a message to the server that we just had a drink.
            var qry = diabeticHealthTracker.newQuery();
            qry.insert("Food", ["Picture"],
            {"Picture":url});
            this.GetRecentView(qry);
            qry.Run(diabeticHealthTracker.Food.data.onPageDataCallback,
                    diabeticHealthTracker.Food.data.onMessageFailed);
        }
        ,onPageDataCallback:null // assign this callback function when the server returns data to display
        ,onMessageFailed:null // assign this callback function when the server returns data to display
        ,GetRecentView:function(aQuery){
          
            // all local dates must be converted to sqlDate strings (which converts them to UTC time)
            aQuery.select("RecentReadings",
            {
                "sql": "DECLARE @MinDate DateTime\nSET @MinDate  =CAST(FLOOR(CAST(GetUTCDate() AS float)) AS DATETIME)-5\nselect \n  Picture, \n  TimeTaken \nfrom \n  Food \nwhere TimeTaken > CASE WHEN @start > @MinDate THEN @start ELSE @MinDate END\n and _userid = @_userid order by TimeTaken DESC",
                "token": "I7mMhokDHseuQ+zqtK0H4NC/nGaBR+CxF8syRbzsnofXc4nnSndWzWQ40IGQAxkuHQZnks0+RuC/A/N0yLzQN8UglZSnzwpzsZfE+mAr17w="
            }
            ,
              {"start":aQuery.format.sqlDateTime(eta.utils.dateFloor()) });
            
        }
    }
    
    
    }

