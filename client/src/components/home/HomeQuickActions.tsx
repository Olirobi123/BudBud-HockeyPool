import React from 'react';
import { Trophy, Users, TrendingUp } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import {
  Card, CardHeader, CardTitle, CardContent,
} from '@/components/ui/card';
import { ArrowLeftRight } from 'lucide-react';

export const HomeQuickActions: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg">Actions Rapides</CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <Link href="/equipes">
        <Button variant="outline" className="w-full justify-start">
          <Trophy className="w-4 h-4 mr-2" />
          Voir Classement
        </Button>
      </Link>
      <Link href="/draft">
        <Button variant="outline" className="w-full justify-start">
          <Users className="w-4 h-4 mr-2" />
          Repêchage 2024-25
        </Button>
      </Link>
      <Link href="/echanges" className="w-full justify-start">
        <Button  variant="outline" className="w-full justify-start">
          <ArrowLeftRight className="w-4 h-4 mr-2" />
          Voir tous les Échanges
        </Button>
      </Link>

      <a
        href="https://www.marqueur.com/hockey/mbr/tools/pool/index.php?nyx=190707"
        target="_blank"
        rel="noopener noreferrer"
        className="block"
      >
        <Button variant="outline" className="w-full justify-start">
          <TrendingUp className="w-4 h-4 mr-2" />
          Statistiques Marqueur
        </Button>
      </a>
    </CardContent>
  </Card>
);
