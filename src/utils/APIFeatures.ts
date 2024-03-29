import { Query } from 'mongoose';
import QueryString from 'qs';

class APIFeatures {
  query: any;
  queryString: QueryString.ParsedQs;

  constructor(query: any, queryString: QueryString.ParsedQs) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    //1) Build The query :
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach((el) => delete queryObj[el]);

    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this; //* so we can chain em
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = (this.queryString.sort as string).split(',').join(' '); //TODO check again as string
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt'); // TODO change : feed algorithm
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = (this.queryString.fields as string).split(',').join(' '); //TODO check again as string
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v'); // by mongo
    }
    return this;
  }

  paginate() {
    const page = (this.queryString.page as any) * 1 || 1; //TODO check as any
    const limit = (this.queryString.limit as any) * 1 || 100; //TODO check as any
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

export default APIFeatures;
