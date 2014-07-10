//Definir un módulo angular de nuestra aplicación
var app = angular.module('MyAppInartec', ['ngGrid']);
var efectoSelectedItems = true;
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
      { field: "posicion", displayName: 'Posicion'}
    ],
    // Para activar desplazamiento del div de los detalles del paciente y se vea con animacion.
    afterSelectionChange: function() {
      if(efectoSelectedItems == true){
        $(".selectedItems").slideUp('slow').attr('ng-hide','true');
        $(".selectedItems").slideDown('slow').attr('ng-hide','false');
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

  function LoadGrid(){
    $http.post("php/consultas.php").success(function(data){
      $scope.myData = data;
    });
  }

  $scope.cualArea = function (area) {
    $scope.gridOptions.filterOptions.filterText = area;
  };

  $scope.getDataOrder = function(){
    //angular.forEach($scope.myData, function(data, index){   console.log(index,data); })
    $.map($scope.gridOptions.ngGrid.filteredRows, function(o){
      debugger;
      console.log(o.entity);
    });
  };
});