
import './ColorPicker.css'
import React, { useRef, useEffect, useState } from 'react';

export const ColorPicker=()=>{

    const canvasRef = useRef(null);
    const imgRef = useRef(null);
    const [color, setColor] = useState('#000000');
    const[selectImagePixlInfo,setSelectImagePixelInfo]=useState([]);

    const [visible, setVisible] = useState(false);
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0});
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0});

    useEffect(() => {
        // handleCanvasWindowSize();
        callingCanvas();
        // console.log(window.innerHeight,window.innerWidth);
    },[localStorage.getItem('imageInfo')]);

    function handleCanvasWindowSize(wheight,wwidth){

        if(wheight<500 && wwidth<500){
            return [wheight-131,wwidth-30]
        }
        else if(wheight<500 || wwidth<500){

            if(wheight<500 ){
                return [wheight,500-131]
            }
            else{
                return [500,wwidth-30]
            }

        }
        else{
            return [500,500]
        }
    }

    function callingCanvas() {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = imgRef.current;
        const drawImage = (targetWidth, targetHeight) => {
          canvas.width = targetWidth;
          canvas.height = targetHeight;
      
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);
        };
      
        img.onload = () => {
           const[targetHeight,targetWidth]= handleCanvasWindowSize(window.innerHeight,window.innerWidth);
          drawImage(targetWidth,targetHeight);;

        };
      
        const handleResize = () => {
        //   drawImage(500, 500);
            const[targetHeight,targetWidth]= handleCanvasWindowSize(window.innerHeight,window.innerWidth);
            drawImage(targetWidth,targetHeight);
            // console.log(targetHeight,targetWidth);
        };
      
        window.addEventListener('resize', handleResize);
      
        img.crossOrigin = 'anonymous';
        img.src = localStorage.getItem('imageInfo');
      
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }
      

    
    const clickHandle =() => {
        setColor(selectImagePixlInfo[40]);
        
    };


    const size=9;
    const half=Math.floor(size/2);
    
    function mouseMoveHandle(e){

        const canvas = canvasRef.current;
        
        // const ctx = canvas.getContext('2d');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        const rect = canvas.getBoundingClientRect();
        const x = Math.floor(e.clientX - rect.left);
        const y = Math.floor(e.clientY - rect.top);
        // console.log(x,y);

        const px = ctx.getImageData(x-half, y-half, size, size).data; 
        const toHex = (value) => value.toString(16).padStart(2, '0');
        // alert(px.length)
        let pixelArray=[];
        for (let i = 0; i < px.length; i += 4) {
            pixelArray.push(`#${toHex(px[i])}${toHex(px[i+1])}${toHex(px[i+2])}`);

            // if(i===4*40) {setColor(`#${toHex(px[i])}${toHex(px[i+1])}${toHex(px[i+2])}`)}
        }
        setSelectImagePixelInfo(pixelArray);
        setCursorPosition({x,y});

        // show data arround the images
        // const offsetPos={x,y};
        
        // if (offsetPos.x+100> 300) {
        //     offsetPos.x-=100;
        // }
        // if (offsetPos.y+100> 300) {
        //     offsetPos.y-=100;
        // }
        
 


        // console.log(windowHeight,windowWidth);
        // setHoverPosition({x:offsetPos.x,y:offsetPos.y});
       setHoverPosition({x:x-52,y:y-52});  // after using position absolute

       // using position fixed

    //    const ww=Math.floor(window.innerWidth);
    //    setHoverPosition(prev=>({...prev,x:59+15+x}));
    //    if(ww>500){
    //         setHoverPosition(prev=>({y:((ww-560)/2)+15+y}));
    //     }
    //     else{
    //         setHoverPosition(prev=>({...prev,y:15+y}));
    //     }
        // console.log(x,y);
    }

    return(
    <div style={{ position: 'relative', display: 'inline-block' }}>

        <div  style={{ position: 'relative' }}>  
            {/* {   visible && 
                <div className='circle-cursor' style={{top: cursorPosition.y,  left: cursorPosition.x,}}>
                        <span className="line top" />
                        <span className="line bottom" />
                        <span className="line left" />
                        <span className="line right" />
               </div>
            } */}
            <canvas
                ref={canvasRef}
                onClick={clickHandle}
                className="canvas-image"
                onMouseEnter={()=>setVisible(true)}
                onMouseLeave={()=>{setVisible(false)}}
                onMouseMove={mouseMoveHandle}
            />
            <img ref={imgRef} className="canvas-image"  alt="hidden" style={{ display: 'none' }}/>
        </div>

        {color 
            && 
            <div style={{ marginTop:5, marginBottom:5 }}>
                <div
                    className='color-show'
                    style={{
                    backgroundColor: color,
                    }}
                />
               <span className='color-value-show'>{color}</span> 
            </div>
            }

        {
            selectImagePixlInfo.length!==0
            && visible
            &&
            <div className='table-main' 
                style={{
                    borderColor:selectImagePixlInfo[40],
                    position:'absolute',
                    top: hoverPosition.y,
                    left: hoverPosition.x,
                    transform: 'translate(10px, 10px)',
                    pointerEvents: 'none',
                }}>
                <table className='table-show-px-color'>
                <tbody>
                {
                    Array.from({ length: 9 }, (_, rowIndex) => (
                        <tr key={rowIndex}>
                        {
                            selectImagePixlInfo
                            .slice(rowIndex * 9, rowIndex * 9 + 9)
                            .map((item, colIndex) => (
                                <td 
                                key={colIndex}
                                className={(rowIndex===4&&colIndex===4) ? 'table-center-td' : 'table-td'}
                                style={{backgroundColor:item}}></td>
                            ))
                        }
                        </tr>
                    )) 
                }
                </tbody>
                </table>
            </div>
        }

    </div>);
}