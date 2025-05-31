import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">404 - Page Not Found</h1>
      <Button asChild>
        <Link to="/">Return Home</Link>
      </Button>
    </div>
  );
}
