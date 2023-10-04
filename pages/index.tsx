import React, { useEffect, useState } from 'react';
import Draggable from './components/Draggable';
import { DndContext } from '@dnd-kit/core';
import Droppable from './components/Droppable';

const Home = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [images, setImages] = useState<string[]>([]);
  const [coordenadas, setCoordenadas] = useState({ x: 0, y: 0 });
  const [elements, setElements] = useState<React.JSX.Element[]>([]);



  const readFileData = (file: File) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e?.target?.result);
      };
      reader.onerror = (err) => {
        reject(err);
      };
      reader.readAsDataURL(file);
    });
  };

  const convertPdfToImages = async (file: File) => {
    const PDFJS = require("pdfjs-dist/webpack");
    const images = [];
    const data = await readFileData(file);
    const pdf = await PDFJS.getDocument(data).promise;
    const canvas = document.createElement("canvas");
    for (let i = 0; i < pdf.numPages; i++) {
      const page = await pdf.getPage(i + 1);
      const viewport = page.getViewport({ scale: 1.5 });
      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;
      await page.render({ canvasContext: context, viewport: viewport }).promise;
      images.push(canvas.toDataURL());
    }
    canvas.remove();
    return images;
  };

  const loadPdfContent = async () => {
    if (selectedFile) {
      const convertedImages = await convertPdfToImages(selectedFile);
      setImages(convertedImages);
      // Aquí puedes usar convertedImages para mostrar las imágenes en algún lugar
    }
  };

  const uploadImg = (e: any) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  function handleDragEnd(event: any) {
    const element = document.getElementById("elemento");
    setCoordenadas(element?.getBoundingClientRect()!);
    const newStyle = `absolute,top-[${event?.over?.rect?.top}],bottom-[${event?.over?.rect?.bottom}],left-[${event?.over?.rect?.left}],right-[${event?.over?.rect?.right}],z-50`;
  
    if (element instanceof HTMLElement && event?.over?.rect) {
      const clonedElement = (
        <div
          key={`elemento-copia-${Date.now()}`}
          className={`p-2 bg-blue-600 max-w-min text-white font-semibold text-sm rounded-lg ${newStyle}`}
        >
          {element.textContent}
        </div>
      );
      setElements([...elements, clonedElement]);
    }
  }

console.log(elements)

  return (
    <div>
      <input
        type="file"
        id="fileInput"
        accept=".pdf, .docx, .jpg"
        onChange={uploadImg}
      />
      <button onClick={loadPdfContent}>Cargar PDF y Convertir a Imágenes</button>
      <div className='mt-10'>
        <DndContext onDragEnd={handleDragEnd}>
          <div className=' flex items-start gap-14'>
            <div className='h-[800px] flex flex-col gap-10 p-12 border '>
              <Draggable id={1} >
                <div id='elemento' className='p-2 bg-blue-600 text-white font-semibold text-sm rounded-lg' >
                  Name
                </div>
              </Draggable>
              <Draggable id={4} >
                <div id='elemento' className='p-2 bg-blue-600 text-white font-semibold text-sm rounded-lg' >
                  lastName
                </div>
              </Draggable>
            </div>

            <div></div>

            <Droppable >
              <div className='flex flex-col gap-10 bg-white px-12 max-h-[800px] max-w-[900px] overflow-y-auto '>
                {images.map((image, index) => (
                  <div key={index} className=' ' >
                    <img src={image} alt={`Page ${index + 1}`} className='' />
                  </div>                    
                ))}
                {
                    elements.map((element, index) => (
                      <div key={index}>{element}</div>
                    ))
                  }
              </div>
            </Droppable>
          </div>
        </DndContext>
      </div>
    </div>
  );
};

export default Home;
