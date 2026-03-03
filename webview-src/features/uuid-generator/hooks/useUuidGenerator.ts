import { useState, useCallback } from "react";
import {
  generateUuids,
  DEFAULT_UUID_OPTIONS,
  type UuidOptions,
} from "../lib/uuid";

export function useUuidGenerator() {
  const [options, setOptions] = useState<UuidOptions>(DEFAULT_UUID_OPTIONS);
  const [uuids, setUuids] = useState<string[]>([]);

  const generate = useCallback(() => {

    const result = generateUuids(options);
    setUuids(result);
  }, [options]);

  return { options, setOptions, uuids, generate };
}
