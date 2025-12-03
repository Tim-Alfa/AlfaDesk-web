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

    /* SKRIPT PRE OBSLUHU NAVIGÁCIE A ZOBRAZOVANIA SEKCIÍ */

    window.showSection = function() {
        // 1. Zistenie aktuálnej stránky
        const path = window.location.pathname;
        const pageName = path.substring(path.lastIndexOf('/') + 1);

        // 2. Skrytie úplne všetkých sekcií (reset stavu)
        // Toto skryje Dashboardy, Tabuľky, Formuláre... všetko s triedou .content-section
        $('.content-section').hide();

        // 3. Logika podľa typu užívateľa (stránky)

        // === ADMIN ===
        if (pageName === 'admin.html') {
            // Admin môže poslať viacero ID naraz (napr. Dashboard + Tabuľka histórie)
            // Funkcia prejde všetky argumenty a zobrazí ich
            for (let i = 0; i < arguments.length; i++) {
                $('#' + arguments[i]).show(); 
            }
        } 
        
        // === TECHNIK a UŽÍVATEĽ ===
        else if (pageName === 'technician.html' || pageName === 'user.html') {
            
            // Získame ID sekcie, ktorú chceme zobraziť (napr. 'section-create-ticket')
            // Ak funkcia nemá argumenty, nič sa nestane
            if (arguments.length > 0) {
                const sectionId = arguments[0];

                // A) Vždy zobrazíme vyžiadanú sekciu (napr. tabuľku alebo formulár)
                $('#' + sectionId).show();

                // B) Rozhodneme, či má byť viditeľný aj hlavný panel s dlaždicami (Dashboard)
                
                // Zoznam "Detailných pohľadov" = obrazovky, kde dlaždice NECHCEME (formuláre, detaily)
                const detailViews = [
                    'section-create-ticket',
                    'section-manage-ticket',
                    'section-finish-ticket',
                    'section-solved-detail',
                    'section-create-user' // Pridané pre istotu, ak by to používal user
                ];

                // Ak aktuálna sekcia NIE JE v zozname detailov, zobrazíme aj Dashboard
                if (detailViews.indexOf(sectionId) === -1) {
                    // Pre novú HTML štruktúru: zobrazíme sekciu, ktorá obaľuje dlaždice
                    $('#section-dashboard').show(); 
                    
                    // Pre starú HTML štruktúru (ak user.html ešte nemá section):
                    $('.tiles-grid').show(); 
                } 
                // Ak JE v zozname detailov, Dashboard ostane skrytý (z kroku 2)
            }
        }
    };


    // --- Inicializácia po načítaní stránky ---
    $(document).ready(function() {
        const path = window.location.pathname;
        const pageName = path.substring(path.lastIndexOf('/') + 1);

        // Nastavenie predvoleného pohľadu po F5 (refresh)
        
        if (pageName === 'admin.html') {
            // Admin vidí Hlavný dashboard + Tabuľku všetkých záznamov
            showSection('section-main-dashboard', 'section-all-records');
        } 
        else if (pageName === 'technician.html') {
            // Technik vidí Dashboard (automaticky cez logiku hore) + Tabuľku všetkých ticketov
            showSection('section-all-tickets'); 
        }
        else if (pageName === 'user.html') {
            // Užívateľ vidí to isté čo technik (Dashboard + Tabuľku)
            showSection('section-all-tickets');
        }
    });
    

});

