//Details to highlight on NOS
const DETAILS_TO_HIGHLIGHT = ['Client Name', 'Date', 'Preferred Time',
  'Barber Name', 'Party size', 'Client Phone', 'Agreed Time',
  'Agreed Date'
];
/**
 * Define Function to Stringify it and inject in HTML for Bg-Player
 *
 */
var code = function() {
var elem = document.getElementsByClassName('ng-scope')[0];
var scope = angular.element(elem).scope();
  /**
   * Checks for the outcome schema variables to highlight when task will be marked as done.
   *
   */
  scope.ctrl.magnify = function() {
    try {
      var provider = (scope.ctrl.outcomeProvider_ || scope.ctrl.saveProvider_
        .outcomeProvider_);
      var outcome = provider.outcome;
      if (!outcome) {
        return;
      }
      //Check for AmUnavailable && permanently closed combination
      if (outcome.name === "AmUnavailable" && outcome.args.permanently_closed) {
        if (outcome.args.permanently_closed.value) {
          scope.ctrl.highlight = true;
        }
      }
      //Check for AmUnavailable and temporarily closed combination
      else if (outcome.name === "AmUnavailable" && outcome.args.temporarily_closed) {
        if (outcome.args.temporarily_closed.value) {
          scope.ctrl.highlight = true;
        }
      }
      //Check for AmUnavailable and never takes reservations combination
      else if (outcome.name === "AmUnavailable" && outcome.args.never_takes_reservations) {
        if (outcome.args.never_takes_reservations.value) {
          scope.ctrl.highlight = true;
        }
      }
      //Check for AmUnavailable and online reservations only combination
      else if (outcome.name === "AmUnavailable" && outcome.args.online_reservations_only) {
        if (outcome.args.online_reservations_only.value) {
          scope.ctrl.highlight = true;
        }
      }
      //Check for AmUnavailable and has party size information combination
      else if (outcome.name === "AmUnavailable" && outcome.args.has_party_size_information) {
        if (outcome.args.has_party_size_information) {
          scope.ctrl.highlight = true;
        }
      }
      //Check for AmUnavailable and wrong number combination
      else if (outcome.name === "AmUnavailable" && outcome.args.wrong_number) {
        if (outcome.args.wrong_number.value) {
          scope.ctrl.highlight = true;
        }
      }
      //Check for IVRNavigationFailed and no relevant option combination
      else if (outcome.name === "IVRNavigationFailed" && outcome.args
        .no_relevant_option) {
        if (outcome.args.no_relevant_option.value) {
          scope.ctrl.highlight = true;
        }
      }
      //Check if outcome name is WrongNumber
      else if (outcome.name === "WrongNumber") {
        scope.ctrl.highlight = true;
      }
      //Check if outcome name is OnlineReservationsOnly
      else if (outcome.name === "OnlineReservationsOnly") {
        scope.ctrl.highlight = true;
      }
      //Check if outcome name is DoestSpeakEnglish
      else if (outcome.name === "DoesntSpeakEnglish") {
        scope.ctrl.highlight = true;
      }
      //Check if outcome name is ReservationRefused
      else if (outcome.name === "ReservationRefused") {
        scope.ctrl.highlight = true;
      }
      //Check if outcome name is OtherFailure
      else if (outcome.name === "OtherFailure") {
        scope.ctrl.highlight = true;
      }
      //Check if outcome name is NumberDisconnected
      else if (outcome.name === "NumberDisconnected") {
        scope.ctrl.highlight = true;
      }
      //If else fails, then there is no need to highlight the page
      else {
        scope.ctrl.highlight = false;
      }
      /*/Check if Blacklist_for_fake_calls is selected for any outcome
      TODO: wait for confirmation on new follow up actions for blacklist_for_fake_calls replacement
      if(outcome.args.blacklist_for_fake_calls) {
          if(outcome.args.blacklist_for_fake_calls.value) {
              scope.ctrl.highlight = true;
          }
      }*/
      //Gets follow-up warnings
      var warnings = document.getElementById(
        'outcome-actions-container').children[
        1].children;
      for (var i = 0; i < warnings.length; i++) {
        if (warnings[i].outerText ===
          "The task will be marked as done." &&
          scope.ctrl.highlight) {
          warnings[i].style.color = 'blue';
          warnings[i].style.background = "indianred";
          warnings[i].style.fontWeight = 'bold';
          warnings[i].style.fontSize = "18px";
        } else {
          warnings[i].style.color = "inherit";
          warnings[i].style.background = "inherit";
          warnings[i].style.fontWeight = 'inherit';
          warnings[i].style.fontSize = "inherit";
        }
      }
    } catch (e) {
      //Do nothing
    }
  };
  setInterval(scope.ctrl.magnify, 1000);
};
/**
 * On load page, depending on the URL, injects different pieces of code to bg-plyaer or bg-hub
 *
 */
window.onload = function() {
  var url = document.URL;
  //If BG Player is loaded
  if (url.indexOf('https://bg-player') > -1 && document.readyState ===
    "complete") {
    setTimeout(function() {
      var body = document.getElementsByTagName('body')[0];
      var script = document.createElement('script');
      script.type = 'text/javascript';
      code = code.toString();
      code = code.slice(code.indexOf("{") + 1, code.lastIndexOf(
        "}"));
      script.text = code;
      body.appendChild(script);
    }, 0);
  }
  //IF NOS is loaded and it is part of the outcome review page
  if (url.indexOf('https://bg-ops') > -1 && url.indexOf(
      'call_review') &&
    document.readyState === "complete") {
    setTimeout(function() {
      var head = document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      style.type = 'text/css';
      style.appendChild(document.createTextNode(
        ".magnify-details {background-color: #cd5c5c !important; color: #fff !important}"
      ));
      head.appendChild(style);
      clearDelay = setInterval(onBgHubLoad, 1000);
    }, 0);
  }
};
/**
 * Function to run when BG Hub (NOS) is loaded
 */
function onBgHubLoad() {
  highLightDetails();
}
/**
 * Highlight Task Details on BG-Hub NOS Outcome Review page
 */
function highLightDetails() {
  //Outcomes where we need to highlight the task Details
  //ReservationMade
  //ReservationCancelled
  try {
    var reservationMade = document.getElementsByClassName(
      'chip reservationmade ng-star-inserted selected');
    var reservationCancelled = document.getElementsByClassName(
      'header')[1];
    //Task Details
    var details = document.getElementsByTagName('task-attributes')[0];
    if (!details) {
      return;
    }
    //Detail key namess
    var keys = details.getElementsByClassName('key');
    //Detail values
    var values = details.getElementsByClassName('value');
    if (reservationMade.length > 0 || reservationCancelled.outerText.indexOf(
        'ReservationCancelled') > -1) {
      for (var i in keys) {
        if (DETAILS_TO_HIGHLIGHT.indexOf(keys[i].outerText) > -1) {
          values[i].classList.add('magnify-details');
          values[i].title = "Confirm the highlighted details";
        }
      }
    } else {
      for (var i in keys) {
        if (DETAILS_TO_HIGHLIGHT.indexOf(keys[i].outerText) > -1) {
          values[i].classList.remove('magnify-details');
          values[i].title = '';
        }
      }
    }
  } catch (e) {
    //Do nothing
  }
}