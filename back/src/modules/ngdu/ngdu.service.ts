import { eq, ilike, sql } from 'drizzle-orm';

import { db } from '@/db/drizzle/connect';
import { cdng, kust, mest, ngdu, obj, plast, well } from '@/db/drizzle/schema/ngdu/schema';

import type { Links, Node } from './dto/ngdu.types';
import type {
  GetGraphRequest,
  PostIsConnectedRequest,
  PostObjectExistsRequest,
  PostObjectNameRequest
} from './dto/request.dto';
import type {
  GetGraphResponse,
  PostIsConnectedResponse,
  PostObjectExistsResponse,
  PostObjectNameResponse
} from './dto/response.dto';
import type { TSearchResult, TTarget } from './types/ngdu.types';

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

  const secondToLastType = (Object.entries(topologyMap).find(([, children]) =>
    children?.some((c) => c.type === 'well')
  )?.[0] ?? null) as TTarget | null;

  const loadBranch = async (type: TTarget, id: number) => {
    const key = `${type}_${id}`;
    if (visited.has(key)) return;
    visited.add(key);

    const table = tables[type] as any;

    const [record] = await db.select().from(table).where(eq(table.id, id));
    if (!record) return;

    nodes.push({ id: record.id, name: record.name, type });

    const children = topologyMap[type] ?? [];

    if (type === secondToLastType) {
      for (const child of children) {
        const rows = await db.select().from(child.table).where(eq(child.column, id));

        for (const r of rows) {
          nodes.push({ id: r.id, name: r.name, type: child.type });

          links.push({ sourceId: id, targetId: r.id });
        }
      }
      return;
    }

    for (const child of children) {
      const rows = await db.select().from(child.table).where(eq(child.column, id));

      for (const r of rows) {
        links.push({ sourceId: id, targetId: r.id });

        await loadBranch(child.type as TTarget, r.id);
      }
    }
  };

  await loadBranch(dto.type, dto.id);

  return { nodes, links };
};

export const searchAllTables = async (query: string): Promise<TSearchResult> => {
  const result: TSearchResult = {
    ngdu: [],
    mest: [],
    cdng: [],
    obj: [],
    plast: [],
    kust: [],
    well: []
  };

  if (!query?.trim()) return result;

  const searchTerm = `%${query.trim()}%`;

  const tables: Record<TTarget, any> = { ngdu, mest, cdng, obj, plast, kust, well };

  for (const [type, table] of Object.entries(tables) as [TTarget, any][]) {
    const rows = await db
      .select({ id: table.id, name: table.name })
      .from(table)
      .where(ilike(table.name, searchTerm));

    if (rows.length) {
      result[type] = rows.map((r) => ({ id: r.id, name: r.name }));
    }
  }

  return result;
};

export const objectExists = async (
  dto: PostObjectExistsRequest
): Promise<PostObjectExistsResponse> => {
  try {
    const formattedTableName = sql.identifier(dto.type.toLowerCase());

    const data = await db.execute<{ name: string }>(sql`
      SELECT * FROM ${formattedTableName}
      WHERE id = ${dto.id}
    `);
    return {
      exists: data.rowCount > 0
    };
  } catch (error) {
    throw error;
  }
};

export const objectByName = async (dto: PostObjectNameRequest): Promise<PostObjectNameResponse> => {
  try {
    const formattedTableName = sql.identifier(dto.type.toLowerCase());

    const data = await db.execute<{ name: string }>(sql`
      SELECT name FROM ${formattedTableName}
      WHERE id = ${dto.id}
    `);

    if (data.rowCount === 0) {
      throw new Error(`Object with id ${dto.id} not found in ${formattedTableName}`);
    }

    return {
      name: data.rows[0].name
    };
  } catch (error) {
    throw error;
  }
};

export const isConnected = async (
  dto: PostIsConnectedRequest
): Promise<PostIsConnectedResponse> => {
  try {
    const normalize = (s: string) => s.toLowerCase() as TTarget;

    const sourceType = normalize(dto.source.type);
    const targetType = normalize(dto.target.type);

    const tables = { ngdu, mest, cdng, obj, plast, kust, well } as const;

    const edges: Record<TTarget, { table: any; fk: string; type: TTarget }[]> = {
      ngdu: [
        { table: mest, fk: 'ngduId', type: 'mest' },
        { table: cdng, fk: 'ngduId', type: 'cdng' }
      ],
      mest: [
        { table: ngdu, fk: 'id', type: 'ngdu' },
        { table: obj, fk: 'mestId', type: 'obj' }
      ],
      cdng: [
        { table: ngdu, fk: 'id', type: 'ngdu' },
        { table: kust, fk: 'cdngId', type: 'kust' }
      ],
      obj: [
        { table: mest, fk: 'id', type: 'mest' },
        { table: plast, fk: 'objId', type: 'plast' }
      ],
      plast: [
        { table: obj, fk: 'id', type: 'obj' },
        { table: well, fk: 'plastId', type: 'well' }
      ],
      kust: [
        { table: cdng, fk: 'id', type: 'cdng' },
        { table: well, fk: 'kustId', type: 'well' }
      ],
      well: [
        { table: kust, fk: 'id', type: 'kust' },
        { table: plast, fk: 'id', type: 'plast' }
      ]
    };

    const queue: { type: TTarget; id: number }[] = [{ type: sourceType, id: dto.source.id }];
    const visited = new Set<string>();

    while (queue.length > 0) {
      const node = queue.shift()!;
      const key = `${node.type}_${node.id}`;

      if (visited.has(key)) continue;
      visited.add(key);

      if (node.type === targetType && node.id === dto.target.id) {
        return { connected: true };
      }

      for (const edge of edges[node.type]) {
        const childTable = edge.table;

        if (edge.fk !== 'id') {
          const rows = await db
            .select({ id: childTable.id })
            .from(childTable)
            .where(eq(childTable[edge.fk], node.id));

          for (const row of rows) {
            queue.push({ type: edge.type, id: row.id });
          }
        } else {
          const currentTable = tables[node.type] as any;
          const [rec] = await db.select().from(currentTable).where(eq(currentTable.id, node.id));

          if (rec && rec[`${edge.type}Id`]) {
            queue.push({ type: edge.type, id: rec[`${edge.type}Id`] });
          }
        }
      }
    }

    return { connected: false };
  } catch (error) {
    throw error;
  }
};
