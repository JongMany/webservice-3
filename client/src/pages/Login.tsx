import { Link, useNavigate } from 'react-router-dom';
import Input from '../component/Input';
import useInputForm from '../hooks/useInputForm';
import Button from '../component/Button';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useNetwork } from '../context/useNetwork';
import useAuthStore from '../store/authStore';

export default function Login() {
  const [form, onChange] = useInputForm({ id: '', password: '' });
  const { login } = useAuthStore();
  const { network } = useNetwork();
  const navigate = useNavigate();
  const [isRetain, setIsRetain] = useState(false);

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: AXIOS 요청
    const res = await network.login(form);
    console.log(res);

    if (res.data.status === 409) {
      alert(res.data.message);
      return;
    }
    if (res.data.status === 201) {
      
      if(isRetain) {
        localStorage.setItem('accessToken', res.data.token.token);
        localStorage.setItem('refreshToken', res.data.token.refreshToken);
      } else {
        sessionStorage.setItem('accessToken', res.data.token.token);
        sessionStorage.setItem('refreshToken', res.data.token.refreshToken);
      }
      login(res.data.token, res.data.id);
      // login(res.data.id);
      navigate('/');
    }

    // TODO: 로그인 요청되면 토큰 저장 및 상태 변경
  };

  return (
    <main>
      <form onSubmit={submitHandler}>
        <Input
          onChange={onChange}
          id={'id'}
          name={'id'}
          value={form['id']}
          label='아이디'
        />
        <Input
          onChange={onChange}
          id={'password'}
          name={'password'}
          value={form['password']}
          label='비밀번호'
        />
        <input type='checkbox' checked={isRetain} name='retain' id='retain' onChange={(e:ChangeEvent<HTMLInputElement>) => {
          setIsRetain(e.target.checked); 
        }} />
        <label htmlFor='retain'>로그인 유지</label>
        <Button type='submit'>로그인</Button>
        <Link to='/join'>회원가입</Link>
      </form>
    </main>
  );
}
