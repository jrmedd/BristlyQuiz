chrome.serial.getDevices(onGetDevices);

var teams;
var currentTeam;
var currentQuestion;
var progress = 0;

var loadedQuestions;

/*Load questions from JSON and do a Fisher-Yates shuffle, load teams from JSON and load a question*/
$.getJSON(chrome.runtime.getURL('js/questions.json'), function(questions) {
  var j, x, i;
  for (i = questions.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = questions[i];
      questions[i] = questions[j];
      questions[j] = x;
  }
  loadedQuestions = questions;
  $.getJSON(chrome.runtime.getURL('js/teams.json'), function(teamInfo) {
    teams = teamInfo.teams;
    displayQuestion();
  });
});

/*random range function*/
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

/*advance team function*/
function advanceTeam(team) {
  var teamCommand = "move_team('" + team + "')\r";
  writeSerial(teamCommand);
}

/*Display question function*/
function displayQuestion() {
  if ((progress +1) > loadedQuestions.length) {
    $("#question").html("<h3>That's all the questions!</h3>").hide().fadeIn();
    return true;
  }
  currentTeam = teams[progress%teams.length];
  currentQuestion = loadedQuestions[progress];
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
}

/*Question answering bind*/
$("#answers").on('click', 'a', function(e){
  e.preventDefault();
  var clickedAnswer = $(this);
  $("#answers").hide();
  if (clickedAnswer.hasClass('correct')) {
    advanceTeam(currentTeam);
    $("#question").html("<h3>That's correct! You move for 5 seconds!</h3>").hide().fadeIn();
  }
  else if (clickedAnswer.hasClass('incorrect')) {
    $("#question").html("<h3>Too bad, everyone else moves, you stay still! The correct answer was: <span class='actual'>"+currentQuestion.correct+"</span></h3>").hide().fadeIn();
    $.each(teams, function(idx, teamName) {
      if (teamName != currentTeam) {
        advanceTeam(teamName);
      }
    });
  }
  setTimeout(function() {progress ++; displayQuestion();}, 2000);
});
