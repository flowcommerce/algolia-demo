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
      attribute: 'local_' + 'france' + '_price.amount',
      items: [
        { label: 'All' },
        { label: 'Less than 50', end: 50 },
        { label: 'Between 50 - 100', start: 50, end: 100 },
        { label: 'More than 100', start: 100 },
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
            <div class="hit-price">{{local_france_price.label}}</div>
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
