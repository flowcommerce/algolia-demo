/* global instantsearch algoliasearch */

const search = instantsearch({
  indexName: 'v1.production_shopify-dev-sandbox_master_items',
  /* the following password is a way of restricting access - it is visible from the FE and does not need to be secret */
  searchClient: algoliasearch('ACHCRLFQK0', 'c5a387e92afcd03ac6f94111076b2a69'),
});

flow.cmd('on', 'ready', function () {
  window.flow.countryPicker.createCountryPicker({
    type: 'modal',
    containerId: 'country-picker'
  });

  const experience = flow.session.getExperience();
  const country = flow.session.getCountry();
  // const currency = flow.session.getCurrency();
  const session = flow.session.getSession();

  const separator = session.local.locale.numbers.group;
  const decimal = session.local.locale.numbers.decimal;
  const symbol = session.local.currency.symbols.primary;

  const currencyFormatter = value => currency(value, {
    symbol,
    separator,
    decimal,
    precision: 0
  });
  // const intlNumberFormatter = new Intl.NumberFormat(country, { style: 'currency', currency, numberingSystem: 'latn', minimumFractionDigits: 0, maximumFractionDigits: 0 });


  search.addWidgets([
    instantsearch.widgets.searchBox({
      container: '#searchbox',
    }),
    instantsearch.widgets.clearRefinements({
      container: '#clear-refinements',
    }),
    instantsearch.widgets.refinementList({
      container: '#categories-list',
      attribute: 'categories',
    }),
    instantsearch.widgets.refinementList({
      container: '#brand-list',
      attribute: 'attributes.vendor',
    }),
    instantsearch.widgets.numericMenu({
      container: '#price-filter',
      attribute: `local_${experience}_price.amount`,
      items: [
        { label: 'All' },
        { label: `Less than ${currencyFormatter(50).format()}`, end: 50 },
        { label: `Between ${currencyFormatter(50).format()} - ${currencyFormatter(100).format()}`, start: 50, end: 100 },
        { label: `More than ${currencyFormatter(100).format()}`, start: 100 },
      ],
    }),
    instantsearch.widgets.hits({
      container: '#hits',
      templates: {
        item: `
          <div>
            <img src="{{images.0.url}}" align="left" width=100% />
            <div class="hit-name">
              {{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}
            </div>
            <div class="hit-description">
              {{description}}
            </div>
            <div class="hit-price">{{local_${experience}_price.label}}</div>
          </div>
        `,
      },
    }),
    instantsearch.widgets.pagination({
      container: '#pagination',
    }),
  ]);

  search.start();

});
