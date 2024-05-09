import { getPointsWithOffset, getAnimationFrames } from "./modules/calculation.js";
import { fetchJSON } from "./modules/api.js";

document.addEventListener("DOMContentLoaded", () => {
    const stateButton = document.querySelector(".actions__state-button");
    const scene = document.querySelector(".scene");
    const actor = document.querySelector(".actor");

    if (!stateButton || !scene || !actor) return;
    
    stateButton.addEventListener("click", () => toggleState(stateButton, actor, scene));

    initActorPosition(actor, scene);
});

const toggleState = (stateButton, actor, scene) => {
    if (stateButton.classList.contains("_start")) {
        makeButtonStop(stateButton);
        start(actor, scene, stateButton);
        return;
    }
    makeButtonStart(stateButton);
    if (stop) stop();
    initActorPosition(actor, scene);
}

const makeButtonStart = (button) => {
    button.classList.remove("_stop");
    button.classList.add("_start");
    button.innerText = "Почати"
}
const makeButtonStop = (button) => {
    button.classList.remove("_start");
    button.classList.add("_stop");
    button.innerText = "Стоп"
}
const initActorPosition = (actor, scene) => {
    if (!actor || !scene) return;
    
    actor.style.top = `${(scene.offsetHeight - actor.offsetHeight) / 2}px`;
    actor.style.left = `${(scene.offsetWidth - actor.offsetWidth) / 2}px`;
    actor.style.transform = `rotate(0deg)`;
}

const start = (actor, scene, stateButton) => {
    fetchJSON('flight_data.json').then(data => animateFlight(data, actor, scene, stateButton));
}
/**
 * Variable that must be implemented to stop the animation action.
 * @type {void}
 */
let stop;

const animateFlight = (flightData, actor, scene, stateButton) => {
    const animationDuration = 20000;
    const points = getPointsWithOffset(flightData, scene);

    const frames = getAnimationFrames(flightData, points);

    const animation = actor.animate(frames, { duration: animationDuration, iterations: 1 });
    stop = () => animation.cancel();
    animation.onfinish = () => makeButtonStart(stateButton);
}