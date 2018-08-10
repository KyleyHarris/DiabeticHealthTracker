var
    all = [];
grid = null;


$(document).ready(function ()
{
    preparePageForLoad();
    grid = $('#dataGrid');

    $('.view-date').text(new Date().toLocaleDateString());
    eta.user.CheckLoginStatus("../etalogin.html", function ()
    {
        diabeticHealthTracker.Diary.data.GetRecentData()
            .then(result =>
            {
                updateGUI(result.Data.Results);
                pageLoadCompleted();
            }).catch(sendingError);
    });
});
function updateGUI(rowSets)
{

    // query 5 sets of data in the back end and we will merge and sort them into a days data here, and then 
    // add them to a datadisplay grid
    var dataBlood = eta.utils.rowsByName("blood", rowSets).data;
    var dataInsulin = eta.utils.rowsByName("insulin", rowSets).data;
    //    var dataWeight = eta.utils.rowsByName("weight", rowSets).data;
    var dataFood = eta.utils.rowsByName("food", rowSets).data;
    var dataWater = eta.utils.rowsByName("water", rowSets).data;

    //    var all = dataBlood.concat(dataInsulin).concat(dataWeight).concat(dataFood).concat(dataWater);
    all = dataBlood.concat(dataInsulin).concat(dataWater).concat(dataFood); // test with 3
    all.sortBy(function (item) { return new Date(item.TimeTaken); });

    processAll();

}

function processAll()
{

    var leftSide = true;
    var dt = new Date('1900-01-01').toLocaleDateString();
    grid.html("");
    var today = new Date().toLocaleDateString();

    all.forEach(function (item, index)
    {
        var itemDate = new Date(item.TimeTaken);
        if (itemDate.toLocaleDateString() == today)
        {

            processHeader(item, itemDate);
            processItem(item);
        }
    });

    all.forEach(function (item, index)
    {
        var itemDate = new Date(item.TimeTaken);
        if (itemDate.toLocaleDateString() !== today)
        {

            processHeader(item, itemDate);
            processItem(item);
        }
    });

    function processHeader(item, itemDate)
    {
        if (itemDate.toLocaleDateString() !== dt)
        {
            var sDate = itemDate.toLocaleDateString();
            if (sDate == today) sDate = "Today - " + sDate;
            grid.append('<h2>' + sDate + '</h2>');
            dt = itemDate.toLocaleDateString();
        }
    }
    function processItem(item)
    {

        if (item.itemType === "water")
            addItemHtml(item.TimeTaken, waterContent(item), "normal", item.Volume_mls,'(mls)');
        else if (item.itemType === "insulin")
            addItemHtml(item.TimeTaken, insulinContent(item), "neutral", item.Amount,'(u)');
        else if (item.itemType === "blood")
            addItemHtml(item.TimeTaken, bloodContent(item), checkBlood(item), item.Amount,'(mmol.L)');
        else if (item.itemType === "food")
            addItemHtml(item.TimeTaken, foodContent(item), "neutral");

        function addItemHtml(time, content, classes, value,units)
        {
            if (value)
                value = diabeticHealthTracker.math.round2dp(value).toFixed(2).toString();
            else
                value = "";
            if (!units) units = "";
            if (!classes) classes = "";
            var html = "";
            var t = new Date(time);
            /*
                    if (leftSide)
                        html = '<div class="left"><div class="slot ' + classes + '" >' + content + '</div ><div class="time-slot">' + t.toLocaleTimeString() + '</div></div>';
                    else
                        html = '<div class="right"><div class="time-slot">' + t.toLocaleTimeString() + '</div><div class="slot ' + classes + '" >' + content + '</div ></div>';
                        */
            html = '<div class="slot-container "><div class="time-slot">' + t.toLocaleTimeString() + '</div><div class="slot-content slot ' + classes + '">' + content + '</div ><div class="slot-value">' + value + '<div class="slot-units">' + units +'</div></div></div>';
            leftSide = !leftSide;
            grid.append(html);
        }


    }

    function foodContent(item)
    {
        if (item.Picture !== "")
            return 'Meal<br><img  class="img-small" src="' + diabeticHealthTracker.util.pictureToUrl(item.Picture) + '" alt="" />';
        else
            return "Meal: " + item.Note;
    }

    function waterContent(item)
    {
        var wt = "Water";
        if (item.WaterType !== "") wt = item.WaterType;
        return "Fluids <b>" + wt +"</b>";
        
    }

    function insulinContent(item)
    {
        return "Insulin Dose, <b>" + item.InsulinType_Name+"</b>";
    }

    function bloodContent(item)
    {
        return "Blood Glucose";
    }

    function checkBlood(item)
    {
        if (item.Amount > 9 || item.Amount < 4)
            return "warning";
        else
            return "good";
    }
}

// for local debugging

//ETACommsSettings.apidomain = "http://localhost:60775/";
