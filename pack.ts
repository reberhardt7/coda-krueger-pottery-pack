import * as coda from "@codahq/packs-sdk";
import parse from "node-html-parser";
import * as schemas from './schemas'

export const pack = coda.newPack({ version: "1.0" });
pack.addNetworkDomain('kruegerpottery.com');

pack.addFormula({
  resultType: coda.ValueType.Array,
  items: coda.makeSchema({
    type: coda.ValueType.String,
  }),
  name: "Search",
  description: "Get the product URL listings for a search term",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "searchTerm",
      description: "Search term",
    }),
  ],
  execute: async function ([searchTerm], context) {
    const url = 'https://kruegerpottery.com/search?type=product&q=' + encodeURIComponent(searchTerm);
    const searchResponse = (await context.fetcher.fetch({
      method: 'GET',
      url: url,
    })).body;
    return parse(searchResponse).querySelectorAll('.product_c .element .product-image a').map(elem => 'https://kruegerpottery.com/' + elem.getAttribute('href'));
  },
});

pack.addFormula({
  resultType: coda.ValueType.Object,
  schema: schemas.ItemSchema,
  name: "ProductInfo",
  description: "Get the product info from the given product page URL",
  parameters: [
    coda.makeParameter({
      type: coda.ParameterType.String,
      name: "productURL",
      description: "Product page URL",
    }),
  ],
  execute: async function ([productURL], context) {
    const searchResponse = (await context.fetcher.fetch({
      method: 'GET',
      url: productURL,
    })).body;
    const parsed = parse(searchResponse);
    const sizes = parsed.querySelectorAll('.product-variants option').map(elem => {
      const name = elem.text.substring(0, elem.text.lastIndexOf(' - '));
      const price = elem.text.substring(elem.text.lastIndexOf(' - ') + 4).split(' ')[0];
      return {
        id: elem.getAttribute('value'),
        name,
        price: Number(price),
        summary: `${name} ($${price})`,
      };
    });
    const photo = parsed.querySelector('.featured_image').getAttribute('src').replace(/^\/\//, 'https://');
    const name = parsed.querySelector('h1[itemprop="name"]').text;
    return { name, photo, sizes };
  },
});
