historyRatingCtrl.$inject = [
  '$scope',
  '$rootScope',
  '$filter',
  '$state',
  '$ionicHistory',
  'history',
  'api'
];

function historyRatingCtrl(
  $scope,
  $rootScope,
  $filter,
  $state,
  $ionicHistory,
  history,
  api
) {
  var status = [
    $filter('translate')('awful'), 
    $filter('translate')('bad'),
    $filter('translate')('satisfactory'),
    $filter('translate')('good'),
    $filter('translate')('well')
  ];
  $scope.statusName = status[2];
  $scope.current = $rootScope.configApp.currency;
  $scope.form = {};
  $scope.rating = {
    iconOn: 'ion-android-star',
    iconOff: 'ion-android-star',
    iconOnColor: 'rgb(255, 223, 43)',
    iconOffColor: 'rgb(178, 178, 178)',
    rating: 3,
    minRating: 1,
    readOnly: true, 
    callback: function(rating, index) {
      $scope.statusName = status[rating - 1];
      $scope.ratingsCallback(rating, index);
    }
  };
  $scope.rate = $scope.rating.rating;
  $scope.history = [];
  $scope.ratingsCallback = function(rating, index) {
    $scope.rate = rating;
  };
  history.setViewsCallback('rating', function(data) {
    $scope.history = data;
  });
  history.render();
  $scope.setRating = function() {
    var currentId = history.getState().id;
    api.setRate({
      id: currentId,
      rate: $scope.rate,
      comment: $scope.form.comment
    }, function() {
      history.setModel({
        id: currentId,
        rate: $scope.rate
      });
      history.render();
      $state.go('menu.history');
    }, function() {

    });
    
  };
};