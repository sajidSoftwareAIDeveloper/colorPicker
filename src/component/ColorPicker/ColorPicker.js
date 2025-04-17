
import './ColorPicker.css'
import React, { useRef, useEffect, useState } from 'react';

export const ColorPicker=()=>{

    const canvasRef = useRef(null);
    const imgRef = useRef(null);
    const [color, setColor] = useState(null);
    const[selectImagePixlInfo,setSelectImagePixelInfo]=useState([]);

    const [visible, setVisible] = useState(false);
    const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0});
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0});


    useEffect(() => {
        okkkkkkkkk();
    },[localStorage.getItem('imageInfo')]);

    function okkkkkkkkk(){
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const img = imgRef.current;

        const drawImage = () => {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            // if(canvas.width>window.innerWidth){canvas.width=window.innerWidth-60}
            // if(canvas.height>window.innerHeight){canvas.height=window.innerHeight-124}
            //     console.log( window.innerHeight, window.innerWidth);
        
            canvas.style.width = `${img.width}px`;
            canvas.style.height = `${img.height}px`;

            // console.log(canvas.width,canvas.height);
        
            ctx.drawImage(img, 0, 0);
          };
        
          img.onload = () => {
            drawImage();
          };
        
          const handleResize = () => {
            drawImage();
                // console.log( window.innerHeight, window.innerWidth);
          };
        
        // console.log(canvas.width,canvas.height);

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
        // okkkkkkkkk();
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
        const offsetPos={x,y};
        
        if (offsetPos.x+100> 400) {
            offsetPos.x-=100;
        }
        if (offsetPos.y+100> 400) {
            offsetPos.y-=100;
        }

        // console.log(windowHeight,windowWidth);
        setHoverPosition({x:offsetPos.x,y:offsetPos.y});
        // console.log(x,y);
    }

    return(
    <div style={{ position: 'relative', display: 'inline-block' }}>

        <div  style={{ position: 'relative' }}>  
            {   visible && 
                <div className='circle-cursor' style={{top: cursorPosition.y,  left: cursorPosition.x,}}>
                        <span className="line top" />
                        <span className="line bottom" />
                        <span className="line left" />
                        <span className="line right" />
               </div>
            }
            <canvas
                ref={canvasRef}
                onClick={clickHandle}
                className="picker-show_image"
                onMouseEnter={()=>setVisible(true)}
                onMouseLeave={()=>{setVisible(false)}}
                onMouseMove={mouseMoveHandle}
            />
            <img ref={imgRef}  alt="hidden" style={{ display: 'none' }}/>
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