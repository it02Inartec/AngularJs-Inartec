//Definir un módulo angular de nuestra aplicación
var app = angular.module('MyAppInartec', ['ngGrid', 'ui.sortable']);

var efectoSelectedItems = true;
var dataSelectedItem = [];
var dataListArea = [];

app.controller('DashboardControl', function($scope, $http) {

  // Cargar todas las areas disponibles en BD
  getArea();

  function getArea(){
    $http.post("php/areas.php").success(function(data){
      $scope.listareas = data;
      LoadGrid();
      dataListArea  = data;
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

  // Opciones/Eventos para el sortable..
  $scope.sortingLog = [];
  $scope.sortableOptions = {
    activate: function() {
        console.log("activate/activar");
    },
    beforeStop: function() {
        console.log("beforeStop/antes de la parada");
    },
    change: function() {
        console.log("change/cambio");
    },
    create: function() {
        console.log("create/crear");
    },
    deactivate: function() {
        console.log("deactivate/desactivar");
    },
    out: function() {
        console.log("out/fuera");
    },
    over: function() {
        console.log("over/encima");
    },
    receive: function() {
        console.log("receive/recibir");
    },
    remove: function() {
        console.log("remove/eliminar");
    },
    sort: function() {
        console.log("sort/ordenar");
    },
    start: function() {
        console.log("start/comienzo");
    },
    update: function(e, ui) {
      console.log("update/actualización");

      var logEntry = dataListArea.map(function(i){
        return i.nombre_area;
      }).join(', ');
      $scope.sortingLog.push('* Update= ' + logEntry);
    },
    stop: function(e, ui) {
      console.log("stop/parada");

      // Esta devolucion tiene el modelo cambiado
      var logEntry = dataListArea.map(function(i){
        return i.nombre_area;
      }).join(', ');
      $scope.sortingLog.push('* Stop= ' + logEntry);
    }
  };
});