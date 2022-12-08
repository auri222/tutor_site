import './button.css';
import { Link } from 'react-router-dom';

const STYLES = ['btn--primary', 'btn--outline'];

const SIZES = ['btn--medium', 'btn--large'];

const Button = ({children, type, onCLick, buttonStyle, buttonSize}) => {
  const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0];

  return (
    <div>Button</div>
  )
}

export default Button