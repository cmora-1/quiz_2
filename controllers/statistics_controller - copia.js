var models = require('../models/models.js');

// GET /quizes/statistics
var countq, countc;
var pregcomm;

exports.show = function(req, res) {
  models.Quiz.count().then(
    function (count){
      countq = count;
      console.log("Recs ", countq);
      models.Comment.count().then(
         function (count){
           countc = count;


           models.Quiz.findAll().then(
             function(quizes) {
               var i;
               pregcomm = 0;
               for (i=0; i < quizes.length; i++) {
                 var idBuscado = quizes[i].id;

                 models.Comment.count({where: ['Quiz.id = ?', idBuscado],
                                       include: [models.Quiz]}).then(
                      function(count) {
                        if (count > 0) ++pregcomm;
                        console.log("este count ", i, pregcomm, count);
                        if (i === quizes.length) {
                          console.log("Finales ", pregcomm, i, quizes.length);
                          res.render('statistics/show.ejs', {contquizes: countq,
                                                           contcomments: countc,
                                                           nmedio: (countc/countq),
                                                           psin: (countq - pregcomm),
                                                           pcon: pregcomm,
                                                           errors: []});
                        }
                      }
                  ).catch(function(error) {})

                } //for

                }
              ).catch(function(error){});





         }
       ).catch(function(error){});
    }
  ).catch(function(error){});

};
