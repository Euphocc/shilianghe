import {
    createRouter,
    createWebHashHistory
} from "vue-router";

import NotFound from "~/pages/404.vue"
import BaseMap from "../pages/Map/BaseMap.vue"
import SiteCard from "~/components/SiteCard.vue"
import ChartView from "~/pages/Chart/ChartView.vue"
import ChartCard from "~/pages/Chart/ChartCard.vue"
//以下是多尺度水文水资源预测预报预警云平台的页面
import ProjectTopics from "~/pages/Platform/ProjectTopics.vue"
import MultiSourceData from "~/pages/Platform/MultiSourceData.vue"
import TheoreticalApproach from "../pages/Platform/TheoreticalApproach.vue";
import ModelTechnology from "../pages/Platform/ModelTechnology.vue";
import IntegrationPlatform from "../pages/Platform/IntegrationPlatform.vue";
import Uncertain from "../pages/Platform/Uncertain.vue";
//这是默认路由，用户共享
const routes = [
    {
        path: '/',
        name: '典型流域',
        component: BaseMap,
    }, {
        //折线图
        path: "/ChartView",
        name: "ChartView",
        component: ChartView,
        meta: {
            title: "站点信息"
        }
    },
    {
        //内嵌页面
        path: "/innerSite",
        component: SiteCard
    },
    {
        //内嵌页面
        path: "/ChartCard",
        component: ChartCard
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    },
    {
        path: "/MultiSourceData",
        name: "MultiSourceData",
        component: MultiSourceData,
        meta: {
            title: "多源数据"
        }
    },
    {
        path: "/TheoreticalApproach",
        name: "TheoreticalApproach",
        component: TheoreticalApproach,
        meta: {
            title: "理论方法"
        }
    },
    {
        path: "/ModelTechnology",
        name: "ModelTechnology",
        component: ModelTechnology,
        meta: {
            title: "模型技术"
        }
    },
    {
        path: "/IntegrationPlatform",
        name: "IntegrationPlatform",
        component: IntegrationPlatform,
        meta: {
            title: "集成平台"
        }
    },
    {
        path: "/Uncertain",
        name: "Uncertain",
        component: Uncertain,
        meta: {
            title: "不确定性"
        }
    }
]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})

