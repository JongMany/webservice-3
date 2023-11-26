import React, { useEffect } from 'react';

interface Props {
  hp: number;
}

export default function Boss({ hp }: Props) {
  useEffect(() => {}, [hp]);
  return <div>병뚜껑의 HP:{hp}</div>;
}
