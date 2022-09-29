import axios from "axios";

const API_URL = process.env.BASE_URL[0];
export function loginUser({ commit }, payload) {
  return axios
    .post(`${API_URL}/api/public/auth/login`, payload)
    .then((res) => {
      commit("LOGIN_USER", true);
      const data = JSON.stringify(res.data);
      localStorage.setItem("data", data);
      localStorage.setItem("hasLoggedInBefore", true);
      return res;
    })
    .catch((error) => {
      commit("LOGIN_USER", false);
      return error.response;
    });
}

export function registerUser({ commit }, user) {
  return axios
    .post(`${API_URL}/api/public/auth/signup`, user)
    .then((res) => {
      commit("REGISTER_USER", true);
      return res;
    })
    .catch((error) => {
      commit("REGISTER_USER", false);
      error.response.data.errors.forEach(element => {
        this.$q.notify({
          type: "negative",
          position: "top-right",
          message: `Fail to create Account`,
          progress: true,
        });
      });
    });
}

export function checkUserExist(payload) {
  return axios.get(`${API_URL}/api/public/auth/check-user`, payload).then((res) => {
    return res
  }).catch((error) => {
    return error
  })
}

export function setNewPassword(payload) {
  return axios.post(`${API_URL}/api/public/auth/set-password`, payload).then((res) => {
    commit("LOGIN_USER", true);
      const data = JSON.stringify(res.data);
      localStorage.setItem("data", data);
      localStorage.setItem("hasLoggedInBefore", true);
      return res;
  }).catch((error) => {
    commit("LOGIN_USER", false);
    return error.response;
  });
}


