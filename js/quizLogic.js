chrome.serial.getDevices(onGetDevices);

$('.team-advance').on('click', function(e){
  var team = "move_team('" + $(this).val() + "')\r";
  console.log(team);
  writeSerial(team);
});

$.getJSON(chrome.runtime.getURL('js/questions.json'), function(questions) {
  $.each(questions, function(idx, value){
    console.log(value.question);
  });
});
