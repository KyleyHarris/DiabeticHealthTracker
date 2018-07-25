diabeticHealthTracker.Diary = {
    data: {
        GetRecentData: function ()
        {
            var qry = diabeticHealthTracker.newQuery();
            this.GetRecentView(qry);
            return qry.run();
        }

        , GetRecentView: function (aQuery)
        {

            
            var theDate = aQuery.format.sqlDateTime(eta.utils.addDays(-7, eta.utils.dateFloor()));
            var theDate1 = aQuery.format.sqlDateTime(eta.utils.dateCeiling());

            var dateRange = { start: theDate, end: theDate1 };
            
            // all local dates must be converted to sqlDate strings (which converts them to UTC time)
            aQuery.select("water",
                {
                    "sql": "DECLARE @FA Bit\nSELECT @FA=FullAccess from UserSubscription where _userID = @_userId\nDECLARE @MinDate DateTime\nIF @FA IS NULL OR @FA <> 1\n  SET @MinDate  =CAST(FLOOR(CAST(GetUTCDate() AS float)) AS DATETIME)-2\nELSE\n  SET @MinDate = '2000-01-01'\nDECLARE @dBEGIN DateTime\nDECLARE @dEND DateTime\nSET @dBEGIN = CASE WHEN @start > @MinDate THEN @start ELSE @MinDate END\nSET @dEND = CASE WHEN @end <= @dBEGIN THEN @dBEGIN+1 ELSE @END END\n\nselect \n  'water' itemType, \n  Volume_mls, \n  FinishedConsumingAt TimeTaken,\n  CASE WHEN wt.Name is null then '' ELSE wt.Name END WaterType\nfrom WaterBasedFluid w\nleft join WaterFluidType wt on (wt._Id = w.WaterTypeId)\nwhere \n  w.FinishedConsumingAt between @dBEGIN and @dEND and\n  w._userid = @_userid \n",
                    "token": "NlWoBqSXARVw0r6BapTGOrJ4L5CPqr0mcBi1Pe90plWUu5tp5JAwW/e5+nz+EjR9If7ALuuH799JsfyF+Lii58QUtSq62FeWRMvx1F/pTW8="
                }
                ,
                dateRange);

            aQuery.select("blood",
                {
                    "sql": "DECLARE @FA Bit\nSELECT @FA=FullAccess from UserSubscription where _userID = @_userId\nDECLARE @MinDate DateTime\nIF @FA IS NULL OR @FA <> 1\n  SET @MinDate  =CAST(FLOOR(CAST(GetUTCDate() AS float)) AS DATETIME)-2\nELSE\n  SET @MinDate = '2000-01-01'\nDECLARE @dBEGIN DateTime\nDECLARE @dEND DateTime\nSET @dBEGIN = CASE WHEN @start > @MinDate THEN @start ELSE @MinDate END\nSET @dEND = CASE WHEN @end <= @dBEGIN THEN @dBEGIN+1 ELSE @END END\n\nselect \n'blood' itemType,\n  Amount, \n  TimeTaken \nfrom \n  SugarReading \nwhere TimeTaken between @dBegin and @dEND\n and _userid = @_userid ",
                    "token": "rJoGihVQilGwucwsepFhDQZi9VqKU47D7FxSmmReHC7oMEHPbM0GxTvaBaDc6VcikVPavy8x7LScN3nukVrmRy+uvk/L6OiItP8MI9sVVic="
                }
                ,
                dateRange);

            aQuery.select("insulin",
                {
                    "sql": "DECLARE @FA Bit\nSELECT @FA=FullAccess from UserSubscription where _userID = @_userId\nDECLARE @MinDate DateTime\nIF @FA IS NULL OR @FA <> 1\n  SET @MinDate  =CAST(FLOOR(CAST(GetUTCDate() AS float)) AS DATETIME)-2\nELSE\n  SET @MinDate = '2000-01-01'\nDECLARE @dBEGIN DateTime\nDECLARE @dEND DateTime\nSET @dBEGIN = CASE WHEN @start > @MinDate THEN @start ELSE @MinDate END\nSET @dEND = CASE WHEN @end <= @dBEGIN THEN @dBEGIN+1 ELSE @END END\n\nselect\n  'insulin' itemType,\n  Amount, \n  it.Name InsulinType_Name,\n  TimeTaken\nfrom InsulinRecording ir\n  left join InsulinType it on (it._id = ir.InsulinTypeId)\nwhere TimeTaken between @dBEGIN and @dEND\n and ir._userid = @_userid ",
                    "token": "faqsoPGX9OBvoF7rYemO+nSOr/qdBkN2BJxXGrKBkvuP5hd5Dpplnw/j2VLg599/OLaEBwaYyAR7rfpdhwblVQpv+b9REZxjsG/bmVmuyXo="
                }
                ,
                dateRange);

            aQuery.select("food",
                {
                    "sql": "DECLARE @FA Bit\nSELECT @FA=FullAccess from UserSubscription where _userID = @_userId\nDECLARE @MinDate DateTime\nIF @FA IS NULL OR  @FA <> 1\n  SET @MinDate  =CAST(FLOOR(CAST(GetUTCDate() AS float)) AS DATETIME)-2\nELSE\n  SET @MinDate = '2000-01-01'\nDECLARE @dBEGIN DateTime\nDECLARE @dEND DateTime\nSET @dBEGIN = CASE WHEN @start > @MinDate THEN @start ELSE @MinDate END\nSET @dEND = CASE WHEN @end <= @dBEGIN THEN @dBEGIN+1 ELSE @END END\n\nselect\n  'food' itemType,\n  Picture, \n  Note,\n  TimeTaken\nfrom food f\nwhere TimeTaken BETWEEN @dBEGIN and @dEND\n and f._userid = @_userid ",
                    "token": "0MG0drTzGVXINBuWJEyjEZLOCkCEN8runtjMxTpkLq9YwGqAN0YTg2QtnYcIDSGc7Dz6jxsKF1e3qNdwIjGqbeZMPk2ylPJk9QJARh6BMWA="
                }
                ,
               dateRange);

        }
    }


};
