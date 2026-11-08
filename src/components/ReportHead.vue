<template>
  <div class="q-mt-lg">
    <div class="row">
      <div class="col-1 col-md-1 col-sm-12 col-xs-12"></div>
      <!----------------LOGO--------------------->
      <div class="col-2 col-md-2 col-sm-12 col-xs-12">
        <img src="../assets/pcc_logo.png" alt="" width="130" height="110" />
      </div>
      <!-------------END OF LOGO----------------->

      <!---------------DETAILS--------------------->
      <div class="col-6 col-lg-6 col-md-6 col-sm-12 col-xs-12 text-center">
        <label style="text-uppercase detail text-weight-bolder;"
          >CHRISTIAN YOUTH FELLOWSHIP (C.Y.F)</label
        ><br />
        <label style="text-uppercase detail text-weight-bolder;"
          >FAKO NORTH PRESBYTERY</label
        >
        <br />
        <label style="text-uppercase detail text-weight-bolder;"
          >BUEA ZONE</label
        >
        <br />
        <label style="text-uppercase detail text-weight-bolder;">
          {{ getOrganisation.name }}
        </label>
        <br />
        <label style="text-uppercase detail text-weight-bolder;"
          >{{ getOrganisation.address }} - {{ getOrganisation.region }}</label
        >
        <br />
        <label style="text-uppercase detail text-weight-medium;">
          {{ getOrganisation.email }}
        </label>
        <br />
        <label style="text-uppercase detail text-weight-medium;">
          <span
            style="list-style-type: none"
            v-for="(value, index) in getOrganisationTelephone"
            :key="index"
          >
            {{ value }}<br />
          </span>
        </label>
      </div>
      <!-------------END OF DETAILS------------->

      <!----------------LOGO--------------------->
      <div class="col-2 col-lg-2 col-md-2 col-sm-12 col-xs-12 flex justify-end">
        <img
          :src="getOrganisationLogo"
          alt=""
          width="130"
          height="110"
          v-if="getOrganisation != null"
        />
      </div>
      <!-------------END OF LOGO----------------->

      <div class="col-1 col-md-1 col-sm-12 col-xs-12"></div>
    </div>
    <hr
      style="
        border-bottom: 5px solid #213c65;
        margin-bottom: 1rem;
        margin-top: 4px;
      "
    />
    <div class="flex justify-end">
      <label class="detail"
        >{{ $t("app.printedDate") }}: {{ getPrintedDate }}</label
      >
    </div>
  </div>
</template>

<script>
import moment from "moment";
import { LocalStorage } from "quasar";
export default {
  computed: {
    getOrganisation() {
      return LocalStorage.getItem("data").subscription.organisation;
    },

    getPrintedDate() {
      return moment(new Date()).format("MM/DD/YYYY");
    },

    getOrganisationLogo() {
      return process.env.SERVER_BASE_URL + this.getOrganisation.logo;
    },

    getOrganisationTelephone() {
      return this.getOrganisation.telephone.split("/");
    },
  },
};
</script>

<style lang="scss" scoped>
.detail {
  font-family: "Roboto";
  font-style: normal;
  // font-weight: 500;
  font-size: 15px;
  letter-spacing: 0.01em;
}
</style>
