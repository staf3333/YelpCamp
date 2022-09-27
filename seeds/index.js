const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');


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

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '632be0b879e4aa869fdc380c',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Maxime pariatur sint, ad, consequuntur blanditiis quidem ea ipsum, quo asperiores at alias laudantium? Ad odit provident ipsa consequatur dolorum commodi necessitatibus?',
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dieek36vp/image/upload/v1664126775/YelpCamp/siti27u1tl0paoktnm6r.jpg',
                    filename: 'YelpCamp/siti27u1tl0paoktnm6r'
                },
                {
                    url: 'https://res.cloudinary.com/dieek36vp/image/upload/v1664126775/YelpCamp/qmxadpgyqgy3v1jy8b3x.jpg',
                    filename: 'YelpCamp/qmxadpgyqgy3v1jy8b3x'
                },
                {
                    url: 'https://res.cloudinary.com/dieek36vp/image/upload/v1664126775/YelpCamp/upbdeeikskfuxtd0yzoy.jpg',
                    filename: 'YelpCamp/upbdeeikskfuxtd0yzoy'
                }
            ]
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})