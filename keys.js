function setUpKeys() {
  $('div.artgraph-tab-content.identity .keys-save-button').click(function(e) {
    e.preventDefault();
    saveKeys();
  });
  $('div.artgraph-tab-content.identity .keys-clear-button').click(function(e) {
    e.preventDefault();
    clearKeys();
  });
}

function getKeysInputElements() {
  return [
    $('div.artgraph-tab-content.identity .keys-public-input'),
    $('div.artgraph-tab-content.identity .keys-private-input'),
  ];
}

function getKeys(errback) {
  localforage.getItem('keys', errback);
}

function saveKeys() {
  const inputs = getKeysInputElements();
  const publicKey = inputs[0].val();
  const privateKey = inputs[1].val();
  console.log('saveKeys', publicKey, privateKey);
  const keys = {
    publicKey,
    privateKey,
  };
  localforage.setItem('keys', keys, function (err) {
    if (err) {
      console.error('Error', error);
      return;
    }
    inputs.forEach((input) => {
      input.val('');
    });
    console.log('Saved keys');
  });
}

function clearKeys() {
  console.log('clearKeys');
  localforage.removeItem('keys', function (err) {
    if (err) {
      console.error('Error', error);
      return;
    }
    const inputs = getKeysInputElements();
    inputs.forEach((input) => {
      input.val('');
    });
    console.log('Cleared keys');
  });
}