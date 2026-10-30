import Navbar from './NavBar/NavBar.jsx';
import Footer from './footer.jsx';

export default function PageLayout({ children, mainClassName = '' }) {
  return (
    <>
      <Navbar />
      <main className={mainClassName}>{children}</main>
      <Footer />
    </>
  );
}
