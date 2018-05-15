historyFact.$inject = ['$http', '$state', 'api'];

function historyFact($http, $state, api) {
  var data = {
    isLoading: false,
    items: {}
  };

  var state = {
    id: null
  };

  var views = {
    maps: {
      data: null,
      callback: null
    },
    item: {
      data: null,
      callback: null
    },
    list: {
      data: null,
      callback: null
    }
  };

  var objectToArray = function(source) {
    var _array = [];
    for (key in source) {
      _array.push(source[key]);
    }
    return _array;
  };

  var render = function(view) {
    if ( angular.isUndefined(view) ) {
      // render view
      var _callback = views[view].callback,
          _data = views[view].data;
      if ( angular.isFunction(_callback) )
        _callback(_data);
    } else {
      // render all views
      for (view in views) {
        var _callback = views[view].callback,
            _data = views[view].data;
        if ( angular.isFunction(_callback) )
          _callback(_data);
      }
    }
  };

  var init = function(view, callback) {
    if ( angular.isFunction(callback) ) {
      switch (view) {
        case 'list':
          if (data.isLoading)
            views.list.data = objectToArray(data.items);
          else
            api.getHistoryList(function(success) {
              var _items = success.data.data.items;
              _items.forEach(function(item) {
                if ( angular.isUndefined(data.items[item.id]) )
                  data.items[item.id] = item;
                else
                  angular.merge(data.items[item.id], item);
              });
              views.list.data = _items;
              data.isLoading = true;
            });
          break;
        default:
          if ( angular.isUndefined(data.items[state.id]) || 
               angular.isUndefined(data.items[state.id].isLoading) ||
               data.items[state.id].isLoading === false ) {
            data.items[state.id].isLoading = false;
            api.getHistoryItem(state.id, function(success) {
              angular.merge(data.items[state.id], success.data.data);
              data.items[state.id].isLoading = true;
            });
          } else {
            views[view].data = data.items[state.id];
          }
      }
      render();
    }
  };

  var setData = function(_data) {
    _data.forEach(function(item) {
      if ( angular.isUndefined(data.items[item.id]) )
        data.items[item.id] = item;
      else
        angular.merge(data.items[item.id], item);
    });
    render();
  };

  var clearData = function() {
    api.clearHistory(function(success) {
      data.items = {};
      render('list');
    });
  };

  var setState = function(id) {
    state.id = id;
  };

  return {
    init: init,
    setData: setData,
    clearData: clearData,
    setState: setState
  };
}