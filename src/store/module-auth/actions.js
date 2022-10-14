
import { Notify, Platform } from "quasar";
import axios from "axios";

export function handleRequestResponse({commit}, payload) {
  if (payload.status == "success") {
    if (payload.msg == "default") {
      Notify.create({
        color: payload.color != "default" ? payload.color : "teal",
        message: "Action completed successful",
        position: Platform.is.mobile ? "bottom" : "top-right",
      });
    } else if (payload.msg) {
      Notify.create({
        color: payload.color != "default" ? payload.color : "teal",
        message: payload.msg,
        position: Platform.is.mobile ? "bottom" : "top-right",
      });
    }
    if (typeof payload.to_on_ok !== "undefined") {
      this.$router.push({
        name: payload.to_on_ok,
      });
    }
  }
  if (payload.status == "fail") {
    if (payload.fail_msg !== "default") {
      Notify.create({
        color: payload.color != "default" ? payload.color : "red",
        message: "Action did not complete successfully",
        position: Platform.is.mobile ? "bottom" : "top-right",
      });
    } else if (payload.data.fail_msg) {
      Notify.create({
        color: payload.color != "default" ? payload.color : "red",
        message: payload.msg,
        position: Platform.is.mobile ? "bottom" : "top-right",
      });
    }
    if (typeof payload.to_on_fail !== "undefined") {
      this.$router.push({
        name: payload.to_on_fail,
      });
    }
  }
}

export function postRequest({ commit, dispatch }, payload) {
  // return axios({
  //   method:"POST",
  //   url: payload.url,
  //   data: payload.data,
  //   headers: payload.headers || null,
  // }).then((res) => {
  //     console.log(res)
  //     let handle_response_payload = {
  //       data: res.data,
  //       status: 'success',
  //       color: payload.color,
  //       msg: res.data.message? res.data.message: 'default',
  //       to_on_ok: payload.to_on_ok
  //     };
  //     dispatch("handleRequestResponse",  handle_response_payload );
  //     return res;
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //     let handle_response_payload = {
  //       status: 'fail',
  //       color: 'red',
  //       to_on_fail: payload.to_on_fail,
  //       // fail_msg: error.response.message? error.response.message : 'default'
  //     };
  //     dispatch("handleRequestResponse", { handle_response_payload });
  //     throw error;
  //   });
axios.post(payload.url, payload.data);
}
