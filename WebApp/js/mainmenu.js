$(document).ready(function ()
{

    eta.user.CheckLoginStatus("./etalogin.html", function ()
    {
        checkSubscription();
        return;
    });



});