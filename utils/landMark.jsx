import {
  barangayHallHTML,
  healthCenterHTML,
  shelterHTML,
} from "@/utils/mapIcon";
import { barangayHallSVG, healthCenterSVG, shelterSVG } from "@/utils/svgIcons";

export const landMarks = [
  {
    name: "Barangay Hall",
    coordinates: { lat: 14.671713871663536, lng: 120.97042400298534 },
    iconHTML: barangayHallHTML, //base64
    iconSVG: barangayHallSVG, //svg
  },
  {
    name: "Health Center",
    coordinates: { lat: 14.671671704218502, lng: 120.97030390962857 },
    iconHTML: healthCenterHTML,
    iconSVG: healthCenterSVG,
  },
  {
    name: "Evacuation Center",
    coordinates: { lat: 14.671372083129416, lng: 120.97004644282855 },
    iconHTML: shelterHTML,
    iconSVG: shelterSVG,
  },
];
