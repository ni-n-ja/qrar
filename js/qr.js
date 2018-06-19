'use strict'

let video;
let bufferCanvas;
let canvas;
let ctx;
let bufferCtx;
var width;
var height;
var orig;

var output;
var outputCanvas;
var outputctx;

var deviceId;

window.onload = function () {

    navigator.mediaDevices.enumerateDevices()
        .then(function (devices) {
            devices.forEach(function (device) {
                if (device.kind == "videoinput") {
                    console.log(device);
                    if (device.label.includes("ManyCam") || device.label.includes("back")) {
                        deviceId = device.deviceId;
                        console.log(device);
                    }
                }
            });
        });

    video = document.createElement('video');
    video.setAttribute('width', 200 + 'px');
    video.setAttribute('height', 200 + 'px');

    bufferCanvas = document.createElement('canvas');
    bufferCtx = bufferCanvas.getContext("2d");
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    output = document.getElementById("out");
    output.setAttribute('width', 200 + 'px');
    output.setAttribute('height', 200 + 'px');
    output.srcObject = canvas.captureStream(30);
    console.log(
        canvas.captureStream(30)
    );

    var constraints = {
        audio: false,
        video: {
            facingMode: "environment",
            deviceId: deviceId,
            // width: 1280,
            // height: 720,
            // facingMode: {
            //     exact: "environment"
            // },
            // deviceId: {
            //     exact: deviceId
            // },
        }
    };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            video.src = window.URL.createObjectURL(stream);
            video.onloadedmetadata = function (e) {
                video.play();
                width = video.videoWidth;
                height = video.videoHeight;
                if (width == 0 || height == 0) {
                    return;
                }
                bufferCanvas.width = canvas.width = width;
                bufferCanvas.height = canvas.height = height;
                render();
            };
        })
        .catch(function (err) {
            console.log(err.name + ": " + err.message);
        });
}

function render() {
    bufferCtx.drawImage(video, 0, 0);
    // ctx.putImageData(bufferCtx.getImageData(0, 0, width, height), 0, 0);
    // ctx.drawImage(video, 0, 0);
    bin();
    requestAnimationFrame(render);
};

function bin() {
    let imgData = bufferCtx.getImageData(0, 0, width, height);
    for (var i = 0; i < imgData.data.length; i += 4) {
        //let avg = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
        let avg = 0.299 * imgData.data[i] + 0.587 * imgData.data[i + 1] + 0.114 * imgData.data[i + 2];
        imgData.data[i] = avg;
        imgData.data[i + 1] = avg;
        imgData.data[i + 2] = avg;
        imgData.data[i + 3] = 255;
    }
    bufferCtx.putImageData(imgData, 0, 0);

    let array = new Array(256);
    for (var i = 0; i < 256; i++) {
        array[i] = 0;
    }
    for (var i = 0; i < imgData.data.length; i += 4) {
        array[imgData.data[i]] += 0.01;
    }

    let th = 0;
    let max = 0;
    let tmp = 0;
    for (var i = 0; i < array.length; i++) {
        let w1 = 0;
        let w2 = 0;
        let sum1 = 0;
        let sum2 = 0;
        let m1 = 0.0;
        let m2 = 0.0;
        for (var j = 0; j < array.length; j++) {
            w1 += array[j];
            sum1 += j * array[j];
        }
        for (var j = i + 1; j < array.length - i; j++) {
            w2 += array[j];
            sum2 += j * array[j];
        }
        if (w1 > 0) m1 = sum1 / w1;
        if (w2 > 0) m2 = sum2 / w2;
        let tmp = (w1 * w2 * (m1 - m2) * (m1 - m2));
        if (tmp > max) {
            max = tmp;
            th = i;
        }
    }

    let biImgData = bufferCtx.getImageData(0, 0, width, height);
    for (var i = 0; i < biImgData.data.length; i += 4) {
        if (biImgData.data[i] < th) {
            biImgData.data[i] = 0;
            biImgData.data[i + 1] = 0;
            biImgData.data[i + 2] = 0;
        } else {
            biImgData.data[i] = 255;
            biImgData.data[i + 1] = 255;
            biImgData.data[i + 2] = 255;
        }
    }
    ctx.putImageData(biImgData, 0, 0);
}

function test(ctx) {
    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(100, 200);
    ctx.stroke();
}