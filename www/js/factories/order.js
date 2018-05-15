orderFact.$inject = ['$filter', '$translate', 'api'];

function orderFact($filter, $translate, api) {
  var
    emptyPoint = {
      id:       null,
      address:  null,
      name:     null,
      house:    null,
      entrance: null,
      street:   null,
      city:     null,
      lat:      null,
      lng:      null,
      comment:  null
    },
    data = {
      points: [
        angular.copy(emptyPoint),
        angular.copy(emptyPoint)
      ],
      options: {
        'tariff': {
          'value': 1,
          'name': 'Фиксированный',
          'icon': 'icon-tariff-0'
        },
        'time': {
          'value': null,
          'name': 'На ближайшее время',
          'icon': 'icon-time-0'
        }
      }
    },
    total = null,
    totalCallback,
    searchCallback,
    optionsList = {},
    callbacks = {},
    orderForm = {
      id:           null,
      index:        null,
      name:         null,
      address:      null,
      house:        null,
      need:         null,
      entrance:     null,
      comment:      null,
      street:       null,
      city:         null,
      lat:          null,
      lng:          null,
      callback:     null,
      meta:         null,
      description:  null,
      view_address: false
    },
    setSearchCallback = function(callback) {
      if ( angular.isFunction(callback) ) {
        searchCallback = callback;
        var query = (orderForm.street === null) ? '' : orderForm.street;
        query = (orderForm.house === null) ? query : query + ' ' + orderForm.house;
        callback(query);
      }
    },
    runSearchCallback = function() {
      if ( angular.isFunction(searchCallback) ) {
        var query = (orderForm.street === null) ? '' : orderForm.street;
        query = (orderForm.house === null) ? query : query + ' ' + orderForm.house;
        searchCallback(query);
      }
    },
    getOrderForm = function() {
      return orderForm;
    },
    setOrderForm = function(params) {
      for (key in params) {
        orderForm[key] = params[key];
      }
      if ( angular.isFunction(orderForm.callback) )
        orderForm.callback(orderForm);
    },
    setTotalCallback = function(callback) {
      totalCallback = callback;
    },
    // it output adapter for api-server
    getApiData = function() {
      var apiData = {
        points: [],
        extend: []
      };
      if (!angular.isUndefined(data.options.class))
        apiData.tariff = data.options.class.id;

      if (!angular.isUndefined(data.options.tariff))
        apiData.calc_format = data.options.tariff.value;

      apiData.payment = data.options.payment.id;
      if (apiData.payment == 1) {
        apiData.payment_system = 'bisys';
        apiData.payment_data = data.options.payment.hash;
      }

      data.points.forEach(function(point) {
        if (point.lat !== null && point.lng !== null)
          apiData.points.push({
            lat:        point.lat,
            lng:        point.lng,
            address:    point.address,
            //street:     point.street,
            //city:       point.city,
            id_address: point.id,
            house:      point.house,
            entrance:   point.entrance,
            note:       point.comment,
            tariff:     point.tariff
          });
      });
      if (data.options.time.value !== null)
        apiData.date = data.options.time.value;
      if (!angular.isUndefined(data.options.other)) {
        data.options.other.forEach(function(option) {
          if (option.checked)
            apiData.extend.push(option.id);
        });
      }
      console.log('adapter data: ', apiData);
      return apiData;
    },
    reflashTotal = function(success, error) {
      var apiData = getApiData();
      console.log('apiData : ', apiData);
      console.log("API : ", api);
      api.calculate(apiData, function(response) {
        console.log('Result from Calculate: ', response);
        if (angular.isFunction(success)) success();
        total = response.data.data.summary + ' руб';
        if (angular.isFunction(totalCallback))
          totalCallback(total);
      }, function(reject) {
        error(reject);
      });
    },
    getTotal = function() {
      return total;
    },
    addCallback = function(key, callback) {
      if (angular.isFunction(callback)) {
        callbacks[key] = callback;
      }
    },
    runCallbacks = function(params) {
      if (angular.isUndefined(params))
        for (key in callbacks) {
          console.log('runnig callbacks: ', key);
          callbacks[key](data);
        }
      else if (angular.isFunction(callbacks[params]))
        callbacks[params](data);
    },
    getOrder = function() {
      return data;
    },
    addPoint = function() {
      data.points.push(angular.copy(emptyPoint));
      console.log(data.points);
    },
    removePoint = function(index) {
      data.points.splice(index, 1);
      // runCallbacks();
    },
    clearPoints = function() {
      data.points = [
        angular.copy(emptyPoint),
        angular.copy(emptyPoint)
      ];
      $translate(['near_future']).then(function(t) {
        data.options['time'] = {
          'value': null,
          'name': t.near_future,
          'icon': 'icon-time-0'
        };
      });

      runCallbacks();
    },
    setPoint = function(index, property) {
      if (angular.isUndefined(property)) {
        console.log('property empty in fact order method setPoint');
        return false;
      }
      if (angular.isUndefined(index)) {
        console.log('index empty in fact order method setPoint');
        return false;
      }
      data.points[index] = angular.merge(data.points[index], property);
      runCallbacks();
    },
    getPoint = function(index) {
      if ( angular.isUndefined(data.points[index]) )
        console.log('error: getPoint is undefined!');
      return data.points[index];
    },
    setOption = function(type, option) {
      data.options[type] = option;
      runCallbacks();
    },
    setOptionsList = function(type, array) {
      optionsList[type] = array;
    },
    getOptionsList = function(type) {
      return optionsList[type];
    },
    loadOptions = function(options) {
      options.forEach(function(item) {
        data.options.other.push({
          value: item.id,
          name: item.name,
          checked: false
        })
      });
    };

  return {
    setSearchCallback: setSearchCallback,
    runSearchCallback: runSearchCallback,
    getOrderForm:     getOrderForm,
    setOrderForm:     setOrderForm,
    setTotalCallback: setTotalCallback,
    reflashTotal:     reflashTotal,
    getTotal:         getTotal,
    getApiData:       getApiData,
    getOrder:         getOrder,
    addPoint:         addPoint,
    removePoint:      removePoint,
    clearPoints:      clearPoints,
    setPoint:         setPoint,
    getPoint:         getPoint,
    addCallback:      addCallback,
    setOption:        setOption,
    loadOptions:      loadOptions,
    setOptionsList:   setOptionsList,
    getOptionsList:   getOptionsList
  };
}
