paymentFact.$inject = [
  '$rootScope',
  '$cordovaInAppBrowser',
  '$cordovaProgress',
  'api'
];

function paymentFact(
  $rootScope,
  $cordovaInAppBrowser,
  $cordovaProgress,
  api
) {
  var model = {};

  var callbacks = {};

  var openPayment = false;
  var initExit = false;

  var addPayment = function() {
    if (initExit === false) {
      $rootScope.$on('$cordovaInAppBrowser:exit', function(e, event) {
        if (openPayment === true) {
          loadingModel('bisys', function() {
            runCallback('list');
          });
        }
        openPayment = false;
      });
      initExit = true;
    }

    api.addPaymentBisysItem(function(data) {
      var url = data.data.data.url;

      $cordovaInAppBrowser.open(url, '_blank')
        .then(function(event) {
          openPayment = true;
        })
    });
  };

  var removePayment = function(id) {
    $cordovaProgress.showSimpleWithLabel(true, 'Удаление...');
    api.deletePaymentBisysItem(id, function(data) {
      model.bisys = model.bisys.filter(function(obj, index) {
        if (obj.id === id)
          return false;
        return true;
      });
      runCallback('list');
      $cordovaProgress.hide();
    }, function(error) {
      $cordovaProgress.hide();
    });
  };

  var setCallback = function(name, callback) {
    if (angular.isFunction(callback)) {
      callbacks[name] = callback;
      loadingModel('bisys', function() {
        runCallback('list');
      });
    }
  };

  var getCallback = function(name) {
    if (angular.isFunction(callbacks[name]))
      return callbacks[name];
    return null;
  }

  var runCallback = function(name) {
    name = ( angular.isUndefined(name) ) ? null : name;
    if (angular.isFunction(callbacks[name]))
      callbacks[name](model.bisys);
  };

  var loadingModel = function(name, callback) {
    $cordovaProgress.showSimpleWithLabel(true, 'Загрузка...');
    api.getPaymentBisysList(function(success) {
      model[name] = success;
      if (angular.isFunction(callback))
        callback();
      $cordovaProgress.hide();
    }, function(error) {
      $cordovaProgress.hide();
    });
  };

  return {
    setCallback:   setCallback,
    addPayment:    addPayment,
    removePayment: removePayment
  }
}