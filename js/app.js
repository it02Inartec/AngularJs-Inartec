//Definir un módulo angular de nuestra aplicación
var app = angular.module('MyAppInartec', []);

app.controller('AreaControl', function($scope, $http) {

  // Cargar todas las areas disponibles en BD
  getArea();

  function getArea(){
    $http.post("php/select.php").success(function(data){
      $scope.listareas = data;
    });
  };
});
