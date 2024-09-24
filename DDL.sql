-- users 테이블 생성
CREATE TABLE users (
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 데이터 삽입
INSERT INTO users (name, email, password, mobile, grade, address, adminyn, status) 
VALUES 
('Bob', 'bob@gmail.com', '$2b$10$Lxlbcu3dLF0TSMSJwEs3Se.Fo8uOnbSvpWnaXKKoJRWo6gDr6V38.', '+14144399310', 'Bronze', 'W Lakefield Dr.', false, 'active'),
('May', 'may@gmail.com', '$2b$10$QGNZOXbL0OLlkCqfXCgsg.Pn2rI9D/wJBpfaSh9Ap39wQgOQL9Sge', '+14144399310', 'Bronze', '30, Seongji-ro 8beon-gil, Busanjin-gu', false, 'active'),
('Mike', 'mike@gmail.com', '$2b$10$fEi0/io6ldjMmfvXDEuB..jZthgimo15aR7PzExuwFMnpsrLwJSB.', '+14144399310', 'Bronze', '541 W 78th St', false, 'active');

-- books 테이블 생성
CREATE TABLE books (
    id SERIAL PRIMARY KEY, 
    isbn VARCHAR(30) NOT NULL,
    isbn13 VARCHAR(30) NOT NULL,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    "pubDate" DATE,
    description TEXT,
    cover VARCHAR(1000) NOT NULL,
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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_isbn UNIQUE (isbn, isbn13)  -- isbn 및 isbn13 중복 방지
);

-- queryTypes 테이블 생성 (id 필드 추가)
CREATE TABLE queryTypes (
    id SERIAL PRIMARY KEY,  -- id 필드 추가
    "queryType" VARCHAR(200) NOT NULL
);

-- bookQueryTypes 테이블 생성 (중간 테이블)
CREATE TABLE bookQueryTypes (
    "bookId" INT,
    "queryTypeId" INT,
    FOREIGN KEY ("bookId") REFERENCES books(id) ON DELETE CASCADE,
    FOREIGN KEY ("queryTypeId") REFERENCES queryTypes(id) ON DELETE CASCADE,
    PRIMARY KEY ("bookId", "queryTypeId")  -- 복합 키로 설정
);

-- queryTypes 테이블에 데이터 삽입
INSERT INTO queryTypes ("queryType") VALUES 
('ItemNewAll'), 
('ItemNewSpecial'), 
('Bestseller'), 
('BlogBest');

-- aladinbooks 테이블 생성
CREATE TABLE aladinbooks (
    "itemId" BIGINT PRIMARY KEY, 
    title VARCHAR(255) NOT NULL,
    link VARCHAR(1000),
    author VARCHAR(255),
    "pubDate" DATE,
    description TEXT,
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
    "queryTypeId" INT REFERENCES queryTypes(id),  -- queryTypeId 사용
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 트리거 함수 수정
CREATE OR REPLACE FUNCTION sync_aladinbooks_to_books()
RETURNS TRIGGER AS $$
BEGIN
    -- books 테이블에 동일한 isbn이 있는지 확인
    IF NOT EXISTS (
        SELECT 1 FROM books WHERE isbn = NEW.isbn13
    ) THEN
        -- isbn13을 기준으로 books에 해당 데이터가 없으면 삽입
        INSERT INTO books (
            isbn, isbn13, title, author, "pubDate", description, cover, 
            "stockStatus", "categoryId", mileage, "categoryName", publisher, 
            "salesPoint", adult, "fixedPrice", "priceStandard", "priceSales", "customerReviewRank"
        )
        VALUES (
            NEW.isbn13, NEW.isbn, NEW.title, NEW.author, NEW.pubDate, NEW.description, 
            NEW.cover, NEW.stockStatus, NEW.categoryId, NEW.mileage, NEW.categoryName, 
            NEW.publisher, NEW.salesPoint, NEW.adult, NEW.fixedPrice, 
            NEW.priceStandard, NEW.priceSales, NEW.customerReviewRank
        );
    END IF;

    -- bookQueryTypes에 관계를 삽입
    INSERT INTO bookQueryTypes ("bookId", "queryTypeId")
    SELECT id, NEW.queryTypeId FROM books WHERE isbn = NEW.isbn13
    ON CONFLICT DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
