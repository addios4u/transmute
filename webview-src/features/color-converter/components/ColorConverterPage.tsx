import { useTranslation } from "react-i18next";
import { CopyButton } from "@/shared/components/CopyButton";
import { useColorConverter } from "../hooks/useColorConverter";

export function ColorConverterPage() {
  const { t } = useTranslation("color-converter");
  const {
    hex,
    rgb,
    hsl,
    hexString,
    rgbString,
    hslString,
    updateFromHex,
    updateFromRgb,
    updateFromHsl,
  } = useColorConverter();

  const handleCopy = (format: string) => {
  };

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h1 className="text-xl font-bold">{t("title")}</h1>
        <p className="mt-1 text-sm text-text-secondary">{t("description")}</p>
      </div>

      {/* Color preview */}
      <div
        className="h-32 w-full rounded-xl border border-border/50 shadow-sm"
        style={{ backgroundColor: hexString }}
      />

      <div className="flex flex-col gap-4">
        {/* HEX */}
        <div className="rounded-xl border border-border/50 bg-bg-secondary/50 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-medium text-text-secondary">
              HEX
            </label>
            <CopyButton
              text={hexString}
              onCopy={() => handleCopy("hex")}
            />
          </div>
          <input
            type="text"
            value={hex}
            onChange={(e) => updateFromHex(e.target.value)}
            className="w-full rounded-lg border border-border bg-bg-secondary px-3 py-2 font-mono text-sm focus:border-accent focus:outline-none"
            placeholder="#000000"
          />
        </div>

        {/* RGB */}
        <div className="rounded-xl border border-border/50 bg-bg-secondary/50 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-medium text-text-secondary">
              RGB
            </label>
            <CopyButton
              text={rgbString}
              onCopy={() => handleCopy("rgb")}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs text-text-tertiary">R</label>
              <input
                type="number"
                min={0}
                max={255}
                value={rgb.r}
                onChange={(e) =>
                  updateFromRgb({ ...rgb, r: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-border bg-bg-secondary px-3 py-2 text-sm focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-tertiary">G</label>
              <input
                type="number"
                min={0}
                max={255}
                value={rgb.g}
                onChange={(e) =>
                  updateFromRgb({ ...rgb, g: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-border bg-bg-secondary px-3 py-2 text-sm focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-tertiary">B</label>
              <input
                type="number"
                min={0}
                max={255}
                value={rgb.b}
                onChange={(e) =>
                  updateFromRgb({ ...rgb, b: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-border bg-bg-secondary px-3 py-2 text-sm focus:border-accent focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* HSL */}
        <div className="rounded-xl border border-border/50 bg-bg-secondary/50 p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between">
            <label className="text-sm font-medium text-text-secondary">
              HSL
            </label>
            <CopyButton
              text={hslString}
              onCopy={() => handleCopy("hsl")}
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1 block text-xs text-text-tertiary">
                H (0-360)
              </label>
              <input
                type="number"
                min={0}
                max={360}
                value={hsl.h}
                onChange={(e) =>
                  updateFromHsl({ ...hsl, h: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-border bg-bg-secondary px-3 py-2 text-sm focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-tertiary">
                S (0-100%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={hsl.s}
                onChange={(e) =>
                  updateFromHsl({ ...hsl, s: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-border bg-bg-secondary px-3 py-2 text-sm focus:border-accent focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-text-tertiary">
                L (0-100%)
              </label>
              <input
                type="number"
                min={0}
                max={100}
                value={hsl.l}
                onChange={(e) =>
                  updateFromHsl({ ...hsl, l: Number(e.target.value) })
                }
                className="w-full rounded-lg border border-border bg-bg-secondary px-3 py-2 text-sm focus:border-accent focus:outline-none"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
