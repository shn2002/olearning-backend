const { User, Course, Comment } = require('./models')
const jwt = require('jsonwebtoken')
const SECRET = 'PRJ666'

const auth = async (req, res, next) => {
    const raw = String(req.headers.authorization).split(' ').pop()
    const { id } = jwt.verify(raw, SECRET)
    req.user = await User.findById(id)
    next()
}


const addCourse = async (user, course) => {
    await User.updateOne(
        { _id: user._id },
        { $addToSet: { courses: course._id } })
    await Course.updateOne(
        { _id: course._id },
        { $addToSet: { user: user._id } })
}

const addCommment = async (user, course, comment) => {
    await User.updateOne(
        { _id: user._id },
        { $addToSet: { comments: comment._id } })
    await Course.updateOne(
        { _id: course._id },
        { $addToSet: { comments: comment._id } })
    await Comment.updateOne(
        { _id: comment._id },
        {
          $set: { user: user._id ,course: course._id } 
           
        })
}


const removeCourse = async (user, course) => {
    await User.updateOne(
        { _id: user._id },
        { $pull: { courses: course._id } })
    await Course.updateOne(
        { _id: course._id },
        { $pull: { user: user._id } })
}

const removeCommment = async (user, course, comment) => {
    await User.updateOne(
        { _id: user._id },
        { $pull: { comments: comment._id } })
    await Course.updateOne(
        { _id: course._id },
        { $pull: { comments: comment._id } })
    await Comment.updateOne(
        { _id: comment._id },
        {
          $set: { user: null ,course: null } 
           
        })
}




module.exports.auth = auth;
module.exports.addCourse = addCourse;
module.exports.addCommment= addCommment;
module.exports.removeCourse= removeCourse;
module.exports.removeCommment= removeCommment;

