import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import APIFeatures from '../utils/APIFeatures';
import { Request, Response, NextFunction } from 'express';
import { PopulateOptions } from 'mongoose';
import { Application } from 'models/Application';
import { Role } from 'models/UserDoc';

export const getAll = (Model: any) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let filter = {};
    if (req.query.user) {
      filter = {
        user: req.query.user,
      };
      delete req.query.user;
    }
    
    if (req.query.worker) {
      filter = {
        worker: req.query.worker,
      };
      delete req.query.worker;
    }

    if (req.query.post) {
      filter = {
        post : req.query.post,
      };
      delete req.query.post;
    }

    // if (req.params.id) {
    //   filter = { user: req.params.id };
    // }
    // const features = new APIFeatures(Model.find(filter), req.query)
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const doc = await features.query;

    console.log(doc[0].worker.experience);

    res.status(200).json({ status: 'success', results: doc.length, data: doc });
  });

export const getOne = (Model: any, populateOptions?: PopulateOptions) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let query = Model.findById(req.params.id);
    query = query.find({ _deletedAt: null });
    if (populateOptions) {
      query = query.populate(populateOptions);
    }
    const doc = await query;
    console.log(doc);
    console.log(typeof doc);
    if (!doc || Object.entries(doc).length === 0) {
      return next(new AppError('no Document found with that id', 404));
    }
    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });
export const createOne = (Model: any) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: doc,
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

    res.status(200).json({ status: 'success', data: doc });
  });

export const deleteOne = (Model: any) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    let updates;
    // if (Model == Application) {
    //   updates = {
    //     statusUpdatedAt: Date.now(),
    //     _deletedAt: Date.now(),
    //     status: ApplicationStatus.Declined,
    //   };
    // } else {
    //   updates = { _deletedAt: Date.now() };
    // }

    const doc = await Model.findByIdAndUpdate(
      req.params.id,
      { _deletedAt: Date.now() },
      { new: true }
    );
    if (!doc) {
      return next(new AppError('no Document found with that ID', 404));
    }
    res.status(204).json({ status: 'success', message: 'delete succefully' }); //* 204
  });
