function setUpCreate() {
  $("div.artgraph-tab-content.create .create-submit").click(function(e) {
    e.preventDefault();
    submitCreate();
  });
}

function getCreateInputElements() {
  return {
    title: $('div.artgraph-tab-content.create .create-title'),
    description: $('div.artgraph-tab-content.create .create-description'),
    category: $('div.artgraph-tab-content.create .create-category'),
    url: $('div.artgraph-tab-content.create .create-url'),
    min_view_price: $('div.artgraph-tab-content.create .create-min_view_price'),
    min_remix_price: $('div.artgraph-tab-content.create .create-min_remix_price'),
  };
}

function submitCreate() {
  const inputs = getCreateInputElements();
  const {
    title: title_el,
    description: description_el,
    category: category_el,
    url: url_el,
    min_view_price: min_view_price_el,
    min_remix_price: min_remix_price_el,
  } = inputs;
  const title = title_el.val();
  const description = description_el.val();
  const category = category_el.val();
  const url = url_el.val();
  const min_view_price = +(min_view_price_el.val());
  const min_remix_price = +(min_remix_price_el.val());
  if (title === '') {
    throw new Error('title cannot be empty');
  }
  if (description === '') {
    throw new Error('description cannot be empty');
  }
  if (category === '') {
    throw new Error('category cannot be empty');
  }
  if (url === '') {
    throw new Error('url cannot be empty');
  }
  if (isNaN(min_view_price) || min_view_price < 0) {
    throw new Error('min_view_price must be a positive number');
  }
  if (isNaN(min_remix_price) || min_remix_price < 0) {
    throw new Error('min_remix_price must be a positive number');
  }
  if (min_remix_price < min_view_price) {
    throw new Error('min_view_price must be at most min_remix_price');
  }

  // invoke create
  const createInputs = [
    title,
    description,
    category,
    url,
    min_view_price,
    min_remix_price,
  ];
  sendRpc("create", createInputs, console.log);
}
