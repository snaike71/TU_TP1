"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRouterDom = require("react-router-dom");
var _UserForm = _interopRequireDefault(require("../components/UserForm"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @fileoverview Page d'inscription contenant le formulaire utilisateur.
 * @module RegisterPage
 */

/**
 * Page du formulaire d'inscription.
 * Contient le formulaire et un lien de retour vers l'accueil.
 *
 * @component
 * @returns {React.JSX.Element}
 */function RegisterPage() {
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("h1", {
      children: "Formulaire d'inscription"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_UserForm.default, {}), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactRouterDom.Link, {
      to: "/",
      className: "back-link",
      children: "Retour \xE0 l'accueil"
    })]
  });
}
var _default = exports.default = RegisterPage;