angular.module('app.factories', [])
  .factory('custom', customFact)
  .factory('api', apiFact)
  .factory('order', orderFact)
  .factory('init', initFact)
  .factory('favorite', favoriteFact)
  .factory('history', historyFact)
  .factory('profile', profileFact)
  .factory('payment', paymentFact)
  .factory('map', mapFact);