import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center px-4">
      <h1 className="text-2xl font-bold text-center">Sorry, this page isn't available.</h1>
      <p className="text-center">The link you followed may be broken, or the page may have been removed. <Link to="/" className="link">Go back to home.</Link></p>
    </div>
  );
}
