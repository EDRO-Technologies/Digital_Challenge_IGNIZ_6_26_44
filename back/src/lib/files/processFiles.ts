import csv from 'csv-parser';
import { count } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import fs from 'node:fs';
import path from 'node:path';
import { Pool } from 'pg';

import config from '../../config';
import * as schema from '../../db/drizzle/schema/ngdu/schema';

const pool = new Pool({
  host: config.database.postgres.host,
  port: +config.database.postgres.port,
  user: config.database.postgres.user,
  password: config.database.postgres.password,
  database: config.database.postgres.database
});
const db = drizzle(pool);

// Интерфейсы для данных
interface CDNG_KUST {
  cdngid: number;
  cdngname: string;
  kustid: number;
  kustname: string;
}

interface KUST_WELL {
  kustid: number;
  kustname: string;
  wellid: number;
  wellname: string;
}

interface MEST_OBJ {
  mestid: number;
  mestname: string;
  objid: number;
  objname: string;
}

interface NGDU_CDNG {
  cdngid: number;
  cdngname: string;
  ngduid: number;
  ngduname: string;
}

interface NGDU_MEST {
  mestid: number;
  mestname: string;
  ngduid: number;
  ngduname: string;
}

interface OBJ_PLAST {
  objid: number;
  objname: string;
  plastid: number;
  plastname: string;
}

interface PLAST_WELL {
  plastid: number;
  plastname: string;
  wellid: number;
  wellname: string;
}

class DataImporter {
  private processedNgdu = new Map<number, string>();
  private processedCdng = new Map<number, { name: string; ngduId: number }>();
  private processedKust = new Map<number, { name: string; cdngId: number }>();
  private processedMest = new Map<number, { name: string; ngduId: number }>();
  private processedObj = new Map<number, { name: string; mestId: number }>();
  private processedPlast = new Map<number, { name: string; objId: number }>();
  private processedWell = new Map<number, { name: string; kustId: number; plastId: number }>();

  private readonly BATCH_SIZE = 1000;

  async importAll() {
    try {
      console.log('Начало импорта данных...');

      // Порядок важен для соблюдения foreign keys
      await this.importNgduData();
      await this.importCdngKustData();
      await this.importMestObjData();
      await this.importWellData();

      console.log('Все данные успешно импортированы!');
    } catch (error) {
      console.error('Ошибка импорта:', error);
    }
  }

  private async importNgduData() {
    console.log('Импорт NGDU данных...');

    // Обрабатываем NGDU-CDNG и NGDU-MEST параллельно
    await Promise.all([
      this.processCSV<NGDU_CDNG>('NGDU-CDNG.csv', async (row) => {
        this.processedNgdu.set(row.ngduid, row.ngduname);
        this.processedCdng.set(row.cdngid, {
          name: row.cdngname,
          ngduId: row.ngduid
        });
      }),
      this.processCSV<NGDU_MEST>('NGDU-MEST.csv', async (row) => {
        this.processedNgdu.set(row.ngduid, row.ngduname);
        this.processedMest.set(row.mestid, {
          name: row.mestname,
          ngduId: row.ngduid
        });
      })
    ]);

    // Вставляем NGDU батчами
    const ngduData = Array.from(this.processedNgdu.entries()).map(([id, name]) => ({
      id,
      name
    }));
    await this.batchInsert(schema.ngdu, ngduData, 'НГДУ');
  }

  private async importCdngKustData() {
    console.log('Импорт CDNG-KUST данных...');

    await this.processCSV<CDNG_KUST>('CDNG-KUST.csv', async (row) => {
      this.processedKust.set(row.kustid, {
        name: row.kustname,
        cdngId: row.cdngid
      });
    });

    // Вставляем CDNG батчами
    const cdngData = Array.from(this.processedCdng.entries()).map(([id, data]) => ({
      id,
      name: data.name,
      ngduId: data.ngduId
    }));
    await this.batchInsert(schema.cdng, cdngData, 'ЦДНГ');

    // Вставляем KUST батчами
    const kustData = Array.from(this.processedKust.entries()).map(([id, data]) => ({
      id,
      name: data.name,
      cdngId: data.cdngId
    }));
    await this.batchInsert(schema.kust, kustData, 'кустов');
  }

