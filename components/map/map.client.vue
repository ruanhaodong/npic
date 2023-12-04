<template >
    <div class="border w-full h-full" ref="container">
        <canvas id="canvas" class="border w-full h-full"></canvas>

        <div class="absolute right-2 top-2 flex gap-2 items-center" v-show="selected">
            <div class="btn btn-sm bg-red-700" @click="deleteArea">删除</div>
            <div class="btn btn-sm bg-amber-500" @click="editArea">编辑</div>
        </div>
    </div>
    <NewArea ref="newAreaModal" title="创建区域" @done="setArea"></NewArea>
</template>
    
<script setup lang="ts">
import NewArea from '~/components/modal/NewArea.vue'
import { fabric } from "fabric";
import { nanoid } from "nanoid";
import { Map } from '@prisma/client';

interface Area {
    areaId: string,
    name: string,
    description: string,
    x: number,
    y: number
}

interface MapData {
    mapId: string,
    background: string,
    areas: Area[],
    jsonData: any
}

const newAreaModal = ref<InstanceType<typeof NewArea> | null>(null);

const openNewAreaModal = (data?: any) => {
    newAreaModal.value?.setIsOpen(true, data)
}

// const instance = getCurrentInstance();
const container = ref()
const selected = ref(false);


let mapData = { "mapId": "SvJzR80CyE49Fi9FgD36B", "background": "https://xinvtech.oss-cn-shanghai.aliyuncs.com/npcepic/map/1688449063392.png", "areas": [{ "areaId": "jWcKnrCMjPDfk9RlqTV1f", "name": "123", "description": "", "x": 7.232635498046875, "y": 5.581573486328125 }, { "areaId": "zecMQugmbQqABWqkAyXCe", "name": "456", "description": "", "x": 114.23263549804688, "y": 94.58157348632812 }], "jsonData": "{\"version\":\"5.3.0\",\"objects\":[{\"type\":\"image\",\"version\":\"5.3.0\",\"originX\":\"center\",\"originY\":\"center\",\"left\":258,\"top\":104,\"width\":2048,\"height\":1536,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":0,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeUniform\":false,\"strokeMiterLimit\":4,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"cropX\":0,\"cropY\":0,\"src\":\"https://xinvtech.oss-cn-shanghai.aliyuncs.com/npcepic/map/1688449063392.png\",\"crossOrigin\":null,\"filters\":[]},{\"type\":\"group\",\"version\":\"5.3.0\",\"originX\":\"center\",\"originY\":\"center\",\"left\":7.23,\"top\":5.58,\"width\":101,\"height\":101,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":0,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeUniform\":false,\"strokeMiterLimit\":4,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"areaId\":\"jWcKnrCMjPDfk9RlqTV1f\",\"objects\":[{\"type\":\"circle\",\"version\":\"5.3.0\",\"originX\":\"center\",\"originY\":\"center\",\"left\":0,\"top\":0,\"width\":100,\"height\":100,\"fill\":\"rgba(140, 55, 59, 0.7)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeUniform\":false,\"strokeMiterLimit\":4,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"radius\":50,\"startAngle\":0,\"endAngle\":360},{\"type\":\"text\",\"version\":\"5.3.0\",\"originX\":\"center\",\"originY\":\"center\",\"left\":0,\"top\":0,\"width\":33.37,\"height\":22.6,\"fill\":\"white\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeUniform\":false,\"strokeMiterLimit\":4,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"fontFamily\":\"Arial\",\"fontWeight\":\"normal\",\"fontSize\":20,\"text\":\"123\",\"underline\":false,\"overline\":false,\"linethrough\":false,\"textAlign\":\"center\",\"fontStyle\":\"normal\",\"lineHeight\":1.16,\"textBackgroundColor\":\"\",\"charSpacing\":0,\"styles\":[],\"direction\":\"ltr\",\"path\":null,\"pathStartOffset\":0,\"pathSide\":\"left\",\"pathAlign\":\"baseline\"}]},{\"type\":\"group\",\"version\":\"5.3.0\",\"originX\":\"center\",\"originY\":\"center\",\"left\":114.23,\"top\":94.58,\"width\":101,\"height\":101,\"fill\":\"rgb(0,0,0)\",\"stroke\":null,\"strokeWidth\":0,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeUniform\":false,\"strokeMiterLimit\":4,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"areaId\":\"zecMQugmbQqABWqkAyXCe\",\"objects\":[{\"type\":\"circle\",\"version\":\"5.3.0\",\"originX\":\"center\",\"originY\":\"center\",\"left\":0,\"top\":0,\"width\":100,\"height\":100,\"fill\":\"rgba(5, 220, 165, 0.7)\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeUniform\":false,\"strokeMiterLimit\":4,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"radius\":50,\"startAngle\":0,\"endAngle\":360},{\"type\":\"text\",\"version\":\"5.3.0\",\"originX\":\"center\",\"originY\":\"center\",\"left\":0,\"top\":0,\"width\":33.37,\"height\":22.6,\"fill\":\"white\",\"stroke\":null,\"strokeWidth\":1,\"strokeDashArray\":null,\"strokeLineCap\":\"butt\",\"strokeDashOffset\":0,\"strokeLineJoin\":\"miter\",\"strokeUniform\":false,\"strokeMiterLimit\":4,\"scaleX\":1,\"scaleY\":1,\"angle\":0,\"flipX\":false,\"flipY\":false,\"opacity\":1,\"shadow\":null,\"visible\":true,\"backgroundColor\":\"\",\"fillRule\":\"nonzero\",\"paintFirst\":\"fill\",\"globalCompositeOperation\":\"source-over\",\"skewX\":0,\"skewY\":0,\"fontFamily\":\"Arial\",\"fontWeight\":\"normal\",\"fontSize\":20,\"text\":\"456\",\"underline\":false,\"overline\":false,\"linethrough\":false,\"textAlign\":\"center\",\"fontStyle\":\"normal\",\"lineHeight\":1.16,\"textBackgroundColor\":\"\",\"charSpacing\":0,\"styles\":[],\"direction\":\"ltr\",\"path\":null,\"pathStartOffset\":0,\"pathSide\":\"left\",\"pathAlign\":\"baseline\"}]}]}" }
console.log('61')
const props = defineProps<{
    preset_mapData?: Map
}>();

