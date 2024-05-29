<template>
  <div :class="$q.platform.is.mobile ? 'q-px-sm' : 'q-pa-sm'">
    <div class="flex justify-center q-mb-md" v-if="getLoadingState">
      <q-spinner color="primary" size="2.5em" />
    </div>
    <div class="row" v-if="!getLoadingState">
      <label for="title" class="q-pb-md title">{{
        $t("app.availableRoleLabel")
      }}</label>
    </div>
    <div class="row" v-if="!getLoadingState">
      <div class="col-3 col-sm-12 col-md-3 col-lg-3 col-xs-12">
        <q-list separator bordered padding class="rounded-borders">
          <q-item
            clickable
            v-ripple
            v-for="role in getRoles"
            :key="role.id"
            :active-class="current_tag == role.name ? 'active_item' : ''"
            :active="current_tag == role.name"
            @click="setCurrentRole(role)"
          >
            <q-item-section top avatar>
              <q-avatar
                :color="current_tag == role.name ? 'white' : 'primary'"
                :text-color="current_tag == role.name ? 'grey' : 'white'"
              >
                {{ getFirstLetter(role.name) }}
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label
                :class="current_tag == role.name ? '' : 'role_name'"
                >{{ role.name }}</q-item-label
              >
            </q-item-section>
          </q-item>
        </q-list>
      </div>
      <div class="col-1 col-sm-12 col-xs-12 col-lg-1 col-md-1"></div>
      <div
        class="col-6 col-sm-12 col-xs-12 col-lg-6 col-md-1"
        :class="$q.platform.is.mobile ? 'q-px-md' : ''"
      >
        <div
          class="flex justify-between"
          :class="$q.platform.is.mobile ? 'q-pt-md' : ''"
        >
          <div>
            <label class="title">Role details</label>
          </div>
          <div>
            <q-btn
              icon="edit"
              size="sm"
              color="primary"
              flat
              round
              @click="showDialog"
            >
              <q-tooltip>
                {{ $t("app.editRole") }}
              </q-tooltip>
            </q-btn>
          </div>
        </div>
        <div class="flex justify-between q-mt-lg">
          <label for=""
            ><span class="label text-weight-meduim">{{
              $t("app.nameLabel")
            }}</span>
          </label>
          <label
            class="value text-weight-bold"
            v-if="getSelectedRole !== undefined"
            >{{ getSelectedRole.name }}</label
          >
        </div>
        <div class="flex justify-between q-mt-sm">
          <label for=""
            ><span class="label text-weight-meduim">{{ $t("app.term") }}</span>
          </label>
          <label
            class="value text-weight-bold"
            v-if="getSelectedRole.name !== 'MEMBER'"
            >{{ getSelectedRole.term }}</label
          >
          <label class="value text-weight-bold" v-else> 0</label>
        </div>
        <div class="flex justify-between q-mt-sm">
          <label for=""
            ><span class="label text-weight-meduim">{{
              $t("app.memberCountLabel")
            }}</span>
          </label>
          <label
            class="value text-weight-bold"
            v-if="getSelectedRole.name !== 'MEMBER'"
            >{{ getSelectedRole.number_of_members }}</label
          >
          <label class="value text-weight-bold" v-else>{{
            $t("app.all")
          }}</label>
        </div>
        <div class="flex justify-between q-mt-sm">
          <label for=""
            ><span class="label text-weight-meduim">{{
              $t("app.createdDate")
            }}</span>
          </label>
          <label class="value text-weight-bold">{{
            getFormatedDate(getSelectedRole.created_at)
          }}</label>
        </div>
        <div class="flex justify-between q-mt-sm">
          <label for=""
            ><span class="label text-weight-meduim">{{
              $t("app.updatedDate")
            }}</span>
          </label>
          <label class="value text-weight-bold">{{
            getFormatedDate(getSelectedRole.updated_at)
          }}</label>
        </div>
        <div class="flex justify-between q-mt-sm">
          <label for=""
            ><span class="label text-weight-meduim">{{
              $t("app.updatedBy")
            }}</span>
          </label>
          <label class="value text-weight-bold">{{
            getSelectedRole.updated_by
          }}</label>
        </div>
        <div class="flex justify-between q-mt-sm">
          <label for=""
            ><span class="label text-weight-meduim">{{
              $t("app.defaultRole")
            }}</span>
          </label>
          <label
            class="value text-weight-bold"
            v-if="getSelectedRole.name !== 'MEMBER'"
            >{{ $t("app.no") }}</label
          >
          <label class="value text-weight-bold" v-else>{{
            $t("app.yes")
          }}</label>
        </div>
        <div class="q-mt-lg">
          <label class="title">Privileges</label>
        </div>
        <div class="q-gutter-x-xs q-mt-md">
          <q-chip
            color="teal"
            text-color="white"
            v-for="permission in getSelectedRole.permissions"
            :key="permission.name"
          >
            {{ permission.name }}
          </q-chip>
        </div>
      </div>
    </div>

    <!------------------------------------------START DIALOG TO UPDATE ROLE------------------------------------------->
    <div v-if="show_dialog">
      <q-dialog v-model="show_dialog">
        <q-card
          :style="
            $q.platform.is.mobile ? 'min-width: 350px' : 'min-width: 450px'
          "
          class="q-px-sm q-pt-sm q-pb-md"
        >
          <q-card-section class="row q-pb-sm">
            <div class="text-h6">{{ $t("app.editRole") }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-form @submit="onUpdateRole" class="q-gutter-md">
              <div>
                <label class="form_field">{{ $t("app.nameLabel") }}</label>
                <q-input v-model="role.name" outlined dense disable> </q-input>
              </div>
              <div>
                <label class="form_field">{{ $t("app.term") }}</label>
                <q-input
                  v-model="role.term"
                  outlined
                  dense
                  type="number"
                ></q-input>
              </div>
              <div>
                <label class="form_field">{{
                  $t("app.memberCountLabel")
                }}</label>
                <q-input
                  v-model="role.number_of_members"
                  outlined
                  dense
                  type="number"
                >
                </q-input>
              </div>
              <div class="q-mt-lg flex justify-end">
                <ButtonVue
                  class="form_button"
                  :label="$t('app.saveBtnLabel')"
                  :loading="loading"
                  color="primary"
                  :disabled="validateForm"
                  :no_caps="true"
                >
                </ButtonVue>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
    <!------------------------------------------------END OF DIALOG TO UPDATE ROLE------------------------------------------>
  </div>
</template>

<script>
import roleMixin from "src/mixins/roleMixin.vue";
import ButtonVue from "src/components/Button.vue";
import moment from "moment";
export default {
  mixins: [roleMixin],

  mounted() {
    this.getAllRoles();
  },
  data() {
    return {
      current_tag: "ADMIN",
      selected_role: this.$store.getters.getRoles[0],
      show_dialog: false,
      role: {
        name: null,
        term: 1,
        number_of_members: 1,
      },
      loading: false,
    };
  },
  computed: {
    getRoles() {
      return this.$store.getters.getRoles;
    },

    validateForm() {
      return (
        this.role.name === null ||
        this.role.number_of_members < 1 ||
        this.role.term < 1
      );
    },

    getLoadingState() {
      return this.$store.getters.getFetchingState;
    },

    getSelectedRole() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      let selected_role =
        this.$store.getters.getRoles != undefined &&
        this.$store.getters.getRoles !== null &&
        this.selected_role == null
          ? this.$store.getters.getRoles[0]
          : this.selected_role;
      return selected_role;
    },
  },

  methods: {
    getFirstLetter(role) {
      let avatar_letter = "";
      switch (role) {
        case "ADMIN":
          avatar_letter = "A";
          break;
        case "PRESIDENT":
          avatar_letter = "PP";
          break;
        case "FINANCIAL_SECRETARY":
          avatar_letter = "FS";
          break;
        case "TREASURER":
          avatar_letter = "TR";
          break;
        case "MEMBER":
          avatar_letter = "M";
          break;
      }

      return avatar_letter;
    },

    getFormatedDate(date) {
      return moment(date).format("MMMM Do YYYY");
    },

    setCurrentRole(role) {
      this.selected_role = role;
      return (this.current_tag = role.name);
    },
    showDialog() {
      this.show_dialog = true;
      this.role.name = this.selected_role.name;
      this.role.number_of_members = this.selected_role.number_of_members;
      this.role.term = this.selected_role.term;

      return this.role;
    },

    onUpdateRole() {
      let payload = {
        url: `/api/protected/roles/update`,
        msg: this.$t("app.updateRoleSuccessMsg"),
        data: this.role,
        color: "default",
        to_on_ok: "none",
        to_on_fail: "none",
        show_feedback: true,
        error_msg: this.$t("app.defaultErrorMsg"),
        has_commit: false,
        commit: "none",
        to_be_store_data: {
          required: false,
          has_value: false,
          data: [],
        },
      };
      this.loading = true;
      this.$store
        .dispatch("putRequest", payload)
        .then((res) => {
          if (res.success) {
            this.selected_role = res.data;
            this.getAllRoles();
          }
          return this.selected_role;
        })
        .then(async (role) => {
          this.selected_role = role;
        })
        .finally(() => {
          this.loading = false;
          this.show_dialog = false;
        });
    },
  },

  components: {
    ButtonVue,
  },
};
</script>
<style lang="scss" scoped>
.text-h6 {
  color: $primary;
  font-family: "Roboto";
  font-style: normal;
  font-weight: 600;
  font-size: 0.9rem;
  align-items: center;
  text-align: center;
}
.title {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.9rem;
  align-items: center;
  color: $grey8;
}

.role_name {
  font-family: "Roboto";
  font-weight: 500;
  color: $grey8;
  font-size: 0.7rem;
}

.active_item {
  background-color: $primary2;
  color: $white1;
  font-size: 0.7rem;
}
.value {
  color: $grey8;
  font-size: 0.8rem;
}
.label {
  color: $grey5;
  font-size: 0.8rem;
}

.inactive_caption_text {
  color: $grey8;
}

.form_field {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 0.7rem;
  align-items: center;
  color: $grey5;
}
</style>
