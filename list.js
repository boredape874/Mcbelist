// list.js
// =========================================================================
// 마인크래프트 서버 리스트 앱의 핵심 로직과 모든 데이터를 관리하는 파일입니다.
// 서버 데이터 및 개별 슬라이드 배너 로직이 포함됩니다.
// =========================================================================

// --- 1. 전역 데이터 및 설정 영역 (사용자가 제공한 데이터로 업데이트) ---
const serverData = {
    // A. 사이트 전체 설정 (텍스트, 타이틀, 속도 등)
    siteConfig: {
        siteTitle: '마인크래프트 커뮤니티 서버 리스트',
        siteDescription: '최신 마인크래프트 커뮤니티 소식을 빠르게 확인하세요.(보드제작)',
        topBannerTitle:'하반기 최고의 서버(광고)', // 최고의 서버 섹션 제목 (광고)
        mainBannerTitle: '오늘의 추천 서버', // 오늘의 추천 서버 섹션 제목 (배너)
        filterTitleCategory: '서버 종류',
        filterTitleTag: '태그',
        noResultsMessage: '현재 선택하신 필터/검색어에 해당하는 서버가 없습니다.',
        resetButtonLabel: '초기화',
        
        // 배너 슬라이드 전환 시간 설정을 분리했습니다.
        topBannerRotationInterval: 4000, // 최고의 서버 (광고) 전환 시간 (밀리초, 4초)
        mainBannerRotationInterval: 3000, // 추천 서버 (배너) 전환 시간 (밀리초, 3초)
    },

    // B. 필터 종류 설정 (카테고리 및 태그)
    config: {
        // 서버 카테고리(서버 종류)를 추가/삭제/수정할 수 있습니다.
        categories: [ '평지생존', '국가전쟁', '야생/RPG', '미니게임', '건축/크리에이티브', '자유 주제' ],
        // 태그를 추가/삭제/수정할 수 있습니다.
        tags: [ '인기', '신규', '이벤트', '개발 중' ]
    },

    // C. 최고의 서버 (광고) 배너 데이터
    topBanners: [
        { id: 'top_001', title: '베드락 최대 규모 국가전쟁', subtitle: '지금 바로 접속하여 특별한 혜택을 받으세요!', 
          image: 'images/제목을-입력해주세요_-001(27).png', 
          url: 'https://open.kakao.com/o/gRUC0Reh', 
          content: '베드락 최대규모 국가전쟁 서버입니다.' },
        { id: 'top_002', title: '🚀 프리미엄 서버 독점 공개!', subtitle: '특별한 혜택을 놓치지 마세요!', 
          image: 'images/banner_top_02.png', 
          url: 'https://example.com/top-server-ad-2', 
          content: '새로운 서버가 최고의 서버 배너에 등록되었습니다! 론칭 이벤트 참여 기회를 잡으세요.' }
    ],

    // D. 오늘의 추천 서버 (배너) 데이터
    mainBanners: [
        { id: 'main_001', title: '✨ 주간 인기 서버 랭킹 1위!', subtitle: '3초마다 자동으로 교체됩니다.', 
          image: 'images/banner_main_01.gif', 
          url: 'https://example.com/weekly-event', 
          content: '주간 인기 서버 랭킹 1위! 상세 내용 확인 및 접속은 여기에서!' },
        { id: 'main_002', title: '🎁 신규 유저 특별 지원!', subtitle: '모던하고 각진 디자인으로 한눈에 서버 정보를 확인하세요.', 
          image: 'images/banner_main_02.png', 
          url: 'https://example.com/new-user-guide', 
          content: '신규 유저를 위한 웰컴 패키지가 준비되어 있습니다. 지금 바로 확인하세요.' }
    ],

    // E. 실제 서버 목록 사이에 삽입되는 인라인 광고 데이터
    inlineAds: [
        { id: 'ad_001', title: '프리미엄 서버 호스팅! 20% 할인 이벤트!', 
          content: '렉 없는 환경을 원한다면 지금 바로 호스팅 서비스 확인하세요! 최고의 안정성과 속도를 보장합니다.', 
          image: 'images/ad_hosting.png', 
          url: 'https://example.com/hosting-ad' },
        { id: 'ad_002', title: '새로운 마인크래프트 런처 출시!', 
          content: '더욱 편리해진 기능과 UI를 경험해보세요. 원클릭 설치, 자동 업데이트, 사용자 정의 테마 지원!', 
          image: 'images/ad_launcher.png', 
          url: 'https://example.com/launcher-ad' }
    ],

    // F. 실제 서버 목록 데이터 (가장 중요)
    servers: [
        { id: 'mc_001', title: '베드락 코어 국가전쟁', content: '베드락 최대 규모 국가전쟁 서버입니다. 새롭게 국가 시스템을 도입하여 플레이어 간의 경쟁을 극대화했습니다.', category: '국가전쟁', tags: ['인기', '신규'], memberCount: 270, // 인원수
          image: 'images/제목을-입력해주세요_-001(27).png', 
          communities: [{ type: 'Discord', url:'https://discord.gg/p77tCgSdqC' }, { type: 'Kakao', url: 'https://open.kakao.com/o/gRUC0Reh' }] },
        { id: 'mc_002', title: '파이브의 베드락 평지생존', content: '파이브의 평지생존에서 신나게 즐겨보세요. 넓은 평지 맵에서 나만의 건축물을 짓고 생존하는 재미!', category: '평지생존', tags: ['이벤트'], memberCount: 190, // 인원수
          image: 'images/1759062239695.png', 
          communities: [{ type: 'Kakao', url: 'https://open.kakao.com/o/gWMaUZuh' }] },
        { id: 'mc_003', title: '판타지 건축 프로젝트', content: '창의적인 건축가들을 위한 서버입니다. 정기적인 건축 대회를 통해 실력을 뽐내세요.', category: '건축/크리에이티브', tags: ['신규', '개발 중'], memberCount: 92, // 인원수
          image: 'images/server_mc_003.png', 
          communities: [{ type: 'Discord', url: 'https://discord.gg/example-build' }, { type: 'Kakao', url: 'https://open.kakao.com/o/example-build-chat' }] },
        { id: 'mc_004', title: '자유 소통 광장', content: '마인크래프트에 관련된 모든 주제로 자유롭게 소통하는 오픈 채팅방입니다. 부담없이 들어오세요! 매일 활발하게 채팅이 이어지고 있습니다.', category: '자유 주제', tags: ['신규'], memberCount: 220, // 인원수
          image: 'images/server_mc_004.png', 
          communities: [{ type: 'Kakao', url: 'https://open.kakao.com/o/example-free' }] },
    ]
};
// --- 전역 데이터 및 설정 영역 끝 ---


