import { AbsoluteFill, interpolate, useCurrentFrame, Img } from 'remotion';
import { useEffect, useRef, useState } from 'react';

export const MyVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const [birdsX, setBirdsX] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animate bird movement (side-to-side)
  useEffect(() => {
    const interval = setInterval(() => {
      setBirdsX((prev) => (prev + 2) % 2000);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Draw birds via canvas
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const drawBird = (x: number, y: number, flap: number) => {
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + 10, y - flap, x + 20, y);
      ctx.quadraticCurveTo(x + 10, y + flap, x, y);
      ctx.fillStyle = '#000';
      ctx.fill();
    };

    const renderCanvasBirds = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, 1920, 1080);
      const flap = Math.sin(frame / 5) * 8;

      // Flying birds across screen
    //   drawBird(birdsX + 0, 100, flap);
    //   drawBird(birdsX + 50, 130, flap - 2);
    //   drawBird(birdsX + 100, 120, flap + 1);

      // Stationary birds beside logo
      drawBird(1600, 40, flap);
      drawBird(1650, 60, flap + 3);
      drawBird(1700, 50, flap - 2);
    };

    renderCanvasBirds();
  }, [frame, birdsX]);

  const textOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });
  const grassSwing = Math.sin(frame / 10) * 5;

  return (
    <AbsoluteFill style={{ backgroundColor: 'black' }}>
      {/* Static Fullscreen Background */}
      <Img
        src={require('../public/background.jpeg')}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />

      {/* Trees (swinging) */}
      <Img
  src={require('../public/trees.png')}
  style={{
    position: 'absolute',
    bottom: 0,
    left: '-70px', // Move to left edge
    transform: `scaleX(-1) rotate(${grassSwing}deg)`, // Added space between transforms
    transformOrigin: 'bottom center',
    width: 320, // Scaled up
  }}
/>


      {/* Grass (swinging) */}
      {/* Grass (swinging) */}
    <Img
    src={require('../public/plant2.png')}
    style={{
        position: 'absolute',
        bottom: -20,
        right: '-50px',
        transform: `scaleX(-1) rotate(${grassSwing}deg)`,
        transformOrigin: 'bottom center',
        width: 350,
    }}
    />


      {/* Animated Main Text - Word by Word ending with final frame */}
    <div
    style={{
        position: 'absolute',
        top: '10%',
        left: '8%',
        fontSize: 46,
        fontWeight: 'bold',
        color: 'white',
        display: 'flex',
        flexWrap: 'wrap',
        maxWidth: '85%',
        lineHeight: '1.6',
    }}
    >
    {[
        'Celebrating', 'World', 'Milk', 'Day', 'with',
        'heartfelt', 'gratitude', 'to', 'those', 'who',
        'compassionately', 'milk', 'cows.',
        'Your', 'dedication', 'nourishes', 'millions',
        'and', 'inspires', 'respect', 'for', 'natural', 'living.',
        'We', 'honor', 'your', 'work', 'and', 'compassion',
        'today', 'and', 'every', 'day.'
    ].map((word, i, arr) => {
        const totalWords = arr.length;
        const totalFrames = 180; // <-- Set this to your actual duration
        const framesPerWord = Math.floor(totalFrames / totalWords);

        const wordStart = i * framesPerWord;
        const wordEnd = wordStart + framesPerWord;

        const opacity = interpolate(frame, [wordStart, wordEnd], [0, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        });

        const scale = interpolate(frame, [wordStart, wordEnd], [0.8, 1], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
        });

        return (
        <span
            key={i}
            style={{
            opacity,
            transform: `scale(${scale})`,
            marginRight: 10,
            }}
        >
            {word}
        </span>
        );
    })}
    </div>




      {/* Logo */}
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
          border: '2px solid white',
          borderRadius: '50%',
          width: 100,
          height: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: 20,
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        YOUR<br />LOGO<br />HERE
      </div>

      {/* Canvas: Flying Birds + Birds beside Logo */}
      <canvas
        ref={canvasRef}
        width={1920}
        height={1080}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 5,
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
