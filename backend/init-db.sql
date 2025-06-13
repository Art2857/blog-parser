CREATE DATABASE blog_parser_test;

GRANT ALL PRIVILEGES ON DATABASE blog_parser_test TO blog_parser_user;

\c blog_parser_dev;

ALTER DATABASE blog_parser_dev SET timezone TO 'UTC';

\c blog_parser_test;

ALTER DATABASE blog_parser_test SET timezone TO 'UTC'; 