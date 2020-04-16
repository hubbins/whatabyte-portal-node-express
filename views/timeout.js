var timeoutInMiliseconds = 20 * 60 * 1000; // 20 minutes
var timeoutId;

function startTimer() {
  // window.setTimeout returns an Id that can be used to start and stop a timer
  timeoutId = window.setTimeout(doInactive, timeoutInMiliseconds);
}

function doInactive() {
  // does whatever you need it to actually do - probably signs them out or stops polling the server for info
  window.location.replace("/logout");
}

function setupTimers() {
  document.addEventListener("mousemove", resetTimer, false);
  document.addEventListener("mousedown", resetTimer, false);
  document.addEventListener("keypress", resetTimer, false);
  document.addEventListener("touchmove", resetTimer, false);

  startTimer();
}

function resetTimer() {
  window.clearTimeout(timeoutId);
  startTimer();
}

setupTimers();
