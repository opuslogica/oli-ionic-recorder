var App =  angular.module('recorder.controllers', [])

App.controller('appController', function($scope, $ionicModal, $timeout) {
});

App.controller('recorderController', function($scope, $http) {
  $scope.recorder = null;
  $scope.upload_queue = [];

  $scope.get_recorder = function() {
    if (!$scope.recorder) {
      $scope.recorder = new OLIRecorder(
	function(file) { $scope.upload_queue.push(file); $scope.process_queue(); },
	function(x) { console.log("two: ", x); },
	function(x) { console.log("tri: ", x); });
      $scope.recorder.expungeLeftOverAudioFiles();
    }
  };

  $scope.start = function() {
    console.log("RECORDER: start_recording();");
    $scope.get_recorder();
    $scope.recorder.start();
  };

  $scope.stop = function() {
    console.log("RECORDER: stop_recording();");
    $scope.get_recorder();
    $scope.recorder.stop();
  };

  $scope.process_queue = function() {
    while ($scope.upload_queue.length > 0) {
      var file = $scope.upload_queue.shift();
      var success = function(file) { console.log("Uploaded " + file + " - now deleting it."); $scope.recorder.expungeLeftOverAudioFile(file); };
      var failure = function(file) { console.log("Failed to upload " + file); $scope.upload_queue.push(file); };
      $scope.upload_file(file, success, failure);
    }
  };
                         
  $scope.upload_file_like_a_regular_fucking_person = function(file_uri, onsuccess, onfailure) {
    var target = "http://stream.phoncert.com/phoncertuploader.php";
    var event_dir = "1423450800.brianjfox";
    var options = new FileUploadOptions();
    var success = function(result) { console.log("RECORDER: Upload SUCCESS: ", result ); onsuccess && onsuccess(file_uri); };
    var failure = function(result) { console.log("RECORDER: Upload FAILURE: ", result ); onfailure && onfailure(file_uri); };

    options.fileKey = "file";
    options.fileName = file_uri.substr(file.lastIndexOf('/') + 1);
    options.mimeType = "audio/aac";
    options.headers = { userid: event_dir };

    var ft = new FileTransfer();
    console.log("RECORDER: uploading file: " + file_uri);
    ft.upload(file, encodeURI(target), success, failure, options);
  };

  $scope.upload_file_like_a_fucking_maniac = function(file_uri, onsuccess, onfailure) {
    var target = "http://stream.phoncert.com/phoncertuploader.php";
    var event_dir = "1423450800.brianjfox";
    var success = function(result) { console.log("RECORDER: Upload SUCCESS: ", result ); onsuccess && onsuccess(file_uri); };
    var failure = function(result) { console.log("RECORDER: Upload FAILURE: ", result ); onfailure && onfailure(file_uri); };

    var gotfile = function(file_entry) {
      file_entry.file(function(file) {
        var reader = new FileReader();
        reader.onloadend = function(ev) {
          var binary_data = this.result;
          var http_args = { url: target,
                            method: "POST",
                            headers: { userid: event_dir },
                            data: new Uint8Array(reader.result),
                            transformRequest: []
                          };
          console.log("RECORDER: uploading file: " + file);
          $http(http_args).success(success).error(failure);
        };
        reader.readAsArrayBuffer(file);
      });
    };

    window.resolveLocalFileSystemURL(file_uri, gotfile, function(x) { console.log("FUCKING FAILED!", x); });
  };

  $scope.upload_file = function(file_uri, onsuccess, onfailure) {
    $scope.upload_file_like_a_fucking_maniac(file_uri, onsuccess, onfailure);
  };
});
