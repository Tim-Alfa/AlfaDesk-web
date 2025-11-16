function api_request(cesta, metoda, parametre, fx_uspech, fx_chyba) {
  let plna_url = API_BASE + cesta;
  $.ajax({
    type: metoda,
    url: plna_url,
    data: parametre,
    dataType: "json",
    success: fx_uspech,
    error: fx_chyba 
  });
}