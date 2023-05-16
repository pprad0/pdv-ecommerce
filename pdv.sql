-- sprint 1
CREATE DATABASE PDV ;

CREATE TABLE USUARIOS
(
    id serial primary key,
    nome text,
    email text unique,
    senha text
);

CREATE TABLE CATEGORIAS
(
    id serial primary key,
    descricao text
);


INSERT INTO CATEGORIAS
    (descricao)
values
    ('Informática'),
    ('Celulares'),
    ('Beleza e Perfumaria'),
    ('Mercado'),
    ('Livros e Papelaria'),
    ('Brinquedos'),
    ('Moda'),
    ('Bebê'),
    ('Games')
;

-- sprint 2
create table produtos
(
    id serial primary key,
    descricao text not null,
    quantidade_estoque integer not null,
    valor integer not null,
    categoria_id integer references categorias(id)
);

create table clientes
(
    id serial primary key,
    nome text not null,
    email text unique not null,
    cpf bigint unique not null,
    cep integer,
    rua text,
    numero integer,
    bairro text,
    cidade text,
    estado text
);

-- sprint 3
create table PEDIDOS
(
    id serial primary key,
    cliente_id integer references clientes(id) not null,
    observacao text,
    produto_id integer references produtos(id) not null,
    quantidade_produto integer not null
);