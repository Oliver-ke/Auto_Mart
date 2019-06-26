"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.showAlert = exports.request = void 0;

/* global fetch */
const request = async (method, endpoint, token) => {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  };

  try {
    const res = await fetch(endpoint, config);
    const {
      error,
      data
    } = await res.json();

    if (error) {
      return {
        error
      };
    }

    return {
      data
    };
  } catch (error) {
    return {
      error
    };
  }
}; // shows alert


exports.request = request;

const showAlert = (msg, alert) => {
  alert.classList.remove('hide');
  alert.innerHTML = ` <i class="fas fa-info-circle"></i> ${msg}`;
  setTimeout(() => alert.classList.add('hide'), 5000);
};

exports.showAlert = showAlert;