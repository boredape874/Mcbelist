// list.js
// =========================================================================
// 마인크래프트 서버 리스트 앱의 핵심 로직과 모든 데이터를 관리하는 파일입니다.
// 모든 이미지 경로는 './images/' 폴더를 기준으로 설정되었습니다.
// =========================================================================

// --- 1. 전역 데이터 및 설정 영역 ---
// 이 섹션의 데이터를 수정하여 서버 목록의 내용, 배너, 필터 종류 등을 변경할 수 있습니다.
const serverData = {
    // A. 사이트 전체 설정 (텍스트, 타이틀, 속도 등)
    siteConfig: {
        siteTitle: '마인크래프트 커뮤니티 서버 통합 리스트',
        siteDescription: '마크 커뮤니티 정보를 빠르게 확인하세요.',
        topBannerTitle: '🏆 최고의 서버 배너', // NEW: 최고의 서버 섹션 제목
        mainBannerTitle: '오늘의 추천 서버', // 오늘의 추천 서버 섹션 제목
        filterTitleCategory: '서버 종류별 분류',
        filterTitleTag: '핵심 태그별 분류',
        noResultsMessage: '현재 선택하신 필터/검색어에 해당하는 서버가 없습니다.',
        resetButtonLabel: '필터 초기화',
        mainBannerRotationInterval: 4000, // 배너 전환 시간 (밀리초, 1000ms = 1초)
    },

    // B. 필터 종류 설정 (카테고리 및 태그)
    config: {
        // 서버 카테고리(서버 종류)를 추가/삭제/수정할 수 있습니다.
        categories: [ '국가전쟁', '야생/RPG', '미니게임', '건축/크리에이티브', '자유 주제' ],
        // 태그를 추가/삭제/수정할 수 있습니다.
        tags: [ '인기', '신규', '이벤트', '개발 중' ]
    },

    // C. 최고의 서버 배너 데이터 (최상단 고정/순환 배너)
    topBanners: [
        { id: 'top_001', title: '🔥베드락 최대규모 국가전쟁🔥!!', subtitle: '지금 바로 접속하여 특별한 혜택을 받으세요!', 
          image: 'images/제목을-입력해주세요_-001(27).png', // <--- 로컬 이미지 경로로 변경됨
          url: 'https://open.kakao.com/o/gRUC0Reh, 
          content: '최고의 서버 랭킹 1위! 가장 많은 유저가 찾는 서버입니다. 상세 광고를 보려면 클릭하세요.' },
        { id: 'top_002', title: '🚀 프리미엄 서버 독점 공개!', subtitle: '특별한 혜택을 놓치지 마세요!', 
          image: 'images/banner_top_02.png', // <--- 로컬 이미지 경로로 변경됨
          url: 'https://example.com/top-server-ad-2', 
          content: '새로운 서버가 최고의 서버 배너에 등록되었습니다! 론칭 이벤트 참여 기회를 잡으세요.' }
    ],

    // D. 오늘의 추천 서버 배너 데이터 (메인 로테이션 배너)
    mainBanners: [
        { id: 'main_001', title: '✨ 주간 인기 서버 랭킹 1위!', subtitle: '3초마다 자동으로 교체됩니다.', 
          image: 'images/banner_main_01.gif', // <--- 로컬 이미지 경로로 변경됨 (GIF도 가능)
          url: 'https://example.com/weekly-event', 
          content: '주간 인기 서버 랭킹 1위! 상세 내용 확인 및 접속은 여기에서!' },
        { id: 'main_002', title: '🎁 신규 유저 특별 지원!', subtitle: '모던하고 각진 디자인으로 한눈에 서버 정보를 확인하세요.', 
          image: 'images/banner_main_02.png', // <--- 로컬 이미지 경로로 변경됨
          url: 'https://example.com/new-user-guide', 
          content: '신규 유저를 위한 웰컴 패키지가 준비되어 있습니다. 지금 바로 확인하세요.' }
    ],

    // E. 서버 목록 사이에 삽입되는 인라인 광고 데이터
    inlineAds: [
        { id: 'ad_001', title: '프리미엄 서버 호스팅! 20% 할인 이벤트!', 
          content: '렉 없는 환경을 원한다면 지금 바로 호스팅 서비스 확인하세요! 최고의 안정성과 속도를 보장합니다.', 
          image: 'images/ad_hosting.png', // <--- 로컬 이미지 경로로 변경됨
          url: 'https://example.com/hosting-ad' },
        { id: 'ad_002', title: '새로운 마인크래프트 런처 출시!', 
          content: '더욱 편리해진 기능과 UI를 경험해보세요. 원클릭 설치, 자동 업데이트, 사용자 정의 테마 지원!', 
          image: 'images/ad_launcher.png', // <--- 로컬 이미지 경로로 변경됨
          url: 'https://example.com/launcher-ad' }
    ],

    // F. 실제 서버 목록 데이터 (가장 중요)
    // 각 서버의 정보를 수정/추가/삭제할 수 있습니다.
    servers: [
        { id: 'mc_001', title: '전설의 마인크래프트 왕국', content: 'GIF 지원 확인! 오래된 역사와 안정적인 운영을 자랑하는 대규모 야생 서버입니다.', category: '야생/RPG', tags: ['인기', '신규'], memberCount: 1500, 
          image: 'images/server_mc_001.jpg', // <--- 로컬 이미지 경로로 변경됨
          communities: [{ type: 'Discord', url: 'https://discord.gg/example-legend' }, { type: 'Web', url: 'http://legend.server.com' }] },
        { id: 'mc_002', title: '미니게임즈 천국', content: '다양하고 신나는 PVP 미니게임들을 24시간 즐겨보세요! 가볍게 즐기기 최고!', category: '미니게임', tags: ['이벤트'], memberCount: 450, 
          image: 'images/server_mc_002.jpg', // <--- 로컬 이미지 경로로 변경됨
          communities: [{ type: 'Kakao', url: 'https://open.kakao.com/o/example-mini' }] },
        { id: 'mc_003', title: '판타지 건축 프로젝트', content: '창의적인 건축가들을 위한 서버입니다. 각진 디자인에 맞게 모든 UI를 깔끔하게 정리했습니다.', category: '건축/크리에이티브', tags: ['신규', '개발 중'], memberCount: 92, 
          image: 'images/server_mc_003.png', // <--- 로컬 이미지 경로로 변경됨
          communities: [{ type: 'Discord', url: 'https://discord.gg/example-build' }, { type: 'Kakao', url: 'https://open.kakao.com/o/example-build-chat' }] },
        { id: 'mc_004', title: '자유 소통 광장', content: '마인크래프트에 관련된 모든 주제로 자유롭게 소통하는 오픈 채팅방입니다. 부담없이 들어오세요!', category: '자유 주제', tags: ['신규'], memberCount: 220, 
          image: 'images/server_mc_004.png', // <--- 로컬 이미지 경로로 변경됨
          communities: [{ type: 'Kakao', url: 'https://open.kakao.com/o/example-free' }] },
        // 서버를 더 추가하려면 여기에 { ... }, 형태로 복사/붙여넣기 하세요.
    ]
};
// --- 전역 데이터 및 설정 영역 끝 ---


