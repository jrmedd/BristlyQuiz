var connectionId = -1;

function onGetDevices(ports){
  if (ports.length > 0) {
    $.each(ports, function(key, value) {
      $('#serial-select').append($('<option></option>').attr('value', value.path).text(value.path));
    });
  }
  else {
  }
};

function onConnect(connectionInfo){
  console.log(connectionInfo);
  connectionId = connectionInfo.connectionId;
};

$('#choose-serial-port').on('click', function(){
  var selectedPort = $('#serial-select').val();
  chrome.serial.connect(selectedPort, {bitrate: 115200}, onConnect);
});

function onSend(sentInfo) {
  console.log(sentInfo);
};

function writeSerial(str) {
  chrome.serial.send(connectionId, convertStringToArrayBuffer(str), onSend);
};

function convertStringToArrayBuffer(str) {
  var buf=new ArrayBuffer(str.length);
  var bufView=new Uint8Array(buf);
  for (var i=0; i<str.length; i++) {
    bufView[i]=str.charCodeAt(i);
  }
  return buf;
};
