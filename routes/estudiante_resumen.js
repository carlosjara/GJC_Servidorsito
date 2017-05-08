var express = require('express');
var router = express.Router();
var Client = require('node-rest-client').Client;
var _ = require('lodash');
var Handlebars = require("hbs");

var client = new Client();

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
    }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('estudiante_resumen');
});

router.get('/:id', function(req, res) {
    var usuario_id = req.params.id;
    var userName = "";
    var userCursos = [];
    var talleresUser = [];
    
    var renderResumen = _.after(1,function() {
        var json = {title: userName ,idUser: usuario_id, datos : { name: userName , cursos: userCursos, talleres: talleresUser}}
        res.render('estudiante_resumen', json);
    });
    
    var done = _.after(2, function() {
        var talleres = [];
        var talleresName = {
            data: {id : usuario_id},
            headers: { "Content-Type": "application/json" }
        };
        client.post("https://rest-hectordavid1228.c9users.io:8081/getTalleres", talleresName, function (data, response) {
            // parsed response body as js object
            talleresUser = data.talleres;
            renderResumen();
        });
        
    });
    var argsUser= {
                data: {"id":usuario_id},
                headers: { "Content-Type": "application/json" }
              };
    client.post("https://rest-hectordavid1228.c9users.io:8081/nameById", argsUser, function (data, response) {
        // parsed response body as js object 
        userName = data.res[0]["nombre_usuario"];
        done();
         var argsNames= {
                data: {"id": usuario_id, "name": userName},
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
