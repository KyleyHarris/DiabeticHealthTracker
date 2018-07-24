$(document).ready(function() {
  preparePageForLoad();

    $('.view-date').text(new Date().toLocaleDateString());
  eta.user.CheckLoginStatus("../etalogin.html", function() {
    diabeticHealthTracker.Diary.data.GetRecentData()
    .then(result=>
        {
          updateGUI(result.Data.Results);
          pageLoadCompleted();
        }).catch(sendingError);
  });
});

function updateGUI(rowSets) {

    // query 5 sets of data in the back end and we will merge and sort them into a days data here, and then 
    // add them to a datadisplay grid
    var dataBlood = eta.utils.RowsByName("blood", rowSets).data;
    var dataInsulin = eta.utils.RowsByName("insulin", rowSets).data;
//    var dataWeight = eta.utils.RowsByName("weight", rowSets).data;
//    var dataFood = eta.utils.RowsByName("food", rowSets).data;
    var dataWater = eta.utils.RowsByName("water", rowSets).data;

//    var all = dataBlood.concat(dataInsulin).concat(dataWeight).concat(dataFood).concat(dataWater);
    var all = dataBlood.concat(dataInsulin).concat(dataWater); // test with 3
    all.sortBy(function (item) { return new Date(item.TimeTaken); });

    var grid = $('#dataGrid');
    var leftSide = true;
    var dt = new Date('1900-01-01').toLocaleDateString();
    grid.html("");
    all.forEach(function (item, index)
    {

        var itemDate = new Date(item.TimeTaken);
        if (itemDate.toLocaleDateString() !== dt)
        {
            grid.append('<h2>' + itemDate.toLocaleDateString() + '</h2>');
            dt = itemDate.toLocaleDateString();
        }

        if(item.itemType === "water")
        {
            addItemHtml( item.TimeTaken, waterContent(item));
        } else if (item.itemType === "insulin")
        {
            addItemHtml(item.TimeTaken, insulinContent(item),"neutral");
        } else if (item.itemType === "blood")
        {
            addItemHtml(item.TimeTaken, bloodContent(item), checkBlood(item));
        } 

    });
             /*
    $("#dataGrid").jsGrid({
        width: "100%",
        inserting: false,
        editing: false,
        sorting: true,
        paging: false,
        rowClass: function (item, itemIndex)
        {
            return getTimeBasedAlternateRowClass(
                item,
                itemIndex,
                "FinishedConsumingAt",
                this.data
            );
        },
        data: history.data,
        fields: [
            { name: "FinishedConsumingAt", title: "Date", type: "date" },
            { name: "FinishedConsumingAt", title: "Time", type: "time" },
            { name: "WaterType", title: "Type", type: "text" },
            { name: "Volume_mls", title: "Volume(mls)", type: "number" }
        ]
    });
    */
    function addItemHtml(time, content, classes)
    {
        if (!classes) classes = "";
        var html = "";
        var t = new Date(time);
        if (leftSide)
            html = '<div class="left"><div class="slot ' + classes + '" >' + content + '</div ><div class="time-slot">' + t.toLocaleTimeString() + '</div></div>';
        else
            html = '<div class="right"><div class="time-slot">' + t.toLocaleTimeString() + '</div><div class="slot ' + classes + '" >' + content + '</div ></div>';
        leftSide = !leftSide;
        grid.append(html);
    }


  }

function waterContent(item)
{
    var wt = "Water";
    if (item.WaterType !== "") wt = item.WaterType;
    return "you drank " + item.Volume_mls + "mls of " + wt;
}

function insulinContent(item)
{
    return "you took " + item.Amount + "units of " + item.InsulinType_Name;
}

function bloodContent(item)
{
    
    
    return "blood glucose reading: " + item.Amount + "mmol/L";
}

function checkBlood(item)
{
    if (item.Amount > 9 || item.Amount < 4)
        return "warning";
    else
        return "good";
}


// for local debugging

//ETACommsSettings.apidomain = "http://localhost:60775/";
