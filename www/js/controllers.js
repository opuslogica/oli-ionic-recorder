var App =  angular.module('recorder.controllers', [])

App.controller('appController', function($scope, $ionicModal, $timeout) {
});

App.controller('recorderController', function($scope, $cordovaFile) {
  $scope.recorder = null;

  $scope.get_recorder = function() {
    if (!$scope.recorder) {
      $scope.recorder = new OLIRecorder(
	function(file) { $scope.recent_file = file; },
	function(x) { console.log("two: ", x); },
	function(x) { console.log("tri: ", x); });
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

  $scope.upload_recent_file = function() {
    var local_file = $scope.recent_file;
    var target = "http://stream.phoncert.com/phoncertuploader.php";
    var event_dir = "1423614600.brianjfox";
    var options = { fileName: "fileSequence9999.aac", mimeType: "audio/aac", params: { userid: event_dir } };
    var success = function(fileUploadResult) { console.log("RECORDER: Upload Success: ", fileUpooadResult); };
    var failure = function(fileUploadResult) { console.log("RECORDER: Upload FAILURE: ", fileUpooadResult); };

    console.log("RECORDER: uploading file: " + local_file);
    $cordovaFile.upload(local_file, target, success, failure, options);
  };
});
