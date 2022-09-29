export default {
  methods: {
    setLocalStorage (data) {
      localStorage.setItem('data', data)
    },
    getLocalStorageData(){
      return localStorage.getItem('data')
    },
    clearLocalStorage(){
      return localStorage.clear();
    }
  }
}
