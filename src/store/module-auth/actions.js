import axios from "axios";

export function loginUser({ commit }) {
  const API_URL = process.env.BASE_URL;

  axios
    .get(`${API_URL}/auth/login`)
    .then((res) => {
      commit("LOGIN_USER", res.data);
    })
    .catch((error) => {
      console.log(error);
    });
}
