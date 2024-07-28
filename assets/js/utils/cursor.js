function lerp(start, end, amount) {
    return (1 - amount) * start + amount * end;
}

const cursor = document.createElement("div");
cursor.className = "cursor";

const cursorBd = document.createElement("div");
cursorBd.className = "cursor-bd";
let cursorX = 0;
let cursorY = 0;
let pageX = 0;
let pageY = 0;
let size = 8;
let sizeBd = 60;
let followSpeed = 0.16;

document.body.appendChild(cursor);
document.body.appendChild(cursorBd);

if ("ontouchstart" in window) {
    cursor.style.display = "none";
    cursorBd.style.display = "none";
}

cursor.style.setProperty("--size", size + "px");
cursorBd.style.setProperty("--size", sizeBd + "px");

window.addEventListener("mousemove", function (e) {
    pageX = e.clientX;
    pageY = e.clientY;
    cursor.style.left = e.clientX - size / 2 + "px";
    cursor.style.top = e.clientY - size / 2 + "px";
});

function loop() {
    cursorX = lerp(cursorX, pageX, followSpeed);
    cursorY = lerp(cursorY, pageY, followSpeed);
    cursorBd.style.top = cursorY - sizeBd / 2 + "px";
    cursorBd.style.left = cursorX - sizeBd / 2 + "px";
    requestAnimationFrame(loop);
}

loop();

let startY;
let endY;
let clicked = false;

function getCurrentScale(element) {
    const transform = getComputedStyle(element).transform;
    if (transform === "none") return 1;
    const matrix = transform.match(/^matrix\((.+)\)$/);
    if (matrix) {
        const values = matrix[1].split(", ");
        return parseFloat(values[0]);
    }
    const matrix3d = transform.match(/^matrix3d\((.+)\)$/);
    if (matrix3d) {
        const values = matrix3d[1].split(", ");
        return parseFloat(values[0]);
    }
    return 1;
}

function mousedown(e) {
    cursor.animate([{ transform: "scale(1)" }, { transform: "scale(4.5)" }], {
        duration: 800,
        iterations: 1,
        fill: "both",
        easing: `cubic-bezier(.07,.76,.39,1)`,
    });
    cursorBd.animate([{ transform: "scale(1)" }, { transform: "scale(0.4)" }], {
        duration: 800,
        iterations: 1,
        fill: "both",
        easing: `cubic-bezier(.07,.76,.39,1)`,
    });

    clicked = true;
    startY = e.clientY || e.touches[0].clientY || e.targetTouches[0].clientY;
}

function mouseup(e) {
    const currentScaleCursor = getCurrentScale(cursor);
    const currentScaleCursorBd = getCurrentScale(cursorBd);

    cursor.animate([{ transform: `scale(${currentScaleCursor})` }, { transform: "scale(1)" }], {
        duration: 800,
        iterations: 1,
        fill: "both",
        easing: `cubic-bezier(.07,.76,.39,1)`,
    });
    cursorBd.animate([{ transform: `scale(${currentScaleCursorBd})` }, { transform: "scale(1)" }], {
        duration: 800,
        iterations: 1,
        fill: "both",
        easing: `cubic-bezier(.07,.76,.39,1)`,
    });

    endY = e.clientY || endY;
    if (clicked && startY && Math.abs(startY - endY) >= 40) {
        clicked = false;
        startY = null;
        endY = null;
    }
}
window.addEventListener("mousedown", mousedown, false);
window.addEventListener("touchstart", mousedown, false);
window.addEventListener(
    "touchmove",
    function (e) {
        if (clicked) {
            endY = e.touches[0].clientY || e.targetTouches[0].clientY;
        }
    },
    false
);
window.addEventListener("touchend", mouseup, false);
window.addEventListener("mouseup", mouseup, false);

function mouseEnterA(e) {
    cursor.animate([{ transform: "scale(1)" }, { transform: "scale(13)" }], {
        duration: 400,
        iterations: 1,
        fill: "both",
        easing: `cubic-bezier(.07,.76,.39,1)`,
    });
    cursorBd.animate([{ transform: "scale(1)" }, { transform: "scale(1)" }], {
        duration: 400,
        iterations: 1,
        fill: "both",
        easing: `cubic-bezier(.07,.76,.39,1)`,
    });
}

function mouseLeaveA(e) {
    const currentScaleCursor = getCurrentScale(cursor);
    const currentScaleCursorBd = getCurrentScale(cursorBd);

    cursor.animate([{ transform: `scale(${currentScaleCursor})` }, { transform: "scale(1)" }], {
        duration: 400,
        iterations: 1,
        fill: "both",
        easing: `cubic-bezier(.07,.76,.39,1)`,
    });
    cursorBd.animate([{ transform: `scale(${currentScaleCursorBd})` }, { transform: "scale(1)" }], {
        duration: 400,
        iterations: 1,
        fill: "both",
        easing: `cubic-bezier(.07,.76,.39,1)`,
    });
}

function mouseEnterOn(e) {
    cursor.animate([{ transform: "scale(1)" }, { transform: "scale(0)" }], {
        duration: 400,
        iterations: 1,
        fill: "both",
        easing: `cubic-bezier(.07,.76,.39,1)`,
    });
    cursorBd.animate([{ transform: "scale(1)" }, { transform: "scale(1.6)" }], {
        duration: 400,
        iterations: 1,
        fill: "both",
        easing: `cubic-bezier(.07,.76,.39,1)`,
    });
}

function mouseLeaveOn(e) {
    const currentScaleCursor = getCurrentScale(cursor);
    const currentScaleCursorBd = getCurrentScale(cursorBd);

    cursor.animate([{ transform: `scale(${currentScaleCursor})` }, { transform: "scale(1)" }], {
        duration: 400,
        iterations: 1,
        fill: "both",
        easing: `cubic-bezier(.07,.76,.39,1)`,
    });
    cursorBd.animate([{ transform: `scale(${currentScaleCursorBd})` }, { transform: "scale(1)" }], {
        duration: 400,
        iterations: 1,
        fill: "both",
        easing: `cubic-bezier(.07,.76,.39,1)`,
    });
}

const eleA = document.querySelectorAll("a");
const eleOn = document.querySelectorAll(".c-on");

eleA.forEach(function (ele, idx) {
    ele.addEventListener("mouseenter", mouseEnterA, false);
    ele.addEventListener("mouseleave", mouseLeaveA, false);
});

eleOn.forEach(function (ele, idx) {
    ele.addEventListener("mouseenter", mouseEnterOn, false);
    ele.addEventListener("mouseleave", mouseLeaveOn, false);
});
