
function showList() {
    document.body.style.backgroundColor = '#ffffff';
    document.getElementById('app-view').style.display = 'block';
    document.getElementById('scan-view').style.display = 'none';
}

function showScanner() {
    document.body.style.backgroundColor = 'transparent';
    document.getElementById('app-view').style.display = 'none';
    document.getElementById('scan-view').style.display = 'block';
}

window.removeSingleTotp = function (key) {
    console.log(key);
    localStorage.removeItem(key);
};

var app = {
    /**
     * Initialize application
     */
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        document.getElementById('scan-btn').addEventListener('click', this.scanCode.bind(this));
        document.getElementById('cancel-btn').addEventListener('click', this.scanCancel.bind(this));
    },

    /**
     * Called when device is ready
     */
    onDeviceReady: function() {
        this.renderAllTokens().bind(this);
    },

    renderAllTokens: function() {
        setInterval(function() {
            document.getElementById('totp-codes').innerHTML = '';
            for (var i = 0; i < localStorage.length; i++){
                document.getElementById('totp-codes').innerHTML += ('<div class="card card bg-dark" id="'+localStorage.key(i)+'" style="margin-top: 10px; margin-bottom: 10px;">\n' +
                    '                    <div class="card-header">' +
                    '                        <div class="float-left">'+JSON.parse(localStorage[localStorage.key(i)]).i+'</div>\n' +
                    '                        <div class="float-right" onclick="removeSingleTotp(\''+localStorage.key(i)+'\')">X Remove</div></div>\n' +
                    '                    <div class="card-body">\n' +
                    '                        <h4 class="card-title">'+JSON.parse(localStorage[localStorage.key(i)]).e+'</h4>\n' +
                    '                        <h1 class="card-title">'+otplib.authenticator.generate(JSON.parse(localStorage[localStorage.key(i)]).s)+'</h1>\n' +
                    '                        <div class="progress">\n' +
                    '                            <div class="progress-bar" role="progressbar" style="width: '+Math.round((otplib.totp.timeRemaining() / 30) * 100)+'%; background-color: #ffd200;" aria-valuenow="'+Math.round((otplib.totp.timeRemaining() / 30) * 100)+'" aria-valuemin="0" aria-valuemax="100"></div>\n' +
                    '                        </div>\n' +
                    '                    </div>\n' +
                    '                </div>');
                console.log(
                    Math.round((otplib.totp.timeRemaining() / 30) * 100)
                );
            }
        }, 200);
    },

    /**
     * Try to scan new QR code
     */
    scanCode: function() {
        showScanner();

        QRScanner.show(function(status){
            console.log(status);
        });
        QRScanner.prepare(this.onDone.bind(this));
    },

    /**
     * When QR code camera is ready / failed
     * @param err
     * @param status
     */
    onDone: function (err, status){
        if (err) {
            alert(err);
        }

        if (status.authorized) {

            /**
             * Scan QR code
             */
            QRScanner.scan(this.displayContents.bind(this));

        } else if (status.denied) {
            if(confirm("You must give a permission for camera usage.")){
                QRScanner.openSettings();
            }
        } else {
            if(confirm("You must give a permission for camera usage.")){
                QRScanner.openSettings();
            }
        }
    },

    /**
     * Callback for scanned QR code
     * @param err
     * @param text
     */
    displayContents: function (err, text){
        if(err){
            if(err.name === 'SCAN_CANCELED') {
                // alert('Cancelled...');
            } else {
                alert('Error...');
            }
        } else {
            this.decodeAuthURL(text).bind(this);
        }

        showList();
    },

    /**
     * Cancel scanning
     */
    scanCancel: function() {
        QRScanner.cancelScan(function(status){
            console.log(status);
        });

        showList();
    },

    // otpauth://totp/<issuer>:<user_name>?secret=<secret>&issuer=<issuer>
    decodeAuthURL: function(authUrl) {
        var issuer = authUrl.split('/')[3].split(':')[1].split('?')[1].split('&')[1].split('=')[1];
        var email = authUrl.split('/')[3].split(':')[1].split('?')[0];
        var secret = authUrl.split('/')[3].split(':')[1].split('?')[1].split('&')[0].split('=')[1];
        localStorage.setItem('2fa_' + Date.now(), JSON.stringify({
            s: secret,
            i: issuer,
            e: email
        }));

        showList();
    }
};

app.initialize();