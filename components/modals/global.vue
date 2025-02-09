<template>
    <div class="modal" v-show="modalState">
        <div class="overlay"></div>
        <div class="modal-con">
            <div class="modal-header">
                <slot name="header" />
            </div>
            <div class="modal-body">
                <slot />
            </div>
            <div class="modal-footer">
                <slot name="footer" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const modalState = useState('modalState', () => false)
</script>

<style lang="css" scoped>
    .modal {position: fixed;left: 50%;top: 50%;transform: translate(-50%, -50%);width: 400px;max-width: 100%;height: 200px;max-height: 80%;box-sizing: border-box;box-sizing: border-box;padding: 22px;border-radius: 8px;box-shadow: -4px 5px 14px 1px #1a1a1a;border: 2px solid #1a1a1a;}

</style>