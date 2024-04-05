<!-- <template>
  <div>
    <q-dialog v-model="show_approve_dialog">
      <q-card class="approve_card">
        <q-card-section>
          <div class="row">
            <div class="col-md-12">
              <label for="msg">
                <span class="text-weight-bold"
                  >Do you want to {{ chosen_state }} {{ approve_msg }}</span
                >
                <br />
                <span class="text-weight-bold" v-if="show_members"
                  >Name: {{ register_member_name }}</span
                >
              </label>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            :class="chosen_state == 'Approve' ? 'approve' : 'decline'"
            size="md"
            label="Cancel"
            flat
            v-close-popup
            no-caps
          />
          <q-btn
            :class="chosen_state == 'Approve' ? 'approve' : 'decline'"
            size="md"
            :label="chosen_state"
            flat
            @click="onChangeRecordState()"
            v-close-popup
            no-caps
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
export default {
  props:{
    chosen_state:{
      type:String,
      required:true
    }
  },
  data(){
    return {
      show_approve_dialog:true,
    }
  }
}
</script> -->
