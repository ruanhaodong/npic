<template>
    <div class="relative w-full h-full">
        <div ref="networkContainer" class="w-full h-full  ">

        </div>
        <div class="absolute top-0  bg-base-100/50 p-4 rounded-lg flex gap-2 w-full">
            <div class="btn btn-sm btn-primary " v-if="selectedNodeId" @click="goToEdit(selectedNodeId)">编辑</div>
            <div class="btn btn-sm btn-neutral ">新增</div>

            <div class="btn btn-sm btn-neutral ">操作节点</div>
            <div class="btn btn-sm btn-neutral bg-green-500" @click="openChatModal(selectedNodeId)" v-show="canChat">聊天</div>
            <div class="btn btn-sm btn-error ml-auto " @click="cleanNodes">清空</div>
        </div>
    </div>

    <NpcChat ref="chatModal" ></NpcChat>

    <!-- {{ networkData.nodes }} -->
</template>

<script setup lang="ts">
import { Network, Options, Data, DataSetEdges, EdgeOptions, } from 'vis-network'
import { DataSet } from 'vis-data'
import { Memory, Node, Npc } from '@prisma/client';
import { VisEdge, VisNode } from 'vis-network/declarations/network/gephiParser';
import NpcChat from '~/components/npc/npcChat.vue'

const { router } = useNuxtApp()
const networkContainer = ref<HTMLElement>()
const network = ref<Network>()
// const networkData = reactive<Data>({
//     nodes: new DataSet<VisNode,'id'>(),
//     edges: new DataSet<VisEdge,'id'>()
// })
const edges = new DataSet<VisEdge, 'id'>()
const nodes = new DataSet<VisNode, 'id'>()

const chatModal = ref<InstanceType<typeof NpcChat> | null>(null);

const openChatModal = (id: string) => {
    const list = toRaw(props.relations);
    var npc = list.find(function (obj) {
        return obj.npc_id === id;
    });
    const data = npc?.npc

    console.log(chatModal.value)
    chatModal.value?.setIsOpen(true, data)
}


// networkData.edges?.forEach

const selectedNodeId = ref()

const canChat = computed(() => {
    const list = toRaw(props.relations);
    var npc = list.find(function (obj) {
        return obj.npc_id === selectedNodeId.value;
    });
    if (npc?.npc.npc_profile) {
        return true
    } else {
        return false
    }
})

const props = defineProps<{
    relations: Array<Node & { npc: Npc,memory:Memory  }>
}>()



watchEffect(() => {
    if (!network) {
        return;
    }
    if (props.relations) {
        const list = toRaw(props.relations);
        nodes.clear()

        list.map((node) => {
            if (node.type=='person'){
                nodes.add({
                id: node.npc_id!,
                label: node.npc.fullname,
                color: node.npc.npc_profile ? 'rgb(22 163 74)' : 'rgb(245 158 11)',
                fixed: false,
            })
            }
            // else if (node.type =='story'){
            //     console.log(node)
            //    nodes.add({
            //     id: node.memory.id,
            //     label: node.memory.emoji+'',
            //     color:  'rgb(22 163 74)',
            //     fixed: false,
                
            //      })
            // }
        })
        nodes.map((edge) => { console.log(edge) })

        edges.clear()

        console.log("???", list)

        props.relations.forEach(node => {
            const avaliableRelations = [] as RelationNode[]
            if ((node.npc?.relations as any[])?.length > 0) {
                avaliableRelations.push(...node.npc.relations as RelationNode[]);
            }
            if ((node.npc?.family as any[])?.length > 0) {
                avaliableRelations.push(...node.npc.family as RelationNode[]);
            }
            // if ((node.memory)){
            //     console.log(node.memory)
            //     // avaliableRelations.push(...node.npc.family as RelationNode[]);
            //     edges.add({
            //         from: node.memory.npc_id,
            //         to : node.memory.id,
            //         id: node.memory.npc_id + node.memory.id,
                    
            //     })
            // }
            avaliableRelations.forEach((relation) => {
                console.log('re', relation)
                edges.add({
                    id: relation.id + node.npc_id,
                    from: node.npc_id!,
                    to: relation.id,
                    label: relation.role + relation.affinity,

                })
            });
        });

        edges.map((edge) => { console.log(edge) })



    }
})
onMounted(() => {
    nextTick(() => {

        sampleGraph()
    })
})
const sampleGraph = () => {
    var options: Options = {
        nodes: {
            shape: 'box',
            // borderWidthSelected:6
            imagePadding:1

        },
        edges: {
            arrows: { to: { enabled: false } },
        }
    };

    network.value = new Network(networkContainer.value as HTMLElement, {
        edges, nodes
    }, options);

    network.value.on('click', (node) => {
        console.log(node)
        selectedNodeId.value = node.nodes[0]
    })
}

const goToEdit = (nodeId: string) => {
    const selectNode = props.relations?.find((node) => node.npc_id === nodeId)
    selectNode && useNuxtApp().$router.push(`/world/npc/${selectNode.npc.npc_id}`)
}

const cleanNodes = () => {
    let confirm = window.confirm('确认清空所有节点吗？')
    if (!confirm) {
        return
    }
    useNuxtApp().$client.npc.delete.query().then()
    emit('refresh')
}
const emit = defineEmits(['refresh'])
</script>

<style scoped></style>