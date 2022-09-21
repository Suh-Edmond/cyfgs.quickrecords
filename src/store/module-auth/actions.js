import axios from "axios";

export function someAction({ commit }) {
  axios
    .get(`${process.env.BASE_URL}/posts`)
    .then((res) => {
      commit("TEST_MUTATION", res.data);
    })
    .catch((error) => {
      console.log(error);
    });
}