watchEffect(() => {
    if (props.preset_mapData) {
        console.log('68')
        console.log("🚀 ~ file: map.client.vue:68 ~ watchEffect ~ preset_mapData:", props.preset_mapData)
        console.log(props.preset_mapData)
        mapData.mapId = props.preset_mapData.id;
        mapData.jsonData = props.preset_mapData.jsonData as any;
        mapData.jsonData = props.preset_mapData.jsonData as any;
        mapData.areas = props.preset_mapData.areas as any;
        mapData.background = props.preset_mapData.background_id as string
        nextTick(() => {
            // initCanvas()
            initCanvasFromJson()
            console.log(1111)
        })

    } else {
        // initCanvas()
    }
})

const jsonObjects = ref()

let selectedArea: string = ""
let currentId: string = ""
let canvas: fabric.Canvas
let startPoint: { x: number, y: number } | null = null
// 定义变量用于存储总偏移量
let offset = { sacleX: 0, sacleY: 0, moveX: 0, moveY: 0 }


const initCanvasFromJson = () => {
    canvas = new fabric.Canvas('canvas');
    const width = container.value.offsetWidth
    const height = container.value.offsetHeight

    const left = container.value.getBoundingClientRect().left
    const top = container.value.getBoundingClientRect().top
    canvas.setDimensions({ width: width, height: height })

    // loadImage();

    canvas.setZoom(1)
    const scale = canvas.getZoom()

    // 加载导出的json文件
    canvas.loadFromJSON(mapData.jsonData, canvas.renderAll.bind(canvas), function (o: any, object: any) {
        // `o` = json object
        // `object` = fabric.Object instance
        // ... do some stuff ...
        // console.log(object)
        if (object.type === "image") {
            object.set({
                originX: "center",
                originY: "center",
                left: canvas.width! / 2 / scale,
                top: canvas.height! / 2 / scale,
                selectable: false // 设置矩形不可选中
            })
        }
        console.log(object)
        canvas.add(object)

        console.log("?????", canvas.getObjects())
        jsonObjects.value = canvas.getObjects()
    });


    // 设置画布可缩放
    canvas.on('mouse:wheel', function (event) {
        var delta = event.e.deltaY;
        var zoom = canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 10) zoom = 10;
        if (zoom < 0.01) zoom = 0.01;
        canvas.zoomToPoint({ x: width / 2, y: height / 2 }, zoom);


        // 计算原点的偏移量
        var scale = canvas.getZoom();
        var centerX = canvas.getWidth() / 2;
        var centerY = canvas.getHeight() / 2;
        var oldCenterX = canvas.getWidth() / (2 * scale);
        var oldCenterY = canvas.getHeight() / (2 * scale);
        offset.sacleX = centerX - oldCenterX;
        offset.sacleY = centerY - oldCenterY;
        event.e.preventDefault();
        event.e.stopPropagation();
    });

    var lastPosX: number
    let lastPosY: number

    canvas.on('mouse:down', function (event: fabric.IEvent) {
        const mouseEvent = event.e as MouseEvent;

        lastPosX = mouseEvent.clientX
        lastPosY = mouseEvent.clientY

        var activeObject = canvas.getActiveObject();

        if (activeObject) {
            // console.log('当前选中的元素是：', activeObject);
            currentId = (activeObject as any).areaId
            // openNewAreaModal(area)
            console.log("123", currentId)
            showTools(true)
        } else {
            // console.log('没有选中任何元素');
            currentId = ""
            showTools(false)
        }

    });
    canvas.on('mouse:dblclick', function (event: fabric.IEvent) {
        const mouseEvent = event.e as MouseEvent;
        startPoint = { x: mouseEvent.clientX - left, y: mouseEvent.clientY - top };
        openNewAreaModal()
    });


    canvas.on('mouse:move', function (options) {
        var scale = canvas.getZoom();
        if (currentId === "") {
            if (options && options.e && options.e.buttons === 1) {
                const deltaX = options.e.clientX - lastPosX;
                const deltaY = options.e.clientY - lastPosY;
                canvas.relativePan(new fabric.Point(deltaX, deltaY));
                lastPosX = options.e.clientX;
                lastPosY = options.e.clientY;
                offset.moveX -= deltaX / scale;
                offset.moveY -= deltaY / scale;
            }
        }


    });

    // 禁用默认的对象选择功能
    canvas.selection = false;
}


