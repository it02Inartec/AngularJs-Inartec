//Definir un módulo angular de nuestra aplicación
var app = angular.module('MyAppInartec', ['ngGrid']);

app.controller('DashboardControl', function($scope, $http) {

  // Cargar todas las areas disponibles en BD
  getArea();

  function getArea(){
    $http.post("php/areas.php").success(function(data){
      $scope.listareas = data;
      LoadGrid();
    });
  };

  $scope.mySelections = [];
  $scope.gridOptions = {
    data: 'myData',
    columnDefs: [
      { field: "nombre_area", displayName: 'Areas'},
      { field: "nombre", displayName: 'Nombres'},
      { field: "apellido", displayName: 'Apellidos'},
      { field: "tiempo", displayName: 'Tiempo en Area'}
    ],
    selectedItems: $scope.mySelections,
    multiSelect: false
  }

  function LoadGrid(){
    $http.post("php/consultas.php").success(function(data){
      $scope.myData = data;
    });
  }

  $scope.cualArea = function (area) {
    debugger;
    /*$http.post("ajax/addTask.php?task="+task).success(function(data){
      getTask();
      $scope.taskInput = "";
    });*/
  };
});