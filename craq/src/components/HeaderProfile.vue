<template>
    <div class="section">
        <div class="margin-bottom-xxxl">
        <HeaderHeading title="Developers" sub="we make world better"></HeaderHeading>
        </div>
        <div class="grid">
            <div class="col12">
                <HeaderProfileCard 
                :fullName="'Hello World!'" 
                :fileName="'ksg.jpg'" 
                :title="'김상근'"
                :subTitle="'FRONT-END'"
                :skills="[
                ['fab', 'cuttlefish'],
                ['fab', 'aws'],
                ['fab', 'vuejs'],
                ['fab', 'node-js'],
                ['fab', 'js-square'],
                ['fab', 'python'],
                ['fab', 'html5'],
                ['fab', 'css3-alt'],
                ]"
                ></HeaderProfileCard>
            </div>
            <div class="col12">
                <HeaderProfileCard 
                :fullName="'DJ. Koo'" 
                :fileName="'kgh.jpg'"
                :title="'김구현'"
                 :subTitle="'HEAD / FRONT-END'"
                 :skills="[
                ['fab', 'aws'], 
                ['fab', 'android']
                ['fab', 'node-js'],
                ['fab', 'vuejs'],
                ['fab', 'cuttlefish'],
                ['fab', 'js-square'],
                ['fab', 'python'],
                ['fab', 'html5'],
                ['fab', 'css3-alt'],
                 ]">
                </HeaderProfileCard>
            </div>
            <div class="col12">
                <HeaderProfileCard 
                :fullName="'Jang The Secretary'" 
                :fileName="'jsj.jpg'"
                :title="'조수장'"
                :subTitle="'BACK-END'"
                 :skills="[
                ['fab', 'google'],
                ['fas', 'sticky-note'],
                ['fas', 'palette'],
                ['fas', 'teeth-open'],
                ['fas', 'calculator']
                 ]"></HeaderProfileCard>
            </div>
            <div class="col12">
                <HeaderProfileCard 
                :fullName="'KB'" 
                :fileName="'kbh.jpg'"
                :title="'김범현'"
                :subTitle="'BACK-END'"
                :skills="[
                 ['fas', 'bed']
                 ]"></HeaderProfileCard>
            </div>
            <div class="col12">
                <HeaderProfileCard 
                :fullName="'JJHJJ'" 
                :fileName="'jjh.jpg'"
                :title="'정준희'"
                :subTitle="'FRONT-END'"
                :skills="[
                ['fab', 'android'],
                ['fab', 'java'],
                ['fab', 'cuttlefish'],
                ['fab', 'node-js'],
                ['fab', 'js-square'],
                ['fab', 'vuejs'],
                ['fab', 'raspberry-pi'],
                ['fab', 'php'],
                ['fab', 'html5'],
                ['fab', 'css3-alt'],
                 ]"
                ></HeaderProfileCard>
            </div>
        </div>
        
    </div>
</template>

<script>
import HeaderProfileCard from '@/components/HeaderProfileCard.vue';
import HeaderHeading from '@/components/HeaderHeading.vue';
export default {
    name: "HeaderProfile",
    components: {
        HeaderProfileCard,
        HeaderHeading
    }
}

</script>

<style lang="scss" scoped>
.section {
    position: relative;
}

.col12 {
    position: relative;
    margin-bottom: 2rem;
}

</style>
