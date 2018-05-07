'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ApiError = function (_Error) {
    _inherits(ApiError, _Error);

    function ApiError(status, message) {
        _classCallCheck(this, ApiError);

        var _this = _possibleConstructorReturn(this, (ApiError.__proto__ || Object.getPrototypeOf(ApiError)).call(this));

        _this.status = status;
        _this.message = message;
        return _this;
    }

    _createClass(ApiError, null, [{
        key: 'NotFound',
        value: function NotFound(name) {
            this.status = 404;
            this.message = name + ' Not Found';
        }
    }, {
        key: 'BadRequest',
        value: function BadRequest() {
            var message = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'Bad Request, Check your inputs';

            this.status = 400;
            this.message = message;
        }
    }, {
        key: 'UnprocessableEntity',
        value: function UnprocessableEntity(message) {
            this.status = 422;
            this.message = message;
        }
    }, {
        key: 'InvalidBusnissRule',
        value: function InvalidBusnissRule(message) {
            this.status = 200;
            this.message = message;
        }
    }]);

    return ApiError;
}(Error);

exports.default = ApiError;
//# sourceMappingURL=ApiError.js.map