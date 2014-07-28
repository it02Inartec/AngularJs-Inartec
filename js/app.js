//Definir un módulo angular de nuestra aplicación
var app = angular.module('MyAppInartec', ['ngGrid', 'ui.sortable', 'ngRoute', 'angularFileUpload']);

var efectoSelectedItems = true;
var dataSelectedItem = [];
var dataListArea = [];

//var uploadUrl = 'http://angular-file-upload-cors-srv.appspot.com/upload';

var uploadUrl = 'http://localhost/';

window.uploadUrl = window.uploadUrl || 'localhost';

app.controller('DashboardControl', function($scope, $http, $location, $timeout, $upload) {

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
      dataLis22  = data;
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
      console.log("--> Levantaste a '"+ui.item[0].innerText+"'<--");
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
    // Recorro los datos de "myData2".
    angular.forEach($scope.myData2, function(data, index){
        // si estatus es igual a uno marco la fila.
        if(data.estatus == 1){
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

  $scope.go = function (path){
    $location.path(path);
  };

  /* Inicio cargar archivos */
  $scope.usingFlash = FileAPI && FileAPI.upload != null;
  $scope.fileReaderSupported = window.FileReader != null && (window.FileAPI == null || FileAPI.html5 != false);
  $scope.uploadRightAway = true;
  $scope.changeAngularVersion = function() {
    window.location.hash = $scope.angularVersion;
    window.location.reload(true);
  };
  $scope.hasUploader = function(index) {
    return $scope.upload[index] != null;
  };
  $scope.abort = function(index) {
    $scope.upload[index].abort();
    $scope.upload[index] = null;
  };
  $scope.angularVersion = window.location.hash.length > 1 ? (window.location.hash.indexOf('/') === 1 ? window.location.hash.substring(2): window.location.hash.substring(1)) : '1.2.20';
  $scope.onFileSelect = function($files) {
    $scope.selectedFiles = [];
    $scope.progress = [];
    if ($scope.upload && $scope.upload.length > 0) {
      for (var i = 0; i < $scope.upload.length; i++) {
        if ($scope.upload[i] != null) {
          $scope.upload[i].abort();
        }
      }
    }
    $scope.upload = [];
    $scope.uploadResult = [];
    $scope.selectedFiles = $files;
    $scope.dataUrls = [];
    for ( var i = 0; i < $files.length; i++) {
      var $file = $files[i];
      if ($scope.fileReaderSupported && $file.type.indexOf('image') > -1) {
        var fileReader = new FileReader();
        fileReader.readAsDataURL($files[i]);
        var loadFile = function(fileReader, index) {
          fileReader.onload = function(e) {
            $timeout(function() {
              $scope.dataUrls[index] = e.target.result;
            });
          }
        }(fileReader, i);
      }
      $scope.progress[i] = -1;
      if ($scope.uploadRightAway) {
        $scope.start(i);
      }
    }
  };
  $scope.start = function(index) {
    $scope.progress[index] = 0;
    $scope.errorMsg = null;
    if ($scope.howToSend == 1) {
      $scope.upload[index] = $upload.upload({
        url: uploadUrl,
        method: $scope.httpMethod,
        headers: {'my-header': 'my-header-value'},
        data : {
          myModel : $scope.myModel
        },
        file: $scope.selectedFiles[index],
        fileFormDataName: 'myFile'
      });
      $scope.upload[index].then(function(response) {
        $timeout(function() {
          $scope.uploadResult.push(response.data);
        });
      }, function(response) {
        if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
      }, function(evt) {
        // Math.min is to fix IE which reports 200% sometimes
        $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
      });
      $scope.upload[index].xhr(function(xhr){
        // xhr.upload.addEventListener('abort', function() {console.log('abort complete')}, false);
      });
    } else {
      var fileReader = new FileReader();
            fileReader.onload = function(e) {
            $scope.upload[index] = $upload.http({
              url: uploadUrl,
          headers: {'Content-Type': $scope.selectedFiles[index].type},
          data: e.target.result
            }).then(function(response) {
          $scope.uploadResult.push(response.data);
        }, function(response) {
          if (response.status > 0) $scope.errorMsg = response.status + ': ' + response.data;
        }, function(evt) {
          // Math.min is to fix IE which reports 200% sometimes
          $scope.progress[index] = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
        });
            }
          fileReader.readAsArrayBuffer($scope.selectedFiles[index]);
    }
  };
  $scope.dragOverClass = function($event) {
    var items = $event.dataTransfer.items;
    var hasFile = false;
    if (items != null) {
      for (var i = 0 ; i < items.length; i++) {
        if (items[i].kind == 'file') {
          hasFile = true;
          break;
        }
      }
    } else {
      hasFile = true;
    }
    return hasFile ? "dragover" : "dragover-err";
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

FileAPI = {
  debug: true,
  //forceLoad: true, html5: false //to debug flash in HTML5 browsers
  //only one of jsPath or jsUrl.
    //jsPath: '/js/FileAPI.min.js/folder/',
    //jsUrl: 'yourcdn.com/js/FileAPI.min.js',

    //only one of staticPath or flashUrl.
    //staticPath: '/flash/FileAPI.flash.swf/folder/'
    //flashUrl: 'yourcdn.com/js/FileAPI.flash.swf'
};