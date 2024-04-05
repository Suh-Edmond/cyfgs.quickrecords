<template>
  <div class="row q-pt-lg">
    <div class="col-1 col-md-1 col-sm-1 col-xs-1"></div>
    <!----------------LOGO--------------------->
    <div class="col-5 col-md-5 col-sm-12 col-xs-12">
        <q-avatar size="110px" font-size="52px" v-if="getOrganisation.logo != null">
          <img :src="getOrganisationLogo" alt="" width="160px" />
        </q-avatar>
      </div>
      <!-------------END OF LOGO----------------->

      <!---------------DETAILS--------------------->
      <div class="col-5 col-md-5 col-sm-12 col-xs-12 flex justify-end text-left">
        <label>
          <span class="text-uppercase detail">{{$t('app.organisationName')}} &nbsp;:&nbsp;&nbsp;{{ getOrganisation.name }}</span> <br />
          <span class="detail">{{$t('app.salutation')}} &nbsp;:&nbsp;&nbsp;{{ getOrganisation.salutation }}</span> <br />
          <span class="detail">{{$t('app.boxLabel')}} &nbsp;:&nbsp;&nbsp;{{ getOrganisation.box_number }}</span><br />
          <span class="detail">{{$t('app.addressLabel')}} &nbsp;:&nbsp;&nbsp;{{ getOrganisation.address }}</span><br />
          <span class="detail">{{$t('app.phone')}} &nbsp;:&nbsp;&nbsp;{{ getOrganisation.telephone }}</span><br />
          <span class="detail">{{$t('app.emailLabel')}} &nbsp;:&nbsp;&nbsp;{{ getOrganisation.email }}</span><br /><br/>
          <span class="detail">{{$t('app.printedDate')}} &nbsp;:&nbsp;&nbsp;{{ getPrintedDate }}</span><br />
        </label>
      </div>
      <!-------------END OF DETAILS------------->
    <div class="col-1 col-md-1 col-sm-1 col-xs-1"></div>
  </div>
</template>

<script>
import moment from 'moment';
export default {
  computed: {
    getOrganisation() {
      return this.$store.getters.getOrganisation;
    },

    getPrintedDate(){
      return   moment(new Date()).format("MMMM Do YYYY");
    },

    getOrganisationLogo() {
      return (
        process.env.FILE_API_URL +
        process.env.FILE_DOWNLOAD_PATH +
        this.$store.getters.getOrganisation.logo
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.detail {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 15px;
  letter-spacing: 0.01em;
}
</style>
