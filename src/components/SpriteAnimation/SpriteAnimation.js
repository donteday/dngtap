import React, { useRef, useEffect, useState } from 'react';

const SpriteAnimation = ({ spriteSheet, frameWidth, frameHeight, totalFrames, startFrame, endFrame, fps }) => {
  const canvasRef = useRef(null);
  const [currentFrame, setCurrentFrame] = useState(startFrame);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    const image = new Image();
    image.src = spriteSheet;
    
    image.onload = () => {
      setImageLoaded(true);
    };

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    const updateFrame = () => {
      if (!imageLoaded) return; // Не рисуем, если изображение не загружено

      context.clearRect(0, 0, canvas.width, canvas.height);

      // Вычисление позиции фрейма в спрайт-листе
      const row = Math.floor(currentFrame / (image.width / frameWidth));
      const col = currentFrame % (image.width / frameWidth);

      context.drawImage(
        image,
        col * frameWidth,
        row * frameHeight,
        frameWidth,
        frameHeight,
        0,
        0,
        frameWidth,
        frameHeight
      );

      setCurrentFrame((prevFrame) => {
        if (prevFrame >= endFrame) {
          return startFrame; // Перезапуск анимации
        }
        return prevFrame + 1;
      });
    };

    const interval = setInterval(updateFrame, 1000 / fps);
    return () => clearInterval(interval);
  }, [currentFrame, spriteSheet, frameWidth, frameHeight, startFrame, endFrame, fps, imageLoaded]);

  return <canvas ref={canvasRef} width={frameWidth} height={frameHeight} />;
};

export default SpriteAnimation;