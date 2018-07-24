diabeticHealthTracker.sugarReadings = { // add water intake to the diabeticHealthTracker Singleton
    data: {
        unitType: 1,
        getTodayData: function ()
        {
            var qry = diabeticHealthTracker.newQuery();
            this.getTodayView(qry);
            return qry.run();
        }
        , addReading: function (amount)
        {
            // Send a message to the server that we just had a drink.
            var qry = diabeticHealthTracker.newQuery();
            qry.insert({
                "sql": "insert SugarReading (Amount,TimeTaken)",
                "token": "vdxFw2TrERdNUoH/6KiKRj+bauqsIwRCwvCk3xtzFoDgGdpu4uBAtTp1nDfKC0Xk4wE2rhGNXu4lXNoYZDsGeAjvJ3UdTV9IYNbLCxwPRcI="
            },
                { "Amount": amount, timeTaken: qryActiveDate() });
            this.getTodayView(qry);
            return qry.run();
        }
        , getTodayView: function (aQuery)
        {
            // all local dates must be converted to sqlDate strings (which converts them to UTC time)
            aQuery.select("RecentReadings",
                {
                    "sql": "DECLARE @MinDate DateTime\nSET @MinDate  =CAST(FLOOR(CAST(GetUTCDate() AS float)) AS DATETIME)-5\nselect \n  Amount, \n  TimeTaken \nfrom \n  SugarReading \nwhere TimeTaken > CASE WHEN @start > @MinDate THEN @start ELSE @MinDate END\n and _userid = @_userid order by TimeTaken DESC",
                    "token": "C+uZYpUINu7gZKpTB0XCCajGjjtoP7RfXEv9QfNG+G4MQzdTvQebECjvfYwoNCkndn76mz1ARYyKT7YTrlKaAl9PNGCzAUXTNdIUrYYN5qc="
                },
                { "start": aQuery.format.sqlDateTime(eta.utils.addDays(-3, eta.utils.dateFloor())) });

            aQuery.select("hba1c",
                {
                    "sql": "Select\n  CAST( Round((10.93 * (2.59 + Avg(Amount)) / 1.59) -23.5 , 0) as int) hba1c\nFrom\n  dboex4.SugarReading\nwhere TimeTaken >= DATEADD(month, -3, GETUTCDATE())\nand _userid = @_userid\n",
                    "token": "8GFe9TSQ5UuF3Pk4z1TYqi6rXFOjkLH81g/p2pjpE49Dr42/YouJaCbKiOmrJ/P1j60Bx4UruiUfdeRK8Xdglgy90MNn4FNoSOMYkOHIuVk="
                },
                {});

        }
    }


};
