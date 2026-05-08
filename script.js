document.addEventListener("DOMContentLoaded", () => {

    const toggleFormBtn = document.getElementById("toggleFormBtn");

    const lionForm = document.getElementById("lionForm");

    const cancelBtn = document.getElementById("cancelBtn");

    const summaryGrid = document.getElementById("summaryGrid");

    const detailList = document.getElementById("detailList");

    const deleteBtn = document.getElementById("deleteBtn");

    const countText = document.getElementById("countText");

    let lionData = [];

    const cards = summaryGrid.querySelectorAll(".profile-card");

    cards.forEach(card => {

        const name = card.querySelector("h2").textContent;

        const part = card.querySelector("h4").textContent;

        const summary = card.querySelector("p").textContent;

        lionData.push({
            name,
            part,
            summary
        });
    });

    // 총 인원 표시
    function updateCount() {
        countText.textContent = `총 ${lionData.length}명`;
    }

    // 페이지 처음 로드 시 실행
    updateCount();

    // 폼 열기/닫기
    toggleFormBtn.addEventListener("click", () => {
        lionForm.classList.toggle("hidden");
    });

    cancelBtn.addEventListener("click", () => {
        lionForm.classList.add("hidden");
    });

    // 추가하기
    lionForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const name = document.getElementById("name").value;

        const part = document.getElementById("part").value;

        const skills = document.getElementById("skills").value;

        const summary = document.getElementById("summary").value;

        const intro = document.getElementById("intro").value;

        const email = document.getElementById("email").value;

        const phone = document.getElementById("phone").value;

        const website = document.getElementById("website").value;

        const message = document.getElementById("message").value;

        const skillArray = skills.split(",");

        // 요약 카드 생성
        const summaryCard = document.createElement("article");

        summaryCard.className = "profile-card";

        summaryCard.innerHTML = `
            <div class="image-container">
                <img src="./image.jpg" alt="프로필">
                <span class="badge">${skillArray[0]}</span>
            </div>

            <h2>${name}</h2>

            <h4>${part}</h4>

            <p>${summary}</p>
        `;

        summaryGrid.appendChild(summaryCard);

        // 상세 카드 생성
        const detailCard = document.createElement("article");

        detailCard.className = "introduce";

        detailCard.innerHTML = `
            <div class="info-group">
                <h1>${name}</h1>
                <h3>${part}</h3>
                <h4>멋쟁이사자처럼</h4>
            </div>

            <div class="content-section">
                <h3>자기소개</h3>
                <p>${intro}</p>
            </div>

            <div class="content-section">
                <h3>관심 기술</h3>
                <ul>
                    ${skillArray.map(skill => `<li>${skill.trim()}</li>`).join("")}
                </ul>
            </div>

            <div class="content-section">
                <h3>연락처</h3>
                <ul>
                    <li>E-mail : ${email}</li>
                    <li>Website : ${website}</li>
                    <li>Phone : ${phone}</li>
                </ul>
            </div>

            <div class="content-section">
                <h3>각오</h3>
                <p>${message}</p>
            </div>
        `;

        detailList.appendChild(detailCard);

        lionData.push({
            name,
            part,
            summary
        });

        updateCount();

        lionForm.reset();

        lionForm.classList.add("hidden");
    });

    // 마지막 삭제
    deleteBtn.addEventListener("click", () => {

        if (summaryGrid.lastElementChild) {

            summaryGrid.removeChild(summaryGrid.lastElementChild);

            lionData.pop();
        }

        if (detailList.lastElementChild) {

            detailList.removeChild(detailList.lastElementChild);
        }

        updateCount();
    });

});