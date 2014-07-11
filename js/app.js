//Definir un módulo angular de nuestra aplicación
var app = angular.module('MyAppInartec', ['ngGrid']);

var efectoSelectedItems = true;
var dataSelectedItem = [];
app.controller('DashboardControl', function($scope, $http) {

  // Cargar todas las areas disponibles en BD
  getArea();
  function getArea(){
    $http.post("php/areas.php").success(function(data){
      $scope.listareas = data;
      LoadGrid();
    });
  };

  // Configuramos el grid y sus columnas.
  $scope.mySelections = [];
  $scope.gridOptions = {
    data: 'myData',
    columnDefs: [
      { field: "nombre_area", displayName: 'Areas'},
      { field: "nombre", displayName: 'Nombres'},
      { field: "apellido", displayName: 'Apellidos'},
      { field: "posicion", displayName: 'Posicion'}
    ],
    // Para activar desplazamiento del div de los detalles del paciente y se vea con animacion.
    afterSelectionChange: function() {
      if(efectoSelectedItems == true){
        $(".selectedItems").height('100px');
        $scope.mySelections = dataSelectedItem;
        $(".selectedItems").slideUp();
        $(".selectedItems").slideDown(1000,'linear');
        efectoSelectedItems = false;
      }
      else{
        efectoSelectedItems = true;
      }
    },
    selectedItems: $scope.mySelections,
    showFilter: true,
    filterOptions: {filterText:'', useExternalFilter: false},
    multiSelect: false
  }

  // Para cargar grid
  function LoadGrid(){
    $http.post("php/consultas.php").success(function(data){
      $scope.myData = data;
    });
  }

  // Para filtrar pacientes por area (MobileList)
  $scope.cualArea = function (area) {
    $scope.gridOptions.filterOptions.filterText = area;
  };

  // Para carturar array del grid filtrado
  $scope.getDataOrder = function(){
    $.map($scope.gridOptions.ngGrid.filteredRows, function(o){
      console.log(o.entity);
    });
  };
  $scope.ff = function () {
    dataSelectedItem = $scope.gridOptions.selectedItems;
    $scope.mySelections = [];
  };
});