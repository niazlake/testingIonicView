orderReviewSetTimeCtrl.$inject = [
  '$scope',
  '$state',
  '$ionicHistory',
  '$filter',
  'ionicDatePicker',
  'ionicTimePicker',
  'order',
  'api'
];

function orderReviewSetTimeCtrl(
  $scope,
  $state,
  $ionicHistory,
  $filter,
  ionicDatePicker,
  ionicTimePicker,
  order,
  api
) {

  $scope.date = $filter('date')(new Date(), 'dd.MM.yyyy');
  $scope.time = $filter('date')(new Date(), 'HH:mm');

  var
    datepicker = {
      callback: function (val) {
        $scope.date = $filter('date')(new Date(val), 'dd.MM.yyyy');
      }
    },
    timepicker = {
      callback: function (val) {
        if (typeof (val) === 'undefined') {
          console.log('Time not selected');
        } else {
          $scope.time = $filter('date')(new Date(val * 1000), 'HH:mm', '+0000');
        }
      },
      format: 24,
      step: 1,
      closeLabel: 'Закрыть',
      setLabel: 'Выбрать'
    };
  $scope.setDate = function() {
    var date = $scope.date + ' ' + $scope.time;
    console.log('DATE: ', date);
    var currTariff = order.getApiData().tariff;
    console.log('currTariff', currTariff)
    order.setOption('time', {
      'value': date,
      'name': date,
      'icon': 'icon-soon'
    });
    api.getClass(function(success) {
      var list = success.data.data.items;
      var found = false;
      order.setOptionsList('class', list);
      list.forEach(function(item) {
        if (item.id === currTariff) {
          found = true;
          order.setOption('class', item);
          return false;
        }
      });
      if (!found) order.setOption('class', list[0]);
      // order.reflashTotal();
      $ionicHistory.goBack(-2);
    }, function(error) {}, {
      date: date
    });

  };
  $scope.showDate = function() {
    ionicDatePicker.openDatePicker(datepicker);
  };
  $scope.showTime = function() {
    ionicTimePicker.openTimePicker(timepicker);
  };

};