// --- 2. 전역 상태 및 DOM 요소 참조 ---
const siteConfig = serverData.siteConfig;
const serverList = document.getElementById('server-list');
const noResults = document.getElementById('no-results');
const topBannerContainer = document.getElementById('top-banner-content');
const mainBannerContainer = document.getElementById('main-banner-content');
const adDetailModal = document.getElementById('ad-detail-modal');
const filterDrawer = document.getElementById('filter-drawer');
const drawerOverlay = document.getElementById('drawer-overlay');

let activeCategory = 'all';
let activeTag = 'all';
let searchQuery = '';
let adIndex = 0; 
let currentTopBannerIndex = 0;
let currentMainBannerIndex = 0;


// --- 3. 유틸리티 함수 ---

/** 숫자를 천 단위로 콤마를 넣어 포맷합니다. (예: 1500 -> 1,500) */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** 커뮤니티 타입에 따른 버튼 스타일과 아이콘을 반환합니다. */
function getCommunityInfo(type) {
    // 버튼 스타일과 아이콘을 여기서 커스터마이징 할 수 있습니다.
    const icons = {
        discord: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square mr-1"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
        kakao: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-zap mr-1"><path d="M12 7v10"/><path d="M10 12.5h2.5"/><path d="M8 8h6"/><path d="M12 2v2"/><path d="M20 12h2"/><path d="M12 20v2"/><path d="M4 12h2"/><path d="m17.5 4.5 1.5 1.5"/><path d="m4.5 17.5 1.5 1.5"/><path d="m6 6 1.5 1.5"/><path d="m16.5 16.5 1.5 1.5"/></svg>`,
        web: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe mr-1"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 0 4 10 15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0-4-10 15.3 15.3 0 0 0 4-10zM2 12h20"/></svg>`
    };
    
    switch (type.toLowerCase()) {
        case 'discord':
            // Discord 버튼의 색상을 변경하려면 btn-discord 클래스의 CSS 정의를 index.html에서 수정하세요.
            return { className: 'btn-discord bg-[#5865F2] text-white hover:bg-blue-700 active:bg-blue-900', label: 'Discord', icon: icons.discord };
        case 'kakao':
            // KakaoTalk 버튼의 색상을 변경하려면 btn-kakao 클래스의 CSS 정의를 index.html에서 수정하세요.
            return { className: 'btn-kakao bg-[#FEE500] text-gray-900 hover:bg-yellow-500 active:bg-yellow-700', label: '카카오톡', icon: icons.kakao };
        case 'web':
        default:
            return { className: 'btn-web bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400', label: '웹사이트', icon: icons.web };
    }
}


// --- 4. 초기화 및 UI 업데이트 함수 ---

/** 사이트 Config에 설정된 텍스트를 HTML 요소에 적용합니다. */
function initializeTextContent() {
    document.getElementById('page-title').textContent = siteConfig.siteTitle;
    document.getElementById('site-title-h1').textContent = siteConfig.siteTitle;
    document.getElementById('site-description-p').textContent = siteConfig.siteDescription;
    
    document.getElementById('top-banner-title-h2').textContent = siteConfig.topBannerTitle;
    document.getElementById('main-banner-title-h2').textContent = siteConfig.mainBannerTitle;

    document.getElementById('filter-category-h3').textContent = siteConfig.filterTitleCategory;
    document.getElementById('filter-tag-h3').textContent = siteConfig.filterTitleTag;

    document.getElementById('no-results-message').textContent = siteConfig.noResultsMessage;
    document.getElementById('reset-button').textContent = siteConfig.resetButtonLabel;
}

/** 햄버거 메뉴(필터 드로어)를 열고 닫습니다. */
function toggleDrawer() {
    filterDrawer.classList.toggle('open');
    const isOpen = filterDrawer.classList.contains('open');

    if (isOpen) {
        drawerOverlay.classList.remove('hidden');
        setTimeout(() => drawerOverlay.style.opacity = '1', 10);
        document.body.style.overflow = 'hidden'; // 스크롤 잠금
    } else {
        hideDrawer();
    }
}
window.toggleDrawer = toggleDrawer; // index.html에서 호출 가능하도록 전역 노출

/** 햄버거 메뉴(필터 드로어)를 닫습니다. */
function hideDrawer() {
    filterDrawer.classList.remove('open');
    drawerOverlay.style.opacity = '0';
    setTimeout(() => drawerOverlay.classList.add('hidden'), 300);
    // 광고 모달이 닫혀있을 경우에만 스크롤을 해제합니다.
    if (!adDetailModal.classList.contains('flex')) {
         document.body.style.overflow = ''; 
    }
}
window.hideDrawer = hideDrawer; // index.html에서 호출 가능하도록 전역 노출


// --- 5. 배너 및 광고 로직 ---

/** 광고 데이터(인라인, 메인, 탑 배너)를 ID로 찾습니다. */
function getAdDataById(id) {
    const combinedData = [...serverData.inlineAds, ...serverData.mainBanners, ...serverData.topBanners];
    
    const item = combinedData.find(a => a.id === id);
    if (!item) return null;

    // 배너 구분을 위한 메타 정보 추가
    const isMainBanner = serverData.mainBanners.some(b => b.id === id);
    const isTopBanner = serverData.topBanners.some(b => b.id === id);
    
    return { 
        id: item.id, 
        title: item.title, 
        // 배너의 경우 subtitle 대신 content를 사용하거나 fallback합니다.
        content: item.content || item.subtitle, 
        url: item.url, 
        image: item.image,
        isBanner: isMainBanner || isTopBanner,
        isTop: isTopBanner
    };
}

/** 배너 및 인라인 광고 클릭 시 상세 모달을 표시합니다. (광고 클릭 기능) */
function showAdDetail(itemId) {
    const item = getAdDataById(itemId);
    if (!item) {
        console.error("아이템 ID를 찾을 수 없습니다:", itemId);
        return;
    } 
    
    document.getElementById('modal-ad-title').textContent = item.title;
    document.getElementById('modal-ad-content').textContent = item.content;
    
    const adImage = document.getElementById('modal-ad-image');
    adImage.src = item.image;
    
    // 이미지 로드 실패 시 플레이스홀더를 표시합니다. (로컬 파일 없을 때 대비)
    const placeholderText = item.title.replace(/ /g, '+');
    const placeholderColor = item.isTop ? '9333ea' : (item.isBanner ? '1D4ED8' : 'DC2626');
    adImage.onerror = () => { adImage.src = `https://placehold.co/800x200/${placeholderColor}/ffffff?text=Image+Load+Fail:+${placeholderText}`; };

    document.getElementById('modal-ad-link').href = item.url;
    
    adDetailModal.classList.remove('hidden');
    adDetailModal.classList.add('flex');
    document.body.style.overflow = 'hidden'; // 스크롤 잠금
}
window.showAdDetail = showAdDetail; // index.html에서 호출 가능하도록 전역 노출

/** 광고 상세 모달을 닫습니다. */
function hideAdDetail() {
    adDetailModal.classList.add('hidden');
    adDetailModal.classList.remove('flex');
    // 드로어가 닫혀있을 경우에만 스크롤을 해제합니다.
    if (!filterDrawer.classList.contains('open')) {
         document.body.style.overflow = ''; 
    }
}
window.hideAdDetail = hideAdDetail; // index.html에서 호출 가능하도록 전역 노출

/** 탑 배너(최고의 서버)를 렌더링하고 로테이션을 시작합니다. */
function renderTopBanner(index) {
    const banner = serverData.topBanners[index];
    if (!banner) return;
    
    // 이미지 로드 실패 시 플레이스홀더를 표시합니다. (로컬 파일 없을 때 대비)
    const placeholderText = banner.title.replace(/ /g, '+');
    const placeholderColor = '9333ea';

    const bannerHtml = `
        <div onclick="showAdDetail('${banner.id}')" 
             class="block w-full h-full relative banner-transition opacity-100 cursor-pointer active:scale-[0.99] rounded-none">
            <img src="${banner.image}" 
                 onerror="this.onerror=null;this.src='https://placehold.co/1200x150/${placeholderColor}/ffffff?text=Image+Load+Fail:+${placeholderText}';" 
                 alt="${banner.title} 배너 이미지" 
                 class="w-full h-full object-cover absolute inset-0 rounded-none">
            <div class="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white p-2">
                <p class="text-sm sm:text-lg font-bold shadow-sm">${banner.title}</p>
                <p class="text-xs sm:text-sm mt-0.5">${banner.subtitle}</p>
            </div>
        </div>
    `;
    topBannerContainer.style.opacity = '0';
    setTimeout(() => {
        topBannerContainer.innerHTML = bannerHtml;
        topBannerContainer.style.opacity = '1';
    }, 500); // 부드러운 전환 효과를 위해 0.5초 대기
}

function startTopBannerRotation() {
    if (!serverData.topBanners || serverData.topBanners.length < 1) { 
        topBannerContainer.innerHTML = `<div class="p-2 text-center text-gray-500 text-xs">등록된 최고 서버 배너가 없습니다.</div>`;
        return;
    }
    const interval = siteConfig.mainBannerRotationInterval || 4000;
    renderTopBanner(currentTopBannerIndex); 
    if (serverData.topBanners.length > 1) {
        setInterval(() => {
            currentTopBannerIndex = (currentTopBannerIndex + 1) % serverData.topBanners.length;
            renderTopBanner(currentTopBannerIndex);
        }, interval);
    }
}

/** 메인 배너(오늘의 추천 서버)를 렌더링하고 로테이션을 시작합니다. */
function renderMainBanner(index) {
    const banner = serverData.mainBanners[index];
    if (!banner) return;

    // 이미지 로드 실패 시 플레이스홀더를 표시합니다. (로컬 파일 없을 때 대비)
    const placeholderText = banner.title.replace(/ /g, '+');
    const placeholderColor = '1D4ED8';

    const bannerHtml = `
        <div onclick="showAdDetail('${banner.id}')" class="block w-full h-full relative banner-transition opacity-100 cursor-pointer active:scale-[0.99] rounded-none">
            <img src="${banner.image}" 
                 onerror="this.onerror=null;this.src='https://placehold.co/1200x300/${placeholderColor}/ffffff?text=Image+Load+Fail:+${placeholderText}';" 
                 alt="${banner.title} 배너 이미지 (GIF 지원)" 
                 class="w-full h-full object-cover absolute inset-0 rounded-none">
            <div class="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center text-white p-4">
                <p class="text-xl sm:text-3xl font-extrabold shadow-sm">${banner.title}</p>
                <p class="text-sm sm:text-lg mt-1 font-medium">${banner.subtitle}</p>
            </div>
        </div>
    `;
    mainBannerContainer.style.opacity = '0';
    setTimeout(() => {
        mainBannerContainer.innerHTML = bannerHtml;
        mainBannerContainer.style.opacity = '1';
    }, 500);
}

function startMainBannerRotation() {
    if (serverData.mainBanners.length < 1) { 
        mainBannerContainer.innerHTML = `<div class="p-4 text-center text-gray-500">등록된 메인 배너가 없습니다.</div>`;
        return;
    }
    if (serverData.mainBanners.length === 1) { renderMainBanner(0); return; }
    const interval = siteConfig.mainBannerRotationInterval || 4000;
    renderMainBanner(currentMainBannerIndex); 
    setInterval(() => {
        currentMainBannerIndex = (currentMainBannerIndex + 1) % serverData.mainBanners.length;
        renderMainBanner(currentMainBannerIndex);
    }, interval);
}


// --- 6. 서버 목록 렌더링 및 필터링 로직 ---

/** 인라인 광고 배너 HTML을 생성합니다. */
function createInlineAdHtml(ad) {
    // 이미지 로드 실패 시 플레이스홀더를 표시합니다. (로컬 파일 없을 때 대비)
    const placeholderText = ad.title.replace(/ /g, '+');
    
    return `
        <div onclick="showAdDetail('${ad.id}')"
            class="block bg-gray-100 border border-red-400 p-3 shadow-md hover:shadow-lg transition duration-200 ease-in-out rounded-none cursor-pointer active:scale-[0.98]">
            <div class="flex items-center space-x-3">
                <img src="${ad.image}" 
                    onerror="this.onerror=null;this.src='https://placehold.co/100x50/DC2626/ffffff?text=AD+Fail';" 
                    alt="${ad.title} 광고" class="w-12 h-12 object-cover border border-red-300 rounded-none flex-shrink-0">
                <div class="flex-grow">
                    <span class="text-xs font-bold text-red-600 bg-red-100 px-2 py-0.5 inline-block border border-red-200 rounded-none">광고</span>
                    <h4 class="text-sm font-bold text-gray-900 line-clamp-1">${ad.title}</h4>
                    <p class="text-xs text-gray-600 line-clamp-1">${ad.content}</p>
                </div>
            </div>
        </div>
    `;
}

/** 서버 목록을 렌더링합니다. (고밀도 UI 적용) */
function renderServers(servers) {
    serverList.innerHTML = '';
    
    if (servers.length === 0) {
        serverList.classList.add('hidden');
        noResults.classList.remove('hidden');
        return;
    }

    serverList.classList.remove('hidden');
    noResults.classList.add('hidden');
    adIndex = 0; // 광고 인덱스 초기화

    servers.forEach((server, index) => {
        // 이미지 로드 실패 시 플레이스홀더를 표시합니다. (로컬 파일 없을 때 대비)
        const placeholderText = server.title.replace(/ /g, '+');
        
        // 서버 카드 HTML 생성
        const communityButtons = server.communities.map(comm => {
            const info = getCommunityInfo(comm.type);
            return `
                <a href="${comm.url}" target="_blank" 
                    class="community-btn ${info.className}"
                    title="${server.title} ${info.label} (${comm.type})"
                    onmousedown="this.classList.add('scale-[0.98]');"
                    onmouseup="this.classList.remove('scale-[0.98]');"
                    ontouchstart="this.classList.add('scale-[0.98]');"
                    ontouchend="this.classList.remove('scale-[0.98]');"
                    >
                    ${info.icon}
                    <span>${info.label}</span>
                </a>
            `;
        }).join('');

        const tagsHtml = server.tags.map(tag => `
            <span class="inline-flex items-center px-1.5 py-0 text-xs font-medium bg-primary text-white border border-primary-dark rounded-none">
                #${tag}
            </span>
        `).join('');
        
        const memberCountHtml = `
            <div class="flex items-center text-xs font-medium text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users mr-1 text-primary-dark"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span class="text-gray-900 font-bold">${formatNumber(server.memberCount)}</span>
            </div>
        `;

        const cardHtml = `
            <div class="server-card bg-white shadow-xl overflow-hidden transform hover:shadow-2xl transition duration-200 ease-in-out border border-gray-200 rounded-none">
                <img src="${server.image}" 
                     onerror="this.onerror=null;this.src='https://placehold.co/400x112/B3B3B3/000000?text=Image+Load+Fail:+${placeholderText}';" 
                     alt="${server.title} 이미지" class="w-full h-28 object-cover border-b border-gray-200">
                <div class="p-2 sm:p-3"> 
                    <div class="flex justify-between items-center mb-1">
                        <div class="flex flex-wrap gap-1">${tagsHtml}</div>
                        ${memberCountHtml}
                    </div>
                    <h3 class="text-base font-bold text-gray-900 mb-0.5 line-clamp-1">${server.title}</h3> 
                    <p class="text-xs text-primary font-bold mb-1 line-clamp-1">${server.category}</p> 
                    <p class="text-gray-600 mb-2 text-xs line-clamp-2">${server.content}</p> 
                    <div class="grid grid-cols-2 gap-1">
                        ${communityButtons}
                    </div>
                </div>
            </div>
        `;
        serverList.insertAdjacentHTML('beforeend', cardHtml);

        // 인라인 광고 삽입 로직: 4개 항목마다 광고 삽입
        if (serverData.inlineAds && serverData.inlineAds.length > 0 && (index + 1) % 4 === 0) {
            const ad = serverData.inlineAds[adIndex % serverData.inlineAds.length];
            const adHtml = `<div class="ad-item">${createInlineAdHtml(ad)}</div>`;
            serverList.insertAdjacentHTML('beforeend', adHtml);
            adIndex++; 
        }
    });
}

/** 필터 버튼 UI를 렌더링하고 클릭 이벤트를 설정합니다. */
function renderFilterButtons() {
    const categoriesContainer = document.getElementById('category-filter');
    const tagsContainer = document.getElementById('tag-filter');

    categoriesContainer.innerHTML = '';
    tagsContainer.innerHTML = '';

    const createFilterButton = (container, type, value, label, isInitialActive = false) => {
        const btn = document.createElement('button');
        btn.setAttribute('data-filter-type', type);
        btn.setAttribute('data-filter-value', value);
        
        // 초기 활성화 상태를 반영합니다.
        const isActive = isInitialActive || (type === 'category' && activeCategory === value) || (type === 'tag' && activeTag === value);
        const activeClass = 'bg-primary text-white hover:bg-primary-dark shadow-md border-primary-dark';
        const inactiveClass = 'bg-white text-gray-700 border-gray-400 hover:bg-gray-100';
        
        btn.className = `filter-btn-${type} filter-btn-base ${isActive ? activeClass : inactiveClass}`;
        btn.textContent = label;

        btn.onclick = () => {
            if (type === 'category') { activeCategory = value; } 
            else if (type === 'tag') { activeTag = value; }
            
            applyFilters();
            hideDrawer(); // 필터 적용 후 드로어 숨기기
        };
        container.appendChild(btn);
    };

    // '전체 보기' 버튼 추가
    createFilterButton(categoriesContainer, 'category', 'all', '전체 보기', true);
    // 설정된 카테고리 버튼 추가
    serverData.config.categories.forEach(category => {
        createFilterButton(categoriesContainer, 'category', category, category);
    });

    // '전체 태그' 버튼 추가
    createFilterButton(tagsContainer, 'tag', 'all', '전체 태그', true);
    // 설정된 태그 버튼 추가
    serverData.config.tags.forEach(tag => {
        createFilterButton(tagsContainer, 'tag', tag, `#${tag}`);
    });
}

/** 검색 입력 필드의 값이 바뀔 때 호출됩니다. (index.html에서 onkeyup으로 연결) */
function handleSearch(event) {
    searchQuery = event.target.value;
    applyFilters();
}
window.handleSearch = handleSearch;

/** 필터링 상태를 초기화합니다. */
function resetFilters() {
    activeCategory = 'all';
    activeTag = 'all';
    document.getElementById('server-search-input').value = '';
    searchQuery = '';
    applyFilters();
}
window.resetFilters = resetFilters;

/** 필터와 검색어에 따라 서버 목록을 필터링하고 렌더링합니다. */
function applyFilters() {
    const search = searchQuery.toLowerCase().trim();

    const filtered = serverData.servers.filter(server => {
        const categoryMatch = activeCategory === 'all' || server.category === activeCategory;
        const tagMatch = activeTag === 'all' || server.tags.includes(activeTag);
        
        // 검색어 필터링: 제목, 내용, 카테고리, 태그 중 하나라도 포함하는지 확인
        const searchMatch = !search || 
                            server.title.toLowerCase().includes(search) ||
                            server.content.toLowerCase().includes(search) ||
                            server.category.toLowerCase().includes(search) ||
                            server.tags.some(tag => tag.toLowerCase().includes(search));

        return categoryMatch && tagMatch && searchMatch;
    });

    // 필터 버튼 활성화 스타일 업데이트
    updateFilterButtonStyles('category', activeCategory, '.filter-btn-category');
    updateFilterButtonStyles('tag', activeTag, '.filter-btn-tag');

    renderServers(filtered);
}

/** 활성화된 필터 버튼의 스타일을 업데이트합니다. */
function updateFilterButtonStyles(type, activeValue, selector) {
    document.querySelectorAll(selector).forEach(btn => {
        const value = btn.getAttribute('data-filter-value');
        const activeClass = 'bg-primary text-white hover:bg-primary-dark shadow-md border-primary-dark';
        const inactiveClass = 'bg-white text-gray-700 border-gray-400 hover:bg-gray-100';

        btn.className = `filter-btn-${type} filter-btn-base ${value === activeValue ? activeClass : inactiveClass}`;
    });
}


// --- 7. 애플리케이션 시작 (On Load) ---

window.onload = function() {
    // 1. 텍스트 설정 초기화
    initializeTextContent();

    // 2. 탑 배너 로테이션 시작
    startTopBannerRotation();
    
    // 3. 메인 배너 로테이션 시작
    startMainBannerRotation();
    
    // 4. 필터 버튼 렌더링 및 이벤트 연결
    renderFilterButtons();
    
    // 5. 초기 서버 목록 로딩 및 필터 적용
    applyFilters(); 
};

