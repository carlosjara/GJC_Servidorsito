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
  res.render('profesor_nueva');
});

router.get('/:id_profesor', function(req, res, next) {
    var cursos= [];
    var userName = "";
    var renderResumen = _.after(2,function() {
        var json = {title: userName , idUser: req.params.id_profesor,cursos : cursos}
        res.render('profesor_nueva', json);
    });
    var datos = {
                    data: {"id" : req.params.id_profesor},
                    headers: { "Content-Type": "application/json" }
                };
    client.post("https://rest-hectordavid1228.c9users.io:8081/nameById", datos, function (data, response) {
            userName=data.res[0]["nombre_usuario"];
            renderResumen();
        });
    client.post("https://rest-hectordavid1228.c9users.io:8081/getCoursesByTeacher", datos, function (data, response) {
            cursos=data.cursos;
            renderResumen();
        });
});


router.post('/crear/:id_user', function(request, response){   
    //fecha_fin,fecha_inicio,porcentaje_nota,descripcion,activa,id_curso
    var activa =1;
    
    console.log(request.body.picked);
    var nueva = {
        data: {fecha_fin: request.body.fecha_fin,fecha_inicio : request.body.fecha_inicio, porcentaje_nota: request.body.porcentaje_nota,descripcion : request.body.descripcion, activa: activa,id_curso: request.body.picked},
        headers: { "Content-Type": "application/json" }
    }; 
    client.post("https://rest-hectordavid1228.c9users.io:8081/nuevaActividad", nueva, function (data, response) {
        console.log(data.respuesta);
    });
    response.redirect("/profesor_nueva/"+request.params.id_user);
});

module.exports = router;