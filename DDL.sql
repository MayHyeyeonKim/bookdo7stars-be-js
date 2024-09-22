-- users 테이블 생성
CREATE TABLE "users" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(300) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    mobile VARCHAR(100),
    policyyn BOOLEAN,
    grade VARCHAR(100),
    recipient VARCHAR(200),
    post_code VARCHAR(100),
    address VARCHAR(200),
    address_detail VARCHAR(200),
    adminyn BOOLEAN DEFAULT false,
    status VARCHAR(50) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

-- 데이터 삽입
INSERT INTO "users" (name, email, password, mobile, grade, address, adminyn, status) 
VALUES 
('Bob','bob@gmail.com','$2b$10$Lxlbcu3dLF0TSMSJwEs3Se.Fo8uOnbSvpWnaXKKoJRWo6gDr6V38.','+14144399310','Bronze','W Lakefield Dr.',false,'active'),
('May','may@gmail.com','$2b$10$QGNZOXbL0OLlkCqfXCgsg.Pn2rI9D/wJBpfaSh9Ap39wQgOQL9Sge','+14144399310','Bronze','30, Seongji-ro 8beon-gil, Busanjin-gu',false,'active'),
('Mike','mike@gmail.com','$2b$10$fEi0/io6ldjMmfvXDEuB..jZthgimo15aR7PzExuwFMnpsrLwJSB.','+14144399310','Bronze','541 W 78th St',false,'active');

-- queryTypes 테이블 생성
CREATE TABLE "queryTypes" (
    id SERIAL PRIMARY KEY,   
    type VARCHAR(200) NOT NULL  
);

-- queryTypes 테이블에 데이터 삽입
INSERT INTO "queryTypes" (type) VALUES ('ItemNewAll'), ('ItemNewSpecial'), ('Bestseller'), ('BlogBest');

-- books 테이블 생성
CREATE TABLE IF NOT EXISTS "books" (
  "queryTypeId" INT,
  id SERIAL PRIMARY KEY,
  isbn VARCHAR(30) NOT NULL,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(255) NOT NULL,
  "pubDate" DATE,
  description VARCHAR(255),
  cover VARCHAR(255) NOT NULL,
  "stockStatus" VARCHAR(100),
  "categoryId" VARCHAR(200),
  mileage NUMERIC,
  "categoryName" VARCHAR(200),
  publisher VARCHAR(200),
  "salesPoint" NUMERIC,
  adult BOOLEAN DEFAULT FALSE,
  "fixedPrice" BOOLEAN DEFAULT FALSE,
  "priceStandard" NUMERIC NOT NULL,
  "priceSales" NUMERIC,
  "customerReviewRank" NUMERIC,
  deleted BOOLEAN DEFAULT FALSE,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("queryTypeId") REFERENCES "queryTypes"(id)
);

-- aladinbooks 테이블 생성
CREATE TABLE IF NOT EXISTS "aladinbooks" (
  "itemId" BIGINT PRIMARY KEY, 
  title VARCHAR(255) NOT NULL,
  link VARCHAR(1000),
  author VARCHAR(255),
  "pubDate" DATE,
  description VARCHAR(2000),
  isbn VARCHAR(20),
  isbn13 VARCHAR(20),
  "priceSales" NUMERIC,
  "priceStandard" NUMERIC NOT NULL,
  "mallType" VARCHAR(50),
  "stockStatus" VARCHAR(100),
  mileage NUMERIC,
  cover VARCHAR(1000),
  "categoryId" VARCHAR(20),
  "categoryName" VARCHAR(1000),
  publisher VARCHAR(255),
  "salesPoint" NUMERIC,
  adult BOOLEAN DEFAULT FALSE,
  "fixedPrice" BOOLEAN DEFAULT FALSE,
  "customerReviewRank" NUMERIC,
  "queryTypeId" INT,
  created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY ("queryTypeId") REFERENCES "queryTypes"(id)
);

-- 트리거 함수 수정
CREATE OR REPLACE FUNCTION sync_aladinbooks_to_books()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO "books" (
    isbn, title, author, "pubDate", description, cover, "stockStatus", "categoryId", mileage, 
    "categoryName", publisher, "salesPoint", adult, "fixedPrice", "priceStandard", "priceSales", 
    "customerReviewRank", "queryTypeId"
  )
  VALUES (
    NEW.isbn13, NEW.title, NEW.author, NEW."pubDate", NEW.description, NEW.cover, NEW."stockStatus",
    NEW."categoryId", NEW.mileage, NEW."categoryName", NEW.publisher, NEW."salesPoint", NEW.adult,
    NEW."fixedPrice", NEW."priceStandard", NEW."priceSales", NEW."customerReviewRank", NEW."queryTypeId"
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


-- 트리거 생성
CREATE TRIGGER after_insert_aladinbooks
AFTER INSERT ON "aladinbooks"
FOR EACH ROW
EXECUTE FUNCTION sync_aladinbooks_to_books();
