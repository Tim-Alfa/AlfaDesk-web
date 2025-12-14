$(document).ready(function() {
    /* --- 1. Globálne nastavenia a konštanty --- */
    console.log("Aplikácia pripravená.");

    const FINALNA_URL = "https://test.alfadesk.esec.sk/ticket/";

    /* --- 2. Správa Ticketov (Odoslanie) --- */
    
    // Event listener pre odoslanie
    $(".submit-btn").on("click", function(e) {
        e.preventDefault();
        odoslatTicket();
    });

    function odoslatTicket() {
        // Zber dát z formulára
        let valZariadenie = $("#zariadenie").val();
        let valNazov = $("#zariadenie_nazov").val();
        let valUmiestnenie = $("#umiestnenie").val();
        let valPopis = $("#popis").val();

        // Validácia
        if (!valUmiestnenie || !valPopis) {
            alert("Vyplňte prosím všetky polia.");
            return;
        }

        // Príprava payloadu
        let data = {
            "fronta": 44,
            "zariadenie": parseInt(valZariadenie) || 12,
            "zariadenie_nazov": valNazov || "Testovacie zariadenie",
            "umiestnenie": valUmiestnenie,
            "popis": valPopis,
            // Technické parametre
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

        // API Request
        $.ajax({
            url: FINALNA_URL,
            type: "POST",
            data: JSON.stringify(data),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(response) {
                alert("ÚSPECH! Ticket ID: " + response.id);
                
                $("#createTicketForm")[0].reset();
                if (typeof showSection === "function") {
                    showSection('section-new-tickets');
                }
            },
            error: function(xhr, status, error) {
                console.error("Chyba spojenia:", error);
                console.log("Server odpovedal:", xhr.responseText);
                
                alert("Chyba pri odosielaní: " + xhr.status + " " + error);
            }
        });
    }

    /* --- 3. Autentifikácia (Login) --- */

    function performLogin() {
        var user = $('#username').val();
        var pass = $('#password').val();

        // Presmerovanie podľa rolí
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
            alert('Nesprávne meno alebo heslo!');
        }
    }

    // Event listeners pre login
    $('#loginBtn').click(function() {
        performLogin();
    });

    $('.login-input').keypress(function(e) {
        if(e.which == 13) { 
            performLogin();
        }
    });

    /* --- 4. Navigácia a zobrazenie sekcií --- */

    window.showSection = function() {
        // Zistenie kontextu stránky
        const path = window.location.pathname;
        const pageName = path.substring(path.lastIndexOf('/') + 1);

        // Reset zobrazenia
        $('.content-section').hide();

        // Logika zobrazenia podľa roly
        
        // --- ADMIN ---
        if (pageName === 'admin.html') {
            for (let i = 0; i < arguments.length; i++) {
                $('#' + arguments[i]).show(); 
            }
        } 
        
        // --- TECHNIK a UŽÍVATEĽ ---
        else if (pageName === 'technician.html' || pageName === 'user.html') {
            if (arguments.length > 0) {
                const sectionId = arguments[0];
                
                // Zobrazenie vyžiadanej sekcie
                $('#' + sectionId).show();

                // Rozhodovanie o zobrazení Dashboardu
                const detailViews = [
                    'section-create-ticket',
                    'section-manage-ticket',
                    'section-finish-ticket',
                    'section-solved-detail',
                    'section-create-user'
                ];

                // Ak nie sme v detaile, zobrazíme aj Dashboard
                if (detailViews.indexOf(sectionId) === -1) {
                    $('#section-dashboard').show(); 
                    $('.tiles-grid').show(); // Fallback pre starú štruktúru
                } 
            }
        }
    };

    /* --- 5. Komponenty UI (Stránkovanie) --- */

    function addPaginationToTables() {
        const tableWrappers = document.querySelectorAll('.table-wrapper');
    
        const paginationHTML = `
            <div class="pagination-container">
                <div class="pagination-info">
                    Zobrazené 1-10 z 50 záznamov
                </div>
    
                <div class="pagination-controls">
                    <button class="pagination-btn" title="Prvá strana">&lt;&lt;</button>
                    <button class="pagination-btn" title="Predchádzajúca">&lt;</button>
                    
                    <div class="pagination-input-group">
                        Strana <input type="number" class="pagination-input" value="1" min="1"> z 5
                    </div>
    
                    <button class="pagination-btn" title="Nasledujúca">&gt;</button>
                    <button class="pagination-btn" title="Posledná strana">&gt;&gt;</button>
                </div>
            </div>
        `;
    
        tableWrappers.forEach(wrapper => {
            if (!wrapper.querySelector('.pagination-container')) {
                wrapper.insertAdjacentHTML('beforeend', paginationHTML);
            }
        });
    }

    /* --- 6. Inicializácia po načítaní --- */
    
    // Injekcia komponentov
    addPaginationToTables();

    // Nastavenie počiatočného stavu
    const path = window.location.pathname;
    const pageName = path.substring(path.lastIndexOf('/') + 1);

    if (pageName === 'admin.html') {
        showSection('section-main-dashboard', 'section-all-records');
    } 
    else if (pageName === 'technician.html') {
        showSection('section-all-tickets'); 
    }
    else if (pageName === 'user.html') {
        showSection('section-all-tickets');
    }
});