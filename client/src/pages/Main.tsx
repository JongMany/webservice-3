import PowerGauge from '../component/Game/PowerGauge';
import useAuthStore from '../store/authStore';
import GameRoomButton from '../component/Game/GameRoomButton';

export default function Main() {
  const { id } = useAuthStore();

  return (
    <main>
      <h3>{id}님 안녕하세요</h3>
      {/* <div onClick={() => {}}></div> */}
      <GameRoomButton />
    </main>
  );
}
