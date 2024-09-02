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
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
)

CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  isbn VARCHAR(30) NOT NULL,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  cover VARCHAR(255) NOT NULL,
  "stockStatus" VARCHAR(100),
  "categoryId" VARCHAR(200),
  mileage NUMERIC,
  "categoryName" VARCHAR(200),
  publisher VARCHAR(200),
  adult BOOLEAN DEFAULT FALSE,
  "fixedPrice" BOOLEAN DEFAULT FALSE,
  "priceStandard" NUMERIC NOT NULL,
  "priceSales" NUMERIC,
  "customerReviewRank" NUMERIC,
  "queryType" VARCHAR(100) NOT NULL,
  deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE aladinbooks (
  itemId BIGINT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  link VARCHAR(1000),
  author VARCHAR(255),
  pubDate DATE,
  description VARCHAR(2000),
  isbn VARCHAR(20),
  isbn13 VARCHAR(20),
  priceSales NUMERIC,
  priceStandard NUMERIC NOT NULL,
  mallType VARCHAR(50),
  stockStatus VARCHAR(100),
  mileage NUMERIC,
  cover VARCHAR(1000),
  categoryId VARCHAR(20),
  categoryName VARCHAR(1000),
  publisher VARCHAR(255),
  salesPoint NUMERIC,
  adult BOOLEAN DEFAULT FALSE,
  fixedPrice BOOLEAN DEFAULT FALSE,
  customerReviewRank NUMERIC
);



CREATE OR REPLACE FUNCTION sync_aladinbooks_to_books()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO books (
    isbn, title, author, description, cover, "stockStatus", "categoryId", mileage, 
    "categoryName", publisher, adult, "fixedPrice", "priceStandard", "priceSales", 
    "customerReviewRank", "queryType"
  )
  VALUES (
    NEW.isbn13, NEW.title, NEW.author, NEW.description, NEW.cover, NEW.stockStatus, 
    NEW.categoryId, NEW.mileage, NEW.categoryName, NEW.publisher, NEW.adult, 
    NEW.fixedPrice, NEW.priceStandard, NEW.priceSales, NEW.customerReviewRank, 'aladinbooks'
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER after_insert_aladinbooks
AFTER INSERT ON aladinbooks
FOR EACH ROW
EXECUTE FUNCTION sync_aladinbooks_to_books();