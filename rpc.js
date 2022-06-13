function sendRpc(functionName, inputs, errback) {
  console.log(`Making RPC ${functionName}`, inputs);
  $.ajax({
    method: 'POST',
    url: '/api/rpc',
    data: JSON.stringify({
      functionName,
      inputs,
    }),
    processData: false,
    contentType: 'application/json',
    dataType: 'json',
    timeout: 2000,
  })
  .done(function(response) {
    errback(undefined, response);
  })
  .fail(function(error) {
    errback(error && error.responseJSON);
  });
}
