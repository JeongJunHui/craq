<template>
    <div class="post-text" item-prop="text">
        <div v-html="body"></div>
    </div>
</template>

<script>
import VClamp from 'vue-clamp'
export default {
    name: "ArticleContent",
    components: {
        VClamp
    },
    props: [
        "body"
    ],
    watch: {
        '$props': function() {
            console.log('content');
        }

    }
}

</script>

<style scoped lang="scss">
.post-text {
    margin-top: var(--space-sm);
    margin-bottom: var(--space-sm);
    word-wrap: break-word;
    font-size: 1rem; // TODO
    line-height: 1.3;
    font-family: Arial, "Helvetica Neue",Helvetica, sans-serif;
    width: 1100px;
}


</style>
