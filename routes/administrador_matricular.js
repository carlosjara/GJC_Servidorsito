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
  res.render('administrador_matricular');
});

router.get('/:id_administrador', function(req, res, next) {
    var estudiantes= [];
    var cursos= [];
    var userName = "";
    var usuarios_cursos = [];
    var renderResumen = _.after(3,function() {
        var json = {title: userName , idUser: req.params.id_administrador,estudiantes : estudiantes,cursos : cursos,usuarios_cursos:usuarios_cursos}
        res.render('administrador_matricular', json);
    });
    var datos = {
                    data: {"id" : req.params.id_administrador},
                    headers: { "Content-Type": "application/json" }
                };
    client.post("https://rest-hectordavid1228.c9users.io:8081/nameById", datos, function (data, response) {
            userName=data.res[0]["nombre_usuario"];
            renderResumen();
        });
    client.get("https://rest-hectordavid1228.c9users.io:8081/getEstudiantes", function (data, response) {
            estudiantes=data.estudiantes;
            
            renderResumen();
        });
    client.get("https://rest-hectordavid1228.c9users.io:8081/getCourses", function (data, response) {
            cursos=data.cursos;
            renderResumen();
        });

    
//    client.get("https://rest-hectordavid1228.c9users.io:8081/getProfesores", function (data, response) {
//            profesores=data.profesores;
//            renderResumen();
//       });
});


router.post('/crear/:id_user', function(request, response){   
    //fecha_fin,fecha_inicio,porcentaje_nota,descripcion,activa,id_curso
    
    var id_estudiante = request.body.pickedEstudiante;
    var id_curso = request.body.pickedCurso;
    var nuevo = {
        data: {id_usuario: id_estudiante, id_curso:id_curso},
        headers: { "Content-Type": "application/json" }
    }; 
    client.post("https://rest-hectordavid1228.c9users.io:8081/nuevaMatricula", nuevo, function (data, response) {
        console.log(data.respuesta);
    });
    response.redirect("/administrador_matricular/"+request.params.id_user);
});

module.exports = router;