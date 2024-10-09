import { Alert, AlertDescription } from '@/components/ui/alert';

export function AlertNotice({ variant = 'default', classNames, message }) {
  return (
    <Alert variant={variant} className={classNames}>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}
