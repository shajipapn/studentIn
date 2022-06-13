let appreciateDisplayTemplate;
let appreciateScanner;

function setUpAppreciate() {
  appreciateDisplayTemplate = $.templates("#appreciate-display-template");

  $("div.artgraph-tab-content.appreciate .appreciate-rating").rating();

  $("div.artgraph-tab-content.appreciate .appreciate-submit").click(function(e) {
    e.preventDefault();
    submitAppreciate();
  });

  $('div.artgraph-tab-content.appreciate .appreciate-qrcode').change(function(e) {
    e.preventDefault();
    const qrcode = $(this).val();
    appreciateDisplayQrcode(qrcode);
  });

  $("div.artgraph-tab-content.appreciate .appreciate-qrcode-scan").click(function(e) {
    e.preventDefault();
    appreciateQrcodeScanStart();
  });

  appreciateScanner= new Instascan.Scanner({
    video: document.querySelector('div.artgraph-tab-content.appreciate .appreciate-qrcode-preview'),
    backgroundScan: false,
    continuous: true,
  });
}

function getAppreciateInputElements() {
  return [
    $('div.artgraph-tab-content.appreciate .appreciate-qrcode'),
    $('div.artgraph-tab-content.appreciate .appreciate-tip'),
    $('div.artgraph-tab-content.appreciate .appreciate-rating'),
  ];
}

function appreciateQrcodeScanStart() {
  $('div.artgraph-tab-content.appreciate .appreciate-qrcode-preview')
    .addClass('show');
  Instascan.Camera.getCameras().then(function (cameras) {
    if (cameras.length > 0) {
      appreciateScanner.start(cameras[0]);
      appreciateScanner.addListener('scan', appreciateQrcodeScanFinish);
    } else {
      console.error('No cameras found.');
    }
  }).catch(function (e) {
    console.error(e);
  });
}

function appreciateQrcodeScanFinish(qrcode) {
  $('div.artgraph-tab-content.appreciate .appreciate-qrcode').val(qrcode);
  appreciateDisplayQrcode(qrcode);
  appreciateScanner.stop().then(function() {
    $('div.artgraph-tab-content.appreciate .appreciate-qrcode-preview')
      .removeClass('show');
  });
}

function appreciateDisplayQrcode(qrcode) {
  // make RPC call to retrieve art data
  sendRpc('getArt', { qrcode }, function (err, result) {
    if (err) {
      console.error('error', err);
      return;
    }
    renderAppreciate(result);
  });

  // update UI
  const img = kjua({
    text: qrcode,
    size: 240,
    mode: 'image',
    mSize: 15,
    image: document.querySelector('img.artgraph-text-image'),
  });
  const container = $('div.artgraph-tab-content.appreciate .appreciate-qrcode-display');
  container.html('');
  container.append(img);
}

function renderAppreciate(art) {
  const html = appreciateDisplayTemplate.render(art);
  $('div.artgraph-tab-content.appreciate .appreciate-display').html(html);
}

function submitAppreciate() {
  const inputs = getAppreciateInputElements();
  const qrcode = inputs[0].val();
  const tip = +(inputs[1].val());
  const ratingString = inputs[2].val();

  if (ratingString === '') {
    // invoke view only
    const viewInputs = { qrcode, tip };
    sendRpc('view', viewInputs, console.log);
  } else {
    // invoke rate instead of view
    const rating = +ratingString;
    const rateInputs = { qrcode, tip, rating };
    sendRpc('rate', rateInputs, console.log);
  }
}