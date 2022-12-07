(() => {
    "use strict";
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(2 == webP.height);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = true === support ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let addWindowScrollEvent = false;
    function headerScroll() {
        addWindowScrollEvent = true;
        const header = document.querySelector("header.header");
        const headerShow = header.hasAttribute("data-scroll-show");
        const headerShowTimer = header.dataset.scrollShow ? header.dataset.scrollShow : 500;
        const startPoint = header.dataset.scroll ? header.dataset.scroll : 1;
        let scrollDirection = 0;
        let timer;
        document.addEventListener("windowScroll", (function(e) {
            const scrollTop = window.scrollY;
            clearTimeout(timer);
            if (scrollTop >= startPoint) {
                !header.classList.contains("_header-scroll") ? header.classList.add("_header-scroll") : null;
                if (headerShow) {
                    if (scrollTop > scrollDirection) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null; else !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
                    timer = setTimeout((() => {
                        !header.classList.contains("_header-show") ? header.classList.add("_header-show") : null;
                    }), headerShowTimer);
                }
            } else {
                header.classList.contains("_header-scroll") ? header.classList.remove("_header-scroll") : null;
                if (headerShow) header.classList.contains("_header-show") ? header.classList.remove("_header-show") : null;
            }
            scrollDirection = scrollTop <= 0 ? 0 : scrollTop;
        }));
    }
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    document.addEventListener("DOMContentLoaded", (function() {
        const form = document.getElementById("form");
        form.addEventListener("submit", formSend);
        async function formSend(e) {
            e.preventDefault();
            let error = formValidate(form);
            let formData = new FormData(form);
            formData.append("file", formFile.files[0]);
            if (0 === error) {
                form.classList.add("_sending");
                let response = await fetch("sendmail.php", {
                    method: "POST",
                    body: formData
                });
                if (response.ok) {
                    let result = await response.json();
                    alert(result.message);
                    formPreview.innerHTML = "";
                    form.reset();
                    form.classList.remove("_sending");
                } else {
                    alert("Помилка!");
                    form.classList.remove("_sending");
                }
            } else alert("Заповніть обов'язкові поля!!!");
        }
        function formValidate(form) {
            let error = 0;
            let formReq = document.querySelectorAll("._req");
            for (let index = 0; index < formReq.length; index++) {
                const input = formReq[index];
                formRemoveError(input);
                if (input.classList.contains("_email")) {
                    if (emailTest(input)) {
                        formAddError(input);
                        error++;
                    }
                } else if ("checkbox" === input.getAttribute("type") && false === input.checked) {
                    formAddError(input);
                    error++;
                } else if ("" === input.value) {
                    formAddError(input);
                    error++;
                }
            }
            return error;
        }
        function formAddError(input) {
            input.parentElement.classList.add("_error");
            input.classList.add("_error");
        }
        function formRemoveError(input) {
            input.parentElement.classList.remove("_error");
            input.classList.remove("_error");
        }
        function emailTest(input) {
            return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(input.value);
        }
        const formFile = document.getElementById("formFile");
        const formPreview = document.getElementById("formPreview");
        formFile.addEventListener("change", (() => {
            uploadFile(formFile.files[0]);
        }));
        function uploadFile(file) {
            var reader = new FileReader;
            reader.onload = function(e) {
                formPreview.innerHTML = `<span>${JSON.stringify(e.target.file)}</span>`;
                JSON.stringify(e.target);
            };
            reader.onerror = function(e) {
                alert("Помилка");
            };
            reader.readAsDataURL(file);
        }
    }));
    window["FLS"] = true;
    isWebp();
    headerScroll();
})();