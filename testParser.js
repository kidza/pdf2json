let PDFParser = require("./pdfparser");
let fs = require('fs');
let PDFImage = require('./lib/pdfimage');
// let PDFJS = require("./lib/pdf.js");

const { createCanvas, loadImage, createImageData } = require('canvas');


let PDFCanvas = require('./lib/pdfcanvas.js');

let pdfParser = new PDFParser(this, 1);

// filePath = "./pdf-parser/pdfFiles/ebf4cd_0.pdf";
// filePath = "./69141d_0(1).pdf";
filePath = "./Atlas of Histology with Functional Correlations ( PDFDrive.com ) (1).pdf";
// filePath = "./pdf-p  arser/pdfFiles/effective-performance-engineering.pdf";
// filePath = "./pdf-parser/pdfFiles/ebf4bd_0.pdf";
// filePath = "./pdf-parser/pdfFiles/deep_learning.pdf";

pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError) );
pdfParser.on("pdfParser_dataReady", async pdfData => {

    debugger;

    let rawText = pdfParser.PDFJS.rawTextContents;

    let pdfPages = pdfData.formImage.Pages;

    for (let j=0; j<pdfPages.length; j++) {
        let pdfImages = pdfPages[j].Images;
        for (let i=0; i<pdfImages.length; i++) {
            let image = pdfImages[i];

            // console.log(typeof imageData.data);

            // console.log(typeof image);
            // exit();

            if (image instanceof PDFImage) { //image is PDFImage
                let fileDataString = decodeBase64(image.src);
                saveImageToDir(fileDataString.data, j, i, 'jpeg');
            } else if (typeof image.data != "undefined") { //image is ImageData
                const canvas = createCanvas(image.width, image.height);

                const ctx = canvas.getContext('2d');

                let arrayclamped = Uint8ClampedArray.from(image.data);
                let canvasImageData = createImageData(arrayclamped, image.width, image.height);
                ctx.putImageData(canvasImageData, 0, 0);

                let dataURL = await canvas.toDataURL();
                // console.log(dataURL)

                let fileDataString = decodeBase64(dataURL);
                // let buf = Buffer.from(fileDataString, 'base64');
                saveImageToDir(fileDataString.data, j, i, 'png');
            }
        }
    }

});

pdfParser.loadPDF(filePath);

let saveImageToDir = (fileString, page, counter, type) => {
    fs.writeFile('images/fileName_' + page + '_' + counter +'.' + type, fileString, 'binary', function (err) {
        if (err) {
            console.log("There was an error writing the image")
        }
        else {
            console.log("The sheel file was written")
        }
    });
}


let decodeBase64 = (dataString) => {
    let matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    let response = {};

    if (matches.length !== 3) {
        return new Error('Invalid data');
    }

    response.type = matches[1];
    response.data = new Buffer.from(matches[2],'base64');

    return response;
};
