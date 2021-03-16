startCheckOut = function(org,country,number) {
  
  if(country === 'CAN'){
    flow.cart.redirectToCheckoutWithForm({
      attributes: {
        cartId: "624c74d6-73cd-4230-885e-b0169357716c",
        customerId: ""
      },
      items: [{
        number: number,
        quantity: 1,
      }],
    });


  }else{
    window.location = 'https://checkout.flow.io/'+org+'/order?country='+country+'&items[0].number='+number+'&items[0].quantity=1';
  }
}

bestseller = function (bes){
  return bes;
}

/* global instantsearch algoliasearch */

const search = instantsearch({
  indexName: 'v1.production_glossier-demo-sandbox_master_items',

  /* the following password is a way of restricting access - it is visible from the FE and does not need to be secret */
  searchClient: algoliasearch('ACHCRLFQK0', 'c5a387e92afcd03ac6f94111076b2a69'),
});

var lowNumber;
var highNumber;

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
      transformItems: (items) => {
        if(search.helper) {
          const item = search.helper.lastResults.hits[0];

          if (!item) {
            return items;
          }

          const basePrice = item.price.amount;
          const localizedPrice = item[`local_${experience}_price`] ? item[`local_${experience}_price`].amount : basePrice;
          const ratio = localizedPrice / basePrice;
          const reg = new RegExp('\\d+');
          lowNumber = lowNumber ? lowNumber : Math.floor(Number(reg.exec(items[1].label)[0]) * ratio);
          highNumber = highNumber ? highNumber : Math.floor(Number(reg.exec(items[3].label)[0]) * ratio);

          if (!highNumber || !lowNumber) {
            return items;
          } else {
            return [
              { label: 'All', value: window.encodeURI('{}') },
              { label: `Less than ${currencyFormatter(lowNumber).format()}`, value: window.encodeURI(`{"end":${lowNumber}}`) },
              { label: `Between ${currencyFormatter(lowNumber).format()} - ${currencyFormatter(highNumber).format()}`, value: window.encodeURI(`{"start":${lowNumber},"end":${highNumber}}`)},
              { label: `More than ${currencyFormatter(highNumber).format()}`, value: window.encodeURI(`{"start":${highNumber}}`) },
            ]
          }
        } else {
          return items;
        }
      }
    }),
    instantsearch.widgets.hits({
      container: '#hits',
      templates: {
        item: `
          <div>
            <img src="{{images.0.url}}" align="left" width=100% />
            <div class="hit-name">
              {{#helpers.highlight}}{ "attribute": "name" }{{/helpers.highlight}}
             {{#attributes.best}}
              <p class="bestseller">Bestseller</p>
            {{/attributes.best}}
             {{#attributes.top}}top
              <p class="toprated">Top Rated</p>
            {{/attributes.top}}
            </div>
            <div class="hit-description">
             {{categories}}
            </div>
            <div class="buy-now-container">
              <button class="buy-now-btn" type="button" id="{{id}}" onclick="startCheckOut('${flow.session.getOrganization()}','${country}','{{number}}')"><span class="ab">Add to Bag</span><span class="price">{{local_${experience}_price.label}}</span></button>
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

