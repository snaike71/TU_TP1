"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _client = require("react-dom/client");
var _reactRouterDom = require("react-router-dom");
var _UserContext = require("./context/UserContext");
var _App = _interopRequireDefault(require("./App"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @fileoverview Point de montage React - Initialise et rend l'application dans le DOM.
 * @module index
 */

const root = (0, _client.createRoot)(document.getElementById('root'));
root.render(/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactRouterDom.BrowserRouter, {
  basename: "/TU_TP1",
  children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_UserContext.UserProvider, {
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_App.default, {})
  })
}));
var _default = exports.default = _App.default;