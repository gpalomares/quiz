exports.question = function (req, res) {
	res.render('quizes/question',{pregunta: 'Capital de Italia'});
};

exports.answer = function (req, res){
	if (req.query.respuesta=== "Roma"){
		res.render('quizes/answer', {respuesta: "Correcto"});
	}else {
		res.render("quizes/answer",{respuesta: "incorrecto"});
	}
};
/*
exports.authores = function (req,res){
	res.render("authores/authores",{respuesta: "minombre"});
};
*/