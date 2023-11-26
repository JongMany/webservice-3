import React from 'react';
import useAuthStore from '../store/authStore';
import {Link, useLocation} from 'react-router-dom';

export default function Results() {
  const {id} = useAuthStore();
  const location = useLocation();
  const {winner, results} = location.state;
  const summarizedResult = summarizeResult(results);

  return (
      <div>
        <p>
          {winner === id
              ? '우승하셨습니다!'
              : `${winner}께서 우승하셨습니다... 다음 기회에 다시 도전해보세요`}
        </p>
        <p>{`전체 최고점수는 ${summarizedResult.maxValue}이며 이 기록은 ${summarizedResult.bestAttacker.join('')}의 기록입니다.`}</p>
        <Link to='/'>메인화면으로</Link>
      </div>
  );
}

interface IResults {
  [key: string]: number[];
}

interface ISummarizedResult {
  bestAttacker: string[],
  maxValue: number
}

function summarizeResult(results: IResults): ISummarizedResult {
  const entries = Object.entries(results); // [[userId, 공격 데이터]]
  const result: ISummarizedResult = {bestAttacker: [], maxValue: 0};
  let maxList = []
  for (const entry of entries) {
    const max = Math.max(...entry[1]);
    maxList.push(max);
  }
  const bestMax = Math.max(...maxList);
  for (const entry of entries) {
    const max = Math.max(...entry[1]);
    if (max === bestMax) {
      result.bestAttacker.push(entry[0]);
    }
  }
  result.maxValue = bestMax;

  return result;
}