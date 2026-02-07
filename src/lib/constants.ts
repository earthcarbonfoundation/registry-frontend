// Centralized constants to avoid duplication and improve maintainability

export const ACTION_TYPES = [
  { value: "solar_rooftop", label: "Solar Rooftop", unit: "kW" },
  { value: "swh", label: "Solar Water Heater", unit: "liters" },
  { value: "rwh", label: "Rainwater Harvesting", unit: "m³" },
  { value: "waterless_urinal", label: "Waterless Urinal", unit: "units" },
  {
    value: "wastewater_recycling",
    label: "Wastewater Recycling",
    unit: "m³/day",
  },
  { value: "biogas", label: "Biogas (Food Waste)", unit: "kg/day" },
  { value: "led_replacement", label: "LED Replacement", unit: "bulbs" },
  { value: "tree_plantation", label: "Tree Plantation", unit: "trees" },
];

export const ACTION_LABELS: Record<string, string> = ACTION_TYPES.reduce(
  (acc, type) => {
    acc[type.value] = type.label;
    return acc;
  },
  {} as Record<string, string>,
);
