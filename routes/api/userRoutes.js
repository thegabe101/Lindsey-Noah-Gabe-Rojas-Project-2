const router = require('express').Router();
const { User, Book, Catalog } = require("../../models/User");
const haveAuth = require('../../utils/auth');

//route to get ALL users, without password attribute if we just want other user data
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method)
    User.findAll({
        attributes: { exclude: ['password'] }
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});
//route to get a single user by id 
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Catalog,
                attributes: ['id', 'catalog_name']
            },
            {
                model: Book,
                attributes: ['title', 'author', 'catalog_id', 'isbn_num', 'owned'],
                through: Catalog,
                as: 'catalog_books'
            }
        ]
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user matching this id could be found within our database.' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/', (req, res) => {
    // this will expect input in this format: {name: 'Gabe', username: 'thegabe101', email: 'sowag@gmail.com', password: 'password123'}
    User.create({
        name: req.body.name, 
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbUserData => {
            req.session.save(() => {
                req.session.user_id = dbUserData.id;
                req.session.username = dbUserData.username;
                //log session as boolean true- logged in
                req.session.loggedIn = true;

                res.json(dbUserData);
            });
        })
});

router.post('/login', (req, res) => {
    // this will expect input in this format: {email: 'sowag@gmail.com', password: 'password123'}
    User.findOne({
      //finds one user where an email is matching, and if not it returns with a status showing no email address
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that email address exists in our database.' });
            return;
        }

        const validPassword = dbUserData.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({ message: 'Sorry, that password is incorrect. Please try again.' });
            return;
        }

        req.session.save(() => {
            // this is where we save the session variables. all we should need to fetch everything else user-based is user id, username, and the logged in token. 
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

            res.json({ user: dbUserData, message: 'Logged in successfully.' });
        });
    });
});

router.post('/logout', (req, res) => {
    if (req.session.loggedIn) {
      //logging out is simple- all we need to do is destroy the req.session. can send a 404 if something fails 
        req.session.destroy(() => {
            res.status(204).end();
        });
    }
    else {
        res.status(404).end();
    }
});


router.put('/:id', haveAuth, (req, res) => {
    // expects {name: 'Gabe', username: 'thegabe101', email: 'sowag@gmail.com', password: 'password123'}
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData[0]) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//deleting a user will involve a similar process to logout except we require an authorization, which we will grab from our util folder
router.delete('/:id', haveAuth, (req, res) => {
    User.destroy({
    where: {
        id: req.params.id
    }
})
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user matching that id was found in our database.' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;