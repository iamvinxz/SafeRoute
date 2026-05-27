import {
  barangayHallHTML,
  healthCenterHTML,
  shelterHTML,
} from "@/utils/mapIcon";
import { barangayHallSVG, healthCenterSVG, shelterSVG } from "@/utils/svgIcons";

export const landMarks = [
  {
    name: "Barangay Hall",
    coordinates: { lat: 14.67020445507815, lng: 120.96488547174975 },
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
