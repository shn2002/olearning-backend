const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

mongoose.connect('mongodb+srv://admin:admin123@mongoprj666.68ilm.mongodb.net/<dbname>?retryWrites=true&w=majority', {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
});
// mongoose.connect('mongodb+srv://alternateuser:Project566@senecaweb-7yi0b.mongodb.net/<dbname>?retryWrites=true&w=majority', {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//     useCreateIndex: true
// });

const UserSchema = new mongoose.Schema({
    username: { type: String },
    password: {
        type: String,
        set(val) {
            return bcrypt.hashSync(val, 10)
        }

    },
    email: { type: String, unique: true },
    firstname: { type: String },
    lastname: { type: String },
    usertype: { type: String },
    isdelete: { type: String, default: '0' },
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }]
},{ timestamps: true })

const CourseSchema = new mongoose.Schema({
    courseLink: { type: String },
    imageSource: { type: String },
    courseDescription: { type: String },
    user:[{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments:[{
        type: Schema.Types.ObjectId,
        ref: 'Comment'
    }],
},{ timestamps: true })

const CommentSchema = new mongoose.Schema({
    user:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: { type: String },
    course: {
        type: Schema.Types.ObjectId,
        ref: 'Course'
    },
},{ timestamps: true })

const User = mongoose.model('User', UserSchema)
const Course = mongoose.model('Course', CourseSchema)
const Comment = mongoose.model('Comment', CommentSchema)

module.exports = { User, Course, Comment }

