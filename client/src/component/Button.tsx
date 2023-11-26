import {ButtonHTMLAttributes} from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {

}

export default function Button({children, type, onClick}: Props) {
  return <button type={type} onClick={onClick}>{children}</button>
}