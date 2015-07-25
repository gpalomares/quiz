var path = require ("path");

//cargar modelo
var Sequelize=require("sequelize");

//usar BBDD
var sequelize = new Sequelize(null, null, null,
	{dialect: "sqlite", storage: "quiz.sqlite"}
	);

//importar la definición de la tabla
var Quiz = sequelize.import(path.join(__dirname, "quiz"));

exports.Quiz = Quiz;

sequelize.sync().then(function(){
	Quiz.count().then(function(count){
		if (count ===0){
			Quiz.create({pregunta: "capital de Italiz",
							respuesta: "Roma"
						})
			.then(function(){console.log("Base de datos inicializada")});

		};
	});
});