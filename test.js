const { User, Course, Comment } = require('./models')

const createUsers = () => {

    return [
        { username: 'user', password: '123', email: "user@yahoo.com", firstname: "Lebron", lastname: "James",usertype: "1" },
        { username: 'user1', password: '123', email: "user1@yahoo.com", firstname: "Kevin", lastname: "Garnett",usertype: "0" },
        { username: 'user2', password: '123', email: "user2@yahoo.com", firstname: "Chris", lastname: "Paul" ,usertype: "1" },
        { username: 'user3', password: '123', email: "user3@yahoo.com", firstname: "Tim", lastname: "Duncan" ,usertype: "0" },
        { username: 'admin', password: 'admin', email: "admin@olearning.com", firstname: "Admin", lastname: "Admin" ,usertype: "2" },
    ]
}

const createCourses = () => {

    return [
        { courseLink: 'v=fis26HvvDII', imageSource: 'Android', courseDescription: "Android Development for Beginners - Full Course" },
        { courseLink: 'v=0pThnRneDjw', imageSource: 'Web', courseDescription: "Web Development In 2020 - A Practical Guide" },
        { courseLink: 'v=7S_tz1z_5bA', imageSource: 'SQL', courseDescription: "MySQL Tutorial for Beginners - Full Course" },
        { courseLink: 'v=RFDaxPoGA6U', imageSource: 'Business101', courseDescription: "business 101" },
        { courseLink: 'v=ous9XUNYZtc', imageSource: 'BusinessAnalyst', courseDescription: "Business Analysis Training for Beginners | BA Tutorial | ZARANTECH" },
        { courseLink: 'v=6RaOD39W8iQ', imageSource: 'MBA', courseDescription: "MBA, business course" },
        { courseLink: 'v=q5ASe_sxRYI', imageSource: 'SocialMedia', courseDescription: "Complete Social Media Marketing Course | Social Media Marketing Tutorial For Beginners | Simplilearn" },
        { courseLink: 'v=nU-IIXBWlS4', imageSource: 'DigitalMarketing', courseDescription: "Digital Marketing Course Part - 1 | Digital Marketing Tutorial For Beginners | Simplilearn" },
        { courseLink: 'v=UZu5orpKtJs', imageSource: 'MBAMarketing', courseDescription: "MBA, marketing course" },
    ]
}
const createComments= () => {

    return [
        { content: 'I love this course' },
        { content: 'awsome course' },
        { content: 'good instructor' },
        { content: 'php is the best language in the world' },
        { content: 'good instructor, Mr Tom' },
        { content: 'good instructor, Mr Jerry' },
        { content: 'good instructor, Mr Smith'  },
        { content: 'good instructor, Mr Alex'  },
        { content: 'good instructor, Mr Hello World'  },


    ]
}



const initDatabase =  async () => {
    User.db.dropCollection('users')
    Course.db.dropCollection('courses')
    Comment.db.dropCollection('comments')
    const usersList = createUsers()
    const coursesList = createCourses()
    const commentsList = createComments()

    for (let val of usersList) {
        await User.create({
            username: val.username,
            password: val.password,
            email: val.email,
            firstname: val.firstname,
            lastname: val.lastname,
            usertype: val.usertype
        }, function (err) {
            if (err) return handleError(err);
        })
    }

    for (let val of coursesList) {
        await Course.create({
            courseLink: val.courseLink,
            imageSource: val.imageSource,
            courseDescription: val.courseDescription
        }, function (err) {
            if (err) return handleError(err);
        })
    } 

    for (let val of commentsList) {
        await Comment.create({
            content: val.content
        }, function (err) {
            if (err) return handleError(err);
        })
    } 

}

module.exports.initDatabase = initDatabase;