// --- 2. 전역 상태 및 DOM 요소 참조 ---
const siteConfig = serverData.siteConfig;
const serverList = document.getElementById('server-list');
const noResults = document.getElementById('no-results');

// 분리된 배너 컨테이너 참조
const topBannerContainer = document.getElementById('top-banner-content');
const mainBannerContainer = document.getElementById('main-banner-content');

const adDetailModal = document.getElementById('ad-detail-modal');
const filterDrawer = document.getElementById('filter-drawer');
const drawerOverlay = document.getElementById('drawer-overlay');

let activeCategory = 'all';
let activeTag = 'all';
let searchQuery = '';

// 분리된 슬라이더 상태 관리
let currentTopBannerIndex = 0;
let topBannerInterval = null;
let currentMainBannerIndex = 0;
let mainBannerInterval = null;


// --- 3. 유틸리티 함수 ---

/** 숫자를 천 단위로 콤마를 넣어 포맷합니다. (예: 1500 -> 1,500) */
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** 커뮤니티 타입에 따른 버튼 스타일과 아이콘을 반환합니다. (KakaoTalk/Message 스타일) */
function getCommunityInfo(type) {
    const icons = {
        message: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-circle text-primary-dark"><path d="M7.9 20A10.1 10.1 0 0 1 12 21c5.5 0 10-4.5 10-10C22 5.5 17.5 1 12 1S2 5.5 2 11c0 2.6 1 5 2.6 6.8L3 21z"/></svg>`,
        web: `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-globe text-gray-700"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 0 4 10 15.3 15.3 0 0 0-4 10 15.3 15.3 0 0 0-4-10 15.3 15.3 0 0 0 4-10zM2 12h20"/></svg>`
    };
    
    switch (type.toLowerCase()) {
        case 'discord':
            return { className: 'bg-primary-light text-primary-dark hover:bg-primary/20', label: 'Discord', icon: icons.message };
        case 'kakao':
            return { className: 'bg-primary-light text-primary-dark hover:bg-primary/20', label: '카카오톡', icon: icons.message };
        case 'web':
        default:
            return { className: 'bg-white text-gray-700 hover:bg-gray-100', label: '웹사이트', icon: icons.web };
    }
}


