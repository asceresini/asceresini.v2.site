import chai, { expect } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import getUrl from '../../app/lib/get-url';

chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('getUrl', () => {
  let consoleError = null;
  let fetch = null;

  beforeEach(() => {
    consoleError = console.error;
    console.error = () => {};
    fetch = window.fetch;
  });

  afterEach(() => {
    console.error = consoleError;
    window.fetch = fetch;
  });

  [
    {
      response: { status: 200, body: 'the body'},
      url: 'http://1.test.com'
    },
    {
      response: { status: 201, body: 'the body'},
      url: 'http://2.test.com'
    }
  ].forEach(testCase => {
    it(`returns the response when response status is ${testCase.response.status}`, () => {
      window.fetch = sinon.stub();

      window.fetch.returns(new Promise(resolve => resolve(testCase.response)));

      return Promise.all([
        expect(getUrl(testCase.url)).to.eventually.equal(testCase.response),
        expect(window.fetch).to.have.been.calledWith(testCase.url)
      ]);
    });
  });

  [
    {
      response: { status: 400, statusText: 'Bad Request'},
      url: 'http://1.test.com'
    },
    {
      response: { status: 500, statusText: 'Internal Server Error'},
      url: 'http://2.test.com'
    }
  ].forEach(testCase => {
    it(`returns an error when response status is ${testCase.response.status}`, () => {
      window.fetch = sinon.stub();

      window.fetch.returns(new Promise(resolve => resolve(testCase.response)));

      return Promise.all([
        expect(getUrl(testCase.url))
          .to.eventually.be.rejectedWith(`Error: ${testCase.response.statusText}`),
        expect(window.fetch).to.have.been.calledWith(testCase.url)
      ]);
    });
  });
});
