const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const HTTP_PORT =process.env.PORT || 3000

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res, next)=>{
    res.send("Hello Heroku");
})



app.use((err, req, res, next) => {
    if (err) {
        res.status(500).json({
            message: err.message
        })

    }
})

app.listen(3000, () => {
    console.log('Listening on port ' +HTTP_PORT)

})