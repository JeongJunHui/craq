<template>
    <div class="container padding-sm">
        <div>
            <div class="inner-content clearfix">
                <CodeDetailQuestionHeader v-if="loaded" :title="VERSION[QUESTION[0].VERSION].TITLE" :article_pk="QUESTION[0].PK"></CodeDetailQuestionHeader>
                <CodeDetailQuestionHeaderBottom 
                                          v-if="loaded"
                                          :created_at="VERSION[1].CREATED_AT"
                                          :updated_at="VERSION[VERSION.length-1].CREATED_AT"
                                          :views="QUESTION[0].VIEWS"
                                          ></CodeDetailQuestionHeaderBottom>
                <div id="mainbar">
                    <div id="question" class="question">
                        <Article v-if="loaded" :article_pk="QUESTION[0].PK" :canSelected="false" :is_answer="false"></Article>
                    </div>
                    <div id="answers">
                        <CodeDetailAnswerHeader :count="ANSWERS.length"v-if="loaded" @clicked="clicked" :curSort="sort_by"></CodeDetailAnswerHeader>
                        <template v-if="loaded" v-for="answer in ANSWERS" v-key="answer.PK">
                            <Article :article_pk="answer.PK" :canSelected="canSelected" :is_answer="true" :QST_PK="answer.QST_PK"></Article>
                            <div class="separator"></div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
import Spinner from '@/components/Spinner.vue';

const CodeDetailQuestionHeader = () => ({
    component: import("@/components/CodeDetailQuestionHeader.vue"),
    loading: Spinner,
    delay: 500
});
const CodeDetailQuestionHeaderBottom = () => ({
    component: import("@/components/CodeDetailQuestionHeaderBottom.vue"),
    loading: Spinner,
    delay: 200
});
const Article = () => ({
    component: import("@/components/Article.vue"),
    loading: Spinner,
    delay: 200
});
const CodeDetailAnswerHeader = () => ({
    component: import("@/components/CodeDetailAnswerHeader.vue"),
    loading: Spinner,
    delay: 200
});

export default {
    name: "CodeDetail",
    components: {
        CodeDetailQuestionHeader,
        CodeDetailAnswerHeader,
        CodeDetailQuestionHeaderBottom,
        Article
    },
    data() {
        return {
            ANSWERS: [],
            QUESTION: [],
            VERSION: [0],
            loaded: false,
            canSelected: false,
            sort_by: "votes",
        }
    },
    props: [
        "question_pk"
    ],
    methods: {
        clicked(sort_by) {
            if (this.sort_by == sort_by) return;
            alert('WIP');
            this.sort_by = sort_by; 
            this.sort(sort_by);
        },
        sort(sort_by) {
            this.loaded = false;
            this.loaded = true;
            this.$forceUpdate();
            if (sort_by == 'votes') {

            } else if(sort_by == 'active') {

            } else {

            }
        },
        update() {
            this.loaded = false;
            this.VERSION = [0];
            this.$axios.get(`questions/detail/${this.question_pk}`).then(res=>{
                const data = res.data.data;
                this.ANSWERS = data.ANSWERS;
                this.QUESTION = data.QUESTION;
                this.VERSION = this.VERSION.concat(data.VERSION);
                this.canSelected = !data.QUESTION[0].IS_ANSWER && this.$session.get('username') == data.QUESTION[0].USER_NAME;
                this.loaded = true;
                //this.ANSWERS.sort(this.votes);
            })
        },
    },
    watch: {
        "$route": function() {
            this.update();
        }
    },
    mounted() {
        this.update();
    }
}

</script>

<style scoped lang="scss">
#mainbar {
    width: calc(100%-300px-24px); //TODO
    float: left;
    margin: 0;
    padding: 0;
}

#question {
    clear: both;
}



.clearfix::after {
    content: "";
    display: table;
    clear: both;
}
.ps-relative {
    position: relative !important;
}
.d-block {
    display: block !important;
}

.separator {
    margin: 30px 1px;
    height: 0px;
    border-bottom: 1px solid var(--color-contrast-low);

}
</style>
