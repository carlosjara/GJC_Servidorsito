var express = require("express");
var router = express.Router();
var Client = require('node-rest-client').Client;
var _ = require('lodash');
var Handlebars = require("hbs");
var formidable = require('formidable');

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


router.get('/',function(req,res,next){
    res.render('estudiante_materias');
});

router.get('/:id', function(req, res) {
    var usuario_id = req.params.id;
    var userName = "";
    var userCursos = [];
    var talleresDetalle= [];
    
    var renderMaterias = _.after(1,function() {
        console.log(talleresDetalle);
        var json = {title: userName ,idUser: usuario_id, datos : { name: userName , cursos: userCursos, talleres: talleresDetalle}}
        res.render('estudiante_materias', json);
    });
    
    var done = _.after(2, function() {
        var talleresName = {
            data: {id : usuario_id},
            headers: { "Content-Type": "application/json" }
        };
        client.post("https://rest-hectordavid1228.c9users.io:8081/getDetallesTalleres", talleresName, function (data, response) {
            // parsed response body as js object
            talleresDetalle = data.talleres;
            renderMaterias();
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

router.post('/file/:id/tarea/:id_tarea', function (req, res){
    var form = new formidable.IncomingForm();
    form.parse(req);
    var filename = "";
    var id_usuario= req.params.id;
    var id_tarea= req.params.id_tarea;
    var renderizar = _.after(2,function() {
        res.redirect("/estudiante_materias/"+id_usuario);
    });
    
    var carga = _.after(1,function() {
        var fechaHoy= new Date();
        
        var dfin = fechaHoy.getDate();
        var mfin = fechaHoy.getMonth(); + 1
        var afin = fechaHoy.getFullYear();
        var f_creacion = "";
        if(dfin<10){
          f_creacion = afin+'-'+mfin+'-'+'0'+dfin;
        }
        if(mfin<10){
          f_creacion = afin+'-'+'0'+mfin+'-'+dfin;
        }
        if(mfin<10 && dfin<10){
          f_creacion = afin+'-'+'0'+mfin+'-'+'0'+dfin;
        }
        
        console.log("--",filename,"--",f_creacion,"--",id_tarea,"--",id_usuario);
        var documento = {
                data: {nombre: filename, fecha_creacion: f_creacion, id_tarea:id_tarea,id_usuario : id_usuario},
                headers: { "Content-Type": "application/json" }
            };
        client.post("https://rest-hectordavid1228.c9users.io:8081/nuevoDocumento", documento, function (data, response) {
                // parsed response body as js object
                renderizar();
        });
    });
    
    
    form.on('fileBegin', function (name, file){
        filename = file.name;
        file.path = __dirname + '/../public/uploads/' + file.name;
        
    });

    form.on('file', function (name, file){
        
        console.log('Uploaded ' + file.name);
        renderizar();
        carga();
    });
    
    
});

module.exports = router;
