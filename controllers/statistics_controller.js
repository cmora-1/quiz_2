var models = require('../models/models.js');

// GET /quizes/statistics
var countq, countc;
var NumQ;
var NumC;
var QuizWithComment;
var i;

exports.mostrar = function(req, res) {
  console.log('SHOWING...', this.NumQ, this.NumC, this.QuizWithComment);
  var nq, nc, nqc;

   nq = this.NumQ;

   nc = this.NumC;

   nqc = this.QuizWithComment;

  res.render('statistics/show.ejs',
  { contquizes: nq,
    contcomments: nc,
    nmedio: (nc/nq),
    psin: (nq - nqc),
    pcon: nqc,
    errors: []
  });
};

exports.load = function(req, res) {
  this.QuizWithComment = 0; i = 0;
  models.Quiz.count().then(
    function (count){
    var nq = count;
    this.NumQ = nq;
    res.redirect('/quizes/statistics/ld1');
  });
}

exports.ld1 = function(req, res) {
  models.Comment.count().then(
    function (count){
    var nc = count;
    this.NumC = nc;
    res.redirect('/quizes/statistics/ld2');
  });
}


exports.ld2 = function(req, res) {
  if (i < this.NumQ) {
    models.Quiz.findAll().then(
            function(quizes) {
              if (i < quizes.length) {
                var idBuscado = quizes[i++].id;
                var myUrl;
                 myUrl = '/quizes/statistics2/'+idBuscado;
                 console.log("QID=",  myUrl);
                 res.redirect(myUrl);
            }
    });
  }
  else {
    res.redirect('/quizes/statistics/mostrar');
  }
};

exports.ld3 = function(req, res) {
  models.Comment.count({where: ['Quiz.id = ?', req.params.statId],
                        include:
                        [
                          {model: models.Quiz}
                        ]}).then(
       function(count) {
         if (count > 0) ++this.QuizWithComment;

         res.redirect('/quizes/statistics/ld2');
  });
};
