export type FieldAccessor<T> = (item: T) => string | string[] | null | undefined;

export interface WeightedField<T> {
  weight: number;
  accessor: FieldAccessor<T>;
}

export function computeSearchScore<T>(
  item: T,
  query: string,
  fields: Record<string, WeightedField<T>>
): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return 0;

  let score = 0;

  for (const key in fields) {
    const { weight, accessor } = fields[key];
    const raw = accessor(item);
    const values = Array.isArray(raw) ? raw : [raw];
    const haystack = values
      .filter((v): v is string => typeof v === "string")
      .map((v) => v.toLowerCase())
      .join(" ");

    if (!haystack) continue;

    // All tokens must be present for this field to count
    const matchAll = tokens.every((t) => haystack.includes(t));
    if (matchAll) {
      score += weight;
      continue;
    }

    // Partial token coverage: give fractional credit
    const matched = tokens.filter((t) => haystack.includes(t)).length;
    if (matched > 0) {
      score += weight * (matched / tokens.length) * 0.6;
    }
  }

  return score;
}


