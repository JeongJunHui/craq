<template>
    <div class="menu-wrapper js-menu-wrapper" ref="dropdownMenu">
        <font-awesome-icon @click.prevent="showMe" icon="bell"></font-awesome-icon>

        <menu id="menu-example" class="menu js-menu" :class="{'menu--is-visible': show}">
            <router-link :to="{ name:'profile', params: {user_name : this.$session.get('username')}}">
                <li class="menu__item js-menu__item" role="menuitem">
                    <svg class="icon menu__icon" aria-hidden="true" viewBox="0 0 12 12"><path d="M10.121.293a1,1,0,0,0-1.414,0L1,8,0,12l4-1,7.707-7.707a1,1,0,0,0,0-1.414Z"></path></svg>
                    <span>Edit Profile</span>
                </li>   
            </router-link>
            <li class="menu__separator" role="separator"></li>

            <li class="menu__label-wrapper"><span class="menu__label">Noty</span></li>
            <template v-for="noty in noties" v-key="noty.pk">
                <li class="menu__item js-menu__item" role="menuitem">
                    <Noty :noty="noty" @onClose="onClose(noty.pk)" @onGo="onGo(noty.pk)"></Noty>
                </li>
            </template>

            <li class="menu__separator" role="separator"></li>

            <li class="menu__item js-menu__item" role="menuitem" @click.prevent="signOut">
                <svg class="icon menu__icon" aria-hidden="true" viewBox="0 0 12 12"><path d="M8.354,3.646a.5.5,0,0,0-.708,0L6,5.293,4.354,3.646a.5.5,0,0,0-.708.708L5.293,6,3.646,7.646a.5.5,0,0,0,.708.708L6,6.707,7.646,8.354a.5.5,0,1,0,.708-.708L6.707,6,8.354,4.354A.5.5,0,0,0,8.354,3.646Z"></path><path d="M6,0a6,6,0,1,0,6,6A6.006,6.006,0,0,0,6,0ZM6,10a4,4,0,1,1,4-4A4,4,0,0,1,6,10Z"></path></svg>
                <span>SignOut</span>
            </li>

        </menu>
    </div>
</template>

<script>
import Noty from '@/components/Noty.vue';

export default {
    name: "NavBarDropDown",
    components: {
        Noty
    },
    props: [
        "noties"
    ],
    methods: {
        closer(e) {
            let el = this.$refs.dropdownMenu;
            let target = e.target
            if (el !== target && !el.contains(target)) {
                this.noShow();
            }
        },
        onClose(id) {
            this.$emit('onClose', id);
        },
        onGo(pk) {
            this.$emit('onGo', pk);
        },
        signOut() {
            this.$emit('signOut');
        },
        noShow() {
            document.removeEventListener('click', this.closer)
            this.show = false;
        },
        showMe() {
            this.show = true;
            document.addEventListener('click', this.closer);
        },
    },
    data() {
        return {
            "show": false,
        }
    },
    created() {
        console.log('dropdown created');

    },
    destroyed() {
        console.log('goodbye');
    }
}
</script>

<style lang="scss" scoped>
/* -------------------------------- 

File#: _1_menu
Title: Menu
Descr: Application menu that provides access to a set of functionalities

-------------------------------- */

$--menu-item-padding: var(--space-xxs) var(--space-sm);
$--menu-width: 22rem;

.menu-wrapper {
    display: inline-block;
    position: relative;
}

.menu {
    list-style: none;
    width: $--menu-width;
    position: absolute;
    right: 0;
    top: calc(100% + 4px);
    background-color: var(--color-bg);
    box-shadow: var(--shadow-sm);
    padding: var(--space-xxs) 0;
    border-radius: var(--radius-md);
    z-index: var(--zindex-popover);

    // reset spacing and text sizes
    @include spaceUnit(1rem);
    font-size: 1rem;

    transform: translateY(-4px);
    visibility: hidden;
    opacity: 0;
    transition: visibility 0s .2s, opacity .2s, transform .2s ease-out;
}

.menu--is-visible {
    visibility: visible;
    opacity: 1;
    transform: translateY(0);
    transition: opacity .2s, transform .2s ease-out;
}

.menu__item {
    text-decoration: none; // reset link style
    display: block; // fallback
    display: flex;
    align-items: center;
    padding: $--menu-item-padding;
    color: var(--color-contrast-high);
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:hover {
        background-color: var(--color-contrast-lower);
    }
}

.menu__label-wrapper {
    padding: $--menu-item-padding;
}

.menu__label {
    text-transform: uppercase;
    font-size: 0.6em;
    letter-spacing: 0.1em;
    color: var(--color-contrast-medium);
}

.menu__separator {
    height: 1px;
    background-color: var(--color-contrast-low);
    margin: $--menu-item-padding;
}

.menu__icon {
    color: var(--color-contrast-medium);
    margin-right: var(--space-xxs);
}
</style>
