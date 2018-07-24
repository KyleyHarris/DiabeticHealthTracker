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

            
            var theDate = aQuery.format.sqlDateTime(eta.utils.addDays(-1,eta.utils.dateFloor()));

            
            // all local dates must be converted to sqlDate strings (which converts them to UTC time)
            aQuery.select("water",
                {
                    "sql": "DECLARE @MinDate DateTime\nSET @MinDate  =CAST(FLOOR(CAST(GetUTCDate() AS float)) AS DATETIME)-1\nselect \n  'water' itemType, \n  Volume_mls, \n  FinishedConsumingAt TimeTaken,\n  CASE WHEN wt.Name is null then '' ELSE wt.Name END WaterType\nfrom WaterBasedFluid w\nleft join WaterFluidType wt on (wt._Id = w.WaterTypeId)\nwhere \n  w.FinishedConsumingAt > CASE WHEN @start > @MinDate THEN @start ELSE @MinDate END and\n  w._userid = @_userid \n",
                    "token": "ET6+BMtqMTYZWvprCpG92V7a0Fn+Uwq9obe2DgRo16s3nU/VaFZEBWzoyQB4zf+yaO8LwSOuSdXlDiqFjhknd+joY709V5Oa17BjeZya29U="
                }
                ,
                { start: theDate });

            aQuery.select("blood",
                {
                    "sql": "DECLARE @MinDate DateTime\nSET @MinDate  =CAST(FLOOR(CAST(GetUTCDate() AS float)) AS DATETIME)-1\nselect \n'blood' itemType,\n  Amount, \n  TimeTaken \nfrom \n  SugarReading \nwhere TimeTaken > CASE WHEN @start > @MinDate THEN @start ELSE @MinDate END\n and _userid = @_userid ",
                    "token": "a3OtD+ALY4cHcNs14RivsWx4+yWKhxtCDGfdmsfy3UqpBrwRa4a3h143BYLw5j4GI5lUBPIHEvsH6bHeglWfmFPLEQ+epAynwxzz6KdtOrc="
                }
                ,
                { start: theDate });

            aQuery.select("insulin",
                {
                    "sql": "DECLARE @MinDate DateTime\nSET @MinDate  =CAST(FLOOR(CAST(GetUTCDate() AS float)) AS DATETIME)-1\nselect\n  'insulin' itemType,\n  Amount, \n  it.Name InsulinType_Name,\n  TimeTaken\nfrom InsulinRecording ir\n  left join InsulinType it on (it._id = ir.InsulinTypeId)\nwhere TimeTaken > CASE WHEN @start > @MinDate THEN @start ELSE @MinDate END\n and ir._userid = @_userid ",
                    "token": "8Fl2AvQPmsBtY0ZVq0N/nAAtwqPNJCNAjz9HA7nENgm8cRxB3YWD90qJ+l62xgasQBwYT51UJmJa5aPE/H8dzytAeCY5yG2iukX6Pext5JI="
                }
                ,
                { start: theDate });


        }
    }


};
