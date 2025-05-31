import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-2xl font-bold">Questionnaires</h1>
      <div className="flex flex-col gap-2">
        <Button asChild>
          <Link to="/ipss">IPSS Questionnaire</Link>
        </Button>
        <Button asChild>
          <Link to="/mipro">MIPRO Questionnaire</Link>
        </Button>
        <Button asChild>
          <Link to="/enuresis">Enuresis Questionnaire</Link>
        </Button>
      </div>
    </div>
  );
}
import { useNavigate } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  return (
    <Button onClick={() => navigate('/ipss')}>
      Go to IPSS Questionnaire
    </Button>
  );
}
