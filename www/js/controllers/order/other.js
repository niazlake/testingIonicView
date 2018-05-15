orderReviewOtherCtrl.$inject = ['$scope', '$rootScope', '$state', '$ionicHistory', 'order', 'api'];

function orderReviewOtherCtrl($scope, $rootScope, $state, $ionicHistory, order, api) {

  $scope.otherList = angular.copy(order.getOrder().options.other);

  $scope.current = $rootScope.configApp.currency;

  $scope.setOther = function() {

    order.setOption('other', $scope.otherList);
    order.reflashTotal();
    $ionicHistory.goBack();
  };

};
