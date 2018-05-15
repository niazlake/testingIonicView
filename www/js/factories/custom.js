function customFact() {

  var
    overrideObject = function(source, object) {
       var isOverride = false;
       source.forEach(function(item, index) {
        if (item.id === object.id) {
          angular.extend(source[index], object);
          isOverride = true;
          return false;
        }
       });
      if (!isOverride) source.push(object);
    },
    overrideArray = function(source, array) {
      array.forEach(function(item) {
        overrideObject(source, item);
      });
    },
    removeObject = function(source, id) {
      source.forEach(function(item, index) {
        if (item.id === id) {
          source.splice(index, 1);
          return false;
        }
      });
    };

  return {
    overrideObject: overrideObject,
    overrideArray: overrideArray,
    removeObject: removeObject
  };

};