var express = require('express');
var router = express.Router();
var Client = require('node-rest-client').Client;
var _ = require('lodash');

var client = new Client();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('estudiante_resumen');
});

router.get('/:id', function(req, res) {
    var usuario_id = req.params.id;
    var userName = "";
    var userCursos = [];
    
    var done = _.after(2, function() {
        
        res.render('estudiante_resumen', {title: userName ,datos : { name: userName , cursos: userCursos}});
    });
    
    var argsUser= {
                data: {"id":req.params.id},
                headers: { "Content-Type": "application/json" }
              };
    client.post("https://rest-hectordavid1228.c9users.io:8081/nameById", argsUser, function (data, response) {
        // parsed response body as js object 
        userName = data.res[0]["nombre_usuario"];
        done();
         var argsNames= {
                data: {"name": userName},
                headers: { "Content-Type": "application/json" }
              };
        client.post("https://rest-hectordavid1228.c9users.io:8081/cursesByName", argsNames, function (data, response) {
            // parsed response body as js object 
            userCursos = userCursos.concat(data.res);
            done();
        }); 
    });
    
});



module.exports = router;
