const fakeServer = require('test-fake-server');
const schema = require('./schema.json');

const model = {
  port: 3000,
  api: [
    {
      method: 'GET',
      path: '/products',
      response: schema,
    },
  ],
};

fakeServer(model).catch((server) => {
  server.stop();
});
