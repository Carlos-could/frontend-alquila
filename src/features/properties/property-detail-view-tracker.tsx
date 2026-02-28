"use client";

import { useEffect } from "react";
import { logger } from "@/features/observability/logger";

type PropertyDetailViewTrackerProps = {
  propertyId: string;
  city: string;
};

export function PropertyDetailViewTracker({ propertyId, city }: PropertyDetailViewTrackerProps) {
  useEffect(() => {
    logger.info("properties.detail.viewed", "Public property detail viewed.", { propertyId, city });
  }, [city, propertyId]);

  return null;
}
