//Definir un módulo angular de nuestra aplicación
var app = angular.module('MyAppInartec', ['ngGrid']);

app.controller('DashboardControl', function($scope, $http) {

  // Cargar todas las areas disponibles en BD
  getArea();


  function getArea(){
    $http.post("php/select.php").success(function(data){
      $scope.listareas = data;
    });
    CallGrid();
  };

  function CallGrid(){
    debugger;
    $scope.mySelections = [];
    $scope.myData = [{Area: "MAIN LOBBY", Nombre: "Moroni", Apellido: "Perez", age: 50},
                     {Area: "SALA DE ESPERA", Nombre: "Tiancum", Apellido: "Briceño", age: 43},
                     {Area: "SALA DE ESPERA", Nombre: "Jacob", Apellido: "Alarcon", age: 27},
                     {Area: "SALA DE ESPERA", Nombre: "Nephi", Apellido: "Beuses", age: 29},
                     {Area: "RAXOS X", Nombre: "Enos", Apellido: "Barriga", age: 34}];
    $scope.gridOptions = {
      data: 'myData',
      columnDefs: [{ field: "Area", displayName: 'Areas'},
                    { field: "Nombre", displayName: 'Nombres'},
                    { field: "Apellido", displayName: 'Apellidos'}],
      selectedItems: $scope.mySelections,
      multiSelect: false
    };
  }
});