const initCanvas = () => {
    canvas = new fabric.Canvas("canvas");

    const width = container.value.offsetWidth
    const height = container.value.offsetHeight

    const left = container.value.getBoundingClientRect().left
    const top = container.value.getBoundingClientRect().top

    console.log(left, top, width, height)
    canvas.setDimensions({ width: width, height: height })

    // loadImage();

    canvas.setZoom(1)

    // 设置画布可缩放
    canvas.on('mouse:wheel', function (event) {
        var delta = event.e.deltaY;
        var zoom = canvas.getZoom();
        zoom *= 0.999 ** delta;
        if (zoom > 10) zoom = 10;
        if (zoom < 0.01) zoom = 0.01;
        canvas.zoomToPoint({ x: width / 2, y: height / 2 }, zoom);


        // 计算原点的偏移量
        var scale = canvas.getZoom();
        var centerX = canvas.getWidth() / 2;
        var centerY = canvas.getHeight() / 2;
        var oldCenterX = canvas.getWidth() / (2 * scale);
        var oldCenterY = canvas.getHeight() / (2 * scale);
        offset.sacleX = centerX - oldCenterX;
        offset.sacleY = centerY - oldCenterY;
        event.e.preventDefault();
        event.e.stopPropagation();
    });

    var lastPosX: number
    let lastPosY: number

    canvas.on('mouse:down', function (event: fabric.IEvent) {
        const mouseEvent = event.e as MouseEvent;

        lastPosX = mouseEvent.clientX
        lastPosY = mouseEvent.clientY

        var activeObject = canvas.getActiveObject();

        if (activeObject) {
            // console.log('当前选中的元素是：', activeObject);
            currentId = (activeObject as any).areaId
            // openNewAreaModal(area)
            console.log(currentId)
            showTools(true)
        } else {
            // console.log('没有选中任何元素');
            currentId = ""
            showTools(false)
        }

    });
    canvas.on('mouse:dblclick', function (event: fabric.IEvent) {
        const mouseEvent = event.e as MouseEvent;
        startPoint = { x: mouseEvent.clientX - left, y: mouseEvent.clientY - top };
        openNewAreaModal()
    });


    canvas.on('mouse:move', function (options) {
        var scale = canvas.getZoom();
        if (currentId === "") {
            if (options && options.e && options.e.buttons === 1) {
                const deltaX = options.e.clientX - lastPosX;
                const deltaY = options.e.clientY - lastPosY;
                canvas.relativePan(new fabric.Point(deltaX, deltaY));
                lastPosX = options.e.clientX;
                lastPosY = options.e.clientY;
                offset.moveX -= deltaX / scale;
                offset.moveY -= deltaY / scale;
            }
        }


    });

    // 禁用默认的对象选择功能
    canvas.selection = false;
}

const loadImage = (img?: string) => {
    console.log(mapData)
    let image = mapData.background
    if (img) {
        mapData.background = img
        image = img
    }

  
        // console.log(image)
        fabric.Image.fromURL(image, function (img: any) {
            const scale = canvas.getZoom()
            img.set({
                originX: "center",
                originY: "center",
                left: canvas.width! / 2 / scale,
                top: canvas.height! / 2 / scale,
                selectable: false // 设置矩形不可选中
            });

            canvas.add(img);
            canvas.renderAll();
            // 将图片设置为背景
            canvas.sendToBack(img);
        });
  

};

