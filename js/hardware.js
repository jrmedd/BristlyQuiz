var connectionId = -1;
var decoder = new TextDecoder("utf-8");

function onGetDevices(ports){
  if (ports.length > 0) {
    $.each(ports, function(key, value) {
      if (value.path.includes("tty.usbmodem")) {
        $('#serial-select').append($('<option selected="selected"></option>').attr('value', value.path).text(value.path));
        chrome.serial.connect(value.path, {bitrate: 115200}, onConnect);
      }
      else {
        $('#serial-select').append($('<option></option>').attr('value', value.path).text(value.path));
      }
    });
  }
  else {
  }
};

function onConnect(connectionInfo){
  console.log(connectionInfo);
  connectionId = connectionInfo.connectionId;
  chrome.serial.onReceive.addListener(onReceiveCallback);
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

var incoming = "";
var onReceiveCallback = function(info) {
  if (info.connectionId == connectionId && info.data) {
    incoming += decoder.decode(info.data);
    if (incoming.slice(-1) == "\n") {
      if(incoming.length == 2) {
        $("#"+incoming[0]).trigger("click");
        incoming = "";
      };
    }
  }
};
