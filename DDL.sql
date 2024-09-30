CREATE TABLE users
(
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(300) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    mobile VARCHAR(100),
    policyyn boolean,
    grade VARCHAR(100),
    recipient VARCHAR(200),
    post_code VARCHAR(100),
    address VARCHAR(200),
    address_detail VARCHAR(200),
    adminyn boolean DEFAULT false,
    status VARCHAR(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
)

insert into users (name, email, password, mobile, grade, address, adminyn, status) values ('Bob','bob@gmail.com','$2b$10$Lxlbcu3dLF0TSMSJwEs3Se.Fo8uOnbSvpWnaXKKoJRWo6gDr6V38.','+14144399310','Bronze','W Lakefield Dr.',false,'active');
insert into users(name, email, password, mobile, grade, address, adminyn, status) values('May','may@gmail.com','$2b$10$QGNZOXbL0OLlkCqfXCgsg.Pn2rI9D/wJBpfaSh9Ap39wQgOQL9Sge','+14144399310','Bronze','30, Seongji-ro 8beon-gil, Busanjin-gu',false,'active');
insert into users(name, email, password, mobile, grade, address, adminyn, status) values('Mike','mike@gmail.com','$2b$10$fEi0/io6ldjMmfvXDEuB..jZthgimo15aR7PzExuwFMnpsrLwJSB.','+14144399310','Bronze','541 W 78th St',false,'active');


CREATE TABLE books (
  id BIGINT PRIMARY KEY,
  isbn VARCHAR(30) NOT NULL,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  pub_date DATE,
  description VARCHAR(2000),
  cover VARCHAR(255) NOT NULL,
  stock_status VARCHAR(100),
  category_id VARCHAR(200),
  mileage NUMERIC,
  category_name VARCHAR(200),
  publisher VARCHAR(200),
  sales_point NUMERIC,
  adult BOOLEAN DEFAULT FALSE,
  fixed_price BOOLEAN DEFAULT FALSE,
  price_standard NUMERIC NOT NULL,
  price_sales NUMERIC,
  customer_review_rank NUMERIC,
  deleted BOOLEAN DEFAULT FALSE,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE book_query_types (
  book_id BIGINT,
  query_type VARCHAR(100) NOT NULL,
  PRIMARY KEY(book_id, query_type),
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
)

CREATE TABLE aladinbooks (
  item_id BIGINT,
  title VARCHAR(255) NOT NULL,
  link VARCHAR(1000),
  author VARCHAR(255),
  pub_date DATE,
  description VARCHAR(2000),
  isbn VARCHAR(20),
  isbn13 VARCHAR(20),
  price_sales NUMERIC,
  price_standard NUMERIC NOT NULL,
  mall_type VARCHAR(50),
  stock_status VARCHAR(100),
  mileage NUMERIC,
  cover VARCHAR(1000),
  category_id VARCHAR(20),
  category_name VARCHAR(1000),
  publisher VARCHAR(255),
  sales_Point NUMERIC,
  adult BOOLEAN DEFAULT FALSE,
  fixed_price BOOLEAN DEFAULT FALSE,
  customer_review_rank NUMERIC, 
  query_type VARCHAR(200),
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (item_id, query_type)
);

CREATE OR REPLACE FUNCTION sync_aladinbooks_to_books()
RETURNS TRIGGER AS $$
DECLARE
  new_book_id BIGINT;
BEGIN
  INSERT INTO books (
    id, isbn, title, author,pub_date, description, cover, stock_status, category_id, mileage, 
    category_name, publisher, sales_point, adult, fixed_price, price_standard, price_sales, 
    customer_review_rank
  )
  VALUES (
    NEW.item_id, NEW.isbn13, NEW.title, NEW.author, NEW.pub_date, NEW.description, NEW.cover, NEW.stock_status, NEW.category_id, NEW.mileage,
    NEW.category_name, NEW.publisher, NEW.sales_point, NEW.adult, NEW.fixed_price, NEW.price_standard, NEW.price_sales, 
    NEW.customer_review_rank
  )
  ON CONFLICT (id) DO UPDATE SET
    isbn = EXCLUDED.isbn,
    title = EXCLUDED.title,
    author = EXCLUDED.author,
    pub_date = EXCLUDED.pub_date,
    description = EXCLUDED.description,
    cover = EXCLUDED.cover,
    stock_status = EXCLUDED.stock_status,
    category_id = EXCLUDED.category_id,
    mileage = EXCLUDED.mileage,
    category_name = EXCLUDED.category_name,
    publisher = EXCLUDED.publisher,
    sales_point = EXCLUDED.sales_point,
    adult = EXCLUDED.adult,
    fixed_price = EXCLUDED.fixed_price,
    price_standard = EXCLUDED.price_standard,
    price_sales = EXCLUDED.price_sales,
    customer_review_rank = EXCLUDED.customer_review_rank

  RETURNING id INTO new_book_id;
  INSERT INTO books_query_type (book_id, query_type) VALUES (
    new_book_id, NEW.query_type
  )
  ON CONFLICT (book_id, query_type) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_insert_aladinbooks
AFTER INSERT ON aladinbooks
FOR EACH ROW
EXECUTE FUNCTION sync_aladinbooks_to_books();