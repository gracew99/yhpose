import React from "react";
import Webcam from "react-webcam";


function App() {
  const refCam = React.useRef(null);
  const [imageSrc,setImageSrc]=React.useState('');
  const canvas = React.useRef();

  React.useEffect(() => {
    setTimeout(() => {
      let imageSrc = refCam && refCam.current && refCam.current.getScreenshot();
      let body = JSON.stringify({ imgSrc: imageSrc })

      fetch('/poseNet', {
        method: "POST",
        body: body,
        headers: {"Content-type": "application/json; charset=UTF-8"}
      })
      .then(response => response.json()) 
      .then(json => {
          
        const ctx = canvas && canvas.current && canvas.current.getContext('2d');
        

        ctx.clearRect(0, 0, 650, 470);

        // console.log(json.skeleton)
        const ref = json.skeleton
        // left hip to left knee
        ctx.beginPath();
        ctx.moveTo(ref["leftHip"][0], ref["leftHip"][1]);
        ctx.lineTo(ref["leftKnee"][0], ref["leftKnee"][1]);
        ctx.closePath();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "yellow";
        ctx.stroke();


        // left knee to left ankle
        ctx.beginPath();
        ctx.moveTo(ref["leftKnee"][0], ref["leftKnee"][1]);
        ctx.lineTo(ref["leftAnkle"][0], ref["leftAnkle"][1]);
        ctx.strokeStyle = "red";

        ctx.closePath();
        ctx.stroke();

        // right hip to right knee
        ctx.beginPath();
        ctx.moveTo(ref["rightHip"][0], ref["rightHip"][1]);
        ctx.lineTo(ref["rightKnee"][0], ref["rightKnee"][1]);
        ctx.strokeStyle = "yellow";
        ctx.closePath();
        ctx.stroke();

        // left hip to right hip
        ctx.beginPath();
        ctx.moveTo(ref["leftHip"][0], ref["leftHip"][1]);
        ctx.lineTo(ref["rightHip"][0], ref["rightHip"][1]);
        ctx.strokeStyle = "green";
        ctx.closePath();
        ctx.stroke();


        // right knee to right ankle
        ctx.beginPath();
        ctx.moveTo(ref["rightKnee"][0], ref["rightKnee"][1]);
        ctx.lineTo(ref["rightAnkle"][0], ref["rightAnkle"][1]);
        ctx.strokeStyle = "red";
        ctx.closePath();
        ctx.stroke();


        // left shoulder to left elbow
        ctx.beginPath();
        ctx.moveTo(ref["leftShoulder"][0], ref["leftShoulder"][1]);
        ctx.lineTo(ref["leftElbow"][0], ref["leftElbow"][1]);
        ctx.strokeStyle = "purple";
        ctx.closePath();
        ctx.stroke();

        // left shoulder to left hip
        ctx.beginPath();
        ctx.moveTo(ref["leftShoulder"][0], ref["leftShoulder"][1]);
        ctx.lineTo(ref["leftHip"][0], ref["leftHip"][1]);
        ctx.strokeStyle = "blue";
        ctx.closePath();
        ctx.stroke();

        // left shoulder to right shoulder
        ctx.beginPath();
        ctx.moveTo(ref["leftShoulder"][0], ref["leftShoulder"][1]);
        ctx.lineTo(ref["rightShoulder"][0], ref["rightShoulder"][1]);
        ctx.strokeStyle = "pink";
        ctx.closePath();
        ctx.stroke();


        // // right shoulder to right elbow
        ctx.beginPath();
        ctx.moveTo(ref["rightShoulder"][0], ref["rightShoulder"][1]);
        ctx.lineTo(ref["rightElbow"][0], ref["rightElbow"][1]);
        ctx.strokeStyle = "purple";
        ctx.closePath();
        ctx.stroke();

        // right shoulder to right hip
        ctx.beginPath();
        ctx.moveTo(ref["rightShoulder"][0], ref["rightShoulder"][1]);
        ctx.lineTo(ref["rightHip"][0], ref["rightHip"][1]);
        ctx.strokeStyle = "blue";
        ctx.closePath();
        ctx.stroke();

        // right elbow to right wrist
        ctx.beginPath();
        ctx.moveTo(ref["rightElbow"][0], ref["rightElbow"][1]);
        ctx.lineTo(ref["rightWrist"][0], ref["rightWrist"][1]);
        ctx.strokeStyle = "orange";
        ctx.closePath();
        ctx.stroke();

        // left elbow to left wrist
        ctx.beginPath();
        ctx.moveTo(ref["leftElbow"][0], ref["leftElbow"][1]);
        ctx.lineTo(ref["leftWrist"][0], ref["leftWrist"][1]);
        ctx.strokeStyle = "orange";
        ctx.closePath();
        ctx.stroke();
    })
      .catch(err => console.log(err));

      setImageSrc(imageSrc)
    }, 1000);
  }, [refCam, imageSrc, canvas]);

  return (
  
      <div style={{display: "flex", justifyContent: "center", alignItems: "center"}} >
          <Webcam audio={false} ref={refCam} screenshotFormat="image/jpeg" className="shadow-lg rounded-lg " />
          <canvas style={{position: "absolute"}} ref={canvas} id="canvas" width="650" height="470"></canvas>
      </div>
  );
}



export default App;
