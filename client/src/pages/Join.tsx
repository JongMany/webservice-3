import Input from '../component/Input';
import useInputForm from '../hooks/useInputForm';
import Button from '../component/Button';
import { FormEvent, useState } from 'react';
import { useNetwork } from '../context/useNetwork';
import { useNavigate } from 'react-router-dom';

export default function Join() {
  const [checkDuplicate, setCheckDuplicate] = useState(false);
  const [form, onChange] = useInputForm({
    id: '',
    password: '',
    confirmPassword: '',
  });

  const { network } = useNetwork();
  const navigate = useNavigate();

  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 유효성 검사
    if (!checkDuplicate) {
      alert('아이디 중복 여부를 확인해주세요');
      return;
    }
    if (form.id.length < 4) {
      alert('아이디는 4글자 이상이여야 합니다.');
      return;
    }
    if (form.password.length < 4) {
      alert('비밀번호는 4글자 이상이여야 합니다.');
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert('비밀번호가 서로 다릅니다.');
      return;
    }

    const res = await network.signUp({ id: form.id, password: form.password });

    if (res.data.status === 201) {
      alert('회원가입이 성공했습니다');
      navigate('/login');
    } else {
      navigate('/join');
    }
  };

  const checkDuplicateId = async () => {
    if (form.id.length < 4) {
      alert('아이디는 4글자 이상이어야 합니다.');
      return;
    }

    const res = await network.checkDuplicateId({ id: form.id });

    if (res.data.status === 200) {
      alert('아이디를 사용할 수 있습니다.');
      setCheckDuplicate(true);
    } else {
      alert('이미 중복된 아이디입니다.');
      setCheckDuplicate(false);
    }
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
        <Button type='button' onClick={checkDuplicateId}>
          중복 체크
        </Button>
        <Input
          onChange={onChange}
          type='password'
          id={'password'}
          name={'password'}
          value={form['password']}
          label='비밀번호'
        />
        <Input
          onChange={onChange}
          type='password'
          id={'confirm-password'}
          name={'confirmPassword'}
          value={form['confirmPassword']}
          label='비밀번호 확인'
        />
        <Button type='submit'>회원가입</Button>
      </form>
      <Button type='button' onClick={() => navigate('/login')}>
        로그인 페이지로
      </Button>
    </main>
  );
}
