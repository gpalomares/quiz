var express = require('express');
var router = express.Router();

var quizController= require("../controllers/quiz_controller.js");
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

/* pagina de creditos */
router.get('/authores', function(req, res, next) {
  res.render('authores', { fecha: new Date().getFullYear(), errors: [] });
});

router.get("/quizes/question", quizController.question);
router.get("/quizes/answer", quizController.answer);
router.get("/quizes/search", quizController.search);
module.exports = router;
