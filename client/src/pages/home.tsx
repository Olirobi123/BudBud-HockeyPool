import { useCallback } from 'react';
import { Link } from 'wouter';
import {
  ArrowRight, Calendar, Trophy, Users, TrendingUp,
} from 'lucide-react';
import Navigation from '@/components/navigation';
import HeroSection from '@/components/hero-section';
import Footer from '@/components/footer';
import {
  Card, CardContent, CardHeader, CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-900">
      <Navigation />
      <HeroSection />

      {/* Recent Activity Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Live Activity Feed */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Activité en Direct
								</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  <span className="text-sm text-green-600 font-medium">
                  En direct
  </span>
                </div>
              </div>

              <div className="space-y-4">
                {/* The following block was removed as per the edit hint */}
                {/* {recentActivity.map((activity, index) => ( */}
                {/* 	<Card */}
                {/* 		key={index} */}
                {/* 		className="border-l-4 border-l-primary" */}
                {/* 	> */}
                {/* 		<CardContent className="p-4"> */}
                {/* 			<div className="flex items-start justify-between"> */}
                {/* 				<div className="flex-1"> */}
                {/* 					<div className="flex items-center space-x-2 mb-1"> */}
                {/* 						<Badge */}
                {/* 							variant={ */}
                {/* 								activity.type === "trade" */}
                {/* 									? "default" */}
                {/* 									: "secondary" */}
                {/* 							} */}
                {/* 						> */}
                {/* 							{activity.type === "trade" */}
                {/* 								? "Échange" */}
                {/* 								: activity.type === */}
                {/* 								  "scoring" */}
                {/* 								? "Score" */}
                {/* 								: "Match"} */}
                {/* 						</Badge> */}
                {/* 						<span className="text-sm text-gray-500"> */}
                {/* 							{activity.time} */}
                {/* 						</span> */}
                {/* 					</div> */}
                {/* 					<p className="font-medium text-gray-900 mb-1"> */}
                {/* 						{activity.description} */}
                {/* 					</p> */}
                {/* 					<p className="text-sm text-gray-600"> */}
                {/* 						{activity.details} */}
                {/* 					</p> */}
                {/* 				</div> */}
                {/* 			</div> */}
                {/* 		</CardContent> */}
                {/* 	</Card> */}
                {/* ))} */}
              </div>
            </div>

            {/* Latest Trade Sidebar */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                Dernier Échange
              </h3>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg">
                  Échange Récent
									</CardTitle>
                  <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                  {/* The following block was removed as per the edit hint */}
                  {/* {latestTrade.date} */}
                </span>
                </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                  <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">
                  {/* The following block was removed as per the edit hint */}
                  {/* {latestTrade.teamA} */}
                </h4>
                  <div className="space-y-1">
                  {/* The following block was removed as per the edit hint */}
                  {/* {latestTrade.playersA.map( */}
                  {/* 	(player, index) => ( */}
                  {/* 		<div */}
                  {/* 			key={index} */}
                  {/* 			className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded" */}
                  {/* 		> */}
                  {/* 			{player} */}
                  {/* 		</div> */}
                  {/* 	) */}
                  {/* )} */}
                </div>
                </div>

                  <div className="text-center">
                  <div className="text-gray-400 font-bold">
                  ↕
    </div>
                </div>

                  <div className="text-center">
                  <h4 className="font-semibold text-gray-900 mb-2">
                  {/* The following block was removed as per the edit hint */}
                  {/* {latestTrade.teamB} */}
                </h4>
                  <div className="space-y-1">
                  {/* The following block was removed as per the edit hint */}
                  {/* {latestTrade.playersB.map( */}
                  {/* 	(player, index) => ( */}
                  {/* 		<div */}
                  {/* 			key={index} */}
                  {/* 			className="text-sm bg-red-100 text-red-700 px-2 py-1 rounded" */}
                  {/* 		> */}
                  {/* 			{player} */}
                  {/* 		</div> */}
                  {/* 	) */}
                  {/* )} */}
                </div>
                </div>
                </div>

                  <Link href="/echanges">
                  <Button className="w-full mt-4 bg-primary hover:bg-primary/90 text-white">
                  Voir tous les Échanges
      <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                </Link>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                  Actions Rapides
									</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Link href="/equipes">
                  <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Trophy className="w-4 h-4 mr-2" />
                  Voir Classement
										</Button>
                </Link>

                  <Link href="/draft">
                  <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Repêchage 2024-25
    </Button>
                </Link>

                  <a
                  href="https://www.marqueur.com/hockey/mbr/tools/pool/index.php?nyx=190707"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button
                  variant="outline"
                  className="w-full justify-start"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Statistiques Marqueur
    </Button>
                </a>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
