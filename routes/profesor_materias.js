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
  res.render('profesor_resumen');
});

router.get('/:id', function(req, res) {
    var usuario_id = req.params.id;
    var userName = "";
    var userCursos = [];
    var talleresCursos = [];
    var estudiantesCursos = [];
    var doneOneCourse = _.after(2, function() {
        console.log(userCursos);
    });
    var argsUser= {
                data: {"id":usuario_id},
                headers: { "Content-Type": "application/json" }
              };
    client.post("https://rest-hectordavid1228.c9users.io:8081/nameById", argsUser, function (data, response) {
        // parsed response body as js object 
        userName = data.res[0]["nombre_usuario"];
        var argsCursos = {
            data: {id : usuario_id},
            headers: { "Content-Type": "application/json" }
        };
        client.post("https://rest-hectordavid1228.c9users.io:8081/getCoursesByTeacher", argsCursos, function (data, response) {
            // parsed response body as js object
            userCursos = data.cursos;
            var renderMaterias = _.after((userCursos.length),function() {
                console.log("--",talleresCursos);
                var json = {title: userName ,idUser: usuario_id, datos : userCursos, talleres: talleresCursos}
                res.render('profesor_materias', json);
            });
            
            for (var i in userCursos){
                var id_c=usuario_id;
                var argsTalleres = {
                    data: {"id" : id_c},
                    headers: { "Content-Type": "application/json" }
                };
                client.post("https://rest-hectordavid1228.c9users.io:8081/getDetailActivitiesCoursesByTeacher", argsTalleres, function (data, response) {
                    talleresCursos = data.cursos;
                    renderMaterias();
                });
            }
            
        });
        
        
        }); 

    
});

router.get('/:id/materia/:idmateria', function(req, res) {
    var usuario_id = req.params.id;
    var materia_id= req.params.idmateria;
    var userName = "";
    var talleresCursos = [];
    var estudiantesCursos = [];
    var documentos = [];
    
    var argsUser= {
                data: {"id":usuario_id},
                headers: { "Content-Type": "application/json" }
              };
    client.post("https://rest-hectordavid1228.c9users.io:8081/nameById", argsUser, function (data, response) {
        // parsed response body as js object 
        userName = data.res[0]["nombre_usuario"];

        var argsTalleres = {
            data: {id : materia_id},
            headers: { "Content-Type": "application/json" }
        };
        client.post("https://rest-hectordavid1228.c9users.io:8081/getTalleresByCourse", argsTalleres, function (data, response) {
            // parsed response body as js object
            talleresCursos = data.talleres;
    
            var renderMaterias = _.after(1,function() {
                var json = {title: userName ,idUser: usuario_id, talleres: talleresCursos, estudiantes: estudiantesCursos, documentos: documentos}
                res.render('profesor_una_materia', json);
            });
    
            client.post("https://rest-hectordavid1228.c9users.io:8081/getStudentsByCourse", argsTalleres, function (data, response) {
                    estudiantesCursos=data.estudiantes;
                    //renderMaterias();
                    var renderMaterias2 = _.after((estudiantesCursos.length)*(talleresCursos.length),function() {
                        renderMaterias();
                    });
                    
                    for (var k in talleresCursos){
                        for (var i in estudiantesCursos){
                            var argDocumento = {
                                data: {id_activity : talleresCursos[k]["id_tarea"], id_user:estudiantesCursos[i]["id_usuario"]},
                                headers: { "Content-Type": "application/json" }
                            };
                            client.post("https://rest-hectordavid1228.c9users.io:8081/getDocument", argDocumento, function (data, response) {
                                    documentos=documentos.concat(data.documento);
                                    renderMaterias2();
                            });
                        }
                    }
            });

            
            
        });
        
        
        }); 

    
});

router.post('/registrarNota/:id/curso/:id_curso/actividad/:id_tarea/usuario/:id_usuario', function(request, response){    
    var notas = {
        data: {id_tarea: request.params.id_tarea,nota : request.body.nota, id_usuario: request.params.id_usuario},
        headers: { "Content-Type": "application/json" }
    }; 
    client.post("https://rest-hectordavid1228.c9users.io:8081/setNotaActividad", notas, function (data, response) {
        console.log(data.respuesta);
    });
    //console.log(request.body.nota);
    var id = request.params.id;
    var id_tarea = request.params.id_tarea;
    response.redirect("../../../../../../../"+id+"/materia/"+request.params.id_curso);
});

router.post('/ActualizarMateria/:id_curso/actividad/:id_tarea/profesor/:id_user', function(request, response){
    var actividad = {
        data: {fecha_fin: request.body.fecha_fin, fecha_inicio: request.body.fecha_inicio, descripcion: request.body.descripcion, id_tarea: request.params.id_tarea},
        headers: { "Content-Type": "application/json" }
    }; 
    client.post("https://rest-hectordavid1228.c9users.io:8081/updateActividad", actividad, function (data, response) {
        console.log(data.respuesta);
    });
    response.redirect("../../../../../../../"+"profesor_materias/"+request.params.id_user);
});

module.exports = router;