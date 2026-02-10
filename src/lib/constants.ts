// Centralized constants to avoid duplication and improve maintainability
export const ACTION_TYPES = [
  { value: "solar_rooftop", label: "Solar Rooftop", unit: "kW" },
  { value: "swh", label: "Solar Water Heater", unit: "liters" },
  { value: "rwh", label: "Rainwater Harvesting", unit: "m³" },
  { value: "waterless_urinal", label: "Waterless Urinal", unit: "No." },
  { value: "wastewater_recycling", label: "Wastewater Recycling", unit: "m3" },
  { value: "biogas", label: "Biogas (Food Waste)", unit: "kg" },
  { value: "led_replacement", label: "LED Replacement", unit: "No." },
  { value: "tree_plantation", label: "Tree Plantation", unit: "No. of Trees" },
];
export const ACTION_LABELS: Record<string, string> = ACTION_TYPES.reduce(
  (acc, type) => {
    acc[type.value] = type.label;
    return acc;
  },
  {} as Record<string, string>,
);
