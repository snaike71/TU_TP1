"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createUser = createUser;
exports.getUsers = getUsers;
var _axios = _interopRequireDefault(require("axios"));
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
/**
 * @fileoverview Service API pour la gestion des utilisateurs via JSONPlaceholder.
 * @module userApi
 */

const API_BASE_URL = process.env.VITE_API_URL || 'https://jsonplaceholder.typicode.com';

/**
 * Récupère la liste des utilisateurs depuis l'API.
 *
 * @returns {Promise<Array>} Liste des utilisateurs
 * @throws {Error} En cas d'erreur réseau ou serveur
 */
async function getUsers() {
  const response = await _axios.default.get(`${API_BASE_URL}/users`);
  return response.data;
}

/**
 * Enregistre un nouvel utilisateur via l'API.
 *
 * @param {Object} userData - Données de l'utilisateur à créer
 * @returns {Promise<Object>} L'utilisateur créé (avec id attribué par le serveur)
 * @throws {Error} En cas d'erreur réseau, métier (400) ou serveur (500)
 */
async function createUser(userData) {
  const response = await _axios.default.post(`${API_BASE_URL}/users`, userData);
  return response.data;
}