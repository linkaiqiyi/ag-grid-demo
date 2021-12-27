<template>
  <div
  :ref="'group' + params.value"
    style="
      line-height: 42px;
      padding-left: 17px;
      font-size: 24px;
      font-weight: bold;
    "
  >
    Group: {{ params.value }}
  </div>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  beforeMount() {
    this.params.registerRowDragger(
      this.params.eParentOfValue,
      undefined,
      "group" + this.params.value,
      true
    );
  }
});
</script>

<style>
</style>