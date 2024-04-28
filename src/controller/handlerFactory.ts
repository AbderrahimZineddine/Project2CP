import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import APIFeatures from '../utils/APIFeatures';
import { Request, Response, NextFunction } from 'express';
import { PopulateOptions } from 'mongoose';

export const getAll = (Model: any) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // let filter = {};
    // if (req.params.id) {
    //   filter = { user: req.params.id };
    // }
    // const features = new APIFeatures(Model.find(filter), req.query)
    const features = new APIFeatures(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    res
      .status(200)
      .json({ status: 'success', results: doc.length, data: { data: doc } });
  });

export const getOne = (Model: any, populateOptions?: PopulateOptions) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query = Model.findById(req.params.id);
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    const doc = await query;
    if (!doc) {
      return next(new AppError('no Document found with that id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });
export const createOne = (Model: any) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: { data: doc },
    });
  });
export const updateOne = (Model: any) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // new updated document will be returned
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('no Document found with that id', 404));
    }

    res.status(200).json({ status: 'success', data: { data: doc } });
  });

export const deleteOne = (Model: any) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      { _deletedAt: Date.now() },
      { new: true }
    );
    if (!doc) {
      return next(new AppError('no Document found with that ID', 404));
    }
    res.status(204).json({ status: 'success' }); //* 204
  });
