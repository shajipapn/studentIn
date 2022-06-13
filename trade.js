let tradesDisplayTemplate;
let tradeScanner;

function setUpTrade() {
  tradesDisplayTemplate = $.templates("#trade-display-template");

  $('div.artgraph-tab-content.trade .trade-submit').click(function(e) {
    e.preventDefault();
    submitTrade();
  });

  $('div.artgraph-tab-content.trade .trade-refresh').click(function(e) {
    e.preventDefault();
    displayTrades();
  });

  $('div.artgraph-tab-content.trade .trade-qrcode').change(function(e) {
    e.preventDefault();
    const qrcode = $(this).val();
    tradeDisplayQrcode(qrcode);
  });

  $("div.artgraph-tab-content.trade .trade-qrcode-scan").click(function(e) {
    e.preventDefault();
    tradeQrcodeScanStart();
  });

  tradeScanner= new Instascan.Scanner({
    video: document.querySelector('div.artgraph-tab-content.trade .trade-qrcode-preview'),
    backgroundScan: false,
    continuous: true,
  });

  displayTrades();
}

function getTradeInputElements() {
  return {
    qrcode: $('div.artgraph-tab-content.trade .trade-qrcode'),
    offer_amount: $('div.artgraph-tab-content.trade .trade-offer_amount'),
  };
}

function tradeQrcodeScanStart() {
  $('div.artgraph-tab-content.trade .trade-qrcode-preview')
    .addClass('show');
  Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
      tradeScanner.start(cameras[0]);
      tradeScanner.addListener('scan', tradeQrcodeScanFinish);
    } else {
      console.error('No cameras found.');
    }
  }).catch(function (e) {
    console.error(e);
  });
}

function tradeQrcodeScanFinish(qrcode) {
  $('div.artgraph-tab-content.trade .trade-qrcode').val(qrcode);
  tradeDisplayQrcode(qrcode);
  tradeScanner.stop().then(function() {
    $('div.artgraph-tab-content.trade .trade-qrcode-preview')
      .removeClass('show');
  });
}

function tradeDisplayQrcode(qrcode) {
  const img = kjua({
    text: qrcode,
    size: 240,
    mode: 'image',
    mSize: 15,
    image: document.querySelector('img.artgraph-text-image'),
  });
  const container = $('div.artgraph-tab-content.trade .trade-qrcode-display');
  container.html('');
  container.append(img);
}

function submitTrade() {
  const inputs = getTradeInputElements();
  const qrcode = inputs.qrcode.val();
  const offer_amount = +(inputs.offer_amount.val());
  if (qrcode === '') {
    throw new Error('qrcode cannot be empty');
  }
  if (isNaN(offer_amount) || offer_amount <= 0) {
    throw new Error('offer_amount must be a positive number');
  }

  // invoke tradeCreate
  const tradeCreateInputs = [
    qrcode,
    offer_amount,
  ];
  sendRpc("tradeCreate", tradeCreateInputs, console.log);
}


const tradeDisplayTemplateHelpers = {
  shouldShowButtons: function(status) {
    return (status === 'pending');
  }
};

// TODO un stub this data
function displayTrades() {
  const trades = {
    buyOffers: [
      {
        offer_id: 123,
        art_id: 100001,
        title: 'Spring Blossoms',
        name: 'Jose Perez',
        price: 10,
        status: 'pending',
      },
    ],
    sellOffers: [
      {
        offer_id: 124,
        art_id: 100002,
        title: 'Autumn Wilts',
        name: 'Brendan Graetz',
        price: 20,
        status: 'completed',
      },
      {
        offer_id: 125,
        art_id: 100003,
        title: 'Autumn Wilts',
        name: 'Brendan Graetz',
        price: 15,
        status: 'rejected',
      },
    ],
  };
  setTimeout(function() {
    renderTrades(trades, tradeDisplayTemplateHelpers);
  }, 500);
}

function renderTrades(trades) {
  const html = tradesDisplayTemplate.render(trades);
  $('div.artgraph-tab-content.trade .trade-display').html(html);
}