<template>
  <div class="q-pa-sm">
    <div class="text_h6 text-center q-pt-xs q-pb-md add_member_title">
      Expenditure Item Information
    </div>
    <div>
      <label for="expenditure_category" class="label">Expenditure Category: <span class="value">Birthdays</span></label>
    </div>
    <div>
      <label for="name" class="label">Expenditure Item: <span class="value">Birthdays</span></label>
    </div>
    <div>
      <label for="amount" class="label">Amount: <span class="value">5000 XAF</span></label>
    </div>
    <div>
      <label for="venue" class="label">Venue: <span class="value">Sandpit Bakweri Town</span></label>
    </div>
    <div>
      <label for="date" class="label">Date: <span class="value">2013/01/20</span></label>
    </div>
    <div>
      <label for="date" class="label">Comment: </label>
      <p class="value">
        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Suscipit, numquam. Magni et similique tempora, iure, consectetur voluptates eaque in consequatur ad sapiente non, neque laborum nemo ab dolor amet unde?
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {

    }
  }
}
</script>

<style lang="scss" scoped>
.add_member_title {
  font-family: "Roboto";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 29px;
  align-items: center;
  text-align: center;
  letter-spacing: 0.01em;
  color: #5384ae;
  text-transform: capitalize;
}
.label {

font-family: 'Roboto';
font-style: normal;
font-weight: 500;
font-size: 13px;
line-height: 24px;
display: flex;
align-items: center;
letter-spacing: 0.01em;
color: $grey2;
}

.value {

font-family: 'Roboto';
font-style: normal;
font-weight: 500;
font-size: 14px;
line-height: 27px;
display: flex;
align-items: center;
letter-spacing: 0.005em;
color: $dark;
margin-left: .8rem;
}
</style>
