document.addEventListener("DOMContentLoaded", (event) => {
    // lenis 초기화
    const lenis = new Lenis();

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    document.querySelectorAll(".btn-goback").forEach((el) => {
        el.addEventListener("click", (e) => {
            e.preventDefault();

            if (history.length > 1) {
                window.history.back();
            } else {
                location.href = "/";
            }
        });
    });

    lenis.on("scroll", (e) => {
        const scrollToButtons = document.querySelectorAll(".btn-scroll-to");

        scrollToButtons.forEach((btn, idx) => {
            btn.addEventListener("click", (e) => {
                const target = document.querySelector(`[data-scroll-cnt=${btn.dataset.scrollBtn}]`);

                if (target) {
                    lenis.scrollTo(target, { offset: -80 });
                }
            });
        });
    });
});
