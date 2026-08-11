import type { Request, Response } from 'express';
import { prisma } from '../util/prisma';
import { asyncHandler } from '../middlewares/asyncHandler';
import { NotFoundError, BadRequestError } from '../util/errors/AppError';
import { ApiResponse } from '../util/response/ApiResponse';
import { ListingStatus } from '@prisma/client';

export const handleGetListings = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { status, page = 1, limit = 10 } = req.query;

    const pageNumber = Number(Array.isArray(page) ? page[0] : page);
    const limitNumber = Number(Array.isArray(limit) ? limit[0] : limit);

    // Build where clause based on filters
    const where: {
      clientProfile: { userId: string };
      status?: ListingStatus;
    } = {
      clientProfile: {
        userId,
      },
    };

    if (status && typeof status === 'string') {
      where.status = status as ListingStatus;
    }

    // Get total count for pagination
    const total = await prisma.listing.count({ where });

    // Get listings with pagination
    const listings = await prisma.listing.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      skip: (pageNumber - 1) * limitNumber,
      take: limitNumber,
    });

    const pagination = ApiResponse.calculatePagination(
      pageNumber,
      limitNumber,
      total
    );

    return ApiResponse.paginated(
      res,
      listings,
      pagination,
      'Listings retrieved successfully'
    );
  }
);

export const handleGetListingById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    const listingId = Array.isArray(id) ? id[0] : id;

    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
    });

    if (!listing) {
      throw new NotFoundError('Listing not found');
    }

    // Ensure the listing belongs to the authenticated user
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { id: listing.clientProfileId },
    });

    if (!clientProfile || clientProfile.userId !== userId) {
      throw new BadRequestError(
        'You do not have permission to view this listing'
      );
    }

    // Get client profile details for response
    const user = await prisma.user.findUnique({
      where: { id: clientProfile.userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    const listingWithClient = {
      ...listing,
      clientProfile: {
        ...clientProfile,
        user,
      },
    };

    return ApiResponse.success(
      res,
      listingWithClient,
      'Listing retrieved successfully'
    );
  }
);

export const handleCreateListing = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId },
    });

    if (!clientProfile) {
      throw new NotFoundError('Client profile not found');
    }

    const listing = await prisma.listing.create({
      data: {
        ...req.body,
        clientProfileId: clientProfile.id,
      },
    });

    return ApiResponse.created(res, listing, 'Listing created successfully');
  }
);

export const handleUpdateListing = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    const listing = await prisma.listing.findUnique({
      where: { id: String(id) },
    });

    if (!listing) {
      throw new NotFoundError('Listing not found');
    }

    // Ensure the listing belongs to the authenticated user
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId },
    });

    if (!clientProfile || listing.clientProfileId !== clientProfile.id) {
      throw new BadRequestError(
        'You do not have permission to update this listing'
      );
    }

    const { ...updateData } = req.body;

    const updatedListing = await prisma.listing.update({
      where: { id: String(id) },
      data: updateData,
    });

    return ApiResponse.success(
      res,
      updatedListing,
      'Listing updated successfully'
    );
  }
);

export const handleDeleteListing = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    const listing = await prisma.listing.findUnique({
      where: { id: String(id) },
    });

    if (!listing) {
      throw new NotFoundError('Listing not found');
    }

    // Ensure the listing belongs to the authenticated user
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId },
    });

    if (!clientProfile || listing.clientProfileId !== clientProfile.id) {
      throw new BadRequestError(
        'You do not have permission to delete this listing'
      );
    }

    await prisma.listing.delete({
      where: { id: String(id) },
    });

    return ApiResponse.noContent(res);
  }
);

export const handleUpdateListingStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body as { status: ListingStatus };
    const userId = req.user!.id;

    const listing = await prisma.listing.findUnique({
      where: { id: String(id) },
    });

    if (!listing) {
      throw new NotFoundError('Listing not found');
    }

    // Ensure the listing belongs to the authenticated user
    const clientProfile = await prisma.clientProfile.findUnique({
      where: { userId },
    });

    if (!clientProfile || listing.clientProfileId !== clientProfile.id) {
      throw new BadRequestError(
        'You do not have permission to update this listing'
      );
    }

    const updatedListing = await prisma.listing.update({
      where: { id: String(id) },
      data: { status },
    });

    return ApiResponse.success(
      res,
      updatedListing,
      'Listing status updated successfully'
    );
  }
);
