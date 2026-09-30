export function getDashboardName(path: string): string {
  const cleanPath = path.replace(/^dashboard\//, '');

  const lastSegment = cleanPath.split('/').slice(2, 3).join() || 'Dashboard';

  return lastSegment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
