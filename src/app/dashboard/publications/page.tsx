/**
 * @file page.tsx
 * @description src/app/dashboard/publications/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 1
 * @lines 187
 * @size 8.11 KB
 */
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { Plus, BookOpen, FileDown } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default async function PublicationsPage() {
  const publications = await prisma.publication.findMany({
    include: {
      _count: {
        select: {
          chapters: true,
        },
      },
    },
    orderBy: { year: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Édition & Publication
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
            Livre annuel et publications scientifiques
          </p>
        </div>
        <Link href="/dashboard/publications/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle publication
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-md transition-shadow duration-200" variant="elevated">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Total publications
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {publications.length}
              </p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-3 rounded-xl flex-shrink-0 ml-4 shadow-sm">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow duration-200" variant="elevated">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                Publiées
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {publications.filter((p) => p.isPublished).length}
              </p>
            </div>
            <div className="bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 p-3 rounded-xl flex-shrink-0 ml-4 shadow-sm">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6 hover:shadow-md transition-shadow duration-200" variant="elevated">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                En préparation
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
                {publications.filter((p) => !p.isPublished).length}
              </p>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 p-3 rounded-xl flex-shrink-0 ml-4 shadow-sm">
              <BookOpen className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      <Card variant="elevated" className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Titre
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Année
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Chapitres
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {publications.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12">
                    <EmptyState
                      icon={BookOpen}
                      title="Aucune publication"
                      description="Commencez par créer une nouvelle publication."
                      action={
                        <Link href="/dashboard/publications/new">
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Créer une publication
                          </Button>
                        </Link>
                      }
                    />
                  </td>
                </tr>
              ) : (
                publications.map((pub) => (
                  <tr key={pub.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {pub.title}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">{pub.year}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">{pub.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {pub._count.chapters} chapitre(s)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge
                        variant={pub.isPublished ? "success" : "warning"}
                        size="sm"
                      >
                        {pub.isPublished ? "Publié" : "En préparation"}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/publications/${pub.id}`}>
                          <Button variant="ghost" size="sm">
                            Voir
                          </Button>
                        </Link>
                        {pub.isPublished && (
                          <Button variant="ghost" size="sm" title="Télécharger PDF">
                            <FileDown className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