// --- 4. 초기화 및 UI 업데이트 함수 ---

/** 사이트 Config에 설정된 텍스트를 HTML 요소에 적용합니다. */
function initializeTextContent() {
    document.getElementById('page-title').textContent = siteConfig.siteTitle;
    document.getElementById('site-title-h1').textContent = siteConfig.siteTitle;
    document.getElementById('site-description-p').textContent = siteConfig.siteDescription;
    
    // 분리된 배너 제목 설정
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
        document.body.style.overflow = 'hidden'; 
    } else {
        hideDrawer();
    }
}
window.toggleDrawer = toggleDrawer; 

/** 햄버거 메뉴(필터 드로어)를 닫습니다. */
function hideDrawer() {
    filterDrawer.classList.remove('open');
    drawerOverlay.style.opacity = '0';
    setTimeout(() => drawerOverlay.classList.add('hidden'), 300);
    document.body.style.overflow = ''; 
}
window.hideDrawer = hideDrawer; 


// --- 5. 배너 및 광고 로직 (단일 슬라이드 구현) ---

function getAdDataById(id) {
    // 모든 배너와 광고를 통합하여 검색
    const combinedData = [...serverData.mainBanners, ...serverData.topBanners, ...serverData.inlineAds];
    const item = combinedData.find(a => a.id === id);
    if (!item) return null;

    const isTopBanner = serverData.topBanners.some(b => b.id === id);
    
    return { 
        id: item.id, 
        title: item.title, 
        content: item.content || item.subtitle, 
        url: item.url, 
        image: item.image,
        isTop: isTopBanner
    };
}

function showAdDetail(itemId) {
    const item = getAdDataById(itemId);
    if (!item) { console.error("아이템 ID를 찾을 수 없습니다:", itemId); return; } 
    
    document.getElementById('modal-ad-title').textContent = item.title;
    document.getElementById('modal-ad-content').textContent = item.content;
    
    const adImage = document.getElementById('modal-ad-image');
    // TopBanner는 어두운 파랑 (광고), MainBanner는 밝은 파랑 (추천) 계열로 구분
    const placeholderColor = item.isTop ? '3D5ECF' : '5F82FF'; 
    
    adImage.src = item.image;
    adImage.onerror = () => { adImage.src = `https://placehold.co/800x200/${placeholderColor}/ffffff?text=배너+이미지+로드+실패`; };

    document.getElementById('modal-ad-link').href = item.url;
    
    adDetailModal.classList.remove('hidden');
    adDetailModal.classList.add('flex');
    document.body.style.overflow = 'hidden'; // 스크롤 잠금
}
window.showAdDetail = showAdDetail; 

function hideAdDetail() {
    adDetailModal.classList.add('hidden');
    adDetailModal.classList.remove('flex');
    if (!filterDrawer.classList.contains('open')) {
         document.body.style.overflow = ''; 
    }
}
window.hideAdDetail = hideAdDetail; 

