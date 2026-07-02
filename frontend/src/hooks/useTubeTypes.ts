/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";

import {
  buildTubeTypeMap,
  getTubeTypes,
  type TubeTypeDefinition,
} from "../services/tubeTypeService";

export function useTubeTypes() {
  const [tubeTypes, setTubeTypes] = useState<TubeTypeDefinition[]>([]);
  const [tubeMap, setTubeMap] = useState<Record<string, TubeTypeDefinition>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getTubeTypes()
      .then((types) => {
        setTubeTypes(types);
        setTubeMap(buildTubeTypeMap(types));
      })
      .catch(() => setError("Failed to load tube types"))
      .finally(() => setLoading(false));
  }, []);

  return {
    tubeTypes,
    tubeMap,
    tubeOptions: tubeTypes.map((tube) => tube.name),
    loading,
    error,
  };
}
