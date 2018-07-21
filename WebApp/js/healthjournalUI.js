$(document).ready(function () {

  // ETA Root folder is a special feature we set up that allows the javascript and 
  // html for the site to work either on a specific hosted domain
  // eg www.DiabeticHealthTracker.com
  // or in the fully functioning test site as a sub web link of Enter The Api
  // using the Public Name of the API project
  eta.rootFolder = "";
  if (window.location.hostname.toLowerCase() == 'entertheapi.azurewebsites.net') {
    eta.rootFolder = '/web/diabetichealthtracker'
  }

  $('.primary-editor').focus();
  // This lets the generic login page know where to come back to
  sessionStorage.setItem('eta_homepage', eta.rootFolder + '/index.htm');
  sessionStorage.setItem("eta_headerimgurl",
    eta.rootFolder + "/images/diabeticHealthTracker.png"
  );
  sessionStorage.setItem("eta_headercolor", "antiquewhite");

  try {
    $('#addtimepicker').html('<div class="" ><input id="timepicker" class="time ui-timepicker-input number-edit" type="text"/>When?</div>')
    // setup timepicker if it exists on a screen. this app only needs 1 picker per pages
    $('#timepicker').timepicker({ step: 15, 'scrollDefault': 'now', disableTouchKeyboard: true });
    $('#timepicker').timepicker('setTime', new Date());


  } catch (error) {
    // Just means this page is not timepicker enabled  
  }
  bindForms();
  // Any page of the app which wants to divide its page into a working section and settings 
  // page can be setup here with page switching
  eta.forms.dht.bindSettings();

  // setup a default error handler for the app to display erros in a Div section
  // id="error"
  eta.forms.onError = function (errorMsg) {
    eta.forms.alertError('error', errorMsg);
  }

  // any debug logging will be output to this element with $().append()
  debug.logSpace = $("#log");

  // setup the banner image which will be used by the generic login page 
  // and each page of the web app and micro apps.

  // bind the image and colors.
  $(".app-header").css(
    "background-image",
    "url(" + sessionStorage.getItem("eta_headerimgurl") + ")"
  );
  $(".app-header").css(
    "background-color",
    sessionStorage.getItem("eta_headercolor")
  );
});

// this is the datetime to use for any data entry additions that require a date
function activeDate() {
  var timepicker = $('#timepicker');
  if (timepicker.length > 0) {
    return timepicker.timepicker('getTime');
  } else
    return new Date();
}

function qryActiveDate() {
  return diabeticHealthTracker.newQuery().format.sqlDateTime(activeDate());
}

function bindForms() {
  eta.forms.dht = {

    bindSettings: function () {
      $('.settings-click').click(function () {
        this.showSettings();
      }.bind(this));

      $('.settings-click').addClass("button button-action button-circle");

      $('.return-click').click(function () {
        this.hideSettings();
      }.bind(this));
      $('.return-click').addClass("button button-action button-circle");

    }
    , showSettings: function () {
      $(".settings-section").show();
      $(".main-section").hide();
    }
    , hideSettings: function () {
      $(".settings-section").hide();
      $(".main-section").show();

    }
    , toggleSettings(value) {
      if (value)
        this.showSettings();
      else
        this.hideSettings();
    }

  }
}

if (!(window.jsGrid === undefined)) {

  var dhtDateField = function (config) {
    jsGrid.Field.call(this, config);
  };

  dhtDateField.prototype = new jsGrid.Field({

    css: "date-field",            // redefine general property 'css'
    align: "right",              // redefine general property 'align'

    sorter: function (date1, date2) {
      return new Date(date1) - new Date(date2);
    },

    itemTemplate: function (value) {
      return new Date(value).toLocaleDateString();
    }
  });


  var dhtTimeField = function (config) {
    jsGrid.Field.call(this, config);
  };

  dhtTimeField.prototype = new jsGrid.Field({

    css: "time-field",            // redefine general property 'css'
    align: "right",              // redefine general property 'align'

    sorter: function (date1, date2) {
      return new Date(date1) - new Date(date2);
    },

    itemTemplate: function (value) {
      return new Date(value).toLocaleTimeString();
    }


  });

  jsGrid.fields.time = dhtTimeField;
  jsGrid.fields.date = dhtDateField;
}

var resetDataEntry = null; // assign a callback here for setup after a successful post of data

function getTimeBasedAlternateRowClass(item, itemIndex, dateField, data) {
  var c = "";
  if (itemIndex % 2 == 1) c = "jsgrid-dht-alt-row ";
  if (itemIndex > 0 && new Date(item[dateField]).toDateString() != new Date(data[itemIndex - 1][dateField]).toDateString())
    return c + "jsgrid-row-break"
  else
    return c;
}


// use this to insert a progress meter style spinner
function insertProgressIndicatorTemplate(jItem, classType, title, message) {
  if (!title) title = "Sending...";
  if (!message) message = "";
  if (!classType) classType = "goodMsg";
  jItem.append('<div class="progress-spinner progress ' + classType + '">' +
    '<i class="fa fa-spinner fa-spin" style="font-size:24px"></i><span class="progress-title">' + title + '</span>' +
    '<span class="progress-message">' + message + '</span></div>');
};

function removeSpinner(jItem) {
  jItem.find('.progress-spinner').remove();
}

function insertTimedIndicatorMessage(jItem, classType, iconClass, title, message, timeOut) {
  if (!timeOut) timeOut = 5000;
  if (!iconClass) iconClass = "far fa-check-circle";
  jItem.append('<div class="indicator progress ' + classType + '">' +
    '<i class="' + iconClass + '" style="font-size:24px"></i><span class="progress-title">' + title + '</span>' +
    '<span class="progress-message">' + message + '</span></div>');
  window.setTimeout(() => { jItem.find('.indicator').remove(); }, timeOut);
}

function insertLoadingSpinner() {
  var iconClass = "fa fa-spinner";
  $(document.body).append('<div class="indicator-loading">' +
    '<i class="' + iconClass + ' fa-spin" style="font-size:24px"></i><span class="progress-title">Loading</span>' +
    '</div>');
}

function preparePageForLoad() {
  insertLoadingSpinner();
  $('.button').disable();
}

function pageLoadCompleted() {
  $('.button').enable();
  $('.indicator-loading').remove();
}

function sendingNow() {
  var jItem = $('.msg-area');
  $('.button').disable();
  insertProgressIndicatorTemplate(jItem, "goodMsg", "Sending Now...");
}
function sendingComplete(message) {
  var msgArea = $('.msg-area');
  $('.button').enable();
  removeSpinner(msgArea);
  insertTimedIndicatorMessage(msgArea, "goodMsg", undefined, "Success", message);

  if(resetDataEntry) resetDataEntry();
  try {
    $('#timepicker').timepicker('setTime', new Date());
  } catch (error) {
    // just means no timepicker on this page;  
  }
}

function sendingError(error) {
  var jItem = $('.msg-area');
  $('.button').enable();
  removeSpinner(jItem);
  insertTimedIndicatorMessage(jItem, "badMsg", "fas fa-exclamation-circle", "Error", error.message, 10000);
}

function loadingError(error) {
  var jItem = $('.msg-area');
  insertTimedIndicatorMessage(jItem, "badMsg", "fas fa-exclamation-circle", "Error", error.message + '<br>Please Reload the page and try again', 100000);
}