/** 단일 슬라이드 트랙을 렌더링하고 DOM에 추가합니다. */
function renderBanners(banners, containerElement, trackId, isTopBanner) {
    if (!banners || banners.length === 0) {
        containerElement.innerHTML = `<div class="p-4 text-center text-gray-500">등록된 배너가 없습니다.</div>`;
        return null;
    }
    
    const track = document.createElement('div');
    track.id = trackId;
    track.className = 'slider-track'; // CSS transition defined in index.html
    // 모든 슬라이드가 100% 폭을 차지하도록 전체 트랙 너비를 설정 (배너 개수 * 100%)
    track.style.width = `${banners.length * 100}%`; 
    track.style.transform = 'translateX(0)';

    // Generate individual slides
    const slidesHtml = banners.map((banner) => {
        const placeholderBg = isTopBanner ? '3D5ECF' : '5F82FF';
        const titleSize = isTopBanner ? 'text-xl sm:text-2xl' : 'text-xl sm:text-3xl'; 
        const subtitleSize = isTopBanner ? 'text-xs sm:text-sm' : 'text-sm sm:text-lg';
        const contentBg = isTopBanner ? 'bg-primary-dark' : 'bg-primary'; 
        const label = isTopBanner ? '광고' : '추천';

        return `
            <div onclick="showAdDetail('${banner.id}')" 
                 style="width: ${100 / banners.length}%;"
                 class="flex-shrink-0 block h-full relative cursor-pointer active:scale-[0.99]">
                <!-- 배너 꽉 채움, 모서리 둥글게 처리 제거 -->
                <img src="${banner.image}" 
                     onerror="this.onerror=null;this.src='https://placehold.co/1200x300/${placeholderBg}/ffffff?text=${label}+이미지+로드+실패';" 
                     alt="${banner.title} 배너 이미지" 
                     class="w-full h-full object-cover absolute inset-0">
                <div class="absolute inset-0 ${contentBg} bg-opacity-70 flex flex-col justify-center items-center text-white p-2">
                    <p class="text-xs font-light mb-1 border px-2 py-0.5 rounded-full border-white/50">${label}</p>
                    <p class="${titleSize} font-extrabold shadow-sm">${banner.title}</p>
                    <p class="${subtitleSize} mt-0.5">${banner.subtitle}</p>
                </div>
            </div>
        `;
    }).join('');

    track.innerHTML = slidesHtml;
    containerElement.innerHTML = ''; // Clear loading text
    containerElement.appendChild(track);

    return track;
}

/** 개별 슬라이더 전환 로직 (각 배너 섹션에 대해 독립적으로 호출됨) */
function startSliderRotation(banners, trackElement, intervalTime, isTopBanner) {
    // 배너가 2개 미만이면 슬라이드 로직을 실행하지 않습니다.
    if (!trackElement || banners.length < 2) return; 

    const totalBanners = banners.length;
    
    let currentIndex;
    let intervalId;

    if (isTopBanner) {
        currentIndex = currentTopBannerIndex;
        intervalId = topBannerInterval;
    } else {
        currentIndex = currentMainBannerIndex;
        intervalId = mainBannerInterval;
    }

    // Clear any existing interval
    if (intervalId) clearInterval(intervalId);

    // Set up the interval function
    const rotationFn = () => {
        // 인덱스를 순환
        currentIndex = (currentIndex + 1) % totalBanners;
        
        // 100% 기준으로 트랙을 이동시킵니다. (전체 슬라이드 효과)
        const translateXValue = -(currentIndex * 100); 
        trackElement.style.transform = `translateX(${translateXValue}%)`;
        
        // 전역 상태 업데이트
        if (isTopBanner) {
            currentTopBannerIndex = currentIndex;
        } else {
            currentMainBannerIndex = currentIndex;
        }
    };

    // Start rotation
    intervalId = setInterval(rotationFn, intervalTime);

    if (isTopBanner) {
        topBannerInterval = intervalId;
    } else {
        mainBannerInterval = intervalId;
    }
}


// --- 6. 서버 목록 렌더링 및 필터링 로직 (통이미지 카드 적용) ---

/** 인라인 광고 카드를 렌더링합니다. */
function renderInlineAd(ad) {
     if (!ad) return '';

     // 배경색: 주황색 계열 (보조 강조색)
     const placeholderBg = 'F59E0B'; 
     const placeholderText = 'FFFFFF'; 
     
     // 인라인 광고도 꽉 찬 느낌으로 변경
     return `
        <div onclick="showAdDetail('${ad.id}')" 
            class="server-card bg-white shadow-md hover:shadow-lg overflow-hidden transform hover:scale-[1.01] transition duration-200 ease-in-out border border-secondary rounded-xl cursor-pointer">
            <div class="flex flex-col sm:flex-row items-center p-3 sm:p-4">
                <div class="flex-shrink-0 mb-3 sm:mb-0 sm:mr-4 w-16 h-16 sm:w-20 sm:h-20 overflow-hidden rounded-lg border-2 border-secondary/50">
                    <img src="${ad.image}" 
                         onerror="this.onerror=null;this.src='https://placehold.co/96x96/${placeholderBg}/${placeholderText}?text=AD';" 
                         alt="${ad.title} 광고 이미지" class="w-full h-full object-cover">
                </div>
                <div class="flex-grow">
                    <div class="flex justify-between items-center mb-1">
                         <h3 class="text-base sm:text-lg font-extrabold text-secondary line-clamp-1">${ad.title}</h3>
                         <span class="text-xs font-semibold text-secondary/80 ml-2 border border-secondary/50 px-2 py-0.5 rounded-full">광고</span>
                    </div>
                    <p class="text-gray-600 mb-1 text-xs sm:text-sm line-clamp-2">${ad.content}</p> 
                    <a href="${ad.url}" target="_blank" class="text-primary-dark text-xs sm:text-sm font-bold hover:underline">
                        자세히 보기 &rarr;
                    </a>
                </div>
            </div>
        </div>
     `;
}

