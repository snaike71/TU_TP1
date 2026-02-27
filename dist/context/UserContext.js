"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserContext = void 0;
exports.UserProvider = UserProvider;
exports.useUsers = useUsers;
var _react = _interopRequireWildcard(require("react"));
var _userApi = require("../api/userApi");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * @fileoverview Contexte React pour la gestion globale des utilisateurs inscrits via API.
 * @module UserContext
 */

/**
 * @typedef {Object} User
 * @property {string} name - Nom de l'utilisateur
 * @property {string} firstName - Prénom de l'utilisateur
 * @property {string} email - Email de l'utilisateur
 * @property {string} birthDate - Date de naissance
 * @property {string} postalCode - Code postal
 * @property {string} city - Ville
 */

/**
 * @typedef {Object} UserContextValue
 * @property {User[]} users - Tableau des utilisateurs inscrits
 * @property {function(User): Promise<Object>} addUser - Enregistre un utilisateur via l'API
 * @property {function(): Promise<void>} fetchUsers - Recharge la liste depuis l'API
 * @property {boolean} loading - Indique si un chargement est en cours
 */const UserContext = exports.UserContext = /*#__PURE__*/(0, _react.createContext)(null);

/**
 * Provider du contexte utilisateur.
 * Charge les utilisateurs depuis l'API au montage et expose les fonctions CRUD.
 *
 * @component
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {React.JSX.Element}
 */
function UserProvider({
  children
}) {
  const [users, setUsers] = (0, _react.useState)([]);
  const [loading, setLoading] = (0, _react.useState)(false);
  const fetchUsers = (0, _react.useCallback)(async () => {
    setLoading(true);
    try {
      const data = await (0, _userApi.getUsers)();
      setUsers(data);
    } catch {
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);
  (0, _react.useEffect)(() => {
    fetchUsers();
  }, [fetchUsers]);
  const addUser = async userData => {
    const created = await (0, _userApi.createUser)(userData);
    setUsers(prev => [...prev, {
      ...userData,
      id: created.id
    }]);
    return created;
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(UserContext.Provider, {
    value: {
      users,
      addUser,
      fetchUsers,
      loading
    },
    children: children
  });
}

/**
 * Hook personnalisé pour accéder au contexte utilisateur.
 *
 * @returns {UserContextValue}
 */
function useUsers() {
  const context = (0, _react.useContext)(UserContext);
  if (!context) {
    throw new Error('useUsers doit être utilisé dans un UserProvider');
  }
  return context;
}