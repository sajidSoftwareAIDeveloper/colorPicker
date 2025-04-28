
import { ColorPicker } from '../ColorPicker/ColorPicker';
import './Image.css'

import React, { useRef, useState, useEffect } from "react";

export const Image = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [isOpenCamera, setIsOpenCamera] = useState(false);
//   const [isValid, setIsValid] = useState(false);
  const[isActivated,setIsActivated]=useState(false);

  const [stream, setStream] = useState(null);

  const [windowWidth,setWindowWidth]=useState();

  // useEffect(()=>{
  //   setWindowWidth(window.innerWidth);
  //   // console.log(window.innerWidth);
  // },[window.innerWidth])

  const cameraHandle = async () => {
    setIsOpenCamera(true);
    try {
        const newStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
            videoRef.current.srcObject = newStream;
            setStream(newStream);
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
          

  };

  const closedCameraHandle = () => {
    setIsOpenCamera(false);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const captureImage = () => {
    setIsOpenCamera(false);
    const context = canvasRef.current.getContext("2d");
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
    localStorage.setItem('imageInfo',canvasRef.current.toDataURL("image/png"));
    
    setImage(canvasRef.current.toDataURL("image/png"));
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const fileHandle = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  const openHandle = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    //   setIsValid(false);
    localStorage.setItem('imageInfo',URL.createObjectURL(file));
    }
  };

  return (
    <div className="main_class">

        <div className='select-images'>
          
            <div>
                <button onClick={cameraHandle}>  <img className="camera" src="camera.png" alt="camera" />  </button>
            </div>

            <div>
              <button className='isactivated' onClick={()=>{setIsActivated(!isActivated)}}>{isActivated?'inactivate':'activate'}</button>
            </div>

            <canvas ref={canvasRef} style={{ display: "none" }} />
            <div>
                    <button onClick={fileHandle}><img className="file" src="fileIcon.png" alt="file"/> </button>
                <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    ref={fileInputRef}
                    onChange={openHandle}
                    style={{ display: "none" }}
                />
            </div>

        </div>

      { 
         isOpenCamera 
         && 
        <div className="popup">

            <video ref={videoRef} autoPlay className="video_style"/>
            
            <button className="clickPhoto" onClick={captureImage}></button>
            
            <button className="cut_camera" 
              onClick={closedCameraHandle}
              // style={{marginLeft:windowWidth>500?(windowWidth/2+210):windowWidth-40}}
              >X
            </button>

        </div>
      }


      <div className='show-image-area'>
          {/* {
            image ?
             <img src={image} alt="Captured" className="show_image" />
            :
            <img src='nature-image.png' alt="Captured" className="show_image" />

            } */}

          {
            isActivated===true
            ? <ColorPicker/>   
            : 
            <div>
                <img src={localStorage.getItem('imageInfo')} alt="Captured" className="show_image" />  
            </div>
          }

          {/* <ColorPicker/>    */}
      </div>


    </div>
  );
};