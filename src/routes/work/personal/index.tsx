import { createFileRoute, Navigate } from '@tanstack/react-router';

export const Route = createFileRoute('/work/personal/')({
  component: () => <Navigate to="/work" />,
});
