<template>
    <div id="cardz">
        <div class="cardz-con bg-primary muted">
            <div class="cardz-left">
                <figure>
                    <img src="/rick.gif" />
                </figure>
            </div>
            <div class="cardz-right">
                <h1>CardZ</h1>
                <ul class="user-options">
                    <li><a href="#!" @click="showLoginForm">Login</a></li>
                    <li><nuxt-link to="/cardz/game" @click="showLoginForm">Guest Login</nuxt-link></li>
                    <li><a href="#!" @click="showSignupForm">Sign Up</a></li>
                </ul>
                <p>By Neil Axinto</p>
            </div>
            
            <ModalsGlobal v-if="modalState.isActive && modalState.type === 'login'">
                <template #header>
                    Login
                </template>
                
                <div class="form">
                    <div class="form-section">
                        <label>Username</label>
                        <input v-model="loginForm.username" type="text" />
                    </div>

                    <div class="form-section">
                        <label>Password</label>
                        <input v-model="loginForm.password" type="password" />
                    </div>

                    <div class="form-section" v-if="modalState.data">
                        <p style="text-align: center;">
                            {{ modalState.data.isFetching ? 'Please wait...' : modalState.data?.message }}
                        </p>
                    </div>
                </div>

                <template #footer>
                    <button 
                        class="btn bg-primary muted"
                        @click="hideModal">
                            Concede
                    </button>
                    <button 
                        :class="['btn', 'bg-primary', {'disabled' : modalState?.data?.isFetching}]"
                        @click="login">
                            Attack
                    </button>
                </template>
            </ModalsGlobal>

            <ModalsGlobal v-if="modalState.isActive && modalState.type === 'signup'">
                <template #header>
                    Signup
                </template>
                
                <div class="form">
                    <div class="form-section">
                        <label>Username</label>
                        <input v-model="signupForm.username" type="text" />
                    </div>

                    <div class="form-section">
                        <label>Password</label>
                        <input v-model="signupForm.password" type="password" />
                    </div>

                    <div class="form-section">
                        <label>Confirm Password</label>
                        <input v-model="signupForm.password2" type="password" />
                    </div>

                    <div class="form-section" v-if="modalState.data">
                        <p style="text-align: center;">
                            {{ modalState.data.isFetching ? 'Please wait...' : modalState.data?.message }}
                        </p>
                    </div>
                </div>

                <template #footer>
                    <button 
                        class="btn bg-primary muted"
                        @click="hideModal">
                            Concede
                    </button>
                    <button 
                        :class="['btn', 'bg-primary', {'disabled' : modalState?.data?.isFetching}]"
                        @click="signup">
                            Attack
                    </button>
                </template>
            </ModalsGlobal>
        </div>
    </div>
</template>

<script lang="tsx" setup>
    import { useGameStore } from '~/stores/game';
    import { type LoginForm, type SignupForm } from '~/types/Forms';

    let gameState = useGameStore()
    const modalState = ref<{isActive: boolean, type: string | null, data: any}>({isActive: false, type: null, data: null})
    const loginForm : LoginForm = {
        username    : '',
        password    : '',
    }

    const signupForm : SignupForm = {
        username    : '',
        password    : '',
        password2   : '',
    }

    const showLoginForm = () => {
        modalState.value.isActive   = true
        modalState.value.type       = 'login'
    }

    const showSignupForm = () => {
        modalState.value.isActive   = true
        modalState.value.type       = 'signup'
    }

    const login = async () => {
        try {
            modalState.value.data = {
                isFetching : true
            }
            const res = await gameState.login(loginForm);

            if (res?.success) {
                if(res?.data && res.data?.token) {
                    localStorage.setItem("user_token", res.data.token);
                    gameState.setUserInfo(res.data.user)
                }
                modalState.value.data.message = res?.message || null
                return navigateTo("/cardz/game");
            } else {
                modalState.value.data.isFetching    = false
                modalState.value.data.message       = res?.message || "An unexpected error occurred"
            }
        } catch (error) {
            // Handle network issues or API errors
            modalState.value.data = {
                message: error.message || "Failed to log in. Please try again.",
            };
        }
    };


    const signup = async () => {
        try {
            modalState.value.data = {
                isFetching : true
            }
            const res = await gameState.signup(signupForm)
            modalState.value.data.isFetching = false

            if(res?.success) {
                modalState.value.type = 'login'
                modalState.value.data.message = res?.message || null
            }
            else {
                modalState.value.data.message = res?.message || "An unexpected error occurred"
            }
        } catch (error) {
            // Handle network issues or API errors
            modalState.value.data = {
                message: error.message || "Failed to Sign Up. Please try again.",
            };
        }
    }

    const hideModal = () => {
        modalState.value.isActive   = false
        modalState.value.type       = null
        modalState.value.data       = null
    }

    onMounted(() => {})
</script>

<style lang="scss" scoped>
    #cardz {
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 20px;
    }
    .cardz-con {
        max-width: 960px;
        margin: 0 auto;
        text-align: center;
        padding: 64px 25px;
        width: 100%;
        height: 100%;
        max-height: 383px;
        border: 1px solid #fff;
        box-shadow: 0px 0px 23px -12px #1a1a1a;
        display: flex;
        justify-content: center;
        column-gap: 110px;

        .cardz-left {
            figure {
                margin: 0;
                max-width: 100%;
                max-height: 100%;
                overflow: hidden;
                display: flex;
                img {
                }
            }
        }
        .cardz-right {

        }

        h1 {
            margin-bottom:40px;
        }

        .user-options {
            margin: 0;
            padding: 0;
            list-style: none;
            margin-bottom: 70px;
            li {
                margin-bottom: 12px;
                a {
                    color: #fff !important;
                    text-decoration: none;
                    display: block;
                    width: 140px;
                    max-width: 100%;
                    padding: 11px 5px;
                    margin: 0 auto;
                    border: 1px solid #fff;
                    border-radius: 5px;
                    transition: .6s;
                    &:hover {
                        background: #008C99;
                    }
                }
            }
        }
    }
</style>