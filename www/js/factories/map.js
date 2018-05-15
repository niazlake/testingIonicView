mapFact.$inject = ['$state', 'order'];

function mapFact($state, order) {
  var
    mapApp,
    maps = {
    },
    setRouteCar = function(currendPoint) {
      if ( angualar.isUndefined(maps['menu.history-map'].routeCar) ) {
        maps['menu.history-map'].routeCar = [ [currendPoint.lat, currendPoint.lng] ];
        return true;
      }
      var lengthPoints = maps['menu.history-map'].routeCar.length;
      var lastPoint = {
        lat: maps['menu.history-map'].routeCar[lengthPoints][0],
        lng: maps['menu.history-map'].routeCar[lengthPoints][1]
      }
    },
    setCenter = function() {
      if (maps['menu.history-map'].active === true) {
        maps['menu.history-map'].objects.forEach(function(item) {
          if (item.type === 'point') {
            mapApp.animateCamera({
              target: item.coord,
              zoom: 16,
              duration: 1000
            });
            return false;
          }
        });
      }
    },
    getParamsByModel = function(model) {
      var params = {};
      if (!angular.isUndefined(model.route.bound)) {
        params.bounds = [
          {
            lat: model.route.bound[0][0],
            lng: model.route.bound[0][1]
          },
          {
            lat: model.route.bound[1][0],
            lng: model.route.bound[1][1]
          }
        ];
        params.objects = [
          {
            type: 'route',
            coords: model.route.geometry
          },
          {
            type: 'point',
            coord: {
              lat: model.points[0].lat,
              lng: model.points[0].lng
            }
          },
          {
            type: 'point',
            coord: {
              lat: model.route.to.lat,
              lng: model.route.to.lng
            }
          }
        ];
      } else {
        params.center = {
          lat: model.points[0].lat,
          lng: model.points[0].lng
        };
        params.objects = [
          {
            type: 'point',
            coord: {
              lat: model.points[0].lat,
              lng: model.points[0].lng
            }
          }
        ];
      }

      if (model.driver && model.driver.lat != null && model.driver.lng != null)
        params.objects.push({
          type: 'car',
          visible: true,
          coord: {
            lat: model.driver.lat,
            lng: model.driver.lng
          }
        });
      else
        params.objects.push({
          type: 'car',
          visible: false,
          coord: {
            lat: 0,
            lng: 0
          }
        });
      return params;
    },
    getMap = function(state) {
      return mapApp;
    },
    setCar = function(coord) {
      if (
        !angular.isUndefined(maps['menu.history-map']) &&
        !angular.isUndefined(maps['menu.history-map'].car) &&
        (maps['menu.history-map'].active === true)
      ) {
        if (coord.lat == null || coord.lng == null) {
          maps['menu.history-map'].car.setVisible(false);
        } else {
          var carLatLng = new plugin.google.maps.LatLng(coord.lat, coord.lng);

          mapApp.animateCamera({
            target: carLatLng,
            zoom: 16,
            duration: 1000
          });

          maps['menu.history-map'].car.setVisible(true);
          maps['menu.history-map'].car.setPosition(carLatLng);
        }
      }
    },
    render = function(state) {
      if (!angular.isUndefined(maps[state]) && !angular.isUndefined(maps[state].element)) {
        for (_state in maps) {
          maps[_state].active = false;
        }
        maps[state].active = true;

        mapApp = plugin.google.maps.Map.getMap(maps[state].element, maps[state].params);

        mapApp.on(plugin.google.maps.event.MAP_READY, function() {
          mapApp.clear();
          mapApp.off();

          if (!angular.isUndefined(maps[state].params.camera.center)) {
            mapApp.setCenter(maps[state].params.camera.center);
            mapApp.setZoom(16);
          }
          if (!angular.isUndefined(maps[state].params.camera.target)) {
            mapApp.moveCamera({
              target: maps[state].params.camera.target,
              zoom: 16
            });
          }
          if (angular.isArray(maps[state].objects)) {
            maps[state].objects.forEach(function(obj, index) {
              switch (obj.type) {
                case 'point':
                  mapApp.addMarker({
                    'position': obj.coord,
                    'icon': {
                      'url': '../www/img/point.png',
                      'size': {
                        'width': 26,
                        'height': 39
                      }
                    }
                  });
                  break;
                case 'car':
                  mapApp.addMarker({
                    'position': obj.coord,
                    //'visible': obj.visible,
                    'icon': {
                      'url': 'www/img/taxi.png',
                      'size': {
                        'width': 26,
                        'height': 26
                      }
                    }
                  }, function(marker) {
                    maps['menu.history-map'].car = marker;
                  });
                  break;
                case 'route':
                  mapApp.addPolyline({
                    'points': obj.coords,
                    'color' : '#0d549e',
                    'width': 4,
                    'geodesic': true
                  });
                  break;
              }
            });
          }
        });
      }
    },
    update = function(state, params) {
      console.log('update');
    },
    dataInit = function(state, params) {
      console.log('data init');
      if ( angular.isUndefined(maps[state]) )
        maps[state] = {};

      maps[state].params = {
        'mapType': plugin.google.maps.MapTypeId.ROADMAP,
        'gestures': {
          'scroll': true,
          'tilt': false,
          'rotate': false,
          'zoom': true
        },
        'camera': {
          'zoom': 16
        }
      };

      if (!angular.isUndefined(params.bounds)) {
        maps[state].params.camera.target = [
          new plugin.google.maps.LatLng(params.bounds[0].lat, params.bounds[0].lng),
          new plugin.google.maps.LatLng(params.bounds[1].lat, params.bounds[1].lng)
        ];
      }
      if (!angular.isUndefined(params.center)) {
        maps[state].params.camera.latLng = new plugin.google.maps.LatLng(params.center.lat, params.center.lng);
      }
      if (angular.isArray(params.objects)) {
        params.objects.forEach(function(obj, index) {
          if (!angular.isUndefined(obj.coord))
            params.objects[index].coord = new plugin.google.maps.LatLng(obj.coord.lat, obj.coord.lng);
          if (!angular.isUndefined(obj.coords)) {
            var _params = [];
            obj.coords.forEach(function(coord) {
              _params.push( new plugin.google.maps.LatLng(coord.lat, coord.lng) );
            });
            params.objects[index].coords = _params;
          }
        });
        maps[state].objects = params.objects;
      }
    },
    viewInit = function(state, element) {
      if (!angular.isUndefined(maps[state])) {
        maps[state].active = false;
        maps[state].element = element;
        render(state);
      }
    },
    init = function(state, element, params) {
      console.log('init maps');
      dataInit(state, params);
      viewInit(state, element);
    };
  return {
    getParamsByModel: getParamsByModel,
    setCenter: setCenter,
    init: init,
    dataInit: dataInit,
    viewInit: viewInit,
    render: render,
    update: update,
    getMap: getMap,
    setCar: setCar
  };
};
