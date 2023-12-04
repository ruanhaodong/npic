<template>
    <div>
        <KeyNode  v-bind="$attrs">
            <template v-slot:content>
                <div class="p-1 flex gap-1   overflow-x-scroll snap-start">
                    <!-- <InputParsedNode></InputParsedNode> -->
                    <!-- <InputParsedNode></InputParsedNode>
                    <InputParsedNode></InputParsedNode>
                    <InputParsedNode></InputParsedNode>
                    <InputParsedNode></InputParsedNode>
                    <InputParsedNode></InputParsedNode>
                    <InputParsedNode></InputParsedNode>
                    <InputParsedNode></InputParsedNode> -->
                    <!-- <div class="btn btn-ghost btn-xs"> 管理全部节点</div> -->
                </div>

            </template>

        </KeyNode>

    </div>
</template>

<script setup lang="ts">
defineProps([''])

</script>

<style scoped></style>