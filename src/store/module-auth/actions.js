import { LocalStorage, Notify, Platform } from "quasar";
import { axios } from "src/boot/axios";

const API_URL = process.env.BASE_URL[0];
const FILE_UPLOAD_URL = "http://127.0.0.1:9000";

export function handleRequestResponse({ }, payload) {
  if (payload.status == "success" && payload.show_feedback) {
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
  if (payload.status == "fail" && payload.show_feedback) {
    if (payload.fail_msg == "default") {
      Notify.create({
        color: payload.color != "default" ? payload.color : "info",
        type: "info",
        message: "Action did not complete successfully",
        position: Platform.is.mobile ? "bottom" : "top-right",
      });
    } else if (payload.fail_msg) {
      Notify.create({
        color: payload.color != "default" ? payload.color : "info",
        message: payload.fail_msg,
        type: "info",
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

export function postRequest({dispatch }, payload) {
  return axios
    .post(API_URL + payload.url, payload.data, payload.headers)
    .then((res) => {
      let handle_response_payload = {
        data: res.data,
        status: "success",
        show_feedback: payload.show_feedback,
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
      let handle_error_payload = {
        status: "fail",
        show_feedback:payload.show_feedback,
        color: "negative",
        to_on_fail: payload.to_on_fail,
        fail_msg:
          payload.error_msg != "default"
            ? payload.error_msg
            : error.response.data.message,
        status_code: 404,
      };
      dispatch("handleRequestResponse", handle_error_payload);
    });
}

//upload excel files for users
export function uploadFileRequest({ dispatch }, payload) {
  return axios
    .post(API_URL + payload.url, payload.data, {
      "Content-Type": "multipart/form-data",
    })
    .then((res) => {
      let handle_response_payload = {
        data: "",
        show_feedback:payload.show_feedback,
        status: payload.status,
        color: payload.color,
        msg: payload.msg ? payload.msg : "default",
        to_on_ok: "none",
      };
      dispatch("handleRequestResponse", handle_response_payload);
      return res;
    })
    .catch((error) => {
      if (error.response != "undefined") {
        let handle_error_payload = {
          status: "fail",
          color: "negative",
          to_on_fail: "none",
          show_feedback:payload.show_feedback,
          fail_msg:
            payload.error_msg != "default"
              ? payload.error_msg
              : error.response.data.message,
          status_code: 404,
        };
        dispatch("handleRequestResponse", handle_error_payload);
      }
    });
}

export function getRequest({ commit, dispatch }, payload) {
  return axios
    .get(API_URL + payload.url)
    .then((res) => {
      let handle_response_payload = {
        data: res.data,
        status: payload.status ? payload.status : "success",
        show_feedback:payload.show_feedback,
        color: payload.color,
        msg: payload.msg ? payload.msg : "default",
        to_on_ok: payload.to_on_ok,
        to_be_store_data: {
          has_value: payload.to_be_store_data.has_value,
          required: payload.to_be_store_data.required,
          data: payload.to_be_store_data.has_value
            ? payload.to_be_store_data.data
            : res.data,
        },
      };
      if (payload.has_commit) {
        commit(payload.commit, res.data.data);
      }
      dispatch("handleRequestResponse", handle_response_payload);
      return res.data;
    })
    .catch((error) => {
      let handle_fail_res_payload = {
        status: "fail",
        color: "negative",
        to_on_fail: payload.to_on_fail,
        show_feedback:payload.show_feedback,
        fail_msg:
          payload.error_msg != "default"
            ? payload.error_msg
            : error.response.data.message,
        status_code: error.response.data.status,
      };
      dispatch("handleRequestResponse", handle_fail_res_payload);
    });
}

export function putRequest({ dispatch }, payload) {
  return axios
    .put(API_URL + payload.url, payload.data)
    .then((res) => {
      let handle_response_payload = {
        data: res.data,
        status: payload.status ? payload.status : "success",
        show_feedback:payload.show_feedback,
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
        show_feedback:payload.show_feedback,
        fail_msg:
          payload.error_msg != "default"
            ? payload.error_msg
            : error.response.data.message,
        status_code: 404,
      };
      dispatch("handleRequestResponse", handle_fail_res_payload);
    });
}

export function deleteRequest({ dispatch }, payload) {
  return axios
    .delete(API_URL + payload.url)
    .then((res) => {
      let handle_response_payload = {
        status: payload.status ? payload.status : "success",
        color: payload.color,
        msg: payload.msg ? payload.msg : "default",
        to_on_ok: payload.to_on_ok,
        to_on_fail: payload.to_on_fail,
        show_feedback:payload.show_feedback,
        to_be_store_data: {
          has_value: payload.to_be_store_data.has_value,
          required: payload.to_be_store_data.required,
          data: payload.to_be_store_data.has_value
            ? payload.to_be_store_data.data
            : res.data,
        },
      };
      dispatch("handleRequestResponse", handle_response_payload);
      return res;
    })
    .catch((error) => {
      let handle_fail_res_payload = {
        status: payload.status ? payload.status : "fail",
        color: "negative",
        show_feedback:payload.show_feedback,
        to_on_fail: payload.to_on_fail,
        fail_msg:
          payload.error_msg != "default"
            ? payload.error_msg
            : error.response.data.message,
        status_code: 404,
      };
      dispatch("handleRequestResponse", handle_fail_res_payload);
    });
}

export function downloadPdf({}, payload) {
  return axios
    .get(API_URL + payload.url, {
      "Content-Type": "application/pdf",
      responseType: "blob",
    })
    .then((res) => {
      var fileURL = window.URL.createObjectURL(new Blob([res.data]));
      var fileLink = document.createElement("a");
      fileLink.href = fileURL;
      fileLink.setAttribute("download", payload.file_name);
      document.body.appendChild(fileLink);
      fileLink.click();
    }).catch((error) => {
      return error
    });
}

//upload any other files being used in the system
export async function uploadImageRequest({ commit, dispatch }, payload) {
  return axios
    .post(FILE_UPLOAD_URL + payload.url, payload.data, {
      withCredentials: false,
    })
    .then((res) => {
      let handle_response_payload = {
        data: "",
        status: payload.status,
        color: payload.color,
        msg: payload.msg ? payload.msg : "default",
        to_on_ok: "none",
      };
      dispatch("handleRequestResponse", handle_response_payload);
      return res;
    })
    .catch((error) => {
      if (error.response != "undefined") {
        let handle_error_payload = {
          status: "fail",
          color: "negative",
          to_on_fail: "none",
          fail_msg:
            payload.error_msg != "default"
              ? payload.error_msg
              : error.response.data.message,
          status_code: 404,
        };
        dispatch("handleRequestResponse", handle_error_payload);
      }
    });
}

//fetch uploaded files
export async function fetchUploadedImageRequest({}, payload) {
  const res = await axios.get(FILE_UPLOAD_URL + payload.url, {
    withCredentials: false,
  });
  return res;
}

export function setFetchingState({ commit }, payload) {
  commit("SET_IS_FETCHING", payload);
}

export function setRoles({ commit }, roles) {
  commit("SET_ROLES", roles);
}

export function logoutUser({}, payload) {
  LocalStorage.remove("data");
  LocalStorage.remove("credential");
  LocalStorage.remove("organisation");
  this.$router.push({
    name: payload.to_on_ok,
  });
}

export function setOrganisation({ commit }, data) {
  commit("SET_ORGANISATION", data);
}

export function updateMember({ commit }, data) {
  commit("UPDATE_MEMBER", data);
}

export function setPayCategories({commit}, data) {
  commit("SET_PAYMENT_CATEGORIES", data)
}

export function setUpdatedPayCategories({commit}, data) {
  commit("UPDATE_PAYMENT_CATEGORY", data)
}

export function setNavigationTabByUserRole(){
  let role = LocalStorage.getItem('data').roles.find(role => role.name === 'PRESIDENT');
  return role == "undefined";
}

export function setCurrentPaymentCategory({commit}, data) {
  commit("SET_CURRENT_PAYMENT_CATEGORY", data)
}

export function setUpdatedPaymentItem({commit}, data) {
  commit("SET_UPDATED_PAYMENT_ITEM", data);
}

export function setExpenditureCategories({commit}, data) {
  commit("SET_EXPENDITURE_CATEGORIES", data);
}

export function setUpdatedExpenditureCategory({commit},data) {
  commit("UPDATE_EXPENDITURE_CATEGORY", data);
}

export function setExpenditureItems({commit}, data) {
  commit("SET_EXPENDITURE_ITEMS", data);
}

export function setCurrentExpenditureCategory({commit}, data) {
  commit("SET_CURRENT_EXPENDITURE_CATEGORY", data);
}

export function setUpdatedExpenditureItem({commit}, data) {
  commit("SET_UPDATED_EXPENDITURE_ITEM", data);
}

export function setEditState({commit}, data) {
  commit("SET_EDIT_STATE", data);
}

export function setExpenditureItemDetails({commit}, data) {
  commit("SET_EXPENDITURE_ITEM_DETAIL", data)
}

export function setCurrentExpenditureItem({commit}, data) {
  commit("SET_CURRENT_EXPENDITURE_ITEM", data)
}
