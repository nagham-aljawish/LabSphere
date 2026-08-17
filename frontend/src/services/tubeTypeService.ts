import api from "./api";

export interface ApiTubeType {
  id: number;
  name: string;
  color_class: string;
  hex_color: string;
  color_label: string;
  additive: string;
  use_for: string;
  sort_order: number;
  is_active: boolean;
}

export interface TubeTypeDefinition {
  name: string;
  colorClass: string;
  hexColor: string;
  colorLabel: string;
  additive: string;
  useFor: string;
}

function mapTubeType(tube: ApiTubeType): TubeTypeDefinition {
  return {
    name: tube.name,
    colorClass: tube.color_class,
    hexColor: tube.hex_color,
    colorLabel: tube.color_label,
    additive: tube.additive,
    useFor: tube.use_for,
  };
}

export function buildTubeTypeMap(
  tubeTypes: TubeTypeDefinition[],
): Record<string, TubeTypeDefinition> {
  return Object.fromEntries(tubeTypes.map((tube) => [tube.name, tube]));
}

let tubeTypesCache: TubeTypeDefinition[] | null = null;
let tubeTypesCacheAt = 0;
const TUBE_TYPES_CACHE_TTL_MS = 5 * 60 * 1000;

export async function getTubeTypes(): Promise<TubeTypeDefinition[]> {
  if (tubeTypesCache && Date.now() - tubeTypesCacheAt < TUBE_TYPES_CACHE_TTL_MS) {
    return tubeTypesCache;
  }

  const { data } = await api.get<ApiTubeType[]>("/tube-types");
  tubeTypesCache = data.map(mapTubeType);
  tubeTypesCacheAt = Date.now();
  return tubeTypesCache;
}

export function getTubeHexColor(
  tubeType: string,
  tubeMap: Record<string, TubeTypeDefinition>,
): string {
  return tubeMap[tubeType]?.hexColor ?? "#94A3B8";
}
