var path = require ("path");

var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name = (url[6] || null);
var user 	= (url[2] || null);
var pwd 	= (url[3] || null);
var protocol= (url[1] || null);
var dialect = (url[1] || null);
var port 	= (url[5] || null);
var host 	= (url[4] || null);
var storage = process.env.DATABASE_STORAGE;

//cargar modelo
var Sequelize=require("sequelize");

// Reemplazamos la definicion de SQLite por nuestro modelo dinamico
var sequelize = new Sequelize(DB_name, user, pwd, {
	dialect : protocol,
	protocol: protocol,
	port 	: port,
	host 	: host,
	storage : storage, 	// solo SQLite (.env)
	omitNull: true 		// definido solo para Heroku PostgreSQL
});



//usar BBDD
//var sequelize = new Sequelize(null, null, null,
//	{dialect: "sqlite", storage: "quiz.sqlite"}
//	);


//importar la definición de la tabla
var Quiz = sequelize.import(path.join(__dirname, "quiz"));

exports.Quiz = Quiz;

sequelize.sync().then(function(){
	Quiz.count().then(function(count){
		if (count ===0){
			Quiz.create({pregunta: "capital de Italia",
							respuesta: "Roma"
						})
			.then(function(){console.log("Base de datos inicializada")});

		};
	});
});