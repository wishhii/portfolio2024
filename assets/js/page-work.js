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
});
