import { AlertCircle, Home as HomeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardContent className="space-y-6 pb-8 pt-8 text-center">
          <div className="flex justify-center">
            <div className="rounded-full bg-muted p-3">
              <AlertCircle className="h-10 w-10 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Page introuvable</h1>
            <p className="text-muted-foreground">
              Désolé, la page que vous recherchez n&apos;existe pas ou a été déplacée.
            </p>
          </div>

          <div className="flex justify-center">
            <Link to="/">
              <Button>
                <HomeIcon className="mr-2 h-4 w-4" />
                Retour à l&apos;accueil
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
