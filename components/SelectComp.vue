<template>
    <div class="relative" ref="bounding">
        <div class="flex items-center max-[768px]:block mb-2" v-if="label">
            <label :for="id" class="block font-semibold mr-2 text-[16px] text-gray-900">{{
            label
        }}</label>
            <p class="text-[10px] text-gray-500 italic" v-if="subtitle">
                {{ subtitle }}
            </p>
        </div>
        <slot></slot>
        <transition enter-from-class="opacity-0" leave-to-class="ease-in-out opacity-0"
            enter-active-class="transition duration-300 ease-in-out"
            leave-active-class="transition duration-300 ease-in-out">
            <div v-if="vm.bound" :class="`absolute z-50  ${full
                ? 'w-full'
                : vm.screen.width / 2 >= vm.bound.left
                    ? 'left-0'
                    : 'right-0'
            }`">
                <div v-if="modelValue" ref="target" :class="`p-1 rounded-[8px] h-full shadow-lg z-[100] w-full block border bg-white ${max ? 'w-max' : ''
            } mt-1 border-gray-200 `" id="temp_menu">
                    <slot name="search"></slot>
                    <div @click="isCloseOnClick()">
                        <slot name="item"></slot>
                    </div>
                    <slot name="action"></slot>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import {
    onClickOutside,
    useElementBounding,
    useWindowSize,
} from "@vueuse/core";
const target = ref(null);
const bounding = ref(null);
const vm = reactive({
    bound: null,
    screen: useWindowSize(),
});
const props = defineProps({
    menu: { type: Boolean, default: false },
    id: { type: String, default: "id" },
    modelValue: Boolean,
    closeOnClick: { type: Boolean, default: true },
    label: String,
    subtitle: String,
    full: Boolean,
    max: Boolean,
});
const emit = defineEmits(["close", "update:modelValue"]);

const isCloseOnClick = () => {
    if (props.closeOnClick) {
        closeMenu();
    }
};

onClickOutside(bounding, (event) => {
    closeMenu();
});

const closeMenu = () => {
    emit("update:modelValue", false);
};

defineExpose({
    closeMenu,
});

onMounted(() => {
    vm.bound = useElementBounding(bounding);
});
</script>

<style></style>