const getCanvasObjects = () => {
    if (canvas.getObjects().length > 0) {
        return canvas.getObjects()
    } else {
        return jsonObjects.value
    }
}


const setArea = (data: any) => {
    var area: any = mapData.areas.find(function (obj) {
        console.log(obj)
        return obj.name === data.name;
    });
    console.log("???", currentId, area)
    

    if (area) {
        return
    }

    let position = startPoint

    if (!startPoint) {
        position = getRandomPosition()
    }

    if (currentId == "") {
        const areaId = nanoid()

        const scale = canvas.getZoom()
        const circle = new fabric.Circle({
            left: 0,
            top: 0,
            radius: 50,
            originX: "center",
            originY: "center",
            fill: getRandomColor(),
            selectable: false
        });

        const text = new fabric.Text(data.name, {
            left: circle.left,
            top: circle.top,
            textAlign: 'center',
            originX: 'center',
            originY: 'center',
            fill: 'white', // 设置文字颜色为白色
            // stroke: 'black', // 设置描边颜色为黑色
            // strokeWidth: 1, // 设置描边宽度为2像素
            fontSize: 20,
            // fontWeight: 'bold', // 设置文字加粗
            fontFamily: 'Arial', // 设置字体为Arial
            selectable: false
        });

        // 创建组对象
        const area = new fabric.Group([circle, text], {
            left: position!.x / scale + offset.sacleX + offset.moveX,
            top: position!.y / scale + offset.sacleY + offset.moveY,
            originX: "center",
            originY: "center",
        });

        (area as any).areaId = areaId

        mapData.areas.push({
            areaId: areaId,
            name: data.name,
            description: data.description,
            x: area.left!,
            y: area.top!
        })


        // 添加矩形到画布
        canvas.add(area);

        console.log(canvas.getObjects())
        // 将矩形设置为最高层级
        canvas.bringToFront(area);
    } else {
        var objects = canvas.getObjects();
        var group = objects.find(function (obj) {
            return (obj as any).areaId === currentId;
        });
        var text = (group as any).getObjects()[1]
        text.set('text', data.name);

        var area: any = mapData.areas.find(function (obj) {
            return obj.areaId === currentId;
        });
        area.name = data.name
        area.description = data.description
        canvas.renderAll();
    }
    console.log(mapData)

    currentId = ""
    showTools(false)

}

const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.7)`;
}

const getRandomPosition = () => {
    const width = container.value.offsetWidth
    const height = container.value.offsetHeight

    const left = container.value.getBoundingClientRect().left
    const top = container.value.getBoundingClientRect().top

    const min: number = -100
    const max: number = 100
    const x: number = Math.floor(Math.random() * (max - min + 1)) + min;
    const y: number = Math.floor(Math.random() * (max - min + 1)) + min;
    const point = { x: x + width / 2, y: y + height / 2 };
    console.log(point)
    return point
}

const saveMapToJson = (): MapData => {
    // 导出画布为JSON
    var json = JSON.stringify(canvas.toObject(['areaId']));
    console.log(json)
    // const json = JSON.stringify(canvas.toJSON());
    // console.log(json)
    // var objects = canvas.getObjects();
    var objects = getCanvasObjects()
    for (let object of objects) {
        if ((object as any).areaId) {
            var area: any = mapData.areas.find(function (obj) {
                return obj.areaId === (object as any).areaId;
            });
            area.x = object.left
            area.y = object.top
        }
    }
    mapData.jsonData = json
    emit('saveMap', mapData)
    return mapData;
}

const showTools = (bool: boolean) => {
    selected.value = bool
}

const deleteArea = () => {
    // console.log("delete")

    for (let i = 0; i < mapData.areas.length; i++) {
        if (mapData.areas[i].areaId === currentId) {
            mapData.areas.splice(i, 1)
        }
    }

    // 获取要删除的元素的引用
    var element = canvas.getActiveObject();
    if (element) {
        canvas.remove(element);
        showTools(false)
    }
    // console.log(mapData)
    currentId = ""
}

const editArea = () => {
    const currentArea = mapData.areas.find(function (obj) {
        return obj.areaId === currentId;
    });
    openNewAreaModal(currentArea)
}

defineExpose({ saveMapToJson, setArea, loadImage, initCanvas })
const emit = defineEmits(['saveMap'])

</script>
    
<style scoped></style>