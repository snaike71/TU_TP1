"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRouterDom = require("react-router-dom");
var _UserContext = require("../context/UserContext");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @fileoverview Page d'accueil affichant le compteur et la liste des utilisateurs inscrits.
 * @module HomePage
 */

/**
 * Page d'accueil de l'application.
 * Affiche un message de bienvenue, le nombre d'utilisateurs inscrits,
 * la liste des inscrits (Nom et Prénom), et un lien vers le formulaire.
 *
 * @component
 * @returns {React.JSX.Element}
 */function HomePage() {
  const {
    users
  } = (0, _UserContext.useUsers)();
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
    className: "home",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("h1", {
      children: "Bienvenue"
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("p", {
      "data-testid": "user-count",
      children: [users.length, " utilisateur", users.length !== 1 ? 's' : '', " inscrit", users.length !== 1 ? 's' : '']
    }), users.length > 0 && /*#__PURE__*/(0, _jsxRuntime.jsx)("ul", {
      "data-testid": "user-list",
      children: users.map((user, index) => /*#__PURE__*/(0, _jsxRuntime.jsxs)("li", {
        children: [user.name, " ", user.firstName]
      }, index))
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactRouterDom.Link, {
      to: "/register",
      className: "register-link",
      children: "S'inscrire"
    })]
  });
}
var _default = exports.default = HomePage;