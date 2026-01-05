/**
 * @file route.ts
 * @description src/app/api/species/with-locations/route.ts
 * @author github-actions[bot]
 * @created 2026-01-04
 * @updated 2026-01-04
 * @updates 1
 * @lines 76
 * @size 2.40 KB
 */
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Note: Using HTTP cache headers instead of revalidate because routes require authentication

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    // Fetch all species with locations and photos in a single query
    const species = await prisma.species.findMany({
      include: {
        locations: {
          orderBy: { observedAt: "desc" },
          take: 10, // Limit locations per species to avoid too much data
        },
        photos: {
          orderBy: { createdAt: "desc" },
          take: 3, // Limit photos per species (we only need the first one for map)
        },
      },
      orderBy: { scientificName: "asc" },
    });

    // Transform the data to flat structure for map markers
    const speciesWithLocations: any[] = [];
    
    for (const spec of species) {
      if (spec.locations && spec.locations.length > 0) {
        // Create one marker per location
        spec.locations.forEach((loc) => {
          speciesWithLocations.push({
            id: `${spec.id}-${loc.id}`,
            speciesId: spec.id,
            scientificName: spec.scientificName,
            commonName: spec.commonName,
            type: spec.type,
            iucnStatus: spec.iucnStatus,
            habitat: spec.habitat,
            latitude: loc.latitude,
            longitude: loc.longitude,
            location: loc.location,
            observedAt: loc.observedAt,
            notes: loc.notes,
            photos: spec.photos || [], // Include all photos for this species
          });
        });
      }
    }

    // Cache for 5 minutes
    return NextResponse.json(speciesWithLocations, {
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    });
  } catch (error: any) {
    console.error("Error fetching species with locations:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération" },
      { status: 500 }
    );
  }
}

