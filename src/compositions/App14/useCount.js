import { defineComponent, reactive, ref, nextTick } from "@vue/composition-api";

export default function useCount() {
    const count = ref(0)

    const addCount = function () {
        count.value = count.value + 1
    }
    return { count, addCount }
}