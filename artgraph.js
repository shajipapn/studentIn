$(document).ready(function() {
  registerTabs();
  setUpKeys();
  setUpAppreciate();
  setUpCreate();
  setUpTrade();
});

function registerTabs() {
  console.log('registering tabs');
  $("div.artgraph-tab-menu>div.list-group>a").click(function(e) {
    e.preventDefault();
    $(this).siblings('a.active').removeClass("active");
    $(this).addClass("active");
    const index = $(this).index();
    console.log('selected tab', index);
    $("div.artgraph-tab>div.artgraph-tab-content").removeClass("active");
    $("div.artgraph-tab>div.artgraph-tab-content").eq(index).addClass("active");
  });
}