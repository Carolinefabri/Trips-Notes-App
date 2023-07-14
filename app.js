require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const User = require('./models/user');
const Post = require('./models/Post.model');
const postRoutes = require('./routes/posts.routes');
const bcrypt = require('bcrypt');


const app = express();
app.use(express.static('public'));
const MONGODB_URI = 'mongodb://127.0.0.1:27017/travelgraphy';

// Configurações do servidor
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/posts', postRoutes);

// Conectar ao banco de dados
mongoose
  .connect(MONGODB_URI, {
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

    app.use(
      session({
        secret: 'seu_secreto_aqui',
        resave: false,
        saveUninitialized: true,
      })
    );

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

    app.get('/home', (req, res) => {
      // Lógica para renderizar a página home aqui
      res.render('home'); // Substitua "home" pelo nome correto do arquivo da página home
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

   

// postRoutes middleware
const postRoutes = (req, res, next) => {
  // código do middleware específico para as rotas de posts
  next(); // chamar next() para passar a execução para o próximo middleware ou rota
};

// Utilização do middleware postRoutes para rotas relacionadas aos posts
app.use('/posts', postRoutes);


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
        const posts = await Post.find();

        // Renderize a página de administração e passe os dados das trips como variável
        res.render('admin', { posts });
      } catch (error) {
        console.error('Error retrieving posts:', error);
        res.status(500).send('Error retrieving posts');
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
app.get('/new-post', (req, res) => {
  res.render('new-post');
});

app.post('/new-post', async (req, res) => {
  try {
    const { location, description, comment, image } = req.body;
    const post = new Post ({ location, description,  comment, image });

    await post.save();
    res.redirect('/posts');
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
