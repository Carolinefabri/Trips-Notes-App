require('dotenv').config();
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const User = require('./models/user');
const Trip = require('./models/trip');
const Photo = require('./models/photo');
const bcrypt = require('bcrypt');

const app = express();
app.use(express.static('public'));
const MONGODB_URI = 'mongodb://127.0.0.1:27017/travelgraphy';

// Configurações do servidor
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

    // Rota para atualizar um usuário existente
    app.put('/users/:id', async (req, res) => {
      try {
        const { username, email, password } = req.body;
        const updatedUser = await User.findByIdAndUpdate(req.params.id, { username, email, password }, { new: true });
        res.redirect('/users');
      } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Error updating user');
      }
    });

    // Rota para excluir um usuário
    app.delete('/users/:id', async (req, res) => {
      try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/users');
      } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).send('Error deleting user');
      }
    });

    // Rota para exibir todas as viagens
    app.get('/trips', async (req, res) => {
      try {
        const trips = await Trip.find();
        res.render('trips', { trips });
      } catch (error) {
        console.error('Error retrieving trips:', error);
        res.status(500).send('Error retrieving trips');
      }
    });

    // Rota para criar uma nova viagem
    app.post('/trips', async (req, res) => {
      try {
        const { destination, date, comment, image } = req.body;
        const trip = new Trip({ destination, date, comment, image });
        await trip.save();
        res.redirect('/trips');
      } catch (error) {
        console.error('Error creating trip:', error);
        res.status(500).send('Error creating trip');
      }
    });

    // Rota para atualizar uma viagem existente
    app.put('/trips/:id', async (req, res) => {
      try {
        const { destination, date, comment, image } = req.body;
        const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, { destination, date, comment, image }, { new: true });
        res.redirect('/trips');
      } catch (error) {
        console.error('Error updating trip:', error);
        res.status(500).send('Error updating trip');
      }
    });

    // Rota para excluir uma viagem
    app.delete('/trips/:id', async (req, res) => {
      try {
        await Trip.findByIdAndDelete(req.params.id);
        res.redirect('/trips');
      } catch (error) {
        console.error('Error deleting trip:', error);
        res.status(500).send('Error deleting trip');
      }
    });

    // Rota para exibir todas as fotos
    app.get('/photos', async (req, res) => {
      try {
        const photos = await Photo.find();
        res.render('photos', { photos });
      } catch (error) {
        console.error('Error retrieving photos:', error);
        res.status(500).send('Error retrieving photos');
      }
    });

    // Rota para criar uma nova foto
    app.post('/photos', async (req, res) => {
      try {
        const { title, description, imagePath, tripId } = req.body;
        const photo = new Photo({ title, description, imagePath, trip: tripId });
        await photo.save();
        res.redirect('/photos');
      } catch (error) {
        console.error('Error creating photo:', error);
        res.status(500).send('Error creating photo');
      }
    });

    // Rota para atualizar uma foto existente
    app.put('/photos/:id', async (req, res) => {
      try {
        const { title, description, imagePath, tripId } = req.body;
        const updatedPhoto = await Photo.findByIdAndUpdate(req.params.id, { title, description, imagePath, trip: tripId }, { new: true });
        res.redirect('/photos');
      } catch (error) {
        console.error('Error updating photo:', error);
        res.status(500).send('Error updating photo');
      }
    });

    // Rota para excluir uma foto
    app.delete('/photos/:id', async (req, res) => {
      try {
        await Photo.findByIdAndDelete(req.params.id);
        res.redirect('/photos');
      } catch (error) {
        console.error('Error deleting photo:', error);
        res.status(500).send('Error deleting photo');
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
