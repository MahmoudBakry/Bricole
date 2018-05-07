'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.multerSaveTo = multerSaveTo;

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ApiError = require('../helpers/ApiError');

var _ApiError2 = _interopRequireDefault(_ApiError);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fileFilter = function fileFilter(req, file, cb) {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else cb(new _ApiError2.default.UnprocessableEntity('jpeg or png are the only accepted types'));
};

function multerSaveTo(folderName) {

    var storage = _multer2.default.diskStorage({
        destination: function destination(req, file, cb) {
            console.log("BODY iN DEST : ", req.body);

            var dest = 'src/uploads/' + folderName;
            // create destination if don't exist
            (0, _mkdirp2.default)(dest, function (err) {
                if (err) return cb(new _ApiError2.default(500, "Couldn't create dest"));

                cb(null, dest);
            });
        },
        filename: function filename(req, file, cb) {
            cb(null, file.fieldname + '-' + (Date.now() + Math.floor(Math.random() * 10000) + _path2.default.extname(file.originalname)));
        }
    });

    return (0, _multer2.default)({
        storage: storage,
        //  fileFilter,
        limits: {
            fileSize: 1024 * 1024 * 10 // limit 10mb
        }
    });;
}
//# sourceMappingURL=multer.js.map