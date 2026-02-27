"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _react = _interopRequireWildcard(require("react"));
var _reactRouterDom = require("react-router-dom");
var _reactToastify = require("react-toastify");
require("react-toastify/dist/ReactToastify.css");
var _validator = require("../validator");
var _UserContext = require("../context/UserContext");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * @fileoverview Composant formulaire d'inscription utilisateur avec validation et appels API.
 * @module UserForm
 */

/**
 * @constant {Object.<string, string>} ERROR_MESSAGES
 * @description Mapping des codes d'erreur de validation vers les messages utilisateur affichés dans le formulaire.
 */const ERROR_MESSAGES = {
  INVALID_INPUT: 'Champ requis',
  AGE_UNDER_18: 'Vous devez être majeur (mineur détecté)',
  INVALID_DATE_FUTURE: 'La date ne peut pas être dans le futur',
  INVALID_DATE_TOO_OLD: 'La date de naissance est invalide',
  INVALID_POSTAL_CODE_FORMAT: 'Code postal invalide (5 chiffres attendus)',
  INVALID_IDENTITY_FORMAT: 'Nom invalide (lettres, accents et tirets uniquement)',
  XSS_DETECTED: 'Contenu XSS détecté',
  INVALID_EMAIL_FORMAT: 'Email invalide'
};

/**
 * Composant de formulaire d'inscription utilisateur.
 * Gère la saisie, la validation en temps réel et la soumission via API.
 * Gère les erreurs serveur (400, 500) avec feedback utilisateur.
 *
 * @component
 * @returns {React.JSX.Element} Le formulaire d'inscription avec validation intégrée
 */
function UserForm() {
  const {
    addUser
  } = (0, _UserContext.useUsers)();
  const navigate = (0, _reactRouterDom.useNavigate)();
  const [formData, setFormData] = (0, _react.useState)({
    name: '',
    firstName: '',
    email: '',
    birthDate: '',
    postalCode: '',
    city: ''
  });
  const [errors, setErrors] = (0, _react.useState)({});
  const [touched, setTouched] = (0, _react.useState)({});
  const [submitting, setSubmitting] = (0, _react.useState)(false);
  const [apiError, setApiError] = (0, _react.useState)(null);
  const validateField = (0, _react.useCallback)((field, value) => {
    let result;
    switch (field) {
      case 'name':
      case 'firstName':
        result = (0, _validator.validateIdentity)(value);
        break;
      case 'email':
        result = (0, _validator.validateEmail)(value);
        break;
      case 'birthDate':
        result = (0, _validator.validateAge)(value);
        break;
      case 'postalCode':
        result = (0, _validator.validatePostalCode)(value);
        break;
      case 'city':
        if (!value || value.trim() === '') {
          result = {
            valid: false,
            error: 'INVALID_INPUT'
          };
        } else {
          result = {
            valid: true
          };
        }
        break;
    }
    return result;
  }, []);
  const handleChange = e => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setApiError(null);
    setErrors(prev => {
      if (!prev[name] && !touched[name]) return prev;
      const result = validateField(name, value);
      const newErrors = {
        ...prev
      };
      if (result.valid) {
        delete newErrors[name];
      } else {
        newErrors[name] = ERROR_MESSAGES[result.error] || result.error;
      }
      return newErrors;
    });
  };
  const handleBlur = e => {
    const {
      name,
      value
    } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    if (value && value.trim() !== '') {
      const result = validateField(name, value);
      setErrors(prev => {
        const newErrors = {
          ...prev
        };
        if (result.valid) {
          delete newErrors[name];
        } else {
          newErrors[name] = ERROR_MESSAGES[result.error] || result.error;
        }
        return newErrors;
      });
    } else {
      setErrors(prev => {
        const newErrors = {
          ...prev
        };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  const isFormValid = () => {
    const fields = ['name', 'firstName', 'email', 'birthDate', 'postalCode', 'city'];
    for (const field of fields) {
      const result = validateField(field, formData[field]);
      if (!result.valid) return false;
    }
    return true;
  };
  const handleSubmit = async e => {
    e.preventDefault();
    if (!isFormValid() || submitting) return;
    setSubmitting(true);
    setApiError(null);
    try {
      await addUser(formData);
      _reactToastify.toast.success('Inscription réussie avec succès !');
      setFormData({
        name: '',
        firstName: '',
        email: '',
        birthDate: '',
        postalCode: '',
        city: ''
      });
      setErrors({});
      setTouched({});
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === 400) {
          const message = error.response.data?.message || 'Cet email est déjà utilisé';
          setApiError(message);
          _reactToastify.toast.error(message);
        } else if (status >= 500) {
          setApiError('Le serveur est temporairement indisponible. Veuillez réessayer plus tard.');
          _reactToastify.toast.error('Erreur serveur. Veuillez réessayer plus tard.');
        } else {
          setApiError('Une erreur est survenue');
          _reactToastify.toast.error('Une erreur est survenue');
        }
      } else {
        setApiError('Impossible de contacter le serveur. Vérifiez votre connexion.');
        _reactToastify.toast.error('Erreur réseau. Vérifiez votre connexion.');
      }
    } finally {
      setSubmitting(false);
    }
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("form", {
    onSubmit: handleSubmit,
    children: [apiError && /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: "api-error",
      role: "alert",
      "data-testid": "api-error",
      children: apiError
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
        htmlFor: "name",
        children: "Nom"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
        id: "name",
        name: "name",
        type: "text",
        value: formData.name,
        onChange: handleChange,
        onBlur: handleBlur
      }), errors.name && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: "error",
        role: "alert",
        children: errors.name
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
        htmlFor: "firstName",
        children: "Pr\xE9nom"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
        id: "firstName",
        name: "firstName",
        type: "text",
        value: formData.firstName,
        onChange: handleChange,
        onBlur: handleBlur
      }), errors.firstName && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: "error",
        role: "alert",
        children: errors.firstName
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
        htmlFor: "email",
        children: "Email"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
        id: "email",
        name: "email",
        type: "text",
        value: formData.email,
        onChange: handleChange,
        onBlur: handleBlur
      }), errors.email && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: "error",
        role: "alert",
        children: errors.email
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
        htmlFor: "birthDate",
        children: "Date de naissance"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
        id: "birthDate",
        name: "birthDate",
        type: "date",
        value: formData.birthDate,
        onChange: handleChange,
        onBlur: handleBlur
      }), errors.birthDate && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: "error",
        role: "alert",
        children: errors.birthDate
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
        htmlFor: "postalCode",
        children: "Code postal"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
        id: "postalCode",
        name: "postalCode",
        type: "text",
        value: formData.postalCode,
        onChange: handleChange,
        onBlur: handleBlur
      }), errors.postalCode && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: "error",
        role: "alert",
        children: errors.postalCode
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)("div", {
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("label", {
        htmlFor: "city",
        children: "Ville"
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)("input", {
        id: "city",
        name: "city",
        type: "text",
        value: formData.city,
        onChange: handleChange,
        onBlur: handleBlur
      }), errors.city && /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
        className: "error",
        role: "alert",
        children: errors.city
      })]
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("button", {
      type: "submit",
      disabled: !isFormValid() || submitting,
      children: submitting ? 'Envoi en cours...' : 'Soumettre'
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactToastify.ToastContainer, {})]
  });
}
var _default = exports.default = UserForm;