var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var grunt = require("grunt");



//Start grunt
grunt.registerTask('default', 'Log some stuff.', function() {
    console.log('stuff');
});

grunt.tasks(['default']);

//Routes
var index = require('./routes/index');
var login = require('./routes/login');
var validation = require('./routes/validation');
var estudiantes_resumen = require('./routes/estudiante_resumen');
var est_materias = require('./routes/estudiante_materias');
var profesores_resumen = require('./routes/profesor_resumen');
var profesores_materias = require('./routes/profesor_materias');
var estudiante_pendiente = require('./routes/estudiante_pendiente');
var profesor_nueva = require('./routes/profesor_nueva');
var administrador_cursos = require('./routes/administrador_cursos');
var administrador_estudiantes = require('./routes/administrador_estudiantes');
var administrador_matricular = require('./routes/administrador_matricular');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Uses
app.use('/', index);
app.use('/index', index);
app.use('/validation', validation);
app.use('/login', login);
app.use('/estudiante_resumen', estudiantes_resumen);
app.use('/estudiante_materias', est_materias);
app.use('/estudiante_pendiente', estudiante_pendiente);
app.use('/profesor_resumen', profesores_resumen);
app.use('/profesor_materias', profesores_materias);
app.use('/profesor_nueva', profesor_nueva);
app.use('/administrador_cursos', administrador_cursos);
app.use('/administrador_estudiantes', administrador_estudiantes);
app.use('/administrador_matricular', administrador_matricular);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


app.listen(8081);
module.exports = app;
