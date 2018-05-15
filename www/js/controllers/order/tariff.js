orderReviewTariffCtrl.$inject = ['$scope', '$state', '$ionicHistory', '$translate', 'order', 'api'];

function orderReviewTariffCtrl($scope, $state, $ionicHistory, $translate, order, api) {
  var type = 'tariff';
  $scope.type = type;

  $translate(["tariff"]).then(function(t) {
    $scope.title = t.tariff;
  });

  $scope.setOption = function(option, index) {
    option.icon = 'icon-' + type + '-' + index;
    order.setOption(type, option);
    //order.reflashTotal();
    $ionicHistory.goBack();
  };

  $scope.options = [
    {
      value: 1,
      name: 'Фиксированный'
    },
    {
      value: 2,
      name: 'Таксометр'
    }
  ];

};
