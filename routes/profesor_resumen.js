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
            
            var modifyCourses = function(){
                a=userCursos;
                for(i in userCursos)
                {
                    talleres=[];
                    for(j in talleresCursos)
                    {
                        if(talleresCursos[j].id_curso==userCursos[i].id_curso)
                        {
                            talleres=talleres.concat([talleresCursos[j]]);
                            
                        }
                    }
                    a[i].talleres=talleres;
                    estudiantes=[];
                    for(k in estudiantesCursos)
                    {
                        if(estudiantesCursos[k].id_curso==userCursos[i].id_curso)
                        {
                            estudiantes=estudiantes.concat([estudiantesCursos[k]]);
                            
                        }
                    }
                    a[i].estudiantes=estudiantes;
                }
                return(a);
            }
            var renderResumen = _.after((userCursos.length)*2,function() {
                userCursos=modifyCourses();
                var json = {title: userName ,idUser: usuario_id, datos : userCursos}
                res.render('profesor_resumen', json);
            });
            
            for (i in userCursos)
            {
                
                var id_c=(userCursos[i].id_curso).toString();
                console.log(id_c);
                var argsTalleres = {
                    data: {"id" : id_c},
                    headers: { "Content-Type": "application/json" }
                };

                client.post("https://rest-hectordavid1228.c9users.io:8081/getTalleresByCourse", argsTalleres, function (data, response) {
                    talleresCursos=talleresCursos.concat(data.talleres);
                    renderResumen();
                    
                });
                
                client.post("https://rest-hectordavid1228.c9users.io:8081/getStudentsByCourse", argsTalleres, function (data, response) {
                    estudiantesCursos=estudiantesCursos.concat(data.estudiantes);
                    renderResumen();
                });
                
            }
            
        });
        
        
        }); 

    
});



module.exports = router;