import React, { useEffect, useState } from 'react';
import useAuthStore from '../../store/authStore';
import Boss from './Boss';
import PowerGauge from './PowerGauge';
import { useSocket } from '../../context/useSocket';
import { useNavigate } from 'react-router-dom';
import Videos from '../Video/Videos';

const initialHP = 1000;

interface Props {
  myTurn: boolean;
  setMyTurn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Game({ myTurn, setMyTurn }: Props) {
  const { id } = useAuthStore();
  const [totalHp, setTotalHp] = useState(initialHP);
  const [myOutput, setMyOutput] = useState(0);
  const [myResults, setMyResults] = useState<number[]>([]);
  // const [otherResult, setOtherResult] = useState(0);
  // const [otherResults, setOtherResults] = useState({});
  // const [myTurn, setMyTurn] = useState(false); // 나중에 false로
  const { socket } = useSocket();

  const navigate = useNavigate();

  // 클릭 시 체력을 떨어뜨리는 역할
  useEffect(() => {
    if (!myTurn) return;
    // if (totalHp - myOutput <= 0) {
    //   socket.emit('finish', {
    //     roomId,
    //     winner: id,
    //   });
    //   navigate('/results')
    // }
    setTotalHp((prev) => prev - myOutput);
    setMyOutput(0);
  }, [myOutput, myTurn]);

  useEffect(() => {
    if (!myOutput) return;
    setMyResults((prev) => [...prev, myOutput]);
  }, [myOutput]);

  // 체력이 0이되면 다시 리셋하는 역할
  useEffect(() => {
    if (totalHp > 0) return;
    setTotalHp(initialHP);
  }, [totalHp]);

  useEffect(() => {
    // turn 이벤트 수신시마다 자신의 턴인지 확인해줌
    socket.on('turn', (data: any) => {
      if (id === data.id) {
        setMyTurn(true);
      } else {
        setMyTurn(false);
      }
    });

    socket.on('attack', (data: any) => {
      const { id: nextId, attack, attacker } = data;
      if (id !== attacker) {
        console.log(attack);
        setTotalHp((prev) => prev - attack);
      }
      // TODO: 상대방 점수 기록하기
      if (id === nextId) {
        setMyTurn(true);
      } else {
        setMyTurn(false);
      }
    });

    // winner 확인
    socket.on('finish', (data: any) => {
      navigate('/results', {
        state: { winner: data.winner, results: data.results },
      });
    });
  }, []);

  return (
    <div>
      {/* 병뚜껑 값 */}
      <Boss hp={totalHp} />

      <PowerGauge
        myOutput={myOutput}
        setMyOutput={setMyOutput}
        myTurn={myTurn}
        myResults={myResults}
        totalHp={totalHp}
      />
      <div>
        <Videos />
      </div>
    </div>
  );
}
