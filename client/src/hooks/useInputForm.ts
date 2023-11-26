import {ChangeEvent, useState} from "react";

const useInputForm = <T>(initialForm: T) => {
  const [form, setForm] = useState(initialForm);

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    setForm(prev => ({...prev, [name]: value}));
  }

  return [form, changeHandler] as const;
}

export default useInputForm;