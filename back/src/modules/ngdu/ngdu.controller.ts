import type { NextFunction, Request, Response } from 'express';

import { sendResponse } from '@/lib/reponse';
import { HttpStatus } from '@/utils/enums/http-status';

import type { GetGraphRequest } from './dto/get-graph.dto';

import * as ngduService from './ngdu.service';

export async function getNgduList(
  req: Request<object, object, object, { query: string }>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await ngduService.searchAllTables(req.query.query);
    sendResponse(res, HttpStatus.OK, result);
  } catch (error) {
    next(error);
  }
}

export async function getNgduGraph(
  req: Request<object, object, GetGraphRequest>,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const result = await ngduService.getNgduGraph(req.body);
    sendResponse(res, HttpStatus.OK, result);
  } catch (error) {
    next(error);
  }
}
