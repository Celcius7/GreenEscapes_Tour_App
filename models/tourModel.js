const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name.'],
      unique: true,
      maxlength: [40, 'A Tour name must have less or equal than 40 character'],
      minlength: [10, 'A Tour name must have more or equal than 10 character'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters.'],
    },
    slug: String,

    secretTour: {
      type: Boolean,
      default: false,
    },

    duration: {
      type: Number,
      required: [true, 'Tour must have a duration.'],
    },

    maxGroupSize: {
      type: Number,
      required: [true, 'Tour must have a group size.'],
    },

    difficulty: {
      type: String,
      required: [true, 'A Tour must have a difficulty.'],
      //only for strings
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy, medium or difficult',
      },
    },

    ratingsAverage: {
      type: Number,
      default: 4.5,
      //min and max works for Numbers and also Date
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
      set: (val) => Math.round(val * 10) / 10,
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price.'],
    },

    priceDiscount: {
      type: Number,
      validate: {
        //this only point to current document on NEW document creation
        validator: function (val) {
          return this.price > val;
        },
        message: 'Discount price ({VALUE}) should be below the regular price.',
      },
    },

    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description.'],
    },

    description: {
      type: String,
      trim: true,
    },

    imageCover: {
      type: String,
      required: [true, 'A Tour must have a cover image.'],
    },

    images: [String],

    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, //createdAt field will not be projected in returned data
    },

    startDates: [Date],
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number], //lon first, lat second
      address: String,
      description: String,
    },

    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],

    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
// tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

//DOCUMENT Middleware runs before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
  // console.log(this);
});

// tourSchema.pre('save', function (next) {
//   console.log('Will save document.');
//   next();
// });

// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//QUERY Middleware
tourSchema.pre(/^find/, function (next) {
  // tourSchema.pre('find', function (next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  next();
});

//AGGREGATION Middleware
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   // console.log(this.pipeline());
//   next();
// });

//Convention : Always use upper case in model name and variable.
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