/** 서버 목록을 렌더링합니다. (통이미지 카드 스타일 - 인원수 반영 및 컴팩트) */
function renderServers(servers) {
    serverList.innerHTML = '';
    
    if (servers.length === 0) {
        serverList.classList.add('hidden');
        noResults.classList.remove('hidden');
        return;
    }

    serverList.classList.remove('hidden');
    noResults.classList.add('hidden');
    
    let adIndex = 0;
    const inlineAds = serverData.inlineAds;

    servers.forEach((server, index) => {
        // --- 1. 인라인 광고 삽입 로직 (3번째 카드마다) ---
        if (index > 0 && index % 3 === 0 && inlineAds.length > 0) {
            const ad = inlineAds[adIndex % inlineAds.length];
            serverList.insertAdjacentHTML('beforeend', renderInlineAd(ad));
            adIndex++;
        }

        // --- 2. 서버 카드 렌더링 (이미지 중심) ---
        const placeholderBg = 'E8F0FF'; 
        const placeholderText = '5F82FF'; 
        
        // 커뮤니티 버튼
        const communityButtons = server.communities.map(comm => {
            const info = getCommunityInfo(comm.type);
            return `
                <a href="${comm.url}" target="_blank" 
                    class="community-btn ${info.className} w-full"
                    title="${server.title} ${info.label} 접속"
                    >
                    ${info.icon}
                    <span class="ml-2 font-semibold text-gray-700">${info.label}</span>
                </a>
            `;
        }).join('');

        // 태그
        const tagsHtml = server.tags.map(tag => `
            <span class="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-primary-light text-primary-dark border border-primary/30 rounded-full">
                #${tag}
            </span>
        `).join('');
        
        // 최종 카드 HTML (통이미지 카드, 크기 및 그림자 감소)
        const cardHtml = `
            <div class="server-card bg-white shadow-md hover:shadow-lg overflow-hidden transform hover:scale-[1.03] transition duration-200 ease-in-out border border-gray-100 rounded-xl">
                
                <!-- 2-1. 통이미지 영역 (높이 h-32로 축소) -->
                <div class="relative w-full h-32 overflow-hidden">
                    <img src="${server.image}" 
                        onerror="this.onerror=null;this.src='https://placehold.co/600x400/${placeholderBg}/${placeholderText}?text=서버+이미지';" 
                        alt="${server.title} 이미지" class="w-full h-full object-cover transition duration-300 hover:scale-105">
                    
                    <!-- 인원수 뱃지 (이미지 위에 오버레이) -->
                    <div class="absolute top-2 right-2 bg-white/90 backdrop-blur-sm shadow-md rounded-lg p-2 flex items-center border border-gray-200">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-users text-primary-dark mr-1"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                        <!-- '인원수'로 텍스트 변경 -->
                        <span class="text-sm font-bold text-primary-dark">${formatNumber(server.memberCount)}명</span>
                    </div>
                </div>

                <!-- 2-2. 상세 내용 영역 (패딩 축소) -->
                <div class="p-3">
                    
                    <!-- 카테고리 & 제목 -->
                    <div class="flex justify-between items-start mb-1">
                        <span class="text-xs font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">${server.category}</span>
                    </div>
                    
                    <h3 class="text-lg font-extrabold text-gray-900 mb-1 line-clamp-2">${server.title}</h3> 

                    <!-- 내용 및 태그 -->
                    <p class="text-gray-600 mb-2 text-sm line-clamp-3">${server.content}</p> 
                    <div class="flex flex-wrap gap-2 mb-3">
                        ${tagsHtml}
                    </div>

                    <!-- 커뮤니티 버튼 -->
                    <div class="grid grid-cols-2 gap-2 mt-2">
                        ${communityButtons}
                    </div>
                </div>
            </div>
        `;
        serverList.insertAdjacentHTML('beforeend', cardHtml);
    });
}

