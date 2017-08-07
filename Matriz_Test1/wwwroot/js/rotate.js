/**
 * @author jcpineda
 */
$(document).ready(ini);
function ini(){
	//Variable que contiene la información de filas x columnas de la matrriz
	var matrix = { columns: 0,
					rows: 0};
	
	//Función inicial para crear el formulario de la matriz (filas x columnas)
	init_body();
	
	/*El primer form que tiene los datos de la matriz no es necesario ir al servidor para crear
	 el formulario de ingreso de cada elemento de la matriz, por eso se escucha el evento de submit*/
	$('body').on('submit', '#form-create', function(e) {
		e.preventDefault();
		
		//Se verifica que ni las filas ni las columnas estén vaciás
		if(($('#Columns').val() == "") || ($('#Rows').val() == "")){
			alert('Ningún campo puede estar vació');
			return;
		}
		
		//Se llama a la función para crear el formulario de ingreso de cada elemento de la matriz
		matrix = create_input_matrix();
	});
	
	//Antes de enviar los datos de la matriz al servidor, se transforman a JSON y se envían por AJAX
	$('body').on('submit', '#form-rotate', function(e) {
		e.preventDefault();
		var jsonMatrix = Array();
		
		//Se leen todos los elementos de la matriz
		for (i = 0; i < matrix.rows; i++) {
			//Se crea un nuevo array dentro del array por cada fila en la matriz
			jsonMatrix.push(new Array());
			for (z = 0; z < matrix.columns; z++){
				/*Se busca los elementos del HTML por el elemento correspondiente a cada elemento de la Matriz
				 donde i y z corresponden a su fila y columna, el elemento HTML tiene un id correspondiente al elemento
				 que representa de la matriz empezando con un Input[z][i], donde z es la columna y la i es la fila*/
				var num_column = i+1;
				var num_row = z+1;
				var value = $("#body").find("#Input"+num_column+num_row).val();
				
				//Se verifica que ningun elemento este vació
				if(value == ""){
					alert('Ningún campo puede estar vació');
	    			return;
				}
				
				//Se almacena el elemento en el array en el ultimo lugar, donde [i] es la fila y el push es la columna
				jsonMatrix[i].push(value);
			}
        }
		
		//AJAX, se envia por POST y en formato JSON el array antes creado, se espera como respuesta un JSON igualmente
		$.ajax({
			type: 'POST',   
			data: { OMatrix: JSON.stringify(jsonMatrix)},
            dataType: "json",
            url:'/Home/rotate',
			success: function (response) {
                //Se llama a la función para imprimir el resultado y la matriz ingresada
                print_matrices(matrix, jsonMatrix, response);
                //alert(response);
			},
			error: function () {
				//Si hubo un error solo se le avisa al usuario que lo intente de nuevo
				alert('Error, intentalo nuevamente.');
			}
		});
	});
	
	//Evento para verificar que se introduzcan solamente numeros
	$('body').on('keydown', 'input', function(e) {
		e.preventDefault();
		//El valor que tiene el input(textbox) para poder modificarlo en caso de ser necesario
		var text_temp = $(this).val();
		
		//Si se presiona el backforward(borrar)
		if(e.keyCode == 8){
			//Se borra el ultimo elemento del string del textbox y regresamos
			text_temp = text_temp.slice(0, -1);
			$(this).val(text_temp);
			return;
		}
		
		//Si se presiona TAB
		if(e.keyCode == 9){
			//Cuanto elementos de input tipo texto existen
			var n = $("input:text").length;
			//Se obtiene el siguiente elemento input tipo texto
			var nextIndex = $('input:text').index(this) + 1;
			if(nextIndex < n){
				//Si existen más elementos se pone el cursor en el siguiente elemento
				$('input:text')[nextIndex].focus();
			}else{
				//Sino existe se deselecciona el elemento actual
				$('input:text')[nextIndex-1].blur();
			}
		}
		
		//Si la tecla no es un numero no se hace nada y regresamos
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        	return;
        }else{
        	//Si es un numero se añade al string que tenga el input(textbox)
        	text_temp += e.key;
        	$(this).val(text_temp);
        	return;
        }
	});
}

/*Función que inicia el formulario para ingresar el numero de filas y columnas*/
function init_body(){
	//Se crea el string con código HTML
	var code = '<form id="form-create" class="container" action="" method="POST">\
					<div class="center">\
						<h2 class="blue-text"> Matriz </h2>\
					</div>\
					<div class="row">\
						<div class="col s8 m4 l4 offset-s2 offset-m4 offset-l4">\
							<div class="card-panel white s4 m2 l2">\
								<div class="input-field">\
									<input id="Columns" type="text" name="Columns">\
									<label for="Columns">Columnas</label>\
								</div>\
								<div class="input-field">\
									<input id="Rows" type="text" name="Rows">\
									<label for="Rows">Filas</label>\
				            			</div>\
				            			<div class="row center">\
				            				<button class="btn waves-effect waves-light blue accent-4" name="submit_dimensions" type="submit" id="Create_Matrix">Crear Matriz\
				            					<i class="material-icons right">send</i>\
				            				</button>\
								</div>\
			            			</div>\
			        		</div>\
			    		</div>\
	        		</form>';
	//A la etiqueta en el HTML con id body se le pasa el HTML creado para su renderización en el browser
	$('#body').html(code);
}

