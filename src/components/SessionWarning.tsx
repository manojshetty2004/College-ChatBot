import { useEffect } from 'react';
import { useSession } from '@/hooks/useSession';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

/**
 * Component to warn users when their session is about to expire
 * and provide option to refresh
 */
const SessionWarning = () => {
  const { isSessionExpiring, timeUntilExpiry, refreshSession } = useSession();
  const { toast } = useToast();

  useEffect(() => {
    if (isSessionExpiring && timeUntilExpiry === 5) {
      toast({
        title: 'Session Expiring Soon',
        description: 'Your session will expire in 5 minutes. Click to refresh.',
        action: (
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              const result = await refreshSession();
              if (result.success) {
                toast({
                  title: 'Session Refreshed',
                  description: 'Your session has been extended.',
                });
              }
            }}
          >
            Refresh
          </Button>
        ),
      });
    }
  }, [isSessionExpiring, timeUntilExpiry, toast, refreshSession]);

  if (!isSessionExpiring || !timeUntilExpiry) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-md">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Session Expiring</AlertTitle>
        <AlertDescription className="space-y-2">
          <p>Your session will expire in {timeUntilExpiry} minute{timeUntilExpiry !== 1 ? 's' : ''}.</p>
          <Button
            variant="outline"
            size="sm"
            onClick={async () => {
              const result = await refreshSession();
              if (result.success) {
                toast({
                  title: 'Session Refreshed',
                  description: 'Your session has been extended.',
                });
              } else {
                toast({
                  title: 'Error',
                  description: 'Failed to refresh session. Please log in again.',
                  variant: 'destructive',
                });
              }
            }}
          >
            Extend Session
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default SessionWarning;