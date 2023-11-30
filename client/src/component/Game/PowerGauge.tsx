import React, { useEffect, useRef } from 'react';
import styles from './PowerGage.module.css';
import { useState } from 'react';
import { useSocket } from '../../context/useSocket';
import useAuthStore from '../../store/authStore';
import { useLocation } from 'react-router-dom';
import Timer from './Timer';

interface Props {
  myOutput: number;
  setMyOutput: React.Dispatch<React.SetStateAction<number>>;
  setTotalHp: React.Dispatch<React.SetStateAction<number>>;
  myTurn: boolean;
  setMyTurn: React.Dispatch<React.SetStateAction<boolean>>;
  myResults: number[];
  totalHp: number;
}

export default function PowerGauge({
  setMyOutput,
  myTurn,
  setMyTurn,
  myResults,
  totalHp,
  setTotalHp,
}: Props) {
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  let direction = useRef(1);
  const [speed, setSpeed] = useState(getRandomSpeed());
  const { socket } = useSocket();
  const { id } = useAuthStore();
  const location = useLocation();
  const roomId = location.pathname.split('/')[2];

  const showValue = () => {
    if (!sliderContainerRef.current || !sliderRef.current) return;
    if (!myTurn) {
      alert('아직 본인의 턴이 아닙니다...');
      return;
    }

    const sliderPosition = sliderRef.current?.offsetLeft;
    const containerWidth = sliderContainerRef.current?.offsetWidth;
    const sliderWidth = sliderRef.current?.offsetWidth;
    const value = Math.floor(
      (sliderPosition / (containerWidth - sliderWidth)) * 100
    );
    setMyOutput(value);
    socket.emit('attack', { value, id, roomId });
    setTotalHp(totalHp - value);
    if (totalHp - value <= 0) {
      if (myTurn) {
        socket.emit('finish', {
          roomId,
          winner: id,
          attack: value,
        });
      }
    } else {
      setMyTurn(false);
    }
  };

  useEffect(() => {
    const moveSlider = () => {
      if (!sliderContainerRef.current || !sliderRef.current) return;
      const sliderPosition = sliderRef.current?.offsetLeft;
      const containerWidth = sliderContainerRef.current?.offsetWidth;
      const sliderWidth = sliderRef.current?.offsetWidth;

      if (
        sliderPosition >= containerWidth - sliderWidth ||
        sliderPosition <= 0
      ) {
        direction.current *= -1;
      }

      const newPosition = Math.max(
        0,
        Math.min(
          containerWidth - sliderWidth,
          sliderPosition + direction.current * speed
        )
      );
      sliderRef.current.style.left = newPosition + 'px';
    };
    const id = setInterval(moveSlider, 10);

    return () => {
      clearInterval(id);
    };
  }, [speed]);

  useEffect(() => {
    const id = setInterval(() => {
      setSpeed(getRandomSpeed());
    }, 1000); // 1초마다 속도를 변경합니다.

    return () => {
      clearInterval(id);
    };
  }, [speed]);

  return (
    <section>
      {myTurn && <Timer />}
      <div>{myTurn ? '본인의 턴입니다.' : '본인의 턴이 아닙니다.'}</div>
      <div className={styles['slider-container']} ref={sliderContainerRef}>
        <div className={styles['slider']} ref={sliderRef}></div>
      </div>
      <button onClick={showValue} disabled={!myTurn}>
        Show Value
      </button>
      <div>0은 제외한 점수</div>
      <ul className={styles['output']}>
        {myResults.map((result) => (
          <li>{result}</li>
        ))}
      </ul>
    </section>
  );
}

function getRandomSpeed() {
  return (Math.random() + 0.1) * 13;
}
