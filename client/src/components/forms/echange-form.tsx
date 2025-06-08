import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeftRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface Equipe {
  id: number;
  nom: string;
  active: boolean;
}

const echangeSchema = z.object({
  equipe_source_id: z.string(),
  equipe_destination_id: z.string(),
  details: z.string().min(10, "Les détails doivent contenir au moins 10 caractères"),
});

export default function EchangeForm() {
  const [open, setOpen] = useState(false);
  
  const form = useForm<z.infer<typeof echangeSchema>>({
    resolver: zodResolver(echangeSchema),
  });

  const { data: equipes } = useQuery<Equipe[]>({
    queryKey: ["equipes-actives"],
    queryFn: async () => {
      const response = await fetch("/api/teams/active");
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des équipes");
      }
      return response.json();
    },
  });

  const onSubmit = async (values: z.infer<typeof echangeSchema>) => {
    try {
      const response = await fetch("/api/echanges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création de l'échange");
      }

      setOpen(false);
      // Recharger les données après la création
      window.location.reload();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-white">
          <ArrowLeftRight className="w-4 h-4 mr-2" />
          Proposer un Échange
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Proposer un Échange</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="equipe_source_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Équipe Source</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner l'équipe source" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {equipes?.map((equipe) => (
                        <SelectItem key={equipe.id} value={equipe.id.toString()}>
                          {equipe.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="equipe_destination_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Équipe Destination</FormLabel>
                  <Select onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner l'équipe destination" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {equipes?.map((equipe) => (
                        <SelectItem key={equipe.id} value={equipe.id.toString()}>
                          {equipe.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Détails de l'Échange</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Entrez les détails de l'échange (joueurs impliqués, etc.)"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2">
              <Button variant="outline" type="button" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button type="submit">
                Proposer l'Échange
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
