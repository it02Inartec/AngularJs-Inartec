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

  $scope.myData2 = [
    {sintoma: "1 Moroni", procedimiento:'test 1', estatus:0},
    {sintoma: "2 Moroni", procedimiento:'test 2', estatus:0},
    {sintoma: "3 Moroni", procedimiento:'test 3', estatus:0},
    {sintoma: "4 Moroni", procedimiento:'test 4', estatus:0},
    {sintoma: "5 Moroni", procedimiento:'test 5', estatus:0}
  ];

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

  $scope.$on('ngGridEventData', function(){
    //$scope.gridOptions2.selectRow(0, true);
    angular.forEach($scope.myData2, function(data, index){
        if(data.estatus == 1){
            $scope.gridOptions2.selectItem(index, true);
        }
    });
  });

  $scope.Arriba = function(){
    angular.forEach($scope.myData2, function(data, index){
        if(data.procedimiento === $scope.mySelections2[0].procedimiento){
            $scope.myData2[index].estatus = 1;
        }
    });
   };
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