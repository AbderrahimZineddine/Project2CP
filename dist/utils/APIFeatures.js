"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class APIFeatures {
    query;
    queryString;
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }
    // filter() {
    //   //1) Build The query :
    //   const queryObj = { ...this.queryString };
    //   const excludedFields = ['page', 'sort', 'limit', 'fields'];
    //   excludedFields.forEach((el) => delete queryObj[el]);
    //   // Check if there's a name query parameter
    //   if (queryObj.name) {
    //     // Construct a regular expression for partial name search
    //     // queryObj.name = {
    //     //   $regex: new RegExp(queryObj.name as string, 'i'),
    //     // } as any;
    //     // this.query = this.query.find(queryObj.name);
    //     // this.query = this.query.find({ name: new RegExp('^' + (queryObj.name as string) + '$', 'i') });
    //     this.query = this.query.find({ name: { $regex: new RegExp(queryObj.name as string, 'i') } })
    //     delete queryObj.name; // Delete the name property after using it
    //   }
    //   console.log('name : ', queryObj.name);
    //   let queryStr = JSON.stringify(queryObj);
    //   queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
    //   // this.query = this.query.find({ _deletedAt: null }); //! this *****
    //   this.query = this.query.find(JSON.parse(queryStr));
    //   return this; //* so we can chain em
    // }
    filter() {
        // Build the query object
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach((el) => delete queryObj[el]);
        // Check if there's a name query parameter
        if (queryObj.name) {
            const name = queryObj.name;
            const words = name.split(/\s+/); // Split the input name into individual words
            const regexWords = words.map((word) => `(?=.*${word})`).join(''); // Construct a regex for each word
            const regex = new RegExp(`^${regexWords}`, 'i'); // Combine regex for all words
            this.query = this.query.find({ name: { $regex: regex } });
            delete queryObj.name; // Delete the name property after using it
        }
        // Continue filtering for other query parameters if any
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        // this.query = this.query.find({ _deletedAt: null }); //! this *****
        this.query = this.query.find(JSON.parse(queryStr));
        return this; //* so we can chain em
    }
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' '); //TODO check again as string
            this.query = this.query.sort(sortBy);
        }
        else {
            this.query = this.query.sort('-createdAt'); // TODO change : feed algorithm
        }
        return this;
    }
    // sort() {
    //   console.log(this.query)
    //   if (this.query._conditions.sortPriority) {
    //     console.log('hi');
    //     const sortObject = this.query._conditions.sortPriority;
    //     const sortBy = Object.entries(sortObject)
    //       .map(([status, priority]) => `${priority}-${status}`)
    //       .join(' ');
    //     this.query = this.query.sort(sortBy);
    //   } else if (this.queryString.sort) {
    //     const sortObject = this.query.sortPriority;
    //     const sortBy = Object.entries(sortObject)
    //       .map(([status, priority]) => `${priority}-${status}`) // Use priority for sorting
    //       .join(' ');
    //     this.query = this.query.sort(sortBy);
    //   } else {
    //     this.query = this.query.sort('-createdAt'); // Default sort
    //   }
    //   return this;
    // }
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' '); //TODO check again as string
            this.query = this.query.select(fields);
        }
        else {
            this.query = this.query.select('-__v'); // by mongo
        }
        return this;
    }
    paginate() {
        const page = this.queryString.page * 1 || 1; //TODO check as any
        const limit = this.queryString.limit * 1 || 100; //TODO check as any
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit);
        return this;
    }
}
exports.default = APIFeatures;
//# sourceMappingURL=APIFeatures.js.map