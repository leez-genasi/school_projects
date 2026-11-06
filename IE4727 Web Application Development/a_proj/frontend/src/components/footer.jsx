import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-row">
        <span>theatre</span>
        <span>Stories are better shared live.</span>
        <Link to="/visit#contact">Contact us</Link>
      </div>
    </footer>
  );
}
