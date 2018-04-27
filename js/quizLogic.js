chrome.serial.getDevices(onGetDevices);

var teams;
var currentTeam;
var currentQuestion;
var progress = 0;

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function advanceTeam(team) {
  var teamCommand = "move_team('" + team + "')\r";
  writeSerial(teamCommand);
}

$.getJSON(chrome.runtime.getURL('js/teams.json'), function(teamInfo) {
  teams = teamInfo.teams;
  displayQuestion();
});

function displayQuestion() {
  $.getJSON(chrome.runtime.getURL('js/questions.json'), function(questions) {
    if ((progress +1) > questions.length) {
      $("#question").html("<h3>That's all the questions!</h3>").hide().fadeIn();
      return true;
    }
    currentTeam = teams[progress%teams.length];
    currentQuestion = questions[progress];
    $("#question").html("<h3>For team "+currentTeam+":<br>"+currentQuestion.question+"</h3>").hide().fadeIn();
    var randomIndex = getRandomArbitrary(0, currentQuestion.incorrect.length)|0;
    $("#answers").empty();
    $.each(currentQuestion.incorrect, function(idx, value){
      if (idx == randomIndex) {
        $("#answers").append('<a class="correct" href="#">'+currentQuestion.correct+'</a><br>');
      }
      $("#answers").append('<a class="incorrect" href="#">'+value+'</a><br>');
    });
    $("#answers").fadeIn();
  });
}

$("#answers").on('click', 'a', function(e){
  e.preventDefault();
  var clickedAnswer = $(this);
  $("#answers").hide();
  if (clickedAnswer.hasClass('correct')) {
    advanceTeam(currentTeam);
    $("#question").html("<h3>That's correct! You move for 5 seconds!</h3>").hide().fadeIn();
  }
  else if (clickedAnswer.hasClass('incorrect')) {
    $("#question").html("<h3>Too bad, everyone else moves, you stay still!</h3>").hide().fadeIn();
    $.each(teams, function(idx, teamName) {
      if (teamName != currentTeam) {
        advanceTeam(teamName);
      }
    });
  }
  setTimeout(function() {progress ++; displayQuestion();}, 2000);
});
