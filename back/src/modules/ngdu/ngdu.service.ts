import { eq, ilike } from 'drizzle-orm';

import { db } from '@/db/drizzle/connect';
import { cdng, kust, mest, ngdu, obj, plast, well } from '@/db/drizzle/schema/ngdu/schema';

import type { GetGraphRequest, GetGraphResponse, Links, Node } from './dto/get-graph.dto';
import type { TTarget } from './types/ngdu.types';

export const getNgduList = async (query: string) => {
  try {
    const rawQuery = db
      .select({
        id: ngdu.id,
        name: ngdu.name
      })
      .from(ngdu)
      .$dynamic();
    if (query?.trim()) {
      const searchTerm = `%${query.trim()}%`;
      return await rawQuery.where(ilike(ngdu.name, searchTerm));
    }

    return await rawQuery;
  } catch (error) {
    throw error;
  }
};

export const getNgduGraph = async (dto: GetGraphRequest): Promise<GetGraphResponse> => {
  const nodes: Node[] = [];
  const links: Links[] = [];
  const visited = new Set<string>();

  const tables = { ngdu, mest, cdng, obj, kust, plast, well } as const;

  const topologyMaps = {
    organizational: {
      ngdu: [{ table: cdng, type: 'cdng', column: cdng.ngduId }],
      cdng: [{ table: kust, type: 'kust', column: kust.cdngId }],
      kust: [{ table: well, type: 'well', column: well.kustId }],
      well: []
    },

    geological: {
      ngdu: [{ table: mest, type: 'mest', column: mest.ngduId }],
      mest: [{ table: obj, type: 'obj', column: obj.mestId }],
      obj: [{ table: plast, type: 'plast', column: plast.objId }],
      plast: [{ table: well, type: 'well', column: well.plastId }],
      well: []
    }
  } as const;

  const topologyMap = topologyMaps[dto.topology];

  /**
   * Тип перед well (например kust → well или plast → well)
   * Чтобы понять, на каком уровне нужно "вывалить список wells"
   */
  const secondToLastType = (Object.entries(topologyMap).find(([, children]) =>
    children?.some((c) => c.type === 'well')
  )?.[0] ?? null) as TTarget | null;

  /**
   * Основная рекурсивная функция
   */
  const loadBranch = async (type: TTarget, id: number) => {
    const key = `${type}_${id}`;
    if (visited.has(key)) return;
    visited.add(key);

    const table = tables[type] as any;

    const [record] = await db.select().from(table).where(eq(table.id, id));
    if (!record) return;

    // Добавляем текущий узел
    nodes.push({ id: record.id, name: record.name, type });

    const children = topologyMap[type] ?? [];

    /**
     * Когда дошли до предпоследнего уровня
     * — выводим все wells, но НЕ продолжаем рекурсию
     */
    if (type === secondToLastType) {
      for (const child of children) {
        const rows = await db.select().from(child.table).where(eq(child.column, id));

        for (const r of rows) {
          nodes.push({ id: r.id, name: r.name, type: child.type });

          // ВАЖНО: теперь линки тоже добавляем
          links.push({ sourceId: id, targetId: r.id });
        }
      }
      return;
    }

    /**
     * Обычная рекурсивная работа
     */
    for (const child of children) {
      const rows = await db.select().from(child.table).where(eq(child.column, id));

      for (const r of rows) {
        // Линки добавляем всегда на каждом уровне
        links.push({ sourceId: id, targetId: r.id });

        await loadBranch(child.type as TTarget, r.id);
      }
    }
  };

  await loadBranch(dto.type, dto.id);

  return { nodes, links };
};
