import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function AuthButtons() {
  return (
    <div className="flex items-center space-x-2">
      <Button variant="ghost" asChild>
        <Link to="/auth">Login</Link>
      </Button>
      <Button asChild>
        <Link to="/auth">Sign Up</Link>
      </Button>
    </div>
  );
}