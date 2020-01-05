export default {
  get: jest.fn(() => Promise.resolve({})),
  post: jest.fn(() => Promise.resolve({})),
  defaults: {
    headers: {}
  }
};
