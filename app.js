const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');
//use ejs mate
const ejsMate = require('ejs-mate');
//add error handler helpers
const { campgroundSchema, reviewSchema} = require('./schemas.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
//method override for extra methaods like put and patch and shit
const methodOverride = require('method-override');
const Campground = require('./models/campground');
const Review = require('./models/review')



mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//new connection logic,, before I used .then and .catch
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Database connected');
});

//for ejs mate
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

//tell express to parse url body (for post req body)
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));

const validateCampground = (req, res, next) => {
    // if (!req.body.campground) throw new ExpressError('Invalid Campground Data', 400)
    const { error } = campgroundSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if (error) {
      
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    }
    else {
        next();
    }
}

app.get('/', (req, res) => {
    res.render('home')
})


//create get route for displaying all campgrounds
app.get('/campgrounds', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds })
}))

//create get route for getting the form for new campground
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

//create post route for submitting new data
app.post('/campgrounds', validateCampground, catchAsync(async (req, res, next) => {

    const campground = new Campground(req.body.campground);
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
})
)

//create show route for individual campgrounds
app.get('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    res.render('campgrounds/show', { campground });
}))

//route for editing campground
app.get('/campgrounds/:id/edit', catchAsync(async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    res.render('campgrounds/edit', { campground });
}))

app.put('/campgrounds/:id', validateCampground, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground })
    res.redirect(`/campgrounds/${campground._id}`)
}));
app.delete('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))

app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`);
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.mesage = 'Something went wrong'
    res.status(statusCode).render('error', { err })
})

// app.get('/makecampground', async (req, res) => {
//     const camp = new Campground({ title: 'MY Backyard', description: 'Cheap Camping!' });
//     await camp.save();
//     res.send(camp)
// })

app.listen(3000, () => {
    console.log('Serving on port 3000')
})