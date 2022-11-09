import { LocalStorage, Notify, Platform } from "quasar";
import { axios } from "src/boot/axios";

const API_URL = process.env.BASE_URL[0];

export function handleRequestResponse({ commit }, payload) {
  if (payload.status == "success") {
    if (payload.msg == "default") {
      Notify.create({
        type: "positive",
        color: payload.color != "default" ? payload.color : "positive",
        message: "Action completed successful",
        position: Platform.is.mobile ? "bottom" : "top-right",
      });
    } else if (payload.msg) {
      Notify.create({
        type: "positive",
        color: payload.color != "default" ? payload.color : "positive",
        message: payload.msg,
        position: Platform.is.mobile ? "bottom" : "top-right",
      });
    }
    if (payload.to_be_store_data.required) {
      payload.to_be_store_data.data.forEach((element) => {
        if (payload.to_be_store_data.has_value) {
          LocalStorage.set(element.key, element.value);
        } else {
          LocalStorage.set(element.key, element.value);
        }
      });
    }
    if (payload.to_on_ok !== "none" && payload.status == "success") {
      this.$router.push({
        name: payload.to_on_ok,
      });
    }
  }
  if (payload.status == "fail") {
    if (payload.fail_msg == "default") {
      Notify.create({
        color: payload.color != "default" ? payload.color : "negative",
        type: "negative",
        message: "Action did not complete successfully",
        position: Platform.is.mobile ? "bottom" : "top-right",
      });
    } else if (payload.fail_msg) {
      Notify.create({
        color: payload.color != "default" ? payload.color : "negative",
        message: payload.fail_msg,
        type: "negative",
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
            : [
                { key: "data", value: res.data.data },
                { key: "has_logged_in", value: true },
              ],
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

export function uploadFileRequest({commit, dispatch}, payload){
  return axios.post(API_URL+payload.url, payload.data, { "Content-Type": "multipart/form-data"}).then((res) =>{
    let handle_response_payload = {
      data: res.data,
      status: "success",
      color: payload.color,
      msg: payload.msg ? payload.msg : "default",
      to_on_ok: payload.to_on_ok,
    };
    dispatch("handleRequestResponse", handle_response_payload);
    return res;
  }).catch((error) => {
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
  })
}

export function getRequest({ commit, dispatch }, payload) {
  return axios
    .get(API_URL+payload.url)
    .then((res) => {
      let handle_response_payload = {
        data: res.data,
        status: payload.status ? payload.status : "success",
        color: payload.color,
        msg: payload.msg ? payload.msg : "default",
        to_on_ok: payload.to_on_ok,
        to_be_store_data: {
          has_value: payload.to_be_store_data.has_value,
          required: payload.to_be_store_data.required,
          data: payload.to_be_store_data.has_value
            ? payload.to_be_store_data.data
            : [],
        },
      };
      if(payload.has_commit){
        console.log(res.data.data);
        commit(payload.commit, res.data.data)
      }
      dispatch("handleRequestResponse", handle_response_payload);
      return res.data;
    })
    .catch((error) => {
      console.log(error);
      let handle_fail_res_payload = {
        status: payload.status ? payload.status : "fail",
        color: "negative",
        to_on_fail: payload.to_on_fail,
        fail_msg:
          payload.error_msg != "default"
            ? payload.error_msg
            : error.response.data.message,
        status_code: error.response.data.status,
      };
      dispatch("handleRequestResponse", handle_fail_res_payload);
    });
}

export function putRequest({ commit, dispatch }, payload) {
  return axios
    .put(API_URL+payload.url, payload.data)
    .then((res) => {
      let handle_response_payload = {
        data: res.data,
        status: payload.status ? payload.status : "success",
        color: payload.color,
        msg: payload.msg ? payload.msg : "default",
        to_on_ok: payload.to_on_ok,
        to_be_store_data: {
          has_value: payload.to_be_store_data.has_value,
          required: payload.to_be_store_data.required,
          data: payload.to_be_store_data.has_value
            ? payload.to_be_store_data.data
            : [],
        },
      };
      dispatch("handleRequestResponse", handle_response_payload);
      return res;
    })
    .catch((error) => {
      let handle_fail_res_payload = {
        status: payload.status ? payload.status : "fail",
        color: "negative",
        to_on_fail: payload.to_on_fail,
        fail_msg:
          payload.error_msg != "default"
            ? payload.error_msg
            : error.response.data.message,
        status_code: error.response.status,
      };
      dispatch("handleRequestResponse", handle_fail_res_payload);
    });
}

export function deleteRequest({ commit }, payload) {
  return axios
    .delete(API_URL+payload.url)
    .then((res) => {
      let handle_response_payload = {
        data: res.data,
        status: payload.status ? payload.status : "success",
        color: payload.color,
        msg: payload.msg ? payload.msg : "default",
        to_on_ok: payload.to_on_ok,
        to_be_store_data: {
          has_value: payload.to_be_store_data.has_value,
          required: payload.to_be_store_data.required,
          data: payload.to_be_store_data.has_value
            ? payload.to_be_store_data.data
            : [],
        },
      };
      dispatch("handleRequestResponse", handle_response_payload);
      return res;
    })
    .catch((error) => {
      let handle_fail_res_payload = {
        status: payload.status ? payload.status : "fail",
        color: "negative",
        to_on_fail: payload.to_on_fail,
        fail_msg:
          payload.error_msg != "default"
            ? payload.error_msg
            : error.response.data.message,
        status_code: error.response.status,
      };
      dispatch("handleRequestResponse", handle_fail_res_payload);
    });
}

export function setRoles({ commit }, roles) {
  commit("SET_ROLES", roles);
}

export function logoutUser({ commit }, payload) {
  LocalStorage.remove("data");
  LocalStorage.remove("credential");
  this.$router.push({
    name: payload.to_on_ok,
  });
  commit("SET_ROLES", []);
}

export function setOrganisation({ commit }, data) {
  commit("SET_ORGANISATION", data);
}


