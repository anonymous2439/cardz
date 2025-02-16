<template>
    <div class="modal">
        <div class="overlay"></div>
        <div class="modal-con">
            <div class="modal-header">
                <div class="wrapper">
                    <slot name="header" />
                </div>
            </div>
            <div class="modal-body">
                <div class="wrapper">
                    <slot />
                </div>
            </div>
            <div class="modal-footer">
                <div class="wrapper">
                    <slot name="footer" />
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
    .modal {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        min-width: 400px;
        max-width: 100%;
        min-height: 200px;
        max-height: 80%;
        box-sizing: border-box;
        box-sizing: border-box;
        border-radius: 8px;
        box-shadow: -4px 5px 14px 1px #1a1a1a;
        border: 2px solid #1a1a1a;
        z-index: 1;
        background: #ffffffff;
        color: #1a1a1a;
        .modal-con {
            .modal-header {
                box-shadow: 0px 7px 20px -6px #1a1a1a;
                padding: 8px 0;
                font-weight: 700;
                text-transform: uppercase;
            }
            .modal-body {
                padding: 25px 0;
            }
            .modal-footer {
                box-shadow: 0px -7px 20px -6px #1a1a1a;
                padding: 8px 0;
                .wrapper {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                }
            }
        }
    }
    .wrapper {
        padding: 0 22px;
        position: relative;
    }

</style>