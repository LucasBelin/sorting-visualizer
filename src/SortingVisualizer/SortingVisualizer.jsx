import React, { useState, useEffect, useRef } from 'react'
import sortingAlgorithms, { animationType, colors } from '../sortingAlgorithms'
import './SortingVisualizer.css'

const SORTED_ANIMATION_SPEED = 5;
const MIN_HEIGHT = 5;
const MAX_HEIGHT = 500;

function SortingVisualizer() {

    const nbValuesSlider = useRef();
    const delaySlider = useRef();

    const [values, setValues] = useState([]);
    const [nbValues, setNbValues] = useState(50);
    const [barWidth, setBarWidth] = useState();
    const [animationDelay, setAnimationDelay] = useState(25);
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentAnimationID, setCurrentAnimationID] = useState(undefined);

    useEffect(() => {
        resetValues();
    }, [])

    useEffect(() => {
        calculateBarWidth();
    }, [values])

    useEffect(() => {
        resetValues();
    }, [nbValues])

    useEffect(() => {
        (isAnimating && disableControls()) || (!isAnimating && enableControls());
    }, [isAnimating]);

    function generateNewArray() {
        clearAnimation();
        resetValues();
    }

    function resetValues() {
        resetBarsColor();
        const array = [];
        for (let i = 0; i < nbValues; i++) {
            array.push(getRandomInt(MIN_HEIGHT, MAX_HEIGHT));
        }
        setValues(array);
    }

    function resetBarsColor() {
        for (let i = 0; i < nbValues; i++) {
            const el = document.getElementById(i);
            if (el) {
                el.style.backgroundColor = colors.unsorted;
            }
        }
    }

    function calculateBarWidth() {
        const width = 30 * 50 / values.length;
        setBarWidth(Math.min(100, width));
    }

    function clearAnimation() {
        if (isAnimating) {
            clearInterval(currentAnimationID);
            setCurrentAnimationID(undefined);
            setIsAnimating(false);
        }
    }

    function updateNbValues() {
        clearAnimation();
        const value = nbValuesSlider.current.value;
        setNbValues(value);
    }

    function updateAnimationDelay() {
        if (isAnimating) return;
        const value = delaySlider.current.value;
        setAnimationDelay(value);
    }


    function sort(type) {
        setIsAnimating(true);
        const animations = sortingAlgorithms(type, values.slice());
        startSortingAnimation(animations);
    }

    function disableControls() {
        const buttons = document.getElementsByClassName("sort-btn");
        delaySlider.current.setAttribute("disabled", "");
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].setAttribute("disabled", "");
            buttons[i].classList.add("disabled");
        }
    }

    function enableControls() {
        setIsAnimating(false);
        delaySlider.current.removeAttribute("disabled");
        const buttons = document.getElementsByClassName("sort-btn");
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].removeAttribute("disabled");
            buttons[i].classList.remove("disabled");
        }
    }

    function startSortingAnimation(animations) {
        const bars = document.getElementsByClassName("bar");
        function animate(animation) {
            if (animation.type === animationType.color) {
                animation.barsToColor.forEach(barIndex => {
                    bars[barIndex].style.backgroundColor = animation.color;
                })
            }
            else if (animation.type === animationType.swap) {
                animation.swapIndices.forEach((barIndex, idx) => {
                    bars[barIndex].style.height = `${animation.swapValues[idx]}px`;
                })
                setTimeout(() => {
                    animation.barsToColor.forEach(barIndex => {
                        bars[barIndex].style.backgroundColor = animation.color;
                    })
                }, animationDelay * 0.95);
            }
        }

        animate(animations[0]);
        let idx = 1;
        const intervalID = setInterval(() => {
            if (idx === animations.length - 1) {
                clearInterval(intervalID);
                setTimeout(startSortedAnimation, animationDelay);
            }

            animate(animations[idx]);
            idx++;
        }, animationDelay)

        setCurrentAnimationID(intervalID);
    }

    function startSortedAnimation() {
        function animate(id) {
            const bar = document.getElementById(id);
            bar.style.backgroundColor = colors.sorted;
        }

        animate(0);
        let idx = 1;
        const intervalID = setInterval(() => {
            if (idx === values.length) {
                clearInterval(intervalID);
                return;
            }
            animate(idx);
            idx++;
        }, SORTED_ANIMATION_SPEED)

        setCurrentAnimationID(intervalID);
    }

    const disabledBtnStyle = {
        color: "rgba(255, 255, 255, 0.7)",
        backgroundColor: "rgba(255, 0, 0, 0.3)",
        borderColor: "rgba(255, 0, 0, 0.3)",
        cursor: "not-allowed",
    }

    return (
        <>
            <div className="top">
                <div className="left">
                    <button className="header-btn" onClick={generateNewArray}>Generate new array</button>
                    <div className="input-frame">
                        <input ref={nbValuesSlider} type="range" min="10" max="300" defaultValue={nbValues} className="input" onChange={updateNbValues} />
                        <span style={{ width: "8ch" }} className="input-label">{values.length} bars</span>
                    </div>
                </div>
                <div className="right">
                    <div className={`input-frame ${isAnimating && "disabled-frame"}`}>
                        <input ref={delaySlider} type="range" min="10" max="200" defaultValue={animationDelay} className={`input ${isAnimating ? "disabled-input" : ""}`} onChange={updateAnimationDelay} />
                        <span style={{ width: "22ch" }} className="input-label">animation speed ({animationDelay} ms) </span>
                    </div>
                    <div className="sort-buttons">
                        <button onClick={() => sort("merge")} style={isAnimating ? disabledBtnStyle : undefined} className="header-btn sort-btn">Merge sort</button>
                        <button onClick={() => sort("quick")} style={isAnimating ? disabledBtnStyle : undefined} className={"header-btn sort-btn"}>Quick sort</button>
                        <button onClick={() => sort("heap")} style={isAnimating ? disabledBtnStyle : undefined} className="header-btn sort-btn">Heap sort</button>
                        <button onClick={() => sort("comb")} style={isAnimating ? disabledBtnStyle : undefined} className="header-btn sort-btn">Comb sort</button>
                        <button onClick={() => sort("gnome")} style={isAnimating ? disabledBtnStyle : undefined} className="header-btn sort-btn">Gnome sort</button>
                        <button onClick={() => sort("oddeven")} style={isAnimating ? disabledBtnStyle : undefined} className="header-btn sort-btn">Odd even sort</button>
                        <button onClick={() => sort("selection")} style={isAnimating ? disabledBtnStyle : undefined} className="header-btn sort-btn">Selection sort</button>
                        <button onClick={() => sort("bubble")} style={isAnimating ? disabledBtnStyle : undefined} className="header-btn sort-btn">Bubble sort</button>
                    </div>
                </div>
            </div>
            <div className="bar-container">
                {values.map((value, idx) => {
                    return (
                        <div className="bar" id={idx} key={idx} style={{ height: `${value}px`, width: `${barWidth}px` }}></div>
                    )
                })}
            </div>
        </>
    )
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export default SortingVisualizer
