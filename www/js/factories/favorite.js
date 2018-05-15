favoriteFact.$inject = ['$http', '$state', 'api', 'custom'];

function favoriteFact($http, $state, api, custom) {
  var
    form = {
      favorite_name: null,
      id: null,
      id_address: null,
      name: null,
      address: null,
      house: null,
      entrance: null,
      comment: null,
      street: null,
      city: null,
      lat: null,
      lng: null,
      callback: null
    },
    list = {
      items: [],
      callback: null
    },
    getForm = function() {
      return form;
    },
    setForm = function(data) {
      if ( angular.isObject(data) )
        angular.extend(form, data);
      if ( angular.isFunction(form.callback) )
        form.callback(form);
    },
    getList = function() {
      return list.items;
    },
    setList = function(data) {
      if ( angular.isArray(data.items) ) {
        custom.overrideArray(list.items, data.items);
      } else if ( angular.isObject(data.item) ) {
        custom.overrideObject(list.items, data.item);
      } else {
        console.log('submitted incorrect data in setList method, invalide data = ', data);
      }
      if ( angular.isFunction(data.callback) )
        list.callback = data.callback;
      if ( angular.isFunction(list.callback) )
        list.callback(list.items);
    },
    removeItem = function(id) {
      custom.removeObject(list.items, id);
      if ( angular.isFunction(list.callback) ) {
        list.callback(list.items);
      }
    };

  return {
    getForm: getForm,
    setForm: setForm,
    getList: getList,
    setList: setList,
    removeItem: removeItem
  };
};