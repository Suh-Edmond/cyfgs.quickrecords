import Vue from "vue";
import axios_ from "axios";
import router from "src/router";
import { LocalStorage, Notify, Platform } from "quasar";

const axios = axios_.create({
  withCredentials: true
})

axios.interceptors.response.use(function(response)  {

  return Promise.resolve(response);

}, function(error) {
  if(typeof error.response == "undefined"){
    Notify.create({
      type:'info',
      message:'No Internet Connection',
      position:Platform.is.mobile?'bottom':'top-right'
    })
  }
  if(error.response.status == 401 && error.response.statusText == "Unauthorized"){

    LocalStorage.remove('data');
    router.push({name:'Login'}, () => {})
  }
  return Promise.reject(error);
})

axios.interceptors.request.use(function (config) {
  const data = LocalStorage.getItem('data');
  let token = "";
  if(data != null){
    token = data.token;
  }
  config.headers.common['Authorization'] = 'Bearer '+token;

  return config

})

Vue.prototype.$axios = axios

export { axios }
