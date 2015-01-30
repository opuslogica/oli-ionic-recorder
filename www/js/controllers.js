var App =  angular.module('recorder.controllers', [])

App.controller('appController', function($scope, $ionicModal, $timeout) {
});

App.controller('recorderController', function($scope) {
  $scope.recorder = null;

  $scope.get_recorder = function() {
    if (!$scope.recorder) {
      $scope.recorder = new OLIRecorder(
	function(x) { console.log("one: ", x); },
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
});
