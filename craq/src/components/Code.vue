<template>
    <div>
        <div class="filler">
            <!-- Headline -->
            <div class="headline">
                <div class="headline__title">{{currentRouteName}}</div>
                <router-link to="/askquestion"><div class="btn btn--primary" @click="askQuestion">Ask Question</div></router-link> 
            </div> <!-- headline -->
            <!-- show search query -->
            <template v-if="query('search_text')">
                <div class="alert alert--is-visible js-alert flex justify-between" role="alert" :class="{'alert--success': asks.length!== 0,
                'alert--warning': asks.length ===0}">
                    <div class="alert__content flex items-center">
                        <font-awesome-icon icon="search">
                        </font-awesome-icon>
                        <p><strong>Searched_about: </strong> 
                        <div v-for="text in search_text" style="display: inline-block;">
                            <span>{{ text }}</span>
                        </div>
                        <ul style="display: flex;">
                            <div v-for="tag in search_tags">
                                <li class="post-tag">{{ tag }}
                                    <button class="reset post-tag-close" @click.prevent="closeTag(tag)">x</button>
                                </li>
                            </div>
                        </ul>
                        </p>
                    </div>
                    <div>
                        <button class="reset alert__close-btn js-alert__close-btn" @click.prevent="showAll">
                            <svg class="icon" viewBox="0 0 24 24"><title>Close alert</title><g stroke-linecap="square" stroke-linejoin="miter" stroke-width="3" stroke="currentColor" fill="none" stroke-miterlimit="10"><line x1="19" y1="5" x2="5" y2="19"></line><line fill="none" x1="19" y1="19" x2="5" y2="5"></line></g></svg>
                        </button>
                    </div>
                </div>
            </template>
            <!-- end show search query -->

            <!-- Filter && Card -->
            <div class="Code">
                <div class="Code__filter">
                    <div class="Code__filter-btn" :class="{'selected':query('order_by') =='PK'}" @click.prevent="sort('PK')">Latest</div>
                    <div class="Code__filter-btn" :class="{'selected':$route.query.order_by =='RELIABLE'}" @click.prevent="sort('RELIABLE')">Reliable</div>
                    <div class="Code__filter-btn" :class="{'selected':$route.query.order_by =='HELPFUL'}" @click.prevent="sort('HELPFUL')">Helpful</div>
                    <div class="Code__filter-btn" :class="{'selected':$route.query.order_by =='ANSWERS'}" @click.prevent="sort('ANSWERS')">Answer</div>
                    <div class="Code__filter-btn" :class="{'selected':$route.query.order_by =='VIEWS'}" @click.prevent="sort('VIEWS')">View</div>
                </div>  <!-- Filter /div -->

                <div class="Code__list" v-if="loaded">
                    <div :key="ask.PK" v-for="(ask) in asks" class="content">
                        <card class="shadow" :list="ask"/>
                    </div>
                </div>

            </div>
            <!-- end FILTER & CARD -->
            <!-- Pagenation -->
            <Paginator :chunkSize="5" :maxPage="maxPage" :curPage="curPage" @clicked="move"></Paginator>
            <!-- pagenation -->

        </div> <!-- Container /div -->
    </div>  <!-- Filler -->
</template>

<script>
//import Card from '@/components/Card.vue';
import Spinner from '@/components/Spinner.vue'
const Card = () => ({
    component: import('@/components/Card.vue'),
    loading: Spinner,
    delay: 2000
})
import Ask from '@/components/AskQuestion.vue';
import Paginator from '@/components/Paginator.vue';

export default {
    name: "Code",
    components: {
        Card,
        Ask,
        Paginator
    },
    data() {
        return {
            asks:  [],
            chunkSize: 5,
            maxPage: 1,
            curPage: 1,
            loaded: false,
            search_tags: [],
            search_words: [],
        }
    },
    watch: {
        $route: function(a, b) {
            this.update();
        }
    },
    methods: {
        showAll() {
            this.$router.push({
                name: 'code',
                query: {
                    page: 1,
                    order_by: "PK",
                    search_text: "",
                }
            })
        },
        closeTag(tag) {
            this.search_tags = this.search_tags.filter(function(el) {
                return !(el == tag)
            })
            this.$router.push({
                name: 'code',
                query: {
                    page: 1,
                    order_by: this.query('order_by'),
                    search_text: this.search_text.join(" ") + (this.search_tags.length === 0 ? "": "[") + this.search_tags.join("] [") + (this.search_tags.length ===0 ? "":"]")
                }
            })
        },
        askQuestion : function() {
            this.$router.push({
                name:'askquestion',
                params : { askQuestion : true}});
            this.askquestion = true;
        },
        update() {
            console.log(encodeURI(this.query('search_text')));
            this.$axios.get(`questions/search/${this.query('page')}?order_by=${this.query('order_by')}&search_text=${encodeURIComponent(this.query('search_text'))}`)
                .then(res=>{
                    if (res.data.status == "fail") {
                        this.asks = [];
                        return;
                    }
                    this.asks = res.data.data;
                    console.log('dddddsssaaa', this.asks);
                    this.maxPage = res.data.max_page
                    this.curPage = this.query('page');
                    this.search_tags = res.data.SEARCH_TAGS;
                    this.search_text = res.data.SEARCH_TEXT;
                    this.loaded = true;  
                });
        },
        queryCheck(obj, key) {
            return Object.keys(obj).includes(key);
        },
        contains(key) {
            return this.queryCheck(this.$route.query, key);

        },
        query(key) {
            return this.$route.query[key];
        },
        move(page) {
            this.loaded = false;
            window.scrollTo(0,0)
            this.$router.push({
                name:'code',
                query: {
                    "page": page,
                    "order_by": this.query('order_by'),
                    "search_text": this.query('search_text')
                }
            })
            this.loaded = true;
        },
        sort(by) {
            this.loaded = false;
            this.$router.push({
                name:"code",
                query: {
                    "page": 1,
                    "order_by": by,
                    "search_text": this.query('search_text')

                }
            }) 
            this.loaded = true; // if pushed to same route no mount watch will happen;
        },
        searchResult() {
        }
    },
    computed: {
        currentRouteName() {
            return this.$route.name;
        },
        inSearch() {
            return this.queryCheck(this.$route.query, 'search_text')
        }
    },
    mounted() {
        console.log(this.$route.query);
        if (!this.contains('page') || !this.contains('order_by')) {
            this.$router.push(
                {"name": "code",
                    "query": {
                        "order_by": "PK",
                        "page": 1,
                        "search_text": (this.contains('search_text') ? this.$route.query.search_text: "")
                    }

                }
            )
        } else {
            this.update();

        }
    }
}

