import express from "express";

export default (
  fn: (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => Promise<void>
) => {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    fn(req, res, next).catch(next); // Propagate errors to global error handler
  };
};

//error ends up in global error handler
//* .catch(err => next(err)); is equivalent to .catch(next);
