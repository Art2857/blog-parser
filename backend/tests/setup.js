require('dotenv').config({ path: '.env.test' });


process.env.NODE_ENV = 'test';


jest.setTimeout(30000);


if (process.env.NODE_ENV === 'test') {
  console.log = jest.fn();
}
