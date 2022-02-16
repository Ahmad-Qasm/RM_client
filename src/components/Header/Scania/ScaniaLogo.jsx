import { Link } from 'react-router-dom'
import ScaniaSymbol from './scania-symbol.svg'

export default function ScaniaLogo(){
  return (
      <Link to="/">
      <img
        src={ScaniaSymbol}
        style={{height: 64, width:64, marginLeft: 8}}
        alt="scania logo"
      />
      </Link>
  );
}
