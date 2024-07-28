export const animations = {
    textFadeUp: {
        element: "children",
        keyframe: [{ transform: "translateY(100%)" }, { transform: "translateY(0)" }],
        options: {
            duration: 320,
            iterations: 1,
            fill: "both",
            delay: 80,
        },
    },
};
