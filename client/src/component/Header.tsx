import { Link } from 'react-router-dom';
import Button from './Button';
import useAuthStore from '../store/authStore';

export default function Header() {
  const { logout } = useAuthStore();
  return (
    <header>
      <Link to='/'>Main</Link>
      <Link to='/record'>Record</Link>
      <Link to='/rooms'>Room</Link>
      <Button onClick={() => logout()}>로그아웃</Button>
    </header>
  );
}
