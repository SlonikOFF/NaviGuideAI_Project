//Подгрузка файлов в буффер
var BufferLoader = function (context, urlList, callback) {
  this.context = context;
  this.urlList = urlList;
  this.onload = callback;
  this.bufferList = new Array();
  this.loadCount = 0;
};

BufferLoader.prototype.load = function () {
  for (var i = 0; i < this.urlList.length; ++i) {
    this.loadBuffer(this.urlList[i], i);
  }
};

BufferLoader.prototype.loadBuffer = function (url, index) {
  var request = new XMLHttpRequest();
  request.open("GET", url, true);
  request.responseType = "arraybuffer";

  var loader = this;

  request.onload = function () {
    loader.context.decodeAudioData(
      request.response,
      function (buffer) {
        if (!buffer) {
          alert("error decoding file data: " + url);
          return;
        }
        loader.bufferList[index] = buffer;
        if (++loader.loadCount == loader.urlList.length) {
          loader.onload(loader.bufferList);
        }
      },
      function (error: any) {
        console.error("decodeAudioData error", error);
      }
    );
  };

  request.onerror = function () {
    alert("BufferLoader: XHR error");
  };

  request.send();
};

var d = document,
  w = window,
  context = null,
  dest = null,
  source = null;
var init = function () {
  try {
    var audioContext = w.AudioContext || w.webkitAudioContext;
    navigator.getMedia =
      navigator.getUserMedia ||
      navigator.webkitGetUserMedia ||
      navigator.mozGetUserMedia ||
      navigator.msGetUserMedia;
    //Создаем контекст
    context = new audioContext();
    //выход по умолчанию
    dest = context.destination;

    var bufferLoader = new BufferLoader(
      context,
      ["effects/reverb.wav"],
      function (buffers) {
        navigator.getMedia(
          { audio: true },
          function (striam) {
            //Создаем интерфейс для получения данных из потока
            source = context.createMediaStreamSource(striam);
          },
          function (e) {
            alert(e);
          }
        );
      }
    );
    bufferLoader.load();
  } catch (e) {
    alert(e.message);
  }
};
