/**
 * @file page.tsx
 * @description src/app/dashboard/documents/page.tsx
 * @author 1
 * @created 2026-01-01
 * @updated 2026-01-01
 * @updates 2
 * @lines 171
 * @size 6.81 KB
 */
import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import Link from "next/link";
import { Plus, FileText, Download } from "lucide-react";
import { formatDate } from "@/lib/utils";

const typeLabels: Record<string, string> = {
  RAPPORT_SCIENTIFIQUE: "Rapport Scientifique",
  RAPPORT_ADMINISTRATIF: "Rapport Administratif",
  DONNEE_BRUTE: "Donnée Brute",
  PUBLICATION: "Publication",
  AUTRE: "Autre",
};

export default async function DocumentsPage() {
  const documents = await prisma.document.findMany({
    include: {
      author: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      mission: {
        select: {
          title: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
            Gestion Documentaire
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-400 mt-1.5">
            Rapports, données et publications
          </p>
        </div>
        <Link href="/dashboard/documents/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nouveau document
          </Button>
        </Link>
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
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Auteur
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Mission
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Version
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
              {documents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12">
                    <EmptyState
                      icon={FileText}
                      title="Aucun document"
                      description="Commencez par ajouter un nouveau document."
                      action={
                        <Link href="/dashboard/documents/new">
                          <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Ajouter un document
                          </Button>
                        </Link>
                      }
                    />
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                        <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                          {doc.title}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="info" size="sm">
                        {typeLabels[doc.type] || doc.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {doc.author.firstName} {doc.author.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {doc.mission?.title || "N/A"}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">v{doc.version}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(doc.createdAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <Link href={doc.fileUrl} target="_blank">
                          <Button variant="ghost" size="sm" title="Télécharger">
                            <Download className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/dashboard/documents/${doc.id}`}>
                          <Button variant="ghost" size="sm">
                            Voir
                          </Button>
                        </Link>
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

