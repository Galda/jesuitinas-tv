
//Funciones para uso 

function videoTube(url){
	/**
	 * Youtube
	 * Tipo url: http://www.youtube.com/watch?v=ZAjASemgx3E&feature=topvideos_music
	 * Buscamos posicion  v=
	 */
	 
	var pos_v = strpos(url,'v=');
	if(pos_v !== false){
		
		var cod_video ='';
		//Buscamos a partir de aqui posibles & (&feature...) 
		var pos_amp = strpos(url,'&',pos_v);
		if(pos_amp !== false){
			cod_video = substr(url,pos_v+2,(pos_amp-(pos_v+2)));
		}else{
			cod_video = substr(url,pos_v+2);
		}
		
		var cod_lista = '';
		//Veamos si es una LISTA DE REPRODUCCIÓN 
		var pos_list = strpos(url,'list=');
		if(pos_list !== false){
			// Buscamos a partir de aqui posibles & (&feature...) 
			pos_amp = strpos(url,'&',pos_list);
			if(pos_amp !== false){
				cod_lista = substr(url,pos_list,(pos_amp-(pos_list)));
			}else{
				cod_lista = substr(url,pos_list);
			}
			cod_lista +=  '&';
		}
		
		var html_video = '<iframe src="http://www.youtube.com/embed/'+cod_video+'?'+cod_lista+'theme=light&modestbranding=0&autoplay=1&autohide=1&wmode=transparent&hd=1&rel=0&showinfo=0&fs=1" width="100%" height="280px" frameborder="0" wmode="Opaque" allowfullscreen webkitallowfullscreen mozallowfullscreen></iframe>';
		//var html_video = '<iframe src="http://www.youtube.com/embed/'+cod_video+'"></iframe>';
		//var html_video = '<iframe width="660" height="370" frameborder="0" mozallowfullscreen="" webkitallowfullscreen="" allowfullscreen="" wmode="Opaque" src="http://www.youtube.com/embed/nIzrlY3-d8s?theme=light&amp;modestbranding=0&amp;autoplay=1&amp;autohide=1&amp;wmode=transparent&amp;hd=1&amp;rel=0&amp;showinfo=0&amp;fs=1"></iframe>';
		return html_video;
	}	
	
}

//Para limpiar links de html
function cleanOpenBrowser(html){
	var matches = html.match(/href="(.+?)"/g);

	matches.forEach(function(href){
		var url = href.match(/href="(.+?)"/)[1]

		html = html.replace(href, 'href="#"');
	});
   
	return html;
}