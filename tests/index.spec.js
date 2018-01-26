const expect = require('chai').expect;
const index = require('../index.js');

describe('index', () => {
  it('should export lib/renderer.js', () => {
    let message = 'Lorem {{p1}}';

    let rendered = index.render(message, {
      p1: 'ipsum'
    });

    expect(rendered).to.eql('Lorem ipsum');
  });
});
