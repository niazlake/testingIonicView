profileFact.$inject = ['$cordovaDialogs', '$ionicHistory', 'api'];

function profileFact($cordovaDialogs, $ionicHistory, api) {

  var data = {
    data: {},
    callback: null
  };

  var init = function(callback) {
    var phone = window.localStorage.getItem('phone');
    var name = window.localStorage.getItem('name');

    setData({
      phone: phone,
      name: name
    });

    setCallback(callback);
  };

  var setData = function(_data) {
    if ( !angular.isUndefined(_data) ){
      angular.extend(data.data, _data);
      if ( !angular.isUndefined(_data.phone) )
        window.localStorage.setItem('phone', _data.phone);
      if ( !angular.isUndefined(_data.name) )
        window.localStorage.setItem('name', _data.name);
    }
    if ( angular.isFunction(data.callback) )
      data.callback(data.data);
  };

  var changeName = function(name) {
    api.changeName(name, function(success) {
      setData({name: name});
      $cordovaDialogs
        .alert(success.data.data.message, 'Выполнено', 'OK')
        .then(function() {
          $ionicHistory.goBack();
        });
    }, function(error) {
      $cordovaDialogs.alert(error.data.message, 'Ошибка!', 'OK');
    });
  };

  var sendSms = function(phone) {
    api.changePhone({phone: phone}, function(success) {
      $cordovaDialogs.prompt('На ваш номер был выслан SMS-код, введите его', 'Внимание!', ['Отправить','Отмена'], '')
        .then(function(result) {
          var input = result.input1;
          if (result.buttonIndex === 1)
            api.changePhone({
              phone: phone,
              code: input
            }, function(success) {
              $cordovaDialogs.alert(success.data.message, 'Выполнено', 'OK');
            }, function(error) {
              $cordovaDialogs.alert(error.data.message, 'Ошибка!', 'OK');
            });
        });
    }, function(error) {
      $cordovaDialogs.alert(error.data.message, 'Ошибка!', 'OK');
    });
  };

  var setCallback = function(callback) {
    if ( angular.isFunction(callback) ) {
      data.callback = callback;
      callback(data.data);
    }
  };

  return {
    init:        init,
    setData:     setData,
    setCallback: setCallback,
    sendSms:     sendSms,
    changeName:  changeName
  };

};