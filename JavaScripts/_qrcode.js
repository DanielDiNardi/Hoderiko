import QrScanner from './qr-scanner.min.js'; // if using plain es6 import
QrScanner.WORKER_PATH = '../JavaScripts/qr-scanner-worker.min.js';
const QrScanner = require('path/to/qr-scanner.umd.min.js'); // if not installed via package


const filename = "QRCODE.JS ";

function Check() {
    console.log(filename + "Starting check")
}

function scanQrCode() {
    console.log("Entering Scan QR Code");
    const qrScanner = new QrScanner(videoElem, result => console.log('decoded qr code:', result));
    qrScanner.start();

}