</script>

<style scoped lang="scss">
// Test End
.filler {
    width: auto;
    background-color: var(--color-background);
}

.headline {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 75px;

    padding: var(--space-md);
    &__title {
        background-color: var(--color-surface);
        font-size: var(--text-xxl);
        text-transform: capitalize;
    }
}


.btn {
    cursor: pointer;
    width: 130px;
    height: 45px;

    display: flex;
    justify-content: center;
    align-items: center;

}

.btn:hover {
    background-color: var(--color-primary-darker);
    color: var(--color-on-primary-light);
}

.shadow {
    box-shadow: var(--shadow-sm);
    width: 100%;
    border: 1px solid var(--color-contrast-low);
margin-bottom: var(--space-sm); }

.content {
    width: 100%;
}

.Code {
    user-select: none;
    display: flex;
    flex-direction: column;

    width: 100%;
    height: auto;
    background-color: var(--color-surface-light);
    padding: var(--space-md);

    &__filter {
        display: flex;

        &-btn {
            cursor: pointer;
            width: 130px;
            height: 45px;

            display: flex;
            justify-content: center;
            align-items: center;
            font-size: var(--text-md);
            color: var(--color-contrast-high);            

            border-radius: var(--radius-sm);

            background-color: var(--color-surface-dark);
            margin-right: var(--space-sm);
        }
    }

    &__list {
        display: flex;
        flex-direction: column;
        align-items: center;

        position: relative;
        top: -3px;

        width: 100%;
        height: 100%;
        background-color: var(--color-surface);

        border-bottom-left-radius:  var(--radius-sm);
        border-bottom-right-radius:  var(--radius-sm);
        border-top: 3px solid var(--color-tertiary);

        padding: var(--space-md);
    }
}

.Code__filter .selected {

    cursor: pointer;

    border-top: 3px solid var(--color-tertiary);
    border-left: 3px solid var(--color-tertiary);
    border-right: 3px solid var(--color-tertiary);
    color: var(--color-on-surface);
    font-weight: bold;
    background-color: var(--color-surface);

    z-index: 1;
}


.post {

    &-taglist {

    }

    &-tag {
        font-size: 12px;
        color: var(--color-tertiary-darker);
        background-color: var(--color-tertiary-lighter);
        border-color: var(--color-tertiary-lighter);
        padding: .4em .5em;
        display: inline-block;
        line-height: 1;
        white-space: nowrap;
        text-decoration: none;
        text-align: center;
        border-width: 1px;
        border-style: solid;
        border-radius: var(--radius-md);
        overflow: hidden;
        transition: all .15s ease;
        margin: 2px 2px 2px 0;

        &:hover {
            color: var(--color-tertiary-darker);
            background-color: var(--color-tertiary);
            border-color: var(--color-tertiary);
            text-decoration: none;
        }

        &-close {
            color: var(--color-contrast-low);
        }
    }
}

.alert {
    padding: var(--space-xs) var(--space-sm);
    background-color: alpha(var(--color-primary), 0.2);
    border-radius: var(--radius-md);
    color: var(--color-contrast-higher);
    // hide element
    position: absolute;
    clip: rect(1px, 1px, 1px, 1px);
    clip-path: inset(50%);
}

.alert__link {
    color: inherit;
    text-decoration: underline;
}

.alert__close-btn {
    display: inline-block; // flex fallback
    flex-shrink: 0;
    margin-left: var(--space-sm);

    .icon {
        display: block;
    }
}

.alert__content {
    align-items: center;
}

// themes
.alert--success {
    background-color: alpha(var(--color-success), 0.2);
}

.alert--error {
    background-color: alpha(var(--color-error), 0.2);
}

.alert--warning {
    background-color: alpha(var(--color-warning), 0.2);
}

// toggle visibility
.alert--is-visible {
    position: static;
    clip: auto;
    clip-path: none;
}

</style>

