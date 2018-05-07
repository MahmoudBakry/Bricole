'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _url = require('url');

var _url2 = _interopRequireDefault(_url);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ApiResponse = function () {
    function ApiResponse(data, page, pageCount, limit, totalCount, req) {
        _classCallCheck(this, ApiResponse);

        this.links = {};

        this.data = data;
        this.page = page;
        this.pageCount = pageCount;
        this.limit = limit;
        this.totalCount = totalCount;
        var appUrl = req.protocol + '://' + req.get('host') + _url2.default.parse(req.originalUrl).pathname;

        this.addSelfLink(appUrl);
        if (page >= 1 && page < pageCount) this.addNextLink(appUrl);

        if (page > 1 && page <= pageCount) this.addPrevLink(appUrl);
    }

    _createClass(ApiResponse, [{
        key: 'addSelfLink',
        value: function addSelfLink(appUrl) {
            this.links.self = appUrl + "?page=" + this.page + "&limit=" + this.limit; // self page
        }
    }, {
        key: 'addNextLink',
        value: function addNextLink(appUrl) {
            var afterPage = this.page + 1;
            this.links.next = appUrl + "?page=" + afterPage + "&limit=" + this.limit; // next page
            this.links.last = appUrl + "?page=" + this.pageCount + "&limit=" + this.limit; // last page
        }
    }, {
        key: 'addPrevLink',
        value: function addPrevLink(appUrl) {
            var prevPage = this.page - 1;
            this.links.prev = appUrl + "?page=" + prevPage + "&limit=" + this.limit; // prev page
            this.links.first = appUrl + "?page=1" + "&limit=" + this.limit; // first page
        }
    }]);

    return ApiResponse;
}();

exports.default = ApiResponse;
//# sourceMappingURL=ApiResponse.js.map