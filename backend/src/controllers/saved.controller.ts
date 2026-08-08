import type { Request, Response } from 'express';
import { asyncHandler } from '../middlewares/asyncHandler';
import { ApiResponse } from '../util/response/ApiResponse';
import { UnauthorizedError } from '../util/errors/AppError';
import {
  getSavedItems,
  getSavedIds,
  saveCreative,
  unsaveCreative,
  toggleSaveCreative,
  saveCult,
  unsaveCult,
  toggleSaveCult,
} from '../services/saved.service';
import type { SavedItemType } from '../types/saved';

export const handleGetSavedItems = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const type = req.query.type as SavedItemType;
    const search = req.query.search as string;
    const page = req.query.page ? Number(req.query.page) : 1;
    const limit = req.query.limit ? Number(req.query.limit) : 20;

    const data = await getSavedItems(userId, {
      type,
      search,
      page,
      limit,
    });

    const pagination = ApiResponse.calculatePagination(page, limit, data.total);

    return res.status(200).json({
      success: true,
      data: data.items,
      message: 'Saved items fetched successfully',
      pagination,
      meta: {
        totalCreatives: data.totalCreatives,
        totalCults: data.totalCults,
      },
    });
  }
);

export const handleGetSavedIds = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const data = await getSavedIds(userId);
    return ApiResponse.success(res, data, 'Saved IDs fetched successfully');
  }
);

export const handleSaveCreative = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const creativeProfileId = String(req.params.creativeProfileId);
    const result = await saveCreative(userId, creativeProfileId);
    return ApiResponse.created(res, result, 'Creative saved successfully');
  }
);

export const handleUnsaveCreative = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const creativeProfileId = String(req.params.creativeProfileId);
    const result = await unsaveCreative(userId, creativeProfileId);
    return ApiResponse.success(res, result, 'Creative unsaved successfully');
  }
);

export const handleToggleSaveCreative = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const creativeProfileId = String(req.params.creativeProfileId);
    const result = await toggleSaveCreative(userId, creativeProfileId);
    return ApiResponse.success(
      res,
      result,
      result.isSaved
        ? 'Creative saved successfully'
        : 'Creative removed from saved'
    );
  }
);

export const handleSaveCult = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const cultId = String(req.params.cultId);
    const result = await saveCult(userId, cultId);
    return ApiResponse.created(res, result, 'Cult saved successfully');
  }
);

export const handleUnsaveCult = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const cultId = String(req.params.cultId);
    const result = await unsaveCult(userId, cultId);
    return ApiResponse.success(res, result, 'Cult unsaved successfully');
  }
);

export const handleToggleSaveCult = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedError('Authentication required');
    }

    const cultId = String(req.params.cultId);
    const result = await toggleSaveCult(userId, cultId);
    return ApiResponse.success(
      res,
      result,
      result.isSaved ? 'Cult saved successfully' : 'Cult removed from saved'
    );
  }
);
