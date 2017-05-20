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
  res.render('administrador_estudiantes');
});

router.get('/:id_administrador', function(req, res, next) {
    var estudiantes= [];
    var profesores= [];
    var administradores= [];
    var userName = "";
    var renderResumen = _.after(4,function() {
        console.log(estudiantes);
        var json = {title: userName , idUser: req.params.id_administrador,estudiantes : estudiantes,profesores : profesores,administradores : administradores}
        res.render('administrador_estudiantes', json);
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
    client.get("https://rest-hectordavid1228.c9users.io:8081/getProfesores", function (data, response) {
            profesores=data.profesores;
            renderResumen();
        });
    client.get("https://rest-hectordavid1228.c9users.io:8081/getAdministradores", function (data, response) {
            administradores=data.administradores;
            renderResumen();
        });
//    client.get("https://rest-hectordavid1228.c9users.io:8081/getProfesores", function (data, response) {
//            profesores=data.profesores;
//            renderResumen();
//       });
});


router.post('/crear/:id_user', function(request, response){   
    //fecha_fin,fecha_inicio,porcentaje_nota,descripcion,activa,id_curso
    
    var nombre = request.body.nombre_estudiante;
    var contraseña = request.body.contraseña;
    var rol = request.body.picked;
    var nuevo = {
        data: {nombre_estudiante: nombre, contraseña:contraseña,rol:rol},
        headers: { "Content-Type": "application/json" }
    }; 
    client.post("https://rest-hectordavid1228.c9users.io:8081/nuevoEstudiante", nuevo, function (data, response) {
        console.log(data.respuesta);
    });
    response.redirect("/administrador_estudiantes/"+request.params.id_user);
});

module.exports = router;