/** 필터 버튼 UI를 렌더링하고 클릭 이벤트를 설정합니다. */
function renderFilterButtons() {
    const categoriesContainer = document.getElementById('category-filter');
    const tagsContainer = document.getElementById('tag-filter');

    categoriesContainer.innerHTML = '';
    tagsContainer.innerHTML = '';

    const createFilterButton = (container, type, value, label) => {
        const btn = document.createElement('button');
        btn.setAttribute('data-filter-type', type);
        btn.setAttribute('data-filter-value', value);
        
        const isActive = (type === 'category' && activeCategory === value) || (type === 'tag' && activeTag === value);
        
        const activeClass = 'bg-primary text-white hover:bg-primary-dark border-primary-dark shadow-md';
        const inactiveClass = 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100';
        
        btn.className = `filter-btn-${type} filter-btn-base ${isActive ? activeClass : inactiveClass}`;
        btn.textContent = label;

        btn.onclick = () => {
            if (type === 'category') { activeCategory = value; } 
            else if (type === 'tag') { activeTag = value; }
            
            applyFilters();
            hideDrawer(); 
        };
        container.appendChild(btn);
    };

    // '전체 보기' 버튼 추가
    createFilterButton(categoriesContainer, 'category', 'all', '전체');
    serverData.config.categories.forEach(category => {
        createFilterButton(categoriesContainer, 'category', category, category);
    });

    // '전체 태그' 버튼 추가
    createFilterButton(tagsContainer, 'tag', 'all', '전체');
    serverData.config.tags.forEach(tag => {
        createFilterButton(tagsContainer, 'tag', tag, `#${tag}`);
    });
}

/** 필터링 로직 */
function handleSearch(event) {
    searchQuery = event.target.value;
    applyFilters();
}
window.handleSearch = handleSearch;

function resetFilters() {
    activeCategory = 'all';
    activeTag = 'all';
    document.getElementById('server-search-input').value = '';
    searchQuery = '';
    applyFilters();
}
window.resetFilters = resetFilters;

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

function updateFilterButtonStyles(type, activeValue, selector) {
    document.querySelectorAll(selector).forEach(btn => {
        const value = btn.getAttribute('data-filter-value');
        const activeClass = 'bg-primary text-white hover:bg-primary-dark border-primary-dark shadow-md';
        const inactiveClass = 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100';

        btn.className = `filter-btn-${type} filter-btn-base ${value === activeValue ? activeClass : inactiveClass}`;
    });
}


// --- 7. 애플리케이션 시작 (On Load) ---

window.onload = function() {
    console.log("SUCCESS: 마인리스트 네오 둥근모 UI 로드 완료. Full Width 및 컴팩트 카드 디자인 적용."); 
    
    // 1. 텍스트 설정 초기화
    initializeTextContent();

    // 2. Top Banner (광고) 슬라이드 설정 및 시작
    const topBannerTrack = renderBanners(serverData.topBanners, topBannerContainer, 'top-banner-slider-track', true);
    if (topBannerTrack) {
        // 배너가 2개 이상일 경우에만 슬라이드 시작
        startSliderRotation(serverData.topBanners, topBannerTrack, siteConfig.topBannerRotationInterval, true);
    }

    // 3. Main Banner (추천) 슬라이드 설정 및 시작
    const mainBannerTrack = renderBanners(serverData.mainBanners, mainBannerContainer, 'main-banner-slider-track', false);
    if (mainBannerTrack) {
        // 배너가 2개 이상일 경우에만 슬라이드 시작
        startSliderRotation(serverData.mainBanners, mainBannerTrack, siteConfig.mainBannerRotationInterval, false);
    }
    
    // 4. 필터 버튼 렌더링 및 이벤트 연결
    renderFilterButtons();
    
    // 5. 초기 서버 목록 로딩 및 필터 적용
    applyFilters(); 
};

