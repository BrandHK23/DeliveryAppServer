DROP TABLE IF EXISTS roles CASCADE;
CREATE TABLE roles(
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR(180) NOT NULL UNIQUE,
	image VARCHAR(255) NULL,
	route VARCHAR(255) NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL
);

DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users(
	id BIGSERIAL PRIMARY KEY,
	email VARCHAR(255) NOT NULL UNIQUE,
	name VARCHAR(255) NOT NULL,
	lastname VARCHAR(255) NOT NULL,
	phone VARCHAR(80) NOT NULL UNIQUE,
	image VARCHAR(255) NULL,
	password VARCHAR(255) NOT NULL,
	is_available BOOLEAN NULL,
	session_token VARCHAR(255) NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL
);

DROP TABLE IF EXISTS users_has_roles CASCADE;
CREATE TABLE users_has_roles(
	id_user BIGSERIAL NOT NULL,
	id_rol BIGSERIAL NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	updated_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY (id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY (id_rol) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE,
	PRIMARY KEY (id_user, id_rol)
);

INSERT INTO roles (
	name,
	route,
	created_at,
	updated_at
)VALUES(
	'CLIENTE',
	'client/products/list',
	'2023-10-17',
	'2023-10-17'
);

INSERT INTO roles (
	name,
	route,
	created_at,
	updated_at
)VALUES(
	'RESTAURANTE',
	'restaurant/orders/list',
	'2023-10-17',
	'2023-10-17'
);

INSERT INTO roles (
	name,
	route,
	created_at,
	updated_at
)VALUES(
	'REPARTIDOR',
	'delivery/orders/list',
	'2023-10-17',
	'2023-10-17'
);

DROP TABLE IF EXISTS business CASCADE;
CREATE TABLE business(
  id_business BIGSERIAL PRIMARY KEY,
  business_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(80) NOT NULL UNIQUE,
  logo VARCHAR(255) NULL,
  is_available BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT false,
  session_token VARCHAR(255) NULL,
  id_user BIGINT NOT NULL,
  created_at TIMESTAMP(0) NOT NULL,
  updated_at TIMESTAMP(0) NOT NULL,
  FOREIGN KEY (id_user) REFERENCES users(id_business) ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS categories CASCADE;
CREATE TABLE categories(
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(180) NOT NULL UNIQUE,
  description VARCHAR(255) NOT NULL,
  created_at TIMESTAMP(0) NOT NULL,
  updated_at TIMESTAMP(0) NOT NULL,
  id_business BIGINT NOT NULL,
  FOREIGN KEY (id_business) REFERENCES business(id_business) ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS products CASCADE;
CREATE TABLE products(
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(180) NOT NULL UNIQUE,
  description VARCHAR(255) NOT NULL,
  price DECIMAL DEFAULT 0,
  image1 VARCHAR(255) NOT NULL,
  image2 VARCHAR(255) NULL,
  image3 VARCHAR(255) NULL,
  id_category BIGINT NOT NULL,
  created_at TIMESTAMP(0) NOT NULL,
  updated_at TIMESTAMP(0) NOT NULL,
  FOREIGN KEY (id_category) REFERENCES categories(id) ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS address CASCADE;
CREATE TABLE address(
  id BIGSERIAL PRIMARY KEY,
  id_user BIGINT NOT NULL,
  address VARCHAR(255) NOT NULL,
  neighborhood VARCHAR(255) NOT NULL,
  lat DECIMAL DEFAULT 0,
  lng DECIMAL DEFAULT 0,
  created_at TIMESTAMP(0) NOT NULL,
  updated_at TIMESTAMP(0) NOT NULL,
  FOREIGN KEY (id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS business_address CASCADE;
CREATE TABLE business_address(
  id BIGSERIAL PRIMARY KEY,
  id_business BIGINT NOT NULL,
  business_address VARCHAR(255) NOT NULL,
  neighborhood VARCHAR(255) NOT NULL,
  lat DECIMAL DEFAULT 0,
  lng DECIMAL DEFAULT 0,
  created_at TIMESTAMP(0) NOT NULL,
  updated_at TIMESTAMP(0) NOT NULL,
  FOREIGN KEY (id_business) REFERENCES business(id_business) ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS orders CASCADE;
CREATE TABLE orders(
  id BIGSERIAL PRIMARY KEY,
  id_client BIGINT NOT NULL,
  id_delivery BIGINT NULL,
  id_business BIGINT NULL,
  id_address BIGINT NOT NULL,
  id_business_address BIGINT NOT NULL,
  lat DECIMAL DEFAULT 0,
  lng DECIMAL DEFAULT 0,
  status VARCHAR(90) NOT NULL,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP(0) NOT NULL,
  updated_at TIMESTAMP(0) NOT NULL,
  FOREIGN KEY (id_client) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (id_delivery) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (id_address) REFERENCES address(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (id_business_address) REFERENCES business_address(id) ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS orders_has_products CASCADE;
CREATE TABLE orders_has_products(
  id_order BIGINT NOT NULL,
  id_product BIGINT NOT NULL,
  quantity BIGINT NOT NULL,
  created_at TIMESTAMP(0) NOT NULL,
  updated_at TIMESTAMP(0) NOT NULL,
  PRIMARY KEY (id_order, id_product),
  FOREIGN KEY (id_order) REFERENCES orders(id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (id_product) REFERENCES products(id) ON UPDATE CASCADE ON DELETE CASCADE
);

ALTER TABLE users
ADD COLUMN user_has_business BOOLEAN DEFAULT false;

ALTER TABLE categories DROP CONSTRAINT categories_name_key;

ALTER TABLE products ALTER COLUMN image1 DROP NOT NULL;

