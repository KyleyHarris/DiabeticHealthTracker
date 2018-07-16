$(document).ready(function() {

  // ETA Root folder is a special feature we set up that allows the javascript and 
  // html for the site to work either on a specific hosted domain
  // eg www.DiabeticHealthTracker.com
  // or in the fully functioning test site as a sub web link of Enter The Api
  // using the Public Name of the API project
  eta.rootFolder = "" ;
  if (window.location.hostname.toLowerCase() == 'entertheapi.azurewebsites.net')
  {
    eta.rootFolder = '/web/diabetichealthtracker'
  }
  
  $('.primary-editor').focus();
  // This lets the generic login page know where to come back to
  localStorage.setItem('eta_homepage',eta.rootFolder +'/index.htm');
  bindForms();
  // Any page of the app which wants to divide its page into a working section and settings 
  // page can be setup here with page switching
  eta.forms.dht.bindSettings();
  
  // setup a default error handler for the app to display erros in a Div section
  // id="error"
  eta.forms.onError = function(errorMsg){
      eta.forms.alertError('error', errorMsg);
  }

  // any debug logging will be output to this element with $().append()
  debug.logSpace = $("#log");
  
  // setup the banner image which will be used by the generic login page 
  // and each page of the web app and micro apps.
  localStorage.setItem(
    "eta_headerimgurl",
    eta.rootFolder+"/images/diabeticHealthTracker.png"
  );
  localStorage.setItem("eta_headercolor", "antiquewhite");

  // bind the image and colors.
  $(".app-header").css(
    "background-image",
    "url(" + localStorage.getItem("eta_headerimgurl") + ")"
  );
  $(".app-header").css(
    "background-color",
    localStorage.getItem("eta_headercolor")
  );
});

function bindForms(){
eta.forms.dht = {

  bindSettings: function(){
    $('.settings-click').click(function(){
      this.showSettings();
    }.bind(this));
    
  $('.settings-click').addClass("button button-action button-circle");
  
  $('.return-click').click(function(){
    this.hideSettings();
  }.bind(this));
  $('.return-click').addClass("button button-action button-circle");
  
  }
  ,showSettings:function(){
    $(".settings-section").show();
    $(".main-section").hide();
  }
  ,hideSettings:function(){
    $(".settings-section").hide();
    $(".main-section").show();

  }
  ,toggleSettings(value){
    if (value) 
      this.showSettings(); 
    else 
      this.hideSettings();
  }

}
}

if (!(window.jsGrid === undefined) ){

var dhtDateField = function(config) {
  jsGrid.Field.call(this, config);
};

dhtDateField.prototype = new jsGrid.Field({

  css: "date-field",            // redefine general property 'css'
  align: "right",              // redefine general property 'align'

  sorter: function(date1, date2) {
      return new Date(date1) - new Date(date2);
  },

  itemTemplate: function(value) {
      return new Date(value).toLocaleDateString();
  }
});


var dhtTimeField = function(config) {
  jsGrid.Field.call(this, config);
};

dhtTimeField.prototype = new jsGrid.Field({

  css: "time-field",            // redefine general property 'css'
  align: "right",              // redefine general property 'align'

  sorter: function(date1, date2) {
      return new Date(date1) - new Date(date2);
  },

  itemTemplate: function(value) {
      return new Date(value).toLocaleTimeString();
  }

  
});

jsGrid.fields.time = dhtTimeField;
jsGrid.fields.date = dhtDateField;
}



function getTimeBasedAlternateRowClass(item, itemIndex, dateField, data){
  var c = "";
  if(itemIndex %2 == 1) c =  "jsgrid-dht-alt-row ";
  if(itemIndex >0 && new Date(item[dateField]).toDateString() != new Date(data[itemIndex-1][dateField]).toDateString() )
    return c+ "jsgrid-row-break"
    else
    return c;
}