// ================== 零件数据库（你可随时扩展此处） ==================
const partsData = {
    1: { 
        name: "零件1", 
        img: "images/part1.png", 
        model: "models/brutalist_building.glb",
        desc: "用于主体结构连接与受力传递，可应用于梁柱节点、桁架拼接与装配式结构吊装定位。具备较高强度与稳定性，适合在结构深化设计及施工模拟中使用。",
        category:"结构件" 
    },

    2: { 
        name: "零件2", 
        img: "images/part2.png", 
        model: "models/city.glb",
        desc: "用于基础与主体构件的二次固定与安装加强，可在预制构件拼装、钢结构连接处使用。支持LOD350-LOD400深化，适用于施工工艺演示与碰撞检测。",
        category:"结构件" 
    },

    3: { 
        name: "零件3", 
        img: "images/part3.png", 
        model: "models/painterly_cottage.glb",
        desc: "适用于机电安装系统中设备布置、机位定位与维护空间校核，可用于风机、泵阀类设备模型挂载、支撑优化及运维规划。",
        category:"设备件" 
    },

    4: { 
        name: "零件4", 
        img: "images/part4.png", 
        model: "models/asia_building.glb",
        desc: "用于室内装饰与围护构件布置，可应用于幕墙挂板、造型装饰件、吊顶系统深化。适合效果图渲染展示与装饰施工模拟。",
        category:"装修件" 
    },

    5: { 
        name: "示例建筑", 
        img: "images/模型剖面截图.jpg",
        model: "models/示例建筑.glb",
        desc: "零件5的描述信息。",
        category:"示例建筑" 
    },

    6: { 
        name: "钢柱", 
        img: "images/钢柱.png",    
        model: "models/钢柱.glb",
        desc: "零件6的描述信息。",
        category:"柱" 
    },
};


// 🔧 解析 URL 参数
function getQueryParam(param) {
    return new URLSearchParams(window.location.search).get(param);
}

// =================================================================
// ① 详情页加载逻辑：当页面存在 part-detail 标签时自动执行
// =================================================================
// =============== 详情页加载 ==================
function loadPartDetail() {
    const img = document.getElementById("part-img");
    const name = document.getElementById("part-name");
    const desc = document.getElementById("part-desc");
    const cat  = document.getElementById("part-category"); // 分类节点
    const modelViewer = document.getElementById("part-3d"); 

    if (!img || !name || !desc) return;

    const partId = getQueryParam("id");
    const part = partsData[partId];

    if (part) {
        img.src = part.img;
        img.alt = part.name;
        name.textContent = part.name;

        // ⭐ 描述内容（我加了真实范例示意）
        desc.innerHTML = `
            <strong>零件用途说明：</strong><br>
            ${part.desc}<br><br>
        `;

        // ⭐ 显示类别
        if (cat) cat.innerHTML = `所属分类：<a href="category.html?cat=${encodeURIComponent(part.category)}">${part.category}</a>`;

        // ⭐ 显示 3D 模型
        if (modelViewer && part.model) {
            modelViewer.src = part.model;
            modelViewer.alt = `${part.name} 3D 模型`;
        }
        
    } else {
        name.textContent = "未找到零件";
        desc.textContent = "该零件ID不存在。";
        img.style.display = "none";
        if (cat) cat.style.display = "none";
    }
}

// =================================================================
// ② 搜索页逻辑 search.html?keyword=xxx   页面直接生成搜索结果
// =================================================================
function loadSearchPage() {
    const container = document.getElementById("search-results");
    if (!container) return;

    const keyword = (getQueryParam("keyword") || "").trim().toLowerCase();

    if (!keyword) {
        container.innerHTML = `<p>请输入搜索关键字。</p>`;
        return;
    }

    let resultHTML = "";
    let count = 0;

    for (const id in partsData) {
        const p = partsData[id];

        const matchName = p.name.toLowerCase().includes(keyword);
        const matchDesc = p.desc.toLowerCase().includes(keyword);
        const matchCategory = p.category && p.category.toLowerCase().includes(keyword);

        if (matchName || matchDesc || matchCategory) {
            count++;
            resultHTML += `
            <div class="search-item">
                <a href="part-detail.html?id=${id}">
                    <img src="${p.img}" alt="${p.name}">
                    <h3>${p.name}</h3>
                    <p>${p.desc}</p>
                    <span class="tag">分类：${p.category}</span>
                </a>
            </div>`;
        }
    }

    if (count > 0) {
        container.innerHTML = `
            <p class="result-count">搜索 "<b>${keyword}</b>" 得到 <b>${count}</b> 条内容</p>
            <div class="result-list">${resultHTML}</div>
        `;
    } else {
        container.innerHTML = `<p>未找到匹配项。</p>`;
    }
}

// =================================================================
// ③ 首页零件展示逻辑 index.html
// =================================================================

function loadIndexGallery() {
    const gallery = document.getElementById("part-gallery");
    if (!gallery) return;

    let html="";
    for(const id in partsData){
        const p=partsData[id];
        html+=`
        <div class="part-item">
            <a href="part-detail.html?id=${id}">
                <img src="${p.img}">
                <p>${p.name}</p>
                <span class="tag"><a href="category.html?cat=${p.category}">${p.category}</a></span>
            </a>
        </div>`;
    }
    gallery.innerHTML=html;
}

function loadCategoryPage() {
    const catList = document.getElementById("category-list");
    const partBox = document.getElementById("category-parts");
    const title = document.getElementById("category-title");
    if (!catList || !partBox) return;  // 不在分类页则跳过

    const queryCat = getQueryParam("cat");

    // ========== 如果未选择分类 → 显示所有类别 ==========
    if (!queryCat) {
        const categories = new Set(Object.values(partsData).map(p => p.category));

        title.textContent="📂 选择分类";
        let html="";

        categories.forEach(c=>{
            html += `<p><a href="category.html?cat=${encodeURIComponent(c)}">${c}</a></p>`;
        });
        catList.innerHTML = html;
        return;
    }

    // ========== 已选择某个分类 → 显示零件 ==========
    title.textContent=`📦 类别：${queryCat}`;
    let html="";
    let count=0;

    for(const id in partsData){
        const p = partsData[id];
        if (p.category===queryCat){
            count++;
            html+=`
            <div class="part-item">
                <a href="part-detail.html?id=${id}">
                    <img src="${p.img}">
                    <p>${p.name}</p>
                </a>
            </div>`;
        }
    }

    partBox.innerHTML = count?html:`<p>该分类没有零件。</p>`;
}

// =================================================================
// 统一初始化 —— 再也不会互相覆盖！
// =================================================================
document.addEventListener("DOMContentLoaded", function () {
    loadPartDetail();
    loadSearchPage();
    loadIndexGallery();  // ← 首页展示零件
    loadCategoryPage();  // ← 分类页展示零件
});
