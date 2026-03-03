import { useState, useCallback } from "react";
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  isValidRgb,
  isValidHsl,
  type RGB,
  type HSL,
} from "../lib/converter";

export function useColorConverter() {
  const [hex, setHexState] = useState("#000000");
  const [rgb, setRgbState] = useState<RGB>({ r: 0, g: 0, b: 0 });
  const [hsl, setHslState] = useState<HSL>({ h: 0, s: 0, l: 0 });

  const updateFromHex = useCallback((value: string) => {
    setHexState(value);
    const rgbVal = hexToRgb(value);
    if (rgbVal) {
      setRgbState(rgbVal);
      setHslState(rgbToHsl(rgbVal));
    }
  }, []);

  const updateFromRgb = useCallback((value: RGB) => {
    setRgbState(value);
    if (isValidRgb(value)) {
      setHexState(rgbToHex(value));
      setHslState(rgbToHsl(value));
    }
  }, []);

  const updateFromHsl = useCallback((value: HSL) => {
    setHslState(value);
    if (isValidHsl(value)) {
      const rgbVal = hslToRgb(value);
      setRgbState(rgbVal);
      setHexState(rgbToHex(rgbVal));
    }
  }, []);

  const hexString = hex;
  const rgbString = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
  const hslString = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

  return {
    hex,
    rgb,
    hsl,
    hexString,
    rgbString,
    hslString,
    updateFromHex,
    updateFromRgb,
    updateFromHsl,
  };
}
