import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function AuthButtons() {
  return (
    <div className="flex items-center">
      <Button asChild>
        <Link to="/auth">Access</Link>
      </Button>
    </div>
  );
}