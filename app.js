const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const _ = require('lodash')

const app = express()

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'))




mongoose.connect("mongodb+srv://root:root@cluster0.kdlnd.mongodb.net/todolistDB", {
    useNewUrlParser: true
}, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log("connected to the database")
    }
});

// creation of the schema
const itemsSchema = {
    name: String
}

const listSchema = {
    name: String,
    items: [itemsSchema]
}

// creating mongoose model using itemSchema
const Item = mongoose.model("Item", itemsSchema)
const List = mongoose.model('List', listSchema)

// mongoose document creation use model random for not empty


const first = new Item({
    name: "Arpit"
})

const second = new Item({
    name: "Bobby "
})

const defaultItems = [first, second]; // array of object for demo 



app.get('/', (req, res) => {

    Item.find({}, (err, data) => {  // find all items and (error , data recive from the find method)

        if (err) {
            console.log(err)
        }
        // check if the perviously the list is not empty
        if (data.length === 0) {
            Item.insertMany(defaultItems, (err) => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("none")
                }
            })
            res.redirect('/');

        } else {
            res.render('list', { title: "Today", items: data }) //ejs rendering 'page name'  'passing parameter to the page'
        }

    })
})

app.post('/', (req, res) => {
    var inputData = req.body.inp;


    if (inputData == '') {
        if (req.body.list == 'Today') {
            res.redirect('/')
        } else {
            res.redirect('/' + req.body.list)
        }

    } else {
        if (req.body.list == 'Today') {
            const item = new Item({
                name: inputData
            })

            item.save();

            res.redirect('/')
        } else {
            const data = {
                name: inputData
            }
            List.findOneAndUpdate({ name: req.body.list }, { $push: { items: data } }, (err => {
                if (err) {
                    console.log(err)
                } else {
                    console.log("changed")
                }
            }))
            res.redirect('/' + req.body.list)
        }

    }


})

app.get('/favicon.ico', (req, res) => res.status(204));

app.get('/del/:_id/:title', function (req, res) {
    const itemDelete = req.params._id
    const title = req.params.title
    console.log("title To be deleted " + title)
    if (title == "Today") {

        Item.findOneAndRemove({ _id: itemDelete }, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("deleted --->  " + itemDelete)
            }
        });
        res.redirect('/');
    } else {
        const data = {
            _id: itemDelete
        }
        List.findOneAndUpdate({ name: title }, { $pull: { items: data } }, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("deleted --->  " + itemDelete)
            }
        });
        res.redirect('/' + title);

    }

});

app.get('/:random', (req, res) => {

    const title = _.capitalize(req.params.random)

    List.findOne({ name: title }, (err, result) => {
        if (!err) {
            if (result != null) {
                console.log("already exists list")
                // already exists list
                res.render('list', { title: title, items: result.items })
            } else {
                console.log("Right Now in the database " + result)
                // Create a New list
                //document from model
                const list = new List({
                    name: title,
                    items: defaultItems
                })
                list.save() // saving the document
                res.redirect("/" + title) // redirecting back to the same route but now their is result present in the if else condition
            }
        }
    })
})


app.get('/about', (req, res) => {
    res.render('about')
})

let port = 3000 || process.env.PORT
app.listen(port, () => {
    console.log('server is running')
})