const path = require("path");
const express = require('express');
const bodyParser = require('body-parser');
const pino = require('express-pino-logger')();
const tf = require('@tensorflow/tfjs-node');
const posenet = require('@tensorflow-models/posenet');
const fs = require("fs");

const {
    createCanvas, Image
} = require('canvas')
const imageScaleFactor = 0.5;
const outputStride = 16;
const flipHorizontal = false;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(pino);
app.use(express.static(path.join(__dirname, "..", "build")));

app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"),
  res.setHeader("Access-Control-Allow-Headers", "*"),
  next();
})

app.post('/poseNet', (req, res) => {
    // console.log(req.body.imgSrc)
    const poseNet = async() => {
        console.log('start');
        const net = await posenet.load({
            architecture: 'MobileNetV1',
            outputStride: 16,
            inputResolution: 513,
            multiplier: 0.75
        });

        var image = new Image();
        

        const canvas = createCanvas(1080, 720);
        const ctx = canvas.getContext('2d');


        image.onload = function() {
        ctx.drawImage(image, 0, 0);
        };
        image.src = req.body.imgSrc


        const input = tf.browser.fromPixels(canvas);
        const pose = await net.estimateSinglePose(input, imageScaleFactor, flipHorizontal, outputStride);

        const received = {}
        for(const keypoint of pose.keypoints) {
            received[keypoint.part] = [keypoint.position.x, keypoint.position.y]
        }
        return {
            skeleton: received
        };
    }
    poseNet().then(isMatch => {console.log(isMatch); res.send(isMatch)})
  })


app.listen(8001, () =>
    console.log(`Express server is running on localhost:${8001}`)
);
