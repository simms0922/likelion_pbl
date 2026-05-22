document.addEventListener("DOMContentLoaded", () => {
    const lionForm = document.getElementById("lionForm");
    const summaryGrid = document.getElementById("summaryGrid");
    const detailList = document.getElementById("detailList");
    const statusText = document.getElementById("statusText");
    const retryBtn = document.getElementById("retryBtn");
    const countText = document.getElementById("countText");
    const emptyState = document.getElementById("emptyState");

    let allLions = [
        {
            name: "심민서",
            part: "Frontend",
            tech: "HTML / CSS, JavaScript, React",
            summary: "프론트엔드 공부 중..",
            intro: "HTML/CSS부터 JavaScript까지, 탄탄한 기초를 바탕으로 사용자에게 안정적인 인터페이스를 제공할 수 있도록 하겠습니다.",
            email: "simms0922@naver.com",
            phone: "010-0000-0000",
            website: "https://github.com/simms0922/likelion_pbl",
            message: "기초부터 단단하게 쌓아 올려, 성과를 내는 개발자가 되겠습니다."
        },
        {
            name: "김아기사자",
            part: "Frontend",
            tech: "JavaScript, HTML / CSS, React",
            summary: "열심히 배우겠습니다!",
            intro: "탄탄한 기초를 바탕으로 사용자에게 안정적인 인터페이스를 제공할 수 있도록 하겠습니다.",
            email: "simms0922@naver.com",
            phone: "010-1111-1111",
            message: "파이팅!"
        },
        {
            name: "이아기사자",
            part: "Backend",
            tech: "Spring, Java, MySQL",
            summary: "열심히 배우겠습니다!",
            intro: "탄탄한 기초를 바탕으로 사용자에게 안정적인 인터페이스를 제공할 수 있도록 하겠습니다.",
            email: "simms0922@naver.com",
            phone: "010-2222-2222",
            message: "기초부터 단단하게!"
        },
        {
            name: "박아기사자",
            part: "Design",
            tech: "Figma, Adobe XD, Photoshop",
            summary: "열심히 배우겠습니다!",
            intro: "탄탄한 기초를 바탕으로 사용자에게 안정적인 인터페이스를 제공할 수 있도록 하겠습니다.",
            email: "simms0922@naver.com",
            phone: "010-3333-3333",
            message: "디자인 끝판왕!"
        },
        {
            name: "최아기사자",
            part: "Frontend",
            tech: "TypeScript, HTML / CSS, React",
            summary: "열심히 배우겠습니다!",
            intro: "탄탄한 기초를 바탕으로 사용자에게 안정적인 인터페이스를 제공할 수 있도록 하겠습니다.",
            email: "simms0922@naver.com",
            phone: "010-4444-4444",
            message: "함께 성장해요!"
        },
        {
            name: "정아기사자",
            part: "Backend",
            tech: "Node.js, Java, MySQL",
            summary: "열심히 배우겠습니다!",
            intro: "탄탄한 기초를 바탕으로 사용자에게 안정적인 인터페이스를 제공할 수 있도록 하겠습니다.",
            email: "simms0922@naver.com",
            phone: "010-5555-5555",
            message: "백엔드 마스터!"
        },
        {
            name: "오아기사자",
            part: "Frontend",
            tech: "React, JavaScript, HTML / CSS",
            summary: "열심히 배우겠습니다!",
            intro: "탄탄한 기초를 바탕으로 사용자에게 안정적인 인터페이스를 제공할 수 있도록 하겠습니다.",
            email: "simms0922@naver.com",
            phone: "010-6666-6666",
            message: "리액트 장인!"
        },
        {
            name: "심아기사자",
            part: "Frontend",
            tech: "HTML / CSS, JavaScript, React",
            summary: "열심히 배우겠습니다!",
            intro: "탄탄한 기초를 바탕으로 사용자에게 안정적인 인터페이스를 제공할 수 있도록 하겠습니다.",
            email: "simms0922@naver.com",
            phone: "010-7777-7777",
            message: "코드 짜는 게 즐거워요!"
        },
        {
            name: "장아기사자",
            part: "Frontend",
            tech: "HTML / CSS, JavaScript, React",
            summary: "열심히 배우겠습니다!",
            intro: "탄탄한 기초를 바탕으로 사용자에게 안정적인 인터페이스를 제공할 수 있도록 하겠습니다.",
            email: "simms0922@naver.com",
            phone: "010-8888-8888",
            message: "끝까지 달립니다!"
        }
    ];

    let lastRequest = null;

    function init() {
        updateUI();
    }

    async function fetchLions(count, isRefresh = false) {
        toggleLoading(true);
        lastRequest = () => fetchLions(count, isRefresh);

        try {
            const res = await fetch(`https://randomuser.me/api/?results=${count}`);
            if (!res.ok) throw new Error("네트워크 응답 오류");
            const data = await res.json();

            const newLions = data.results.map(user => {
                const parts = ["Frontend", "Backend", "Design"];
                const part = parts[Math.floor(Math.random() * parts.length)];
                const location = `${user.location.country} ${user.location.city}`;

                let tech, intro, message;

                if (part === "Frontend") {
                    tech = "React, TypeScript, Next.js";
                    intro = "사용자 경험을 최우선으로 생각하는 프론트엔드 개발자입니다.";
                    message = "눈에 보이는 가치를 코드로 구현합니다! ✨";
                } else if (part === "Backend") {
                    tech = "Spring Boot, MySQL, Redis";
                    intro = "안정적이고 확장 가능한 서버 인프라 구축에 관심이 많습니다.";
                    message = "데이터의 흐름을 설계하는 즐거움을 느낍니다. 🛠️";
                } else {
                    tech = "Figma, Adobe XD, GUI";
                    intro = "심미성과 기능성의 완벽한 조화를 추구하는 디자이너입니다.";
                    message = "사용자의 마음을 움직이는 디자인을 만듭니다. 🎨";
                }

                return {
                    name: `${user.name.first} ${user.name.last}`,
                    part: part,
                    tech: tech,
                    summary: `${part} · ${location}에서 합류했어요!`,
                    intro: intro,
                    email: user.email,
                    phone: user.phone,
                    website: "https://github.com/likelion",
                    message: message
                };
            });

            if (isRefresh) allLions = newLions;
            else allLions = [...allLions, ...newLions];

            updateUI();
            showStatus("준비 완료");
        } catch (error) {
            showStatus(`불러오기 실패: ${error.message}`, true);
        } finally {
            toggleLoading(false);
        }
    }

    function updateUI() {
        const filter = document.getElementById("filterPart").value;
        const sort = document.getElementById("sortOrder").value;
        const query = document.getElementById("searchInput").value.toLowerCase();

        let filtered = allLions.filter(lion => {
            const matchesPart = filter === "all" || lion.part === filter;
            const matchesSearch = lion.name.toLowerCase().includes(query);
            return matchesPart && matchesSearch;
        });

        if (sort === "name") {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        } else {
            filtered = [...filtered].reverse(); 
        }

        render(filtered);
    }

    function render(data) {
        summaryGrid.innerHTML = "";
        detailList.innerHTML = "";
        countText.textContent = `총 ${allLions.length}명`;

        if (data.length === 0 && allLions.length > 0) emptyState.classList.remove("hidden");
        else emptyState.classList.add("hidden");

        data.forEach(lion => {
            const skills = lion.tech.split(",");
            const summaryHtml = `
                <article class="profile-card ${lion.name === '심민서' ? 'my-card' : ''}">
                    <div class="image-container">
                        <img src="./image.jpg" alt="프로필">
                        <span class="badge">${skills[0].trim()}</span>
                    </div>
                    <h2>${lion.name}</h2>
                    <h4 class="part-text">${lion.part}</h4>
                    <p>${lion.summary}</p>
                </article>
            `;
            summaryGrid.insertAdjacentHTML("beforeend", summaryHtml);

            const detailHtml = `
                <article class="introduce">
                    <div class="info-group"><h1>${lion.name}</h1><h3>${lion.part}</h3><h4>멋쟁이사자처럼</h4></div>
                    <div class="content-section"><h3>자기소개</h3><p>${lion.intro}</p></div>
                    <div class="content-section"><h3>관심 기술</h3><ul>${skills.map(s => `<li>${s.trim()}</li>`).join("")}</ul></div>
                    <div class="content-section"><h3>연락처</h3><p>Email: ${lion.email} | Phone: ${lion.phone}</p></div>
                </article>
            `;
            detailList.insertAdjacentHTML("beforeend", detailHtml);
        });
    }

    function toggleLoading(isLoading) {
        statusText.textContent = isLoading ? "불러오는 중..." : "준비 완료";
        document.querySelectorAll(".api-controls button").forEach(btn => btn.disabled = isLoading);
        if (isLoading) retryBtn.classList.add("hidden");
    }

    function showStatus(msg, isFail = false) {
        statusText.textContent = msg;
        if (isFail) retryBtn.classList.remove("hidden");
    }

    document.getElementById("toggleFormBtn").addEventListener("click", () => lionForm.classList.toggle("hidden"));
    document.getElementById("deleteBtn").addEventListener("click", () => {
        if(allLions.length > 0) {
            allLions.pop();
            updateUI();
        }
    });
    document.getElementById("randomOneBtn").addEventListener("click", () => fetchLions(1));
    document.getElementById("randomFiveBtn").addEventListener("click", () => fetchLions(5));
    document.getElementById("refreshBtn").addEventListener("click", () => fetchLions(5, true));
    retryBtn.addEventListener("click", () => lastRequest());
    
    document.getElementById("searchInput").addEventListener("input", updateUI);
    document.getElementById("filterPart").addEventListener("change", updateUI);
    document.getElementById("sortOrder").addEventListener("change", updateUI);

    document.getElementById("autoFillBtn").addEventListener("click", async () => {
        const btn = document.getElementById("autoFillBtn");
        btn.textContent = "채우는 중..."; 
        btn.disabled = true;

        try {
            const res = await fetch("https://randomuser.me/api/?results=1&nat=us,gb,ca,au,nz");
            const data = await res.json();
            const user = data.results[0];

            const part = ["Frontend", "Backend", "Design"][Math.floor(Math.random() * 3)];
            const location = `${user.location.country} ${user.location.city}`;

            document.getElementById("name").value = `${user.name.first} ${user.name.last}`;
            document.getElementById("part").value = part;
            document.getElementById("email").value = user.email;
            document.getElementById("phone").value = user.phone;
            document.getElementById("website").value = `https://github.com/${user.login.username}`;
            document.getElementById("summary").value = `${part} · ${location}에서 합류했어요!`;
            document.getElementById("skills").value = part === "Frontend" ? "React, JS, CSS" : (part === "Backend" ? "Java, Spring, MySQL" : "Figma, UI/UX");
            document.getElementById("intro").value = `안녕하세요! ${location}에서 온 ${part} 개발자입니다. API로 데이터를 채워보았습니다.`;
            document.getElementById("message").value = "데이터가 바뀌면 UI도 바뀐다! 🔥";

        } catch (error) {
            alert("데이터를 불러오지 못했습니다.");
        } finally {
            btn.textContent = "랜덤 값 채우기";
            btn.disabled = false;
        }
    });

    document.getElementById("cancelBtn").addEventListener("click", () => {
        lionForm.classList.add("hidden");
        lionForm.reset();
    });

    lionForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const newLion = {
            name: document.getElementById("name").value,
            part: document.getElementById("part").value,
            tech: document.getElementById("skills").value,
            summary: document.getElementById("summary").value,
            intro: document.getElementById("intro").value,
            email: "test@example.com", phone: "010-0000-0000"
        };
        allLions.push(newLion);
        updateUI();
        lionForm.reset();
        lionForm.classList.add("hidden");
    });

    init();
});