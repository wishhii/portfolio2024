import { animations } from "./utils/animation.js";
import includeHTML from "./utils/includeHTML.js";
import {
  getRandomNumberBetween,
  getSectionScrollProgress,
  getSectionScrollRange,
  getShuffleArrayBetween,
} from "./utils/utils.js";

const URL = `https://wishhii.github.io/portfolio2024`;
const IMAGE_DIR = `${URL}/assets/images`;

document.addEventListener("DOMContentLoaded", (event) => {
  // 브라우저 기본 스크롤 복원 막기
  // if ("scrollRestoration" in window.history) {
  //     window.history.scrollRestoration = "manual";
  // }

  // include file 불러오기
  // includeHTML()
  //     .then(() => {
  //         console.log("include 성공");

  //         // 여기서 추가 작업 수행 가능
  //         const header = document.querySelector("#header");
  //         const headerRect = header.getBoundingClientRect();
  //     })
  //     .catch((error) => {
  //         console.error("include 오류 발생:", error);
  //     });

  const animationList = animations;

  // lenis 초기화
  const lenis = new Lenis();

  // 새로고침 시 스크롤 맨 위로 복원하기 위해
  // lenis.scrollTo(0, { immediate: true });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // IntersectionObserver -> 클래스로 빼서 gasp scrollTrigger 같이 활용해보기
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.3,
  };
  const callback = (entries, observer) => {
    entries.forEach((entry) => {
      const target = entry.target;

      // 애니메이션을 해야할 요소가 있으면 에니메이션 실행
      if (target.dataset.ani) {
        if (entry.isIntersecting) {
          const animationName = target.dataset.ani;
          const animation = animationList[animationName];

          if (animation) {
            const keyframe = animation.keyframe;
            const options = animation.options;

            switch (animation.element) {
              case "self":
                target.animate(keyframe, options);
                break;
              case "children":
                target.querySelectorAll("*").forEach((child, index) => {
                  child.animate(keyframe, { ...options, delay: index * 100 });
                });
                break;
              case "parent":
                const parentElement = target.parentElement;
                parentElement.animate(keyframe, options);
                break;
            }
          }

          // 한번 화면에 보인 요소는 observe 해제
          observer.unobserve(entry.target);
        }
      }

      if (target.id === "canvas") {
        if (entry.isIntersecting) {
          runner.enabled = true;
          Render.run(render);
        } else {
          runner.enabled = false;
          Render.stop(render);
        }
      }
    });
  };
  const observer = new IntersectionObserver(callback, options);
  const targets = document.querySelectorAll("[data-target]");
  targets.forEach((target) => {
    observer.observe(target);
  });

  // 섹션별 스크롤 애니메이션
  const railContainers = document.querySelectorAll(".rail-container");

  const sectDescEle = document.querySelector("#sect__desc");
  const splitTypingDefaultEle = sectDescEle.querySelectorAll(".desc-text.default span");
  const splitTypingOverlayEle = sectDescEle.querySelectorAll(".desc-text.overlay span");
  const descOverlayText = sectDescEle.querySelector(".desc-text.overlay");
  const descProgressBg = sectDescEle.querySelector(".progress-bg");
  const descPrevText = sectDescEle.querySelector(".prev-text");

  const sectSkillsEle = document.querySelector("#sect__skills .skill-list-wrapper");
  const skills = sectSkillsEle.querySelectorAll(".skill-list li");
  const skillsShuffleArray = getShuffleArrayBetween(0, skills.length - 1);

  // 스크롤 이벤트
  lenis.on("scroll", (e) => {
    // 헤더 숨기기
    // if (headerRect.height + 100 < e.animatedScroll) {
    //     header.classList.add("hide");
    // } else {
    //     header.classList.remove("hide");
    // }

    // project 섹션
    if (railContainers.length > 0) {
      railContainers.forEach((railContainer) => {
        const {
          startPoint: proj_start,
          endPoint: proj_end,
          offset: proj_offset,
        } = getSectionScrollRange(railContainer, "bottom top");

        const railTexts = railContainer.querySelectorAll(".rail-text p span");

        if (lenis.animatedScroll > proj_start && lenis.animatedScroll < proj_end) {
          const proj_progress = getSectionScrollProgress(proj_start, proj_offset, lenis.animatedScroll);

          if (railContainer.classList.contains("reverse")) {
            // conatiner 좌우 이동
            railContainer.style.transform = `translate(${12 - (proj_progress / 100) * 12}%, 0)`; // 12% -> 0%로 -12%만큼 움직이도록

            // font weight
            railTexts.forEach((c, index) => {
              let weight = (proj_progress - (60 / railTexts.length) * index * 0.7) * railTexts.length * 6;
              railTexts[index].style.fontWeight = weight < 200 ? 200 : weight > 600 ? 600 : weight;
            });
          } else {
            // conatiner 좌우 이동
            railContainer.style.transform = `translate(${-12 + (proj_progress / 100) * 12}%, 0)`; // -12% -> 0%로 12%만큼 움직이도록

            // font weight
            railTexts.forEach((c, index) => {
              let weight = (proj_progress - (60 / railTexts.length) * index * 0.7) * railTexts.length * 6;
              let indexReverse = railTexts.length - 1 - index;

              railTexts[indexReverse].style.fontWeight = weight < 200 ? 200 : weight > 600 ? 600 : weight;
            });
          }
        }
      });
    }

    // desc 섹션 - 타이핑 & 배경 애니메이션
    if (sectDescEle) {
      const {
        startPoint: desc_start,
        endPoint: desc_end,
        offset: desc_offset,
      } = getSectionScrollRange(sectDescEle, "top top");

      // 스크롤을 빨리 움직이면 0%로 잘 돌아가지 않아서 상태 초기화해주기 위해 추가
      if (lenis.animatedScroll < desc_start) {
        descProgressBg.style.width = "0%";
        descOverlayText.style.width = "0%";
        descPrevText.style.opacity = 1;
      }

      if (lenis.animatedScroll > desc_start && lenis.animatedScroll < desc_end) {
        const desc_progress = getSectionScrollProgress(desc_start, desc_offset, lenis.animatedScroll);

        // .desc-text 애니메이션
        if (lenis.direction === 1) {
          splitTypingDefaultEle.forEach((ele, idx) => {
            if (desc_progress > 4.7 * (idx + 1)) {
              ele.style.display = "inline-block";
            }
          });
          splitTypingOverlayEle.forEach((ele, idx) => {
            if (desc_progress > 4.7 * (idx + 1)) {
              ele.style.display = "inline-block";
            }
          });
        } else if (lenis.direction === -1) {
          splitTypingDefaultEle.forEach((ele, idx) => {
            if (desc_progress < 4.7 * (idx + 1)) {
              ele.style.display = "none";
            }
          });
          splitTypingOverlayEle.forEach((ele, idx) => {
            if (desc_progress < 4.7 * (idx + 1)) {
              ele.style.display = "none";
            }
          });
        }

        // 배경 애니메이션
        let widthVelocity = desc_progress * 1.6;
        let opacityVelocity = desc_progress * 0.15;

        descProgressBg.style.width = widthVelocity <= 100 ? widthVelocity + "%" : "100%";
        descOverlayText.style.width = widthVelocity <= 100 ? widthVelocity + "%" : "100%";
        descPrevText.style.opacity = 1 - opacityVelocity;

        if (desc_progress > 60) {
          descProgressBg.style.transform = `scale(${1 + (desc_progress - 60) / 100})`;
        } else {
          descProgressBg.style.transform = "scale(1)";
        }
      }
    }

    // skills skill-list 섹션 - 스킬 순차 페이드인
    if (sectSkillsEle) {
      const {
        startPoint: skills_start,
        endPoint: skills_end,
        offset: skills_offset,
      } = getSectionScrollRange(sectSkillsEle, "top top");

      if (lenis.animatedScroll > skills_start && lenis.animatedScroll < skills_end) {
        const skills_progress = getSectionScrollProgress(skills_start, skills_offset, lenis.animatedScroll);

        // TODO: 완벽하지 않음 -> 수정하기
        skills.forEach((skill, index) => {
          skills[skillsShuffleArray[index]].style.opacity =
            (skills_progress * (skills.length * 0.7)) / 100 - (1 / (skills.length * 0.2)) * index;

          skills[skillsShuffleArray[index]].style.filter = `blur(${
            10 - ((skills_progress * (skills.length * 0.7)) / 100 - (1 / (skills.length * 0.2)) * index) * 10
          }px)`;
        });
      }
    }
  });

  // intro section 마우스오버 effect
  let imgBoxInterval;

  const introTexts = document.querySelectorAll("#sect__intro .intro-text-box p");
  const introImgBoxs = document.querySelectorAll("#sect__intro .intro-img-box div");

  imgBoxInterval = setInterval(setRandomIcon, 1000);

  introTexts.forEach((text, index) => {
    text.addEventListener("mouseenter", () => {
      clearImgBox();
      setImgBox(index);
      clearInterval(imgBoxInterval);
    });

    text.addEventListener("mouseleave", () => {
      clearImgBox();
      imgBoxInterval = setInterval(setRandomIcon, 1000);
    });
  });

  function setImgBox(index) {
    const [imgBoxIndex, flatBoxIndex, iconBoxIndex] = getShuffleArrayBetween(0, 8).slice(0, 3);

    introImgBoxs[imgBoxIndex].style.backgroundImage = `url('${IMAGE_DIR}/intro_0${index + 1}_img.png')`;
    introImgBoxs[flatBoxIndex].style.backgroundImage = `url('${IMAGE_DIR}/intro_0${index + 1}_flat.png')`;
    introImgBoxs[iconBoxIndex].style.backgroundImage = `url('${IMAGE_DIR}/intro_0${index + 1}_icon.png')`;
  }

  function clearImgBox() {
    introImgBoxs.forEach((box) => {
      box.style.backgroundImage = "none";
    });
  }

  function setRandomIcon() {
    clearImgBox();

    const randomIndex = getRandomNumberBetween(0, 8);
    const randomSrc = getRandomNumberBetween(0, 6);

    introImgBoxs[randomIndex].style.backgroundImage = `url('${IMAGE_DIR}/intro_0${randomSrc + 1}_icon.png')`;
  }

  // 런드리박스
  var Engine = Matter.Engine,
    Render = Matter.Render,
    Runner = Matter.Runner,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,
    Composite = Matter.Composite,
    Events = Matter.Events,
    Bodies = Matter.Bodies;

  const canvas = document.querySelector("#canvas");
  const cw = 1000;
  const ch = 1000;

  observer.observe(canvas);

  const gravityPower = 0.8;
  let gravityDeg = 0;

  let engine, render, runner, mouse, mouseConstraint;
  initScene();
  initMouse();
  initGround();
  initImageBoxes();

  Events.on(mouseConstraint, "mousedown", () => {
    console.log(mouseConstraint.body);
  });

  Events.on(runner, "tick", () => {
    gravityDeg += 1.2;
    engine.world.gravity.x = gravityPower * Math.cos((Math.PI / 180) * gravityDeg);
    engine.world.gravity.y = gravityPower * Math.sin((Math.PI / 180) * gravityDeg);
  });

  function initScene() {
    engine = Engine.create();
    render = Render.create({
      canvas: canvas,
      engine: engine,
      options: {
        width: cw,
        height: ch,
        wireframes: false,
        background: "#ffffff",
      },
    });
    runner = Runner.create();

    Render.run(render);
    Runner.run(runner, engine);
  }

  function initMouse() {
    mouse = Mouse.create(canvas);
    mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
    });

    Composite.add(engine.world, mouseConstraint);

    canvas.removeEventListener("mousewheel", mouse.mousewheel);
    canvas.removeEventListener("DOMMouseScroll", mouse.mousewheel); // 파이어폭스 호환
  }

  function initGround() {
    const segements = 32;
    const deg = (Math.PI * 2) / segements;
    const width = 50;
    const radius = cw / 2 + width / 2;
    const height = radius * Math.tan(deg / 2) * 2;

    for (let i = 0; i < segements; i++) {
      const theta = deg * i;
      const x = radius * Math.cos(theta) + cw / 2;
      const y = radius * Math.sin(theta) + ch / 2;

      addRect(x, y, width, height, { isStatic: true, angle: theta });
    }
  }

  function initImageBoxes() {
    const scale = 0.9;
    const size = { w: 220 * scale, h: 220 * scale };

    addRect(cw / 2, ch / 2, size.w, size.h, {
      label: "BOOK",
      chamfer: { radius: 20 },
      render: {
        sprite: { texture: `${IMAGE_DIR}/laundry_book.png`, xScale: scale, yScale: scale },
      },
    });
    addRect(cw / 2 - size.w, ch / 2, size.w, size.h, {
      label: "CAKE",
      chamfer: { radius: 20 },
      render: {
        sprite: { texture: `${IMAGE_DIR}/laundry_cake.png`, xScale: scale, yScale: scale },
      },
    });
    addRect(cw / 2 + size.w, ch / 2, size.w, size.h, {
      label: "CLOTH",
      chamfer: { radius: 20 },
      render: {
        sprite: { texture: `${IMAGE_DIR}/laundry_cloth.png`, xScale: scale, yScale: scale },
      },
    });
    addRect(cw / 2, ch / 2 + size.h, size.w, size.h, {
      label: "CLOVER",
      chamfer: { radius: 20 },
      render: {
        sprite: { texture: `${IMAGE_DIR}/laundry_clover.png`, xScale: scale, yScale: scale },
      },
    });
    addRect(cw / 2 - size.w, ch / 2 + size.h, size.w, size.h, {
      label: "FACE",
      chamfer: { radius: 75 },
      render: {
        sprite: { texture: `${IMAGE_DIR}/laundry_face.png`, xScale: scale, yScale: scale },
      },
    });
    addRect(cw / 2 - size.w, ch / 2 + size.h, size.w, size.h, {
      label: "LAPTOP",
      chamfer: { radius: 75 },
      render: {
        sprite: { texture: `${IMAGE_DIR}/laundry_laptop.png`, xScale: scale, yScale: scale },
      },
    });
    addRect(cw / 2 - size.w, ch / 2 + size.h, size.w, size.h, {
      label: "PENGUIN",
      chamfer: { radius: 75 },
      render: {
        sprite: { texture: `${IMAGE_DIR}/laundry_penguin.png`, xScale: scale, yScale: scale },
      },
    });
    addRect(cw / 2 - size.w, ch / 2 + size.h, size.w, size.h, {
      label: "PANTS",
      chamfer: { radius: 75 },
      render: {
        sprite: { texture: `${IMAGE_DIR}/laundry_pants.png`, xScale: scale, yScale: scale },
      },
    });
    addRect(cw / 2 - size.w, ch / 2 + size.h, size.w, size.h, {
      label: "SOCKS",
      chamfer: { radius: 75 },
      render: {
        sprite: { texture: `${IMAGE_DIR}/laundry_socks.png`, xScale: scale, yScale: scale },
      },
    });
  }

  function addRect(x, y, w, h, options = {}) {
    const rect = Bodies.rectangle(x, y, w, h, options);
    Composite.add(engine.world, rect);
  }
});
