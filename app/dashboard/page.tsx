import { Eye, MessageCircle, Users, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatCard } from "@/components/dashboard/stat-card";
import { EventsChart } from "@/components/dashboard/events-chart";
import { getEventSummary } from "@/lib/events";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Tableau de bord", robots: { index: false } };
export const dynamic = "force-dynamic";

const EVENT_LABELS: Record<string, string> = {
  page_view: "Vues de page",
  whatsapp_click: "Clics WhatsApp",
  mailto_click: "Clics e-mail",
  newsletter_signup: "Inscriptions newsletter",
};

export default async function DashboardPage() {
  const summary = await getEventSummary(30);

  const countFor = (name: string) =>
    summary.byName.find((n) => n.name === name)?.count ?? 0;

  return (
    <main className="site-container" style={{ paddingBlock: "3rem" }}>
      <div className="mb-8">
        <h1 style={{ fontSize: "var(--text-xl)", fontWeight: 500 }}>Tableau de bord</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          30 derniers jours — {summary.totalEvents} événements, {summary.uniqueSessions} visiteurs uniques
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Vues de page" value={String(countFor("page_view"))} icon={<Eye size={18} />} />
        <StatCard
          label="Clics WhatsApp"
          value={String(countFor("whatsapp_click"))}
          hint="Devis + contact direct"
          icon={<MessageCircle size={18} />}
        />
        <StatCard label="Visiteurs uniques" value={String(summary.uniqueSessions)} icon={<Users size={18} />} />
        <StatCard
          label="Inscriptions newsletter"
          value={String(countFor("newsletter_signup"))}
          icon={<Mail size={18} />}
        />
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Événements par jour</CardTitle>
        </CardHeader>
        <CardContent>
          <EventsChart data={summary.byDay} />
        </CardContent>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pages les plus actives</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead className="text-right">Événements</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.byPath.map((row) => (
                  <TableRow key={row.path}>
                    <TableCell className="font-mono text-xs">{row.path}</TableCell>
                    <TableCell className="text-right">{row.count}</TableCell>
                  </TableRow>
                ))}
                {summary.byPath.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-muted-foreground text-center">
                      Aucune donnée pour l&apos;instant.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Répartition par type</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.byName.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell>{EVENT_LABELS[row.name] ?? row.name}</TableCell>
                    <TableCell className="text-right">{row.count}</TableCell>
                  </TableRow>
                ))}
                {summary.byName.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-muted-foreground text-center">
                      Aucune donnée pour l&apos;instant.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quand</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Page</TableHead>
                <TableHead>Détail</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {summary.recent.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="text-muted-foreground text-xs whitespace-nowrap">
                    {new Date(event.createdAt).toLocaleString("fr-FR", {
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>{EVENT_LABELS[event.name] ?? event.name}</TableCell>
                  <TableCell className="font-mono text-xs">{event.path}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[24ch] truncate text-xs">
                    {event.meta ? JSON.stringify(event.meta) : ""}
                  </TableCell>
                </TableRow>
              ))}
              {summary.recent.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground text-center">
                    Aucun événement pour l&apos;instant.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
