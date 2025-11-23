$(document).ready(function() {
    console.log("Aplikácia pripravená.");

    const FINALNA_URL = "https://test.alfadesk.esec.sk/ticket/";


    // --- FUNKCIA ODOSLANIA ---
    // Pripneme akciu na tlačidlo (bezpečne cez jQuery)
    $(".submit-btn").on("click", function(e) {
        e.preventDefault(); // Zabráni obnoveniu stránky
        odoslatTicket();
    });

    function odoslatTicket() {
        // Zber dát
        let valZariadenie = $("#zariadenie").val();
        let valNazov = $("#zariadenie_nazov").val();
        let valUmiestnenie = $("#umiestnenie").val();
        let valPopis = $("#popis").val();

        if (!valUmiestnenie || !valPopis) {
            alert("Vyplňte prosím všetky polia.");
            return;
        }

        // Dáta
        let data = {
            "fronta": 44,
            "zariadenie": parseInt(valZariadenie) || 12,
            "zariadenie_nazov": valNazov || "Testovacie zariadenie",
            "umiestnenie": valUmiestnenie,
            "popis": valPopis,
            // Povinné technické polia
            "odstranenie_predpoklad": new Date().toISOString(),
            "odstranenie_skutocne": new Date().toISOString(),
            "zaciatok_riesenia": new Date().toISOString(),
            "koniec_riesenia": new Date().toISOString(),
            "vyriesene": false,
            "nh_predpoklad": 0,
            "nh_skutocne": 0,
            "vyriesil": 44,
            "prilohy_zadavatel": { "filename": [] },
            "prilohy_riesitel": { "filename": [] }
        };

        // AJAX POST
        $.ajax({
            url: FINALNA_URL,
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(response) {
                alert("ÚSPECH! Ticket ID: " + response.id);
                // Reset a prepnutie
                $("#createTicketForm")[0].reset();
                if (typeof showSection === "function") {
                    showSection('section-new-tickets');
                }
            },
            error: function(xhr, status, error) {
                // Detailný výpis chyby
                console.error("Chyba spojenia:", error);
                console.log("Server odpovedal:", xhr.responseText);
                
                alert("Chyba: " + xhr.status + " " + error + 
                      "\n\nMožná príčina:\n1. Zlá adresa (404)\n2. CORS blokovanie (skús plugin v prehliadači)\n3. Zlé dáta (400)");
            }
        });
    }

    // --- NAVIGÁCIA (aby fungovalo menu) ---
    window.showSection = function(sectionId) {
        $('.content-section').hide();
        $('#' + sectionId).show();
    };


    // Login presmerovanie
    $(document).ready(function() {

        // Hlavná funkcia na overenie údajov
        function performLogin() {
            // Získanie hodnôt z inputov podľa ID
            var user = $('#username').val();
            var pass = $('#password').val();

            // Logika presmerovania
            if (user === 'admin' && pass === 'admin') {
                window.location.href = 'admin.html';
            } 
            else if (user === 'user' && pass === 'user') {
                window.location.href = 'user.html';
            } 
            else if (user === 'technician' && pass === 'technician') {
                window.location.href = 'technician.html';
            } 
            else {
                // Chybová hláška
                alert('Nesprávne meno alebo heslo!');
            }
        }

        // Event listener: Kliknutie na tlačidlo
        $('#loginBtn').click(function() {
            performLogin();
        });

        // Event listener: Stlačenie Enter v input poliach
        $('.login-input').keypress(function(e) {
            if(e.which == 13) { // 13 = klávesa Enter
                performLogin();
            }
        });

    });

});

