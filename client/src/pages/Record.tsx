import { useEffect, useState } from 'react';
import useAuthStore from '../store/authStore';
import { useNetwork } from '../context/useNetwork';

const initalState = { win: 0, lose: 0 };
export default function Record() {
  const { id } = useAuthStore();
  const [record, setRecord] = useState(initalState);
  const { network } = useNetwork();

  useEffect(() => {
    network.getRecord(id!).then((res) => {
      setRecord({win: res.data.win, lose: res.data.lose})
    });
  }, []);

  return <div>
    {id}님의 전적입니다.
    승: {record.win}
    패: {record.lose}
  </div>;
}
