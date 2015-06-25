(function(){
  'use strict';
  var myApp = angular.module('app', ['onsen','ngSanitize']);

  myApp.controller('AppController', function($scope, $data) {
    $scope.doSomething = function() {
      ons.notification.alert({message: 'Poner función aquí'});
    };

  });
  
  //Controladores  
  myApp.controller('DetailController', function($scope, $data) {
    $scope.item = $data.selectedItem;
    //$scope.test = JSON.stringify($data.selectedItem); //TEST
  });

  myApp.controller('MasterController', function($scope, $data) {
    $scope.items = $data.items;
    
    $scope.showDetail = function(index) {
      var selectedItem = $data.items[index];
      $data.selectedItem = selectedItem;
      $scope.navi.pushPage('detail.html', {title : selectedItem.title});
    };
  });

  myApp.factory('$data', function($http,$sce) {
	var data = {};
	data.items = [];
	//El AJAX de angular
	$http.post("http://www.jesuitinasdonosti.tv/scripts/appData/index.php",'test')
		.success(function(response) {
			var lista = [];
			angular.forEach(response,function(v,k){
				var video = {};
				
				var keepGoing = true; //<- para control de bucles
				//Saco la imagen
				var img = '';var imgBig = '';
				
				if(v.archivos.img){
					angular.forEach(v.archivos.img,function(i,ik){
						if(keepGoing){
							if(i.nombre){
								img = {fichero: i.copias.social.fichero, alto:i.copias.social.y};
								imgBig = {fichero: i.copias.social.fichero, alto:i.copias.social.y};
								keepGoing = false;
							}
						}
					});
				}
				
				//Saco el vídeo
				var keepGoing = true;
				var mp4 = '';
				if(v.archivos.video){
					angular.forEach(v.archivos.video,function(v,vk){
						if(keepGoing){
							if(v.url_video){
								mp4 = v.url_video;
								keepGoing = false;
							}
						}
					});
				}
				//Guardo datos
					//cropeo el texto
					var clean_desc = String(v.descripcion).replace(/<[^>]+>/gm, '');
					var short_desc = ((clean_desc.length > 120 ) ? clean_desc.substr(0,120) + ' ... ' : clean_desc);

				video = {
					titulo: v.titulo,
					label: v.fecha_pub,
					desc: short_desc,
					long_desc: v.descripcion,
					img: img,
					imgBig: imgBig,
					video: 	 $sce.trustAsHtml(videoTube(mp4)) //VERIFICA QUE LA URL SE PUEDA EJECUTAR
				}
				
				data.items.push(video);
				
			});
		}).error(function(response) {console.log(response)});
     
      return data;
  });
})();


// Wait for device API libraries to load
//
document.addEventListener("deviceready", onDeviceReady, false);

// device APIs are available
//
function onDeviceReady() {
	// var ref = window.open('http://apache.org', '_blank', 'location=yes');
}