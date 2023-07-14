require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
multer = require('multer');
path = require('path')
const User = require('./models/user');
const Trip = require('./models/trip');
const bcrypt = require('bcrypt');
const postRoutes = require('./routes/create-post');


const app = express();
app.use(express.static('public'));
const MONGODB_URI = 'mongodb://127.0.0.1:27017/travelgraphy';

// Configurações do servidor
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/posts', postRoutes);




// Conectar ao banco de dados
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to the database');

    // Função de verificação de autenticidade do usuário
    const authenticateUser = (email, password) => {
      // Aqui você pode implementar a lógica de autenticação adequada
      // Exemplo simplificado de autenticação
      if (email === 'admin@example.com' && password === 'password') {
        return true; // Autenticação bem-sucedida
      }

      return false; // Autenticação falhou
    };


const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'public/images'),
  filename: (req, file, cb) => cb(null, file.originalname)
})

    app.use(session({
      secret: 'seu_secreto_aqui',
      resave: false,
      saveUninitialized: true
    }));

    // Rota da página inicial
    app.get('/', (req, res) => {
      res.render('home');
    });

    // Rota da página de registro
    app.get('/register', (req, res) => {
      res.render('register');
    });

    // Rota para lidar com o registro de usuários (POST)
    app.post('/register', async (req, res) => {
      try {
        // Obtenha os dados do formulário de registro
        const { username, email, password } = req.body;

        // Crie um novo usuário usando o modelo User
        const user = new User({ username, email, password });

        // Salve o usuário no banco de dados
        await user.save();

        // Redirecione para outra página após o registro bem-sucedido
        res.redirect('/signin');
      } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Error registering user');
      }
    });

    // Rota da página de login
    app.get('/signin', (req, res) => {
      res.render('signin');
    });

    // Rota de autenticação (página de login)
    app.post('/signin', async (req, res) => {
      const { email, password } = req.body;

      try {
        // Verifique a autenticidade do usuário consultando o banco de dados
        const user = await User.findOne({ email });

        if (user) {
          // Verifique se a senha fornecida corresponde à senha armazenada no banco de dados
          const isPasswordValid = await user.comparePassword(password);

          if (isPasswordValid) {
            // Autenticação bem-sucedida
            req.session.userId = user._id; // Armazene o ID do usuário na sessão
            res.redirect('/admin'); // Redirecione para a página de administração
          } else {
            // Senha incorreta
            res.render('signin', { errorMsg: 'Email or password is incorrect' });
          }
        } else {
          // Usuário não encontrado
          res.render('signin', { errorMsg: 'Email or password is incorrect' });
        }
      } catch (error) {
        console.error('Error authenticating user:', error);
        res.status(500).send('Error authenticating user');
      }
    });

    // Middleware de autenticação
    const requireAuth = (req, res, next) => {
      if (req.session.userId) {
        // O usuário está autenticado, permita o acesso à rota de administração
        next();
      } else {
        // O usuário não está autenticado, redirecione para a página de login
        res.redirect('/signin');
      }
    };

    // Rota da página de administração
    app.get('/admin', requireAuth, async (req, res) => {
      try {
        // Obtenha os posts (trips) do banco de dados ou de outra fonte de dados
        const trips = await Trip.find();

        // Renderize a página de administração e passe os dados das trips como variável
        res.render('admin', { trips });
      } catch (error) {
        console.error('Error retrieving trips:', error);
        res.status(500).send('Error retrieving trips');
      }
    });

    // Rota para exibir todos os usuários
    app.get('/users', async (req, res) => {
      try {
        const users = await User.find();
        res.render('users', { users });
      } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).send('Error retrieving users');
      }
    });

    // Rota para criar um novo usuário
    app.post('/users', async (req, res) => {
      try {
        const { username, email, password } = req.body;
        const user = new User({ username, email, password });
        await user.save();
        res.redirect('/users');
      } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).send('Error creating user');
      }
    });

    // Rota para criar um novo post
    app.get('/create-post', (req, res) => {
      res.render('create-post');
    });
    
    app.post('/create-post', async (req, res) => {
      try {
        const { location, description, image } = req.body;
        const post = new Trip({ location, description, image });
    
        await post.save();
        res.redirect('/admin');
      } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).send('Error creating post');
      }
    });
    
    
    

    
    // Iniciar o servidor
    app.listen(3000, () => {
      console.log('Server started on port 3000');
    });
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error);
  });
