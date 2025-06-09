import { Children, cloneElement, isValidElement } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlayerDetails from "@/types/IPlayerDetails";

type Props = {
    children: React.ReactElement<{player: PlayerDetails}>[];
    player: PlayerDetails;
}

export default function JoueurTabs({ children, player }: Props) {
    //clone children and add player prop to each of them
    const childrenWithProps = Children.map(children, child => {
        if (isValidElement(child)) {
            return cloneElement(child , { player });
        }
        return child;
    });

    return(
         <Tabs defaultValue="apercu" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger className="" value="apercu">Aperçu</TabsTrigger>
              <TabsTrigger className="" value="stats">Statistiques</TabsTrigger>
              <TabsTrigger className="bg-red" value="derniers-matchs">5 derniers matchs</TabsTrigger>
            </TabsList>

            {childrenWithProps}

        </Tabs>
    )
}