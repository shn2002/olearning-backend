const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res, next)=>{
    res.send("Hello Heroku Henian");
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