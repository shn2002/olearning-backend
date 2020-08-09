const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const { User, Course, Comment } = require('./models')
const service = require('./service')
const test = require('./test')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const SECRET = 'PRJ666'


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
//list all the users
app.get('/api/admin/users', async (req, res) => {

    User.find({ isdelete: "0" }, function (err, obj) {
        if (err) {
            res.status(500).send({ message: "Retrieve data error" })
        } else {
            res.send(obj)
        }
    })


})
//list one user
app.get('/api/admin/user/:userid', async (req, res) => {
    const { userid } = req.params
    const user = await User.findById(userid, function (err, user) {
        if (!user) {
            return res.status(404).send({
                message: "User doesn't exist"
            })
        }
    })
    res.send(user)
})

//list all the courses
app.get('/api/admin/courses', async (req, res) => {

    const courses = await Course.find()

    res.send(courses)
})

//list one course
app.get('/api/admin/course/:courseid', async (req, res) => {
    const { courseid } = req.params
    const course = await Course.findById(courseid, function (err, user) {
        if (!user) {
            return res.status(404).send({
                message: "Course doesn't exist"
            })
        }
    })
    res.send(course)
})




//list all the comments
app.get('/api/admin/comments', async (req, res) => {

    const comments = await Comment.find()

    res.send(comments)

})


//get one course comments
app.get('/api/admin/course/:courseid/comments', async (req, res) => {
    const { courseid } = req.params
    const comments = await Comment.find(
        { course: { $in: courseid } },
        {
            content: 1,
            createdAt: 1,
            updatedAt: 1,
            course: 1,
            user: 1
        })
    res.send(comments)
})



//get current user profile
app.get('/api/profile', service.auth, async (req, res, next) => {
    res.send(req.user)
})

//get current user courses
app.get('/api/courses', service.auth, async (req, res, next) => {

    const courses = await Course.find(
        { _id: { $in: req.user.courses } },
        {
            courseLink: 1,
            imageSource: 1,
            courseDescription: 1,
            createdAt: 1,
            updatedAt: 1
        })

    res.send(courses)

})

//get current user all comments
app.get('/api/comments', service.auth, async (req, res, next) => {

    const comments = await Comment.find(
        { _id: { $in: req.user.comments } },
        {
            content: 1,
            createdAt: 1,
            updatedAt: 1,
            course: 1,
            user: 1
        })

    res.send(comments)

})

app.post('/api/admin/user', async (req, res, next) => {


    User.findById(req.body.userid, function (err) {
        if (err) {
            res.status(500).send({ message: "User id doesn't exist" })
        } else {
            var newvalues = {
                $set: {
                    password: req.body.password,
                    firstname: req.body.firstname,
                    lastname: req.body.lastname,
                    email: req.body.email
                }
            }

            User.updateOne(
                { _id: req.body.userid },
                newvalues
                , function (err) {
                    if (err) {
                        res.status(500).send(
                            { message: "Update failure" }
                        )
                    } else {
                        res.status(200).send()
                    }

                })
        }

    })


})

//get course comments

app.delete('/api/admin/user/:userid', async (req, res, next) => {
    const { userid } = req.params
    const emailValue = 'Deleted User ' + userid
    User.findById(userid, function (err) {
        if (err) {
            res.status(500).send({ message: "User id doesn't exist" })
        } else {
            User.updateOne(
                { _id: userid },
                {
                    $set: { email: emailValue, isdelete: "1" }
                }, function (err) {
                    if (err) {
                        res.status(500).send(
                            { message: "Delete failure" }
                        )
                    } else {
                        res.status(200).send()
                    }

                })
        }

    })

})


//post a comment for a client
app.post('/api/admin/comment', async (req, res, next) => {
    //const user = await User.find({ email: req.body.email })
    const user = await User.findById(req.body.userid)
    const course = await Course.findById(req.body.courseid)
    if (!user) {
        return res.status(422).send({
            message: "User doesn't exist " + req.body.email
        })

    } else if (!course) {
        return res.status(422).send({
            message: "course doesn't exist " + req.body.courseid
        })
    } else {
        console.log(user._id)
        console.log(course._id)
        const comment = await Comment.create({
            content: req.body.content,
            course: req.body.courseid
        })
        await service.addCommment(user, course, comment)
        res.send(
            { user: user }
        )
    }

})

//sign up for a client
app.post('/api/register', async (req, res, next) => {
    const user = await User.create({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        usertype: req.body.usertype

    })
    res.send(user)
})
//sign in for a client
app.post('/api/login', async (req, res, next) => {
    const user = await User.findOne({
        email: req.body.email
    })
    if (!user) {
        return res.status(422).send({
            message: "User doesn't exist " + req.body.email
        })
    }
    const isPasswordVaild = bcrypt.compareSync(
        req.body.password,
        user.password
    )
    if (!isPasswordVaild) {
        return res.status(422).send({
            message: "Password is incorrect"
        })
    }
    const token = jwt.sign({
        id: String(user.id),
    }, SECRET)
    res.send({
        user,
        token: token
    })
})


//initiate database dummy data
app.get('/api/test/initdb_v1', async (req, res, next) => {

    test.initDatabase()
    res.status(200).json({
        message: "data is initialized"
    })

})


//initiate database dummy data --add linking schema
app.get('/api/test/addcourse', async (req, res, next) => {
    //console.log(service.getName());
    const courses = await Course.find()
    const users = await User.find()
    for (var i = 0; i <= 8; i++) {
        service.addCourse(users[0], courses[i])
    }
    const user = await User.findById(users[0]._id)
    const course = await Course.findById(courses[0]._id)

    res.send({
        users: user,
        course: course
    })
})
//initiate database dummy data --add linking schema
app.get('/api/test/removecourse', async (req, res, next) => {
    const courses = await Course.find()
    const users = await User.find()
    service.addCourse(users[0], courses[0])
    res.status(200).json({
        message: "data is removed"
    })

})

//initiate database dummy data --add linking schema
app.get('/api/test/addcomment', async (req, res, next) => {
    const comments = await Comment.find()
    const courses = await Course.find()
    const users = await User.find()
    for (var i = 0; i <= 8; i++) {
        service.addCommment(users[0], courses[0], comments[i])
    }
    const user = await User.findById(users[0]._id)
    const course = await Course.findById(courses[0]._id)
    const comment = await Comment.findById(comments[0]._id)

    res.send({
        users: user,
        course: course,
        comment: comment
    })

})

//initiate database dummy data --remove linking schema
app.get('/api/test/removecomment', async (req, res, next) => {
    const comments = await Comment.find()
    const courses = await Course.find()
    const users = await User.find()
    service.removeCommentToUser(users[0]._id, comments[0])
    service.removeUserToComment(comments[0]._id, users[0])

    service.removeCommentToCourse(courses[0]._id, comments[0])
    service.removeCourseToComment(comments[0]._id, courses[0])

    res.send({
        users: users[0],
        course: courses[0],
        comment: comments[0]
    })

})



app.use((err, req, res, next) => {
    if (err) {
        res.status(500).json({
            message: err.message
        })

    }

})


app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), () => {
    console.log('Node app is running on port', app.get('port'));
})