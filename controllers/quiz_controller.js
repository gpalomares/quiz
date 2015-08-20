var models = require("../models/models.js");


//Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find({
				where: { id: Number(quizId) },
				include: [{ model:models.Comment }]
			}).then(function(quiz) {
		if (quiz) {
			req.quiz = quiz;
			next();
		} else {
			next(new Error('No existe quizId=' + quizId));
		}
	}).catch(function(error) { next(error);});
};


exports.show= function (req, res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		res.render("quizes/show", {quiz: req.quiz, errors: []});
	})
};

exports.answer = function (req, res){
	models.Quiz.find(req.params.quizId).then(function(quiz){
		if (req.query.respuesta===quiz.respuesta){
			res.render ("quizes/answer", {quiz : quiz, respuesta: "Correcto"});
		} else {
			res.render("quizes/answer", {quiz: quiz, respuesta: "Incorrecto"});
		}
	})
};

exports.index = function(req, res) {
	if(req.query.search){
		var search = "%" + (req.query.search).replace(/ /g,"%") + "%";
		models.Quiz.findAll({where:["pregunta like ?", search], order:'pregunta ASC'}).then(function(quizes) {
			res.render('quizes/index.ejs', { quizes: quizes, errors: []});
		}).catch(function(error) {next(error);})
	} else {
		models.Quiz.findAll().then(function(quizes) {
			res.render('quizes/index.ejs', { quizes: quizes, errors: []});
		}).catch(function(error) {next(error);})
	}
	
};


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

exports.new = function(req, res) {
	var quiz = models.Quiz.build(	//crea objeto raiz
		{pregunta: "", respuesta: "", tema: "otro"}
	);
	res.render('quizes/new', {quiz: quiz, errors: []	});
};

//POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);

	quiz.validate().then(function(err){
		if(err) {
			res.render('quizes/new', {quiz: quiz, errors: err.errors});
		} else {
			//save: guarda en DB los campos pregunta y respuesta de quiz
			quiz.save({fields: ["pregunta", "respuesta", "tema"]}).then(function(){
				res.redirect('/quizes');
			})	//res.redirect: Redirección HTTP (URL relativo) lista de preguntas
		}
	});
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
	var quiz = req.quiz; //autoload de instancia quiz
	res.render('quizes/edit', {quiz: quiz, errors: []});
};

//PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tema = req.body.quiz.tema;

	req.quiz.validate().then(function(err){
		if(err) {
			res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
		} else {
			req.quiz.save( {fields: ["pregunta", "respuesta", "tema"]}).then(function(){
				res.redirect('/quizes');
			});
		}	// Redirección HTTP a lista de preguntas (URL relativo)
	});
};

//DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then(function() {
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};