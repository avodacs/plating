const expect = require('chai').expect;
const renderer = require('../../lib/renderer.js');

describe('renderer', () => {
  describe('extractor()', () => {
    it('should return an Array of tokens', () => {
      let message = 'Lorem {{first|default Value}}, and {{second}}';

      let tokens = renderer.extract(message);

      let expected = [{
          raw: '{{first|default Value}}',
          key: 'first',
          defaultValue: 'default Value'
        },
        {
          raw: '{{second}}',
          key: 'second',
          defaultValue: undefined
        }
      ];

      expect(tokens).to.eql(expected);
    });

    it('should return unique tokens if desired', () => {
      let message = '{{first}}, {{second}}, {{first}}';

      let tokens = renderer.extract(message);

      let expected = [{
          raw: '{{first}}',
          key: 'first',
          defaultValue: undefined
        },
        {
          raw: '{{second}}',
          key: 'second',
          defaultValue: undefined
        }
      ];

      expect(tokens).to.eql(expected);
    });

    it('should return duplicate tokens if desired', () => {
      let message = '{{first}}, {{second}}, {{first}}';

      let tokens = renderer.extract(message, false);

      let expected = [{
          raw: '{{first}}',
          key: 'first',
          defaultValue: undefined
        },
        {
          raw: '{{second}}',
          key: 'second',
          defaultValue: undefined
        },
        {
          raw: '{{first}}',
          key: 'first',
          defaultValue: undefined
        },
      ];

      expect(tokens).to.eql(expected);
    });
  });

  describe('render()', () => {
    it('should properly substitute a token', () => {
      let message = 'Lorem {{p1}}';

      let tokens = [];
      tokens['p1'] = 'ipsum';

      let rendered = renderer.render(message, tokens);

      expect(rendered).to.eql('Lorem ipsum');
    });

    it('should properly handle multiple tokens with the same key', () => {
      let message = 'Lorem {{p1}} {{p1}} and {{p1}}';

      let tokens = [];
      tokens['p1'] = 'ipsum';

      let rendered = renderer.render(message, tokens);

      expect(rendered).to.eql('Lorem ipsum ipsum and ipsum');
    });

    it('should fall back to a default value', () => {
      let message = 'Lorem {{p1|ipsum}}';

      let rendered = renderer.render(message, null);

      expect(rendered).to.eql('Lorem ipsum');
    });

    it('should show the raw value if no token exists', () => {
      let message = 'Lorem {{p1}}';

      let rendered = renderer.render(message, null);

      expect(rendered).to.eql('Lorem {{p1}}');
    });

    it('should accept an object for the token list', () => {
      let message = 'Lorem {{p1}}, {{another}}';

      let rendered = renderer.render(message, {
        p1: 'ipsum',
        another: 'dolor'
      });

      expect(rendered).to.eql('Lorem ipsum, dolor');
    });

    it('should accept an array for the token list', () => {
      let message = 'Lorem {{p1}}';

      let tokens = [];
      tokens['p1'] = 'ipsum';

      let rendered = renderer.render(message, tokens);

      expect(rendered).to.eql('Lorem ipsum');
    });
  });
});
