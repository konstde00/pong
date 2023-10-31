import React, { useState, useEffect, useRef } from 'react';

const SPEED_X = 2;
const SPEED_Y = 2;
const RADIUS = 10;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 10;

const App = () => {
  const canvasRef = useRef(null);
  const [ball, setBall] = useState({ x: 300, y: 150, speedX: SPEED_X, speedY: SPEED_Y, radius: RADIUS });
  const [paddle, setPaddle] = useState({ x: 250, width: PADDLE_WIDTH, height: PADDLE_HEIGHT });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let requestId;

    const drawBall = () => {
      context.beginPath();
      context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
      context.fillStyle = 'blue';
      context.fill();
      context.closePath();
    };

    const drawPaddle = () => {
      context.fillStyle = 'green';
      context.fillRect(paddle.x, canvas.height - paddle.height, paddle.width, paddle.height);
    };

    const movePaddle = (event) => {
      const newX = event.clientX - canvas.getBoundingClientRect().left - paddle.width / 2;
      if (newX >= 0 && newX <= canvas.width - paddle.width) {
        setPaddle({ ...paddle, x: newX });
      }
    };

    const updateGameArea = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      drawBall();
      drawPaddle();

      ball.x += ball.speedX;
      ball.y += ball.speedY;

      if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
        ball.speedX = -ball.speedX;
      }

      if (ball.y - ball.radius < 0) {
        ball.speedY = -ball.speedY;
      }

      if (ball.y + ball.radius > canvas.height - paddle.height && !gameOver) {
        if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
          ball.speedY = -ball.speedY;
          setScore(score + 1);
        } else {
          setGameOver(true);
          cancelAnimationFrame(requestId);
        }
      }

      if (!gameOver) {
        requestId = requestAnimationFrame(updateGameArea);
      }
    };

    canvas.addEventListener('mousemove', movePaddle);

    updateGameArea();

    return () => {
      canvas.removeEventListener('mousemove', movePaddle);
      cancelAnimationFrame(requestId);
    };
  }, [ball, paddle, score, gameOver]);

  const restartGame = () => {
    setBall({ x: 300, y: 150, speedX: SPEED_X, speedY: SPEED_Y, radius: RADIUS })
    setScore(0);
    setGameOver(false);
  }
  return (
    <div>
      <canvas
        ref={canvasRef}
        width={750}
        height={500}
        style={{ border: '1px solid black' }}
      />
      <p> Score: {score}</p>
      {gameOver && (
        <div>
          <p>Game Over!</p>
          <button onClick={restartGame}>Restart</button>
        </div>
      )}
    </div>
  );
};

export default App;
