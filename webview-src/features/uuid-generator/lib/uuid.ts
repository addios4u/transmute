export interface UuidOptions {
  count: number;
  uppercase: boolean;
  hyphens: boolean;
}

export const DEFAULT_UUID_OPTIONS: UuidOptions = {
  count: 1,
  uppercase: false,
  hyphens: true,
};

export const COUNT_OPTIONS = [1, 5, 10, 50, 100] as const;

export function generateUuids(options: UuidOptions): string[] {
  const uuids: string[] = [];
  for (let i = 0; i < options.count; i++) {
    let uuid: string = crypto.randomUUID();
    if (!options.hyphens) {
      uuid = uuid.replace(/-/g, "");
    }
    if (options.uppercase) {
      uuid = uuid.toUpperCase();
    }
    uuids.push(uuid);
  }
  return uuids;
}
