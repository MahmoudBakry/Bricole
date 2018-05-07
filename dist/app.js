'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _expressValidator = require('express-validator');

var _expressValidator2 = _interopRequireDefault(_expressValidator);

var _helmet = require('helmet');

var _helmet2 = _interopRequireDefault(_helmet);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _config = require('./config');

var _config2 = _interopRequireDefault(_config);

var _routes = require('./routes');

var _routes2 = _interopRequireDefault(_routes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise;
_mongoose2.default.connect(_config2.default.mongoUrl);

//conect data base
_mongoose2.default.connection.on('connected', function () {
    console.log('\x1b[32m%s\x1b[0m', '[DB] Connected...');
});
_mongoose2.default.connection.on('error', function (err) {
    return console.log('\x1b[31m%s\x1b[0m', '[DB] Error : ' + err);
});
_mongoose2.default.connection.on('disconnected', function () {
    return console.log('\x1b[31m%s\x1b[0m', '[DB] DisConnected...');
});

//build server 
var app = (0, _express2.default)();
var server = _http2.default.Server(app);
//config midleware
app.use((0, _cors2.default)());
app.use((0, _helmet2.default)());

app.use(function (req, res, next) {
    _config2.default.apiAppUrl = req.protocol + '://' + req.get('host');
    next();
});

app.use('/docs', _express2.default.static(_path2.default.join(__dirname, 'docs')));
app.use('/uploads', _express2.default.static(_path2.default.join(__dirname, 'uploads')));

// Ensure Content Type
app.use('/', function (req, res, next) {
    var contype = req.headers['content-type'];

    if (contype && !(contype.includes('application/json') || contype.includes('multipart/form-data'))) return res.status(415).send({ error: "Unsupported Media Type (" + contype + ")" });
    next();
});

app.use(_bodyParser2.default.json({ limit: '50mb' }));
app.use(_bodyParser2.default.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

app.use((0, _expressValidator2.default)());

//user routes 
app.use('/api/v1', _routes2.default);
//Not Found Handler
app.use(function (req, res, next) {
    var error = new Error("Not Found..!");
    error.status = 404;
    next(error);
});

//ERROR Handler
app.use(function (err, req, res, next) {
    // if (err instanceof mongoose.CastError) {
    // err.status = 404;
    // err.message = `${err.model.modelName} Not Found`;
    // }

    var status = err.status ? err.status : 500;
    res.status(status).json({
        success: false,
        error: err.message
    });
    console.log(err);
});

exports.default = app;
//# sourceMappingURL=app.js.map