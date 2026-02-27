"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRouterDom = require("react-router-dom");
var _HomePage = _interopRequireDefault(require("./pages/HomePage"));
var _RegisterPage = _interopRequireDefault(require("./pages/RegisterPage"));
require("./App.css");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @fileoverview Point d'entrée principal de l'application React avec routage.
 * @module App
 */

/**
 * Composant racine de l'application.
 * Définit les routes entre la page d'accueil et le formulaire d'inscription.
 *
 * @component
 * @returns {React.JSX.Element} L'application avec le routage
 */function App() {
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
    className: "app",
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactRouterDom.Routes, {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactRouterDom.Route, {
        path: "/",
        element: /*#__PURE__*/(0, _jsxRuntime.jsx)(_HomePage.default, {})
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactRouterDom.Route, {
        path: "/register",
        element: /*#__PURE__*/(0, _jsxRuntime.jsx)(_RegisterPage.default, {})
      })]
    })
  });
}
var _default = exports.default = App;