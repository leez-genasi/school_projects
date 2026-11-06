import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout.jsx';

export default function PlaceholderPage({ title }) {
  return (
    <PageLayout>
      <div className="container py-5">
        <h1>{title}</h1>
        <p>The page you requested could not be found.</p>
        <Link to="/">Return Home</Link>
      </div>
    </PageLayout>
  );
}
