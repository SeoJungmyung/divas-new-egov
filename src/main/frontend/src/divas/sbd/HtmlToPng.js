import React from 'react';
import html2canvas from 'html2canvas';
import {saveAs} from 'file-saver';

const HtmlToPng = () => {
  const onCapture = () => {
      console.log('onCapture');
      html2canvas(document.getElementById('img_area')).then(canvas=>{
        saveAs(canvas.toDataURL, 'test.png')
      });
  };

 return (
    <>
    </>

 )
}

export default HtmlToPng;