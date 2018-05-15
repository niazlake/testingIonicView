orderReviewClassCtrl.$inject = ['$scope', '$state', '$ionicHistory', '$translate', 'order', 'api'];

function orderReviewClassCtrl($scope, $state, $ionicHistory, $translate, order, api) {
  var type = 'class';
  $scope.type = 'class';
  $scope.options = order.getOrder().options;

  $translate(['tariff']).then(function(t) {
    $scope.title = t.tariff;
  });

  $scope.setOption = function(option, index) {

    option.icon = (typeof option.icon == 'undefined' || option.icon == 'null' || option.icon == null) ? './img/icons/class-0.png' : option.icon; // = 'icon-' + type + '-' + index;

    order.setOption(type, option);
    var tariffId = option.id;
    var data = order.getApiData();
    api.getOther({
      tariff: tariffId,
      gps: data.points[0].lat + ',' + data.points[0].lng
    }, function(success) {
      order.reflashTotal(function() {
        var oldArr = order.getOrder().options.other;
        var newArr = success.data.data.items;
        newArr = newArr.map(function(item, index) {
            item.checked = oldArr[index].checked;
            return item;
        });
        order.setOption('other', newArr);
        $ionicHistory.goBack();
      });
    });

  };
};
