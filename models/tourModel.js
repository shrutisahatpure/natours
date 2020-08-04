const mongoose = require('mongoose');
const slugify = require('slugify');
//const User = require('./userModel');
//const validator = require('validator');

const tourSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:[true,'A tour must have a name'],
        maxlength:[20,'A tour must not be greater than 20 characters'],
        minlength:[10,'A tour must have atleast 10 characters'],
      //  validate:[validator.isAlpha,'Name must be alphabet']
      },
    slug:String,
    rating:{
        type:Number,
        default:4.5,
        min:1,
        max:5
    },
   
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
      },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty'],
        enum : {
            values:['easy','medium','difficult'],
            message:'A tour should have easy, medium and difficult values only'
        }
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be below 5.0'],
        set: val => Math.round(val * 10) / 10 // 4.666666, 46.6666, 47, 4.7
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, 'A tour must have a price']
    },
    priceDiscount: {
        type:Number,
        validate:{
            validator: function(val){
                return this.price>val;
            },
            message:'The Discount price ({VALUE}) should be less than price!'
        }
    },
    summary: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    startLocation: {
        // GeoJSON
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
      },
      locations: [
        {
          type: {
            type: String,
            default: 'Point',
            enum: ['Point']
          },
          coordinates: [Number],
          address: String,
          description: String,
          day: Number
        }
      ],
      guides:[
        {
          type: mongoose.Schema.ObjectId,
          ref: 'User'
        }
      ],
    startDates: [Date],
    secretTour:{
        type:Boolean,
        default:false
    }
    },
    {
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
    },
  
);
tourSchema.index({price:1, ratingsAverage: -1});
tourSchema.index({ startLocation: '2dsphere' });
tourSchema.index({slug:1});

tourSchema.virtual('durationweeks').get(function(){
    return this.duration / 7;
});


// Virtual populate
tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
  });
  
//DOCUMENT MIDDLEWARE
//works only for saving the documents not for other
tourSchema.pre('save', function(next) {
    this.slug =slugify(this.name, {lower:true})
    next();
});
//to implement child referannce data
// tourSchema.pre('save', async function(next){
//     const guidesPromises =this.guides.map(async id =>await User.findById(id));
//     this.guides = await Promise.all(guidesPromises);
//     next();
// });


// tourSchema.pre('save', function(next) {
//     console.log("will save the document");
//     next();
// });

// tourSchema.post('save', function(doc,next) {
//     console.log(doc);
//     next();
// });
//Query Middle ware
tourSchema.pre(/^find/, function(next) {
    this.populate({
      path: 'guides',
      select: '-__v -passwordChangedAt'
    });
  
    next();
  });
tourSchema.pre(/^find/, function(next) {
    this.find({secretTour : {$ne :true} });

    this.start = Date.now();
    next();
});
// tourSchema.post(/^find/, function(docs,next) {
//     console.log(`Query took ${Date.now() - this.start} milliseconds!`);
//     console.log(docs);
//     next();
// });

//AGREGATE MIDDLEWARE
// tourSchema.pre('aggregate', function(next){
//     this.pipeline().unshift({$match : {
//         secretTour : {$ne :true} 
//     }});
//     console.log(this.pipeline());
//     next();
// })
const Tour = mongoose.model('Tour',tourSchema);

module.exports =Tour;