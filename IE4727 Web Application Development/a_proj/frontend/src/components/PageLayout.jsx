import { useEffect } from 'react';
import Navbar from './NavBar/NavBar.jsx';
import Footer from './footer.jsx';

function posterBackgroundValue(imagePath) {
  const escapedPath = [...imagePath].map((character) => {
    const codePoint = character.codePointAt(0);
    if (codePoint < 32 || codePoint === 127 || character === '"' || character === '\\') {
      return `\\${codePoint.toString(16)} `;
    }
    return character;
  }).join('');
  return `url("${escapedPath}")`;
}

export default function PageLayout({ children, mainClassName = '', posterBackground = '' }) {
  useEffect(() => {
    if (!posterBackground) return undefined;

    const body = document.body;
    const hadShowSelectedClass = body.classList.contains('show-selected');
    const previousPosterBackground = body.style.getPropertyValue('--poster-bg');
    body.classList.add('show-selected');
    body.style.setProperty('--poster-bg', posterBackgroundValue(posterBackground));

    return () => {
      if (!hadShowSelectedClass) body.classList.remove('show-selected');
      if (previousPosterBackground) {
        body.style.setProperty('--poster-bg', previousPosterBackground);
      } else {
        body.style.removeProperty('--poster-bg');
      }
    };
  }, [posterBackground]);

  return (
    <>
      <Navbar />
      <main className={mainClassName}>{children}</main>
      <Footer />
    </>
  );
}
