const express = require('express')
const rotas = express();

//importação User
const user = require('../controllers/User');
const validationMiddlewareUser = require('../middlewares/userValidate');
const autenticarUser = require('../middlewares/userAuth');

//importação Login
const loginUser = require('../controllers/Login');
const loginValidationMiddleware = require('../middlewares/loginValidate')

//importação Product
const produto = require('../controllers/Product')
const productValidation = require('../middlewares/productValidate')

//importação Category
const listarCategories = require('../controllers/Category');

//importação de Clients
const cliente = require('../controllers/Clients');
const clientValidation = require('../middlewares/clientValidate');

//importacao Orders (pedidos)
const pedidos = require('../controllers/Orders');




//cadastro, login e listar categorias
rotas.post('/login', loginValidationMiddleware, loginUser);
rotas.post('/usuario', validationMiddlewareUser, user.cadastrarUser);
rotas.get('/categoria', listarCategories);


rotas.use(autenticarUser);

//rotas usuários
rotas.get('/usuario', user.detalharUser);
rotas.put('/usuario', validationMiddlewareUser, user.editarUser);


//rotas produtos
rotas.post('/produto', productValidation, produto.cadastrarProduto);
rotas.put('/produto/:id', productValidation, produto.atualizarProduto);
rotas.get('/produto', produto.listarProdutosPorCategoria);
rotas.get('/produto/:id', produto.listarProduto);
rotas.delete('/produto', produto.excluirProduto);
rotas.delete('/produto/:id', produto.excluirProduto);

//rotas clientes
rotas.post('/cliente', clientValidation, cliente.cadastrarCliente);
rotas.get('/cliente', cliente.listarClientes);
rotas.put('/cliente/:id', clientValidation, cliente.editarCliente);
rotas.get('/cliente/:id', cliente.detalharCliente);

//rotas pedidos
rotas.post('/pedido', pedidos.cadastrarPedido);
rotas.get('/pedido', pedidos.listarPedido);
rotas.get('/pedido/:id', pedidos.listarPedidoId);


module.exports = rotas;