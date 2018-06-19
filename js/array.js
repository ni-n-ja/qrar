'use strict'
let arr = [
    function () {
        return new Promise((resolve, reject) => {
            console.log("aaaaa");
            resolve();
        });
    },
    function () {
        return new Promise((resolve, reject) => {
            console.log("aaaaa");
            resolve();
        });
    },
];

window.onload = () => {
    document.getElementById("input").addEventListener(
        "focus", (e) => {
            console.log("!!!!!");
        });
    arr.reduce((prev, curr, index, arr) => {
        return prev.then(curr);
    }, Promise.resolve());
}