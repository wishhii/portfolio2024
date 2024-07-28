export function getSectionScrollRange(element, triggerPoint) {
    const windowHeight = window.innerHeight;

    let startPoint, endPoint, offset;

    if (triggerPoint === "bottom top") {
        startPoint = element.offsetTop - windowHeight * 0.8;
        offset = element.clientHeight + windowHeight * 0.8;
    } else if (triggerPoint === "top top") {
        // window top이 content top에 닿았을 때
        startPoint = element.offsetTop;
        offset = element.clientHeight;
    }

    endPoint = startPoint + offset;

    return {
        offset,
        startPoint,
        endPoint,
    };
}

// TODO: getSectionScrollRange, getSectionScrollProgress 함수 정리하기
export function getSectionScrollProgress(startPoint, offset, scrollValue) {
    return ((scrollValue - startPoint) / offset) * 100;
}

export function getShuffleArrayBetween(min, max) {
    const array = new Array(max - min + 1).fill(0).map((_, i) => i + min);

    return array.sort(() => Math.random() - 0.5);
}

export function getRandomNumberBetween(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
