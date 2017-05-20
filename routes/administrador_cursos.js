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
  res.render('administrador_cursos');
});

router.get('/:id_administrador', function(req, res, next) {
    var cursos= [];
    var profesores= [];
    var userName = "";
    console.log("---",req.params.id_administrador);
    var renderResumen = _.after(3,function() {
        var json = {title: userName , idUser: req.params.id_administrador,cursos : cursos, profesores:profesores}
        res.render('administrador_cursos', json);
    });
    var datos = {
                    data: {"id" : req.params.id_administrador},
                    headers: { "Content-Type": "application/json" }
                };
    client.post("https://rest-hectordavid1228.c9users.io:8081/nameById", datos, function (data, response) {
            userName=data.res[0]["nombre_usuario"];
            renderResumen();
        });
    client.get("https://rest-hectordavid1228.c9users.io:8081/getCourses", function (data, response) {
            cursos=data.cursos;
            renderResumen();
        });
    client.get("https://rest-hectordavid1228.c9users.io:8081/getProfesores", function (data, response) {
            profesores=data.profesores;
            renderResumen();
        });
});


router.post('/crear/:id_user', function(request, response){   
    //fecha_fin,fecha_inicio,porcentaje_nota,descripcion,activa,id_curso
    
    var nombre = request.body.nombre_curso;
    var id_propietario = request.body.picked;
    var nuevo = {
        data: {nombre_curso: nombre, id_propietario:id_propietario},
        headers: { "Content-Type": "application/json" }
    }; 
    client.post("https://rest-hectordavid1228.c9users.io:8081/nuevoCurso", nuevo, function (data, response) {
        console.log(data.respuesta);
    });
    response.redirect("/administrador_cursos/"+request.params.id_user);
});

module.exports = router;