import { AlertCircle, Home as HomeIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 border-slate-700 bg-slate-800/50 backdrop-blur-sm">
        <CardContent className="pt-8 pb-8 text-center space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-white/10 p-3">
              <AlertCircle className="h-10 w-10 text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-white">Page introuvable</h1>
            <p className="text-slate-400">
              Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
            </p>
          </div>

          <div className="flex justify-center">
            <Link to="/">
              <Button className="w-full bg-gradient-to-r from-blue-400 to-cyan-400 text-slate-900 hover:from-blue-500 hover:to-cyan-500 font-bold shadow-lg">
                <HomeIcon className="mr-2 h-4 w-4" />
                Retour à l'accueil
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
