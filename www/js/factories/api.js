apiFact.$inject = [
  '$http',
  '$state',
  '$ionicPopup',
  '$cordovaDialogs',
  '$cordovaProgress',
  '$timeout',
  '$translate'
];

function apiFact(
  $http,
  $state,
  $ionicPopup,
  $cordovaDialogs,
  $cordovaProgress,
  $timeout,
  $translate
) {
  var
    configApi = {
      url: API_URL,
      methods: {
        auth: '/auth',
        getAddressByGeo: '/address/search-gps',
        getAddressesByName: '/address/search-name',
        getGeoByIp: '/address/search-ip',
        setRate: '/order',
        faq: '/faq',
        createOrder: '/order/create',
        cancelOrder: '/order',
        calculate: '/order/calculate',
        handler: '/order/handler',
        getTariff: '/tariff',
        getHistory: '/order',
        setName: '/user/name',
        setPhone: '/user/phone',
        favorite: '/address/favorite',
        other: '/extend-service',
        getRoute: '/address/search-route',
        pay: '/user/pay',
        confirmPay: '/pay/bisys',
        longPool: '/longpool',
        payBisys: '/pay/bisys',
        chooseDriver: '/chooseDriver',
        cancelDriver: '/cancelDriver'
      }
    },
    errorAction = function(status) {
      if (status === 403 || status === 401) {
        window.localStorage.setItem('token', null);
        $state.go(REGISTRATION);
      }
    },
    registration = function(params, success, error) {
    console.log(params);
      window.localStorage.setItem('phone', params.login);
      window.localStorage.setItem('name', params.name);
      params.login = '7' + params.login;
      $http({
        url: configApi.url + configApi.methods.auth,
        method: 'GET',
        params: params
      }).then(
        function (response) {
          console.log(response);
          if (angular.isFunction(success))
            success(response);
        },
        function (response) {
          console.log(response);
          if (angular.isFunction(error))
            error(response);
        }
      );
    },
    confirm = function(data, success, error) {
      window.localStorage.setItem('phone', data.login);
      data.login = '7' + data.login;

      $http({
        url: configApi.url + configApi.methods.auth,
        method: 'POST',
        data: data
      }).then(
        function (response) {
          window.localStorage.setItem('token', response.data.data.access_token);
          console.log(response);
          if (angular.isFunction(success))
            success(response);
        },
        function (response) {
          console.log(response);
          if (angular.isFunction(error))
            error(response);
        }
      );
    },
    chooseDriver = function(data, success, error) {
      var params = { access_token: window.localStorage.getItem('token') };

      $http({
        url: configApi.url + configApi.methods.chooseDriver + '/' + data.orderId + '/' + data.driverId,
        method: 'PUT',
        params: params
      }).then(
        function (response) {
          console.log(response);
          if (angular.isFunction(success))
            success(response);
        },
        function (response) {
          console.log(response);
          if (angular.isFunction(error))
            error(response);
        }
      );
    },
    cancelDriver = function(data, success, error) {
      var params = { access_token: window.localStorage.getItem('token') };

      $http({
        url: configApi.url + configApi.methods.cancelDriver + '/' + data.orderId + '/' + data.driverId,
        method: 'PUT',
        params: params
      }).then(
        function (response) {
          console.log(response);
          if (angular.isFunction(success))
            success(response);
        },
        function (response) {
          console.log(response);
          if (angular.isFunction(error))
            error(response);
        }
      );
    },
    getPaymentList = function(success, error) {
      var params = { access_token: window.localStorage.getItem('token') }

      $http({
        url: configApi.url + configApi.methods.pay,
        method: 'GET',
        params: params
      }).then(
        function (response) {
          console.log(response);
          if (angular.isFunction(success))
            success(response);
        },
        function (response) {
          console.log(response);
          if (angular.isFunction(error))
            error(response);
        }
      );
    },
    getPaymentBisysList = function(success, error) {
      var params = { access_token: window.localStorage.getItem('token') }

      $http({
        url: configApi.url + configApi.methods.payBisys,
        method: 'GET',
        params: params
      }).then(
        function (response) {
          console.log(response);
          if (angular.isFunction(success))
            success(response.data.data);
        },
        function (response) {
          console.log(response);
          if (angular.isFunction(error))
            error(response);
        }
      );
    },
    addPaymentBisysItem = function(success, error) {
      var params = { access_token: window.localStorage.getItem('token') };

      $http({
        url: configApi.url + configApi.methods.payBisys,
        method: 'POST',
        params: params
      }).then(
        function (response) {
          console.log(response);
          if (angular.isFunction(success))
            success(response);
        },
        function (response) {
          console.log(response);
          if (angular.isFunction(error))
            error(response);
        }
      );
    },
    deletePaymentBisysItem = function(id, success, error) {
      var params = { access_token: window.localStorage.getItem('token') };

      $http({
        url: configApi.url + configApi.methods.payBisys + '/' + id,
        method: 'DELETE',
        params: params
      }).then(
        function (response) {
          console.log(response);
          if (angular.isFunction(success))
            success(response);
        },
        function (response) {
          console.log(response);
          if (angular.isFunction(error))
            error(response);
        }
      );
    },
    getAddressesByName = function(params, success, error) {
      params.access_token = window.localStorage.getItem('token');

      $http({
        url: configApi.url + configApi.methods.getAddressesByName,
        method: 'GET',
        params: params,
        paramSerializer: '$httpParamSerializerJQLike'
      }).then(
        function (response) {
          console.log(response);
          if (angular.isFunction(success))
            success(response.data.data);
        },
        function (response) {
          if (response.status === 400 && params.limit === 1) $cordovaDialogs.alert('Данный адрес не поддерживается!', 'Внимание!', 'ОК');
          errorAction(response.status);
          console.log(response);
          if (angular.isFunction(error))
            error(response);
        }
      );
    },
    getAddressByGeo = function(params, success, error) {
      params.access_token = window.localStorage.getItem('token');

      $http({
        url: configApi.url + configApi.methods.getAddressByGeo,
        method: 'GET',
        params: params,
        cache: false
      }).then(
        function (response) {
          //$cordovaProgress.hide();
          console.log(response);
          if (angular.isFunction(success))
            success(response.data.data);
        },
        function (response) {
          //$cordovaProgress.hide();
          errorAction(response.status);
          console.log(response);
          if (angular.isFunction(error))
            error(response);
        }
      );
    },
    getGeoByIp = function(success, error) {
      var params = { access_token: window.localStorage.getItem('token') };

      $http({
        url: configApi.url + configApi.methods.getGeoByIp,
        method: 'GET',
        params: params
      }).then(
        function (response) {
          console.log(response);
          if (angular.isFunction(success))
            success(response);
        },
        function (response) {
          console.log(response);
          if (angular.isFunction(error))
            error(response);
        }
      );
    },
    getOther = function(params, success, error) {
      params.access_token = window.localStorage.getItem('token');

      $http({
        url: configApi.url + configApi.methods.other,
        method: 'GET',
        params: params,
        paramSerializer: '$httpParamSerializerJQLike'
      }).then(
        function (response) {
          console.log(response);
          if (angular.isFunction(success))
            success(response);
        },
        function (response) {
          errorAction(response.status);
          console.log(response);
          if (angular.isFunction(error))
            error(response);
        }
      );
    };
    calculate = function(params, success, error) {
      params.access_token = window.localStorage.getItem('token');

      $http({
        url: configApi.url + configApi.methods.calculate,
        method: 'GET',
        params: params,
        paramSerializer: '$httpParamSerializerJQLike'
      }).then(
        function (response) {
          console.log("RESPONSE : ", response);
          if (angular.isFunction(success))
            success(response);
        },
        function (response) {
          errorAction(response.status);
          console.log(response);
          if (angular.isFunction(error))
            error(response);
        }
      );
    };
    createOrder = function(data, success, error) {
      $translate(['wait_create']).then(function(t) {
        $cordovaProgress.showSimpleWithLabel(true, t.wait_create);
      });
      var params = { access_token: window.localStorage.getItem('token') };

      $http({
        url: configApi.url + configApi.methods.createOrder,
        method: 'POST',
        params: params,
        data: data
      }).then(
        function (response) {
          $cordovaProgress.hide();
          console.log('CREATE ORDER RESPONSE: ', response);
          if (angular.isFunction(success))
            success(response);
        },
        function (response) {
          $cordovaProgress.hide();
          console.log(response);
          if (angular.isFunction(error))
            error(response);
        }
      );
    };
    cancelOrder = function(id, success, error) {
      $translate(['cancelling']).then(function(t) {
        $cordovaProgress.showSimpleWithLabel(true, t.cancelling);
      });
      var params = { access_token: window.localStorage.getItem('token') };

      $http({
        url: configApi.url + configApi.methods.cancelOrder + '/' + id + '/cancel',
        method: 'PUT',
        params: params
      }).then(function(response) {
        $cordovaProgress.hide();
        if (angular.isFunction(success))
          success(response);
      }, function(response) {
        $cordovaProgress.hide();
        errorAction(response.status);
        console.log(response);
        if (angular.isFunction(error))
          error(response);
      });
    };
    getPayment = function(success, error) {
      success({
        data: {
          data: {
            items: [
              {
                id: 0,
                name: 'Наличными'
              },
              {
                id: 1,
                name: 'Банковской картой'
              }
            ]
          }
        }
      });
    };
    getClass = function(success, error, params) {
      if (typeof params === 'undefined')
        params = { access_token: window.localStorage.getItem('token') };
      else
        params.access_token = window.localStorage.getItem('token');
      $http({
        url: configApi.url + configApi.methods.getTariff,
        method: 'GET',
        params: params
      }).then(
        function (response) {
          console.log(response);
          if (angular.isFunction(success))
            success(response);
        },
        function (response) {
          errorAction(response.status);
          console.log(response);
          if (angular.isFunction(error))
            error(response);
        }
      );
    };
    getRoute = function(route, success, error) {

      var to, from;
      var middle = [];
      var keyLength = [];

      to = [route[0].lat, route[0].lng].join();

      from = [route[route.length - 1].lat, route[route.length - 1].lng].join();

      angular.forEach(route, function(value, key){

        keyLength.push(key);

      });

      for (i = 1; i < keyLength.length - 1; i++) {
        middle.push([route[i].lat, route[i].lng].join());
      }


      var params = {
        to: to,
        from: from,
        access_token: window.localStorage.getItem('token')
      }

      if (middle.length) {
        params.middle = middle;
      }

      $http({
        url: configApi.url + configApi.methods.getRoute,
        method: 'GET',
        params: params,
        paramSerializer: '$httpParamSerializerJQLike'
      }).then(
        function (response) {
          console.log(response);
          if (angular.isFunction(success))
            success(response);
        },
        function (response) {
          console.log(response);
          if (angular.isFunction(error))
            error(response);
        }
      );
    },
    getFavorite = function(success, error) {
      $cordovaProgress.showSimple(true);
      var params = { access_token: window.localStorage.getItem('token') };
      $http({
        url: configApi.url + configApi.methods.favorite,
        method: 'GET',
        params: params
      }).then(
        function (response) {
          $cordovaProgress.hide();
          console.log(response);
          if (angular.isFunction(success))
            success(response);
        },
        function (response) {
          $cordovaProgress.hide();
          errorAction(response.status);
          console.log(response);
          if (angular.isFunction(error))
            error(response);
        }
      );
    },
    removeFavorite = function(id, success, error) {
      $cordovaProgress.showSimple(true);
      var params = { access_token: window.localStorage.getItem('token') };

      $http({
        url: configApi.url + configApi.methods.favorite + '/' + id,
        method: 'DELETE',
        params: params
      }).then(
        function (response) {
          $cordovaProgress.hide();
          console.log(response);
          if (angular.isFunction(success))
            success(response);
        },
        function (response) {
          $cordovaProgress.hide();
          errorAction(response.status);
          console.log(response);
          if (angular.isFunction(error))
            error(response);
        }
      );
    },
    createFavorite = function(data, success, error) {
      $cordovaProgress.showSimple(true);
      var params = { access_token: window.localStorage.getItem('token') };
      $http({
        url: configApi.url + configApi.methods.favorite,
        method: 'POST',
        params: params,
        data: data
      }).then(
        function (response) {
          $cordovaProgress.hide();
          console.log(response);
          if (angular.isFunction(success))
            success(response);
        },
        function (response) {
          $cordovaProgress.hide();
          if (response.status === 400) $cordovaDialogs.alert('Данный адрес не поддерживается!', 'Внимание!', 'ОК');
          console.log(response);
          if (angular.isFunction(error))
            error(response);
        }
      );
    },
    getHistoryList = function(success, error) {
      $translate(['loading']).then(function(t) {
        $cordovaProgress.showSimpleWithLabel(true, t.loading);
      });
      var params = { access_token: window.localStorage.getItem('token') };

      $http({
        url: configApi.url + configApi.methods.getHistory,
        method: 'GET',
        params: params
      }).then(
        function (response) {
          $cordovaProgress.hide();
          console.log(response);
          if (angular.isFunction(success))
            success(response);
        },
        function (response) {
          $cordovaProgress.hide();
          errorAction(response.status);
          console.log(response);
          if (angular.isFunction(error))
            error(response);
        }
      );
    },
    getHistoryFull = function(id, success, error) {
      $translate(['loading']).then(function(t) {
        $cordovaProgress.showSimpleWithLabel(true, t.loading);
      });
      var params = { access_token: window.localStorage.getItem('token') };

      $http({
        url: configApi.url + configApi.methods.getHistory + '/' + id,
        method: 'GET',
        params: params
      }).then(
        function (response) {
          $cordovaProgress.hide();

          console.log(response);
          if (angular.isFunction(success))
            success(response);
        },
        function (response) {
          $cordovaProgress.hide();

          errorAction(response.status);
          console.log(response);
          if (angular.isFunction(error))
            error(response);
        }
      );
    },
    clearHistory = function(success, error) {
      $cordovaProgress.showSimple(true);

      var params = { access_token: window.localStorage.getItem('token') };
      console.log('Clear History', configApi.url + configApi.methods.getHistory);
      $http({
        url: configApi.url + configApi.methods.getHistory,
        method: 'DELETE',
        params: params
      }).then(
        function (response) {
          $cordovaProgress.hide();

          console.log(response);
          if (angular.isFunction(success))
            success(response);
        },
        function (response) {
          $cordovaProgress.hide();

          errorAction(response.status);
          console.log(response);
          if (angular.isFunction(error))
            error(response);
        }
      );
    },
    setRate = function(data, success, error) {
      var params = { access_token: window.localStorage.getItem('token') };

      $http({
        url: configApi.url + configApi.methods.setRate + '/' + data.id + '/rate',
        method: 'PUT',
        params: params,
        data: data
      }).then(function(response) {
        if (angular.isFunction(success))
          success(response);
      }, function(response) {
        errorAction(response.status);
        if (angular.isFunction(error))
          error(response);
      });
    },
    getFaq = function(success, error) {
      var params = { access_token: window.localStorage.getItem('token') };

      $http({
        url: configApi.url + configApi.methods.faq,
        method: 'GET',
        params: params
      }).then(
        function (response) {
          console.log(response);
          if (angular.isFunction(success))
            success(response);
        },
        function (response) {
          console.log(response);
          if (angular.isFunction(error))
            error(response);
        }
      );
    },
    changeName = function(name, success, error) {
      $cordovaProgress.showSimple(true);

      var params = { access_token: window.localStorage.getItem('token') };

      $http({
        url: configApi.url + configApi.methods.setName,
        method: 'PUT',
        params: params,
        data: {
          name: name
        }
      }).then(function(response) {
        $cordovaProgress.hide();
        console.log(response);
        if (angular.isFunction(success))
          success(response);
      }, function(response) {
        $cordovaProgress.hide();
        errorAction(response.status);
        console.log(response);
        if (angular.isFunction(error))
          error(response);
      });
    },
    changePhone = function(data, success, error) {
      $cordovaProgress.showSimple(true);

      var params = {
        access_token: window.localStorage.getItem('token')
      };
      angular.extend(params, data);

      $http({
        url: configApi.url + configApi.methods.setPhone,
        method: 'PUT',
        params: params
      }).then(function(response) {
        $cordovaProgress.hide();
        if (angular.isFunction(success))
          success(response);
      }, function(response) {
        $cordovaProgress.hide();
        errorAction(response.status);
        console.log(response);
        if (angular.isFunction(error))
          error(response);
      });
    },
    longPool = function(last, success, error) {
      var params = {
        access_token: window.localStorage.getItem('token')
      };
      if (last !== null)
        params.last = last;
      console.log('=== begin long-pool time: ' + last + ' ===');
      $http({
        url: configApi.url + configApi.methods.longPool,
        method: 'GET',
        params: params
      }).then(
        function (response) {
          console.log(response);
          console.log('=== end long-pool ===');
          if (angular.isFunction(success))
            success(response);
        },
        function (response) {
          console.log(response);
          console.log('=== end long-pool ===');
          if (angular.isFunction(error))
            error(response);
        }
      );
    },
    confirmPayment = function(id, code, success, error) {
      var params = {
        access_token: window.localStorage.getItem('token'),
      };

      $http({
        url: configApi.url + configApi.methods.confirmPay + '/' + id,
        method: 'PUT',
        params: params,
        data: {
          code: code
        }
      }).then(function(response) {
        if (angular.isFunction(success))
          success(response);
      }, function(response) {
        errorAction(response.status);
        console.log(response);
        if (angular.isFunction(error))
          error(response);
      });
    },
    historyHandler = function(last, success, error) {
      var params = {
        access_token: window.localStorage.getItem('token')
      };
      if (last !== null)
        params.last = last;

      $http({
        url: configApi.url + configApi.methods.handler,
        method: 'GET',
        params: params
      }).then(
        function (response) {
          console.log(response);
          if (angular.isFunction(success))
            success(response);
        },
        function (response) {
          console.log(response);
          if (angular.isFunction(error))
            error(response);
        }
      );
    };

  return {
    registration:           registration,
    confirm:                confirm,
    confirmPayment:         confirmPayment,
    getAddressesByName:     getAddressesByName,
    getAddressByGeo:        getAddressByGeo,
    getGeoByIp:             getGeoByIp,
    getOther:               getOther,
    getClass:               getClass,
    getPayment:             getPayment,
    getFavorite:            getFavorite,
    createFavorite:         createFavorite,
    removeFavorite:         removeFavorite,
    calculate:              calculate,
    createOrder:            createOrder,
    cancelOrder:            cancelOrder,
    getHistoryList:         getHistoryList,
    getHistoryItem:         getHistoryFull,
    clearHistory:           clearHistory,
    longPool:               longPool,
    historyHandler:         historyHandler,
    changeName:             changeName,
    changePhone:            changePhone,
    getFaq:                 getFaq,
    setRate:                setRate,
    getRoute:               getRoute,
    getPaymentList:         getPaymentList,
    getPaymentBisysList:    getPaymentBisysList,
    addPaymentBisysItem:    addPaymentBisysItem,
    deletePaymentBisysItem: deletePaymentBisysItem,
    chooseDriver:           chooseDriver,
    cancelDriver:           cancelDriver
  };
}
