var models = require('../models/models.js');

// GET /quizes/statistics
var countq, countc;
var NumQ;
var NumC;
var QuizWithComment;

exports.show = function(req, res) {
  console.log('SHOWING...', this.NumQ, this.NumC, this.QuizWithComment);
  var nq, nc, nqc;
  if (this.NumQ === undefined)
    nq = models.NumQ;
  else
   nq = this.NumQ;

   if (this.NumC === undefined)
     nc = models.NumC;
   else
    nc = this.NumC;

    if (this.QuizWithComment === undefined)
      nqc = models.QuizWithComment;
    else
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
  models.Quiz.count().then(
    function (count){
    var nq = count;
    this.NumQ = nq;
  });

  models.Comment.count().then(
    function (count){
    var nc = count;
    this.NumC = nc;
  });

  models.Quiz.findAll().then(
           function(quizes) {
             var i;
             var pregcomm = 0;
             for (i=0; i < quizes.length; i++) {
               var idBuscado = quizes[i].id;

               models.Comment.count({where: ['Quiz.id = ?', idBuscado],
                                     include:
                                     [
                                       {model: models.Quiz}
                                     ]}).then(
                    function(count) {
                      if (count > 0) ++pregcomm;
                      this.QuizWithComment = pregcomm;
                    });
            } //for
  });

  res.redirect('/quizes/statistics/show');
};
