/* global instantsearch algoliasearch */

const search = instantsearch({
  indexName: 'v1.production_realrealdemo-sandbox_master_items',
  /* the following password is a way of restricting access - it is visible from the FE and does not need to be secret */
  searchClient: algoliasearch('ACHCRLFQK0', 'bba0520e3cc1fbe5022c7e5640436a58'),
});

var lowNumber;
var highNumber;

flow.cmd('on', 'ready', function () {
  window.flow.countryPicker.createCountryPicker({
    type: 'modal',
    containerId: 'country-picker',
    isDestination: true
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
      attribute: 'attributes.brand',
    }),
    instantsearch.widgets.refinementList({
      container: '#size-list',
      attribute: 'attributes.size',
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
             {{#helpers.highlight}}{ "attribute": "size" }{{/helpers.highlight}}
            </div>
            <div class="hit-price">{{local_${experience}_price.label}}</div>
            <div class="buy-now-container">
              <button class="buy-now-btn" type="button" id="{{id}}" onclick="window.location.href = 'https://checkout.flow.io/${flow.session.getOrganization()}/order?country=${country}&items[0].number={{number}}&items[0].quantity=1'">Buy Now</button>
            </div>
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
