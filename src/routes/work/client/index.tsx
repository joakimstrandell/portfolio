import { createFileRoute } from '@tanstack/react-router';
import { Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/work/client/')({
  component: () => <Navigate to="/work" />,
});
