historyFact.$inject = ['$http', '$state', 'api'];

function historyFact($http, $state, api) {
  var
    model = {
      items: []
    },
    state = {
      id: null
    },
    views = {
      'list': null,
      'item': null,
      'drivers': null,
      'map': null,
      'rating': null
    },
    clearModel = function() {
      model.items = [];
    },
    getModel = function(id) {
      var result;
      model.items.forEach(function(item) {
        if (id === item.id) {
          result = item;
          return false;
        }
      });
      return result;
    },
    setModel = function(data) {
      if (angular.isArray(data)) {
        data.forEach(function(item, index) {
          var 
            found = false,
            currenIndex = null;
          model.items.forEach(function(itm, i) {
            if (item.id === itm.id) {
              found = true;
              currenIndex = i;
              return false;
            }
          });
          if (found) {
            for (key in data[index]) {
              model.items[currenIndex][key] = data[index][key];
            }
          } else {
            model.items.unshift(item);
          }
        });
      } else {
        var found = false;
        model.items.forEach(function(item, index) {
          if (item.id === data.id) {
            for (key in data) {
              model.items[index][key] = data[key];
            }
            found = true;
          }
        });
        if (!found)
          model.items.push(data);
      }
    },
    getCurrentModel = function() {
      var result;
      model.items.forEach(function(item) {
        if (item.id === state.id) {
          result = item;
          return false;
        }
      });
      return result;
    },
    setState = function(_state) {
      state = _state;
    },
    getState = function() {
      return state;
    },
    setViewsCallback = function(view, callback) {
      if (angular.isFunction(callback))
        views[view] = callback;
    },
    render = function() {
      var 
        isMap  = angular.isFunction(views.map),
        isList = angular.isFunction(views.list),
        isDrivers = angular.isFunction(views.drivers),
        isItem = angular.isFunction(views.item),
        isRating = angular.isFunction(views.rating);

      if (isMap || isItem || isRating || isDrivers) {
        var data;
        model.items.forEach(function(item, index) {
          if (state.id === item.id) {
            data = item;
            return false;
          }
        });
        if (isMap)
          views.map(data);
        if (isItem)
          views.item(data);
        if (isDrivers)
          views.drivers(data);
        if (isRating)
          views.rating(data);
      }
      if (isList)
        views.list(model.items);
    };
  return {
    setState: setState,
    getState: getState,
    getModel: getModel,
    setModel: setModel,
    clearModel: clearModel,
    getCurrentModel: getCurrentModel,
    setViewsCallback: setViewsCallback,
    render: render
  };
};