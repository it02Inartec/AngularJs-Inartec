//Definir un módulo angular de nuestra aplicación
var app = angular.module('MyAppInartec', ['ngGrid', 'ui.sortable', 'ngRoute']);

var efectoSelectedItems = true;
var dataSelectedItem = [];
var dataListArea = [];

app.controller('DashboardControl', function($scope, $http, $location, $timeout) {

  // Cargar todas las areas disponibles en BD
  getArea();

  function getArea(){
    $http.post("php/areas.php").success(function(data){
      $scope.listareas = [data,data];
      LoadGrid();
    });
  };

  // Primero hay que configurar el grid y sus columnas.
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
        $(".selectedItems").height('400px');
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

  // Luego podemos cargar el grid
  function LoadGrid(){
    $http.post("php/consultas.php")
    .success(function(data){
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

  // Inicio Opciones/Eventos para el sortable..
  $scope.sortingLog = [];

  function createOptions (listName) {
    var _listName = listName;
    var options = {
      placeholder: "Jen2",
      connectWith: ".Jen",
      stop: function() {
          console.log("lista " + _listName + ": parada");
      },
      update: function() {
          console.log("lista " + _listName + ": actualiza");
          $scope.logModels();
      }
    };
    return options;
  }
  $scope.sortableOptions = [createOptions('A'), createOptions('B')];

  $scope.logModels = function () {
    $scope.sortingLog = [];
    for (var i = 0; i < $scope.listareas.length; i++) {
      var logEntry = $scope.listareas[i].map(function (x) {
        return x.nombre_area;
      }).join(', ');
      logEntry = 'Contenedor ' + (i+1) + ': ' + logEntry;
      $scope.sortingLog.push(logEntry);
    }
  };
  // Fin Opciones/Eventos para el sortable..

  // Data grid del cuadro detalles del paciente
  $scope.myData2 = [
    {sintoma: "1 Moroni", procedimiento:'test 1', estatus:0},
    {sintoma: "2 Moroni", procedimiento:'test 2', estatus:0},
    {sintoma: "3 Moroni", procedimiento:'test 3', estatus:0},
    {sintoma: "4 Moroni", procedimiento:'test 4', estatus:0},
    {sintoma: "5 Moroni", procedimiento:'test 5', estatus:0}
  ];

  // Opciones del grid del cuadro detalles del paciente
  $scope.mySelections2 = [];
  $scope.gridOptions2 = {
    showSelectionCheckbox: true,
    data: 'myData2',
    columnDefs: [
      { field: "sintoma", displayName: 'Sintoma'},
      { field: "procedimiento", displayName: 'Procediemiento'},
      { field: "estatus", displayName: 'Estatus'}
    ],
    selectedItems: $scope.mySelections2,
    showFilter: true,
    filterOptions: {filterText:'', useExternalFilter: false},
    sortInfo:  { fields: ['estatus'], directions: ['asc'] },
    multiSelect: true
  }

  // recorro evento del grid del cuadro detalles del paciente
  $scope.$on('ngGridEventData', function(){
    // Recorro los datos de "myData2".
    angular.forEach($scope.myData2, function(data, index){
        // si estatus es igual a uno marco la fila.
        if(data.estatus === 1){
          // index = posicion de la fila que sera marcada.
          $scope.gridOptions2.selectItem(index, true);
        }
    });
  });

  $scope.Arriba = function(){
    angular.forEach($scope.myData2, function(data, index){
        if(data.procedimiento === $scope.mySelections2[0].procedimiento){
          // Cambio el valor de una fila por "1".
          $scope.myData2[index].estatus = 1;
        }
    });
  };

  // Para cambiar de pagina html
  $scope.go = function (path){
    $location.path(path);
  };
});

// Configuración de las rutas
app.config(function($routeProvider){
    $routeProvider
        .when('/', {
            templateUrl : 'pages/main.html',
            controller  : 'DashboardControl'
        })
        .when('/sortable', {
            templateUrl : 'pages/sortable.html',
            controller  : 'DashboardControl'
        })
        .otherwise({
            redirectTo: '/'
        });
});

function Create_StadistDay(Day,PerDay,DataGrap,container){
  Diary = 100;
  ConsultsD = 43;
  PorDay = ConsultsD / Diary;
  PorDay = PorDay * 100;
  PorDay = parseInt(PorDay);

  Day = [[0.5,'Lunes']];
  PerDay = [[0,PorDay+'%'],[1,'100%']];

  DataGrap = [
    {data:[[60,1]],color:"#b7e4f7"},
    {data:[[30,0]],color:"#f7de8b"},

    {label:'Lunes',data:[[60,1]],color:"#b7e4f7",yaxis:2},
    {label:'Metadiaria',data:[[30,0]],color:"#f7de8b",yaxis:2}
  ];

  //container = document.getElementById(app.w('Stadist_DayChart').base()[0].id);
  //container = $('Dia1');
  graph = Flotr.draw(container,DataGrap,{
    bars : {
      show : true,
      horizontal : true,
      shadowSize : 0,
      barWidth : 0.5
    },
    legend : {
        show:false
    },
    mouse : {
        track : true,
        relative : true
    },
    xaxis:{
        min:0,
        //max:app.parentApp().ConsultDaily()
        max:50
    },
    yaxis : {
        ticks:Day//[[0.5,'Lunes']]
    },
    y2axis:{
        ticks:PerDay//[[0,'50%'],[1,'100%']]
    }
  });
}