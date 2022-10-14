import { Notify, Platform } from "quasar";
import axios from "axios";

const API_URL = process.env.BASE_URL[0];
export function handleRequestResponse({ commit }, payload) {
  if (payload.status == "success") {
    if (payload.msg == "default") {
      Notify.create({
        color: payload.color != "default" ? payload.color : "positive",
        message: "Action completed successful",
        position: Platform.is.mobile ? "bottom" : "top-right",
      });
    } else if (payload.msg) {
      Notify.create({
        color: payload.color != "default" ? payload.color : "positive",
        message: payload.msg,
        position: Platform.is.mobile ? "bottom" : "top-right",
      });
    }
    if (payload.to_be_store_data.required) {
      payload.to_be_store_data.data.forEach((element) => {
        if (payload.to_be_store_data.has_value) {
          localStorage.setItem(element.key, element.value);
        } else {
          console.log(element);
          localStorage.setItem(element.key, JSON.stringify(element.value));
        }
      });
    }
    if (payload.to_on_ok !== "none") {
      this.$router.push({
        name: payload.to_on_ok,
      });
    }
  }
  if (payload.status == "fail") {
    if (payload.fail_msg == "default") {
      Notify.create({
        color: payload.color != "default" ? payload.color : "negative",
        message: "Action did not complete successfully",
        position: Platform.is.mobile ? "bottom" : "top-right",
      });
    } else if (payload.fail_msg) {
      Notify.create({
        color: payload.color != "default" ? payload.color : "negative",
        message: payload.fail_msg,
        position: Platform.is.mobile ? "bottom" : "top-right",
      });
    }
    if (payload.to_on_fail !== "none") {
      this.$router.push({
        name: payload.to_on_fail,
      });
    }
  }
}

export function postRequest({ commit, dispatch }, payload) {
  return axios
    .post(API_URL + payload.url, payload.data, payload.headers)
    .then((res) => {
      let handle_response_payload = {
        data: res.data,
        status: "success",
        color: payload.color,
        msg: payload.msg ? payload.msg : "default",
        to_on_ok: payload.to_on_ok,
        to_be_store_data: {
          has_value: payload.to_be_store_data.has_value,
          required: payload.to_be_store_data.required,
          data: payload.to_be_store_data.has_value
            ? payload.to_be_store_data.data
            : [{ key: "data", value: res.data.data }],
        },
      };
      dispatch("handleRequestResponse", handle_response_payload);
      return res;
    })
    .catch((error) => {
      let handle_response_payload = {
        status: "fail",
        color: "negative",
        to_on_fail: payload.to_on_fail,
        fail_msg:
          payload.error_msg != "default"
            ? payload.error_msg
            : error.response.data.message,
        status_code: error.response.status,
      };
      dispatch("handleRequestResponse", handle_response_payload);
    });
}
