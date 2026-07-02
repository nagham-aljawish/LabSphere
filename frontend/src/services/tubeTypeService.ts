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

export async function getTubeTypes(): Promise<TubeTypeDefinition[]> {
  const { data } = await api.get<ApiTubeType[]>("/tube-types");
  return data.map(mapTubeType);
}

export function getTubeHexColor(
  tubeType: string,
  tubeMap: Record<string, TubeTypeDefinition>,
): string {
  return tubeMap[tubeType]?.hexColor ?? "#94A3B8";
}
