HealthJournal.Food = { 
    Data:{
        GetRecentData: function(callback){
            var qry = HealthJournal.NewQuery();
            this.GetRecentView(qry);
            qry.Run(callback,
                HealthJournal.Food.Data.onMessageFailed);
        }
        ,AddFood:function(url){
            // Send a message to the server that we just had a drink.
            var qry = HealthJournal.NewQuery();
            qry.Insert("Food", ["Picture"],
            {"Picture":url});
            this.GetRecentView(qry);
            qry.Run(HealthJournal.Food.Data.OnPageDataCallback,
                    HealthJournal.Food.Data.onMessageFailed);
        }
        ,OnPageDataCallback:null // assign this callback function when the server returns data to display
        ,onMessageFailed:null // assign this callback function when the server returns data to display
        ,GetRecentView:function(aQuery){
          
            // all local dates must be converted to sqlDate strings (which converts them to UTC time)
            aQuery.Select("RecentReadings",
            {
                "sql": "DECLARE @MinDate DateTime\nSET @MinDate  =CAST(FLOOR(CAST(GetUTCDate() AS float)) AS DATETIME)-5\nselect \n  Picture, \n  TimeTaken \nfrom \n  Food \nwhere TimeTaken > CASE WHEN @start > @MinDate THEN @start ELSE @MinDate END\n and _userid = @_userid order by TimeTaken DESC",
                "token": "I7mMhokDHseuQ+zqtK0H4NC/nGaBR+CxF8syRbzsnofXc4nnSndWzWQ40IGQAxkuHQZnks0+RuC/A/N0yLzQN8UglZSnzwpzsZfE+mAr17w="
            }
            ,
              {"start":aQuery.Format.sqlDateTime(ETA.Utils.DateFloor()) });
            
        }
    }
    
    
    }

