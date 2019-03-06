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


    },

    /**
     * Try to scan new QR code
     */
    scanCode: function() {

        /**
         * When QR code camera is ready / failed
         * @param err
         * @param status
         */
        function onDone(err, status){
            if (err) {
                alert(err);
            }

            if (status.authorized) {

                /**
                 * Scan QR code
                 */
                QRScanner.scan(displayContents);

                /**
                 * Callback for scanned QR code
                 * @param err
                 * @param text
                 */
                function displayContents(err, text){
                    if(err){
                        if(err.name === 'SCAN_CANCELED') {
                            alert('Skanowanie anulowano...');
                        } else {
                            alert('Wystąpił błąd...');
                        }
                    } else {
                        alert(text);
                    }
                }

                /**
                 * Insert camera for scanning QR codes
                 */
                QRScanner.show();

            } else if (status.denied) {
                if(confirm("Musisz udostępnić możliwość nagrywania w ustawieniach aplikacji aby otrzymać możliwość skanowania kodów QR.")){
                    QRScanner.openSettings();
                }
            } else {
                if(confirm("Musisz wyrazić zgodę na użycie kamery.")){
                    QRScanner.openSettings();
                }
            }
        }

        this.setView('scan');
        QRScanner.prepare(onDone);

    },

    scanCancel: function() {
        QRScanner.cancelScan(function(status){
            console.log(status);
        });
        this.setView('list');
    },

    setView: function(viewName = 'list') {
        switch (viewName) {
            case 'list':
                document.body.style.backgroundColor = 'white';
                document.getElementById('app-view').style.display = 'block';
                document.getElementById('scan-view').style.display = 'none';
                break;
            case 'scan':
                document.body.style.backgroundColor = 'transparent';
                document.getElementById('app-view').style.display = 'none';
                document.getElementById('scan-view').style.display = 'block';
                break;
            default:
                document.body.style.backgroundColor = 'white';
                document.getElementById('app-view').style.display = 'block';
                document.getElementById('scan-view').style.display = 'none';
                break;
        }
    }
};

app.initialize();