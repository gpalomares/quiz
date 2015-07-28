var models = require("../models/models.js");

exports.question = function (req, res) {
	models.Quiz.findAll().then(function(quiz){
		res.render('quizes/question',{pregunta:quiz[0].pregunta})
	})
};

exports.answer = function (req, res){
	models.Quiz.findAll().then(function(quiz){

		if (req.query.respuesta=== quiz[0].respuesta){
		res.render('quizes/answer', {respuesta: "Correcto"});
	}else {
		res.render("quizes/answer",{respuesta: "incorrecto"});
	}
})
};

exports.search = function(req, res){
	if (req.query.search){
		var search = req.query.search;
		search = search.split(" ").join('%');
		search = '%' + search + '%';
		query = {
			where : ["lower(pregunta) like lower(?)", search],
			order : "pregunta ASC"
		};
		models.Quiz.findAll({where:["pregunta like ?", search]}).then(function(quizes){
			console.log(quizes);
			res.render('mostrar', {mensaje: quizes});
		})
	}
	else{
		res.render("search", {mensaje: "holass"});
	}
};