  private async importMestObjData() {
    console.log('Импорт MEST-OBJ данных...');

    await Promise.all([
      this.processCSV<MEST_OBJ>('MEST-OBJ.csv', async (row) => {
        this.processedObj.set(row.objid, {
          name: row.objname,
          mestId: row.mestid
        });
      }),
      this.processCSV<OBJ_PLAST>('OBJ-PLAST.csv', async (row) => {
        this.processedPlast.set(row.plastid, {
          name: row.plastname,
          objId: row.objid
        });
      })
    ]);

    // Вставляем MEST батчами
    const mestData = Array.from(this.processedMest.entries()).map(([id, data]) => ({
      id,
      name: data.name,
      ngduId: data.ngduId
    }));
    await this.batchInsert(schema.mest, mestData, 'месторождений');

    // Вставляем OBJ батчами
    const objData = Array.from(this.processedObj.entries()).map(([id, data]) => ({
      id,
      name: data.name,
      mestId: data.mestId
    }));
    await this.batchInsert(schema.obj, objData, 'объектов');

    // Вставляем PLAST батчами
    const plastData = Array.from(this.processedPlast.entries()).map(([id, data]) => ({
      id,
      name: data.name,
      objId: data.objId
    }));
    await this.batchInsert(schema.plast, plastData, 'пластов');
  }

  private async importWellData() {
    console.log('Импорт данных по скважинам...');

    const wellKustMap = new Map<number, number>();
    const wellPlastMap = new Map<number, number>();
    const wellNames = new Map<number, string>();

    await Promise.all([
      this.processCSV<KUST_WELL>('KUST-WELL.csv', async (row) => {
        wellKustMap.set(row.wellid, row.kustid);
        wellNames.set(row.wellid, row.wellname);
      }),
      this.processCSV<PLAST_WELL>('PLAST-WELL.csv', async (row) => {
        wellPlastMap.set(row.wellid, row.plastid);
        wellNames.set(row.wellid, row.wellname);
      })
    ]);

    const wellData = Array.from(wellNames.entries())
      .map(([id, name]) => {
        const kustId = wellKustMap.get(id);
        const plastId = wellPlastMap.get(id);

        if (!kustId || !plastId) {
          console.warn(`Неполные данные для скважины ${id}`);
          return null;
        }

        return {
          id,
          name,
          kustId,
          plastId
        };
      })
      .filter(Boolean);

    await this.batchInsert(schema.well, wellData, 'скважин');
  }

  private async batchInsert(table: any, data: any[], entityName: string) {
    const countRows = await db.select({ count: count() }).from(table);
    if (data.length === 0) {
      console.log(`Нет данных для вставки: ${entityName}`);
      return;
    }
    if (countRows[0].count > 0) {
      console.log(`В таблице ${entityName} уже присутствуют данные`);
      return;
    }

    for (let i = 0; i < data.length; i += this.BATCH_SIZE) {
      const batch = data.slice(i, i + this.BATCH_SIZE);
      await db.insert(table).values(batch).onConflictDoNothing();
    }

    console.log(`Добавлено ${entityName}: ${data.length}`);
  }

  private processCSV<T>(filename: string, processRow: (row: T) => Promise<void>): Promise<void> {
    return new Promise((resolve, reject) => {
      const results: T[] = [];

      const scriptDir = __dirname;
      const filePath = path.join(scriptDir, filename);

      if (!fs.existsSync(filePath)) {
        console.warn(`Файл ${filename} не найден по пути: ${filePath}`);
        return resolve();
      }

      fs.createReadStream(filePath)
        .pipe(csv({ separator: ';' }))
        .on('data', (data) => results.push(data))
        .on('end', async () => {
          try {
            for (const row of results) {
              await processRow(row);
            }
            console.log(`Файл ${filename} обработан: ${results.length} записей`);
            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on('error', reject);
    });
  }
}

new DataImporter().importAll();