/*Función para crear el layout del formulario para ingresar los datos de cada elemento de la matriz*/
function create_input_matrix(){
	//Variable para regresar con los valores que ingreso el usuario de filas y columnas
	var matrix = { columns: 0,
					rows: 0};
	
	//Se leen los datos que ingreso el usuario de filas y columnas				
	var columns = $('#Columns').val();
	var rows = $('#Rows').val();
	
	//Se calcula los tamaños de los textbox de acuerdo a la cantidad que se tienen que dibujar
	var size_textinput = screen.width/Number(columns) - (Number(columns)*2) - ((screen.width*0.08)/Number(columns));
	size_textinput = Math.round(size_textinput);
	
	//Se crea el form para hacer el submit con los datos de los elementos de la matriz
	var code = '<form id="form-rotate" action="" method="POST">\
					<div class="center">\
						<h2 class="blue-text"> Matriz </h2>\
					</div>';
	//Se crean dinamicamente los input(textbox) y se les asigna un id unico para posteriormente identificarlos
	for (i = 1; i <= Number(columns); i++){
		code += '<div class="input-field inline center">';
		for (z = 1; z <= Number(rows); z++){
			code += '<div class="input-field">';
			code += '<input id="Input'+z+i+'" type="text" name="Input'+z+i+'" style="width: '+size_textinput+'px;" />';
			code += '<label for="Input'+z+i+'">Pos. '+z+'_'+i+'</label>';
			code += '</div>';
		}
		code += '</div>';
	}
	//Se crea el botón para hacer la rotación de la matriz
	code += '		<div class="row center">\
    					<button class="btn waves-effect waves-light blue accent-4" name="submit_matrix" type="submit" id="Rotate_Matrix">Rotar Matriz\
							<i class="material-icons right">send</i>\
        				</button>\
					</div>\
				</form>';
	$('#body').html(code);
	
	//Se regresan los datos de columnas y filas de la matriz
	matrix.columns = columns;
	matrix.rows = rows;
	return matrix;
}

/*Función para imprimir las matrices*/
function print_matrices(matrix, matrix_input, matrix_output){
	//Se determina el tamaño del texto dependiendo del tamaño de pantalla y cuantos elementos se van a mostrar
	var size_textinput = screen.width/(Number(matrix.columns)*4) - ((screen.width*0.13)/Number(matrix.columns));
	size_textinput = Math.round(size_textinput);
	
	//Se crea el form para regresar al ingreso de filas y columnas
	var code = '<form id="form-return" action="" method="POST">\
					<div class="center">\
						<h5 class="blue-text"> Matriz ingresada </h5>\
					</div>';
	//Se lee cada elemento de la matriz que se introdujo para mostrarla como un label
	for (i = 0; i < Number(matrix.rows); i++){
		code += '<div class="inline center">';
		code += '<label class="center" style="font-size:'+size_textinput+'px;">';
		for (z = 0; z < Number(matrix.columns); z++){
			code += matrix_input[i][z];
			code += '<span style="display: inline-block; width: 1ch;">&#9;</span>';
		}
		code += '</label>';
		code += '</div>';
	}
	code += 		'<div class="center">\
						<h5 class="blue-text"> Matriz rotada 90 grados </h5>\
					</div>';
	
	//Se lee cada elemento que nos regreso el servidor en forma de JSON teniendo en cuenta que es de 2 dimensiones
	$.each(matrix_output, function(key, value) {
		code += '<div class="inline center">';
		code += '<label class="center" style="font-size:'+size_textinput+'px;">';
		$.each(value, function(element){
			code += value[element];
			code += '<span style="display: inline-block; width: 1ch;">&#9;</span>';
		});
		code += '</label>';
		code += '</div>';
	});
	
	//Se crea el botón para regresar al ingreso de filas y columnas	
	code += '		<div class="row center">\
    					<button class="btn waves-effect waves-light blue accent-4" name="submit_return" type="submit" id="Return">Regresar\
							<i class="material-icons right">send</i>\
        				</button>\
					</div>\
				</form>';
	//A la etiqueta en el HTML con id body se le pasa el HTML creado para su renderización en el browser
	$('#body').html(code);
}
