let model = null;
var hasilPrediksi = document.getElementById("hasilPrediksi");
document.addEventListener("DOMContentLoaded", async function () {
  console.log("model mulai dimuat");
  model = await tf.loadLayersModel("model_float/model.json");
  console.log("model telah selesai dimuat");
});
var loadFile = function (event) {
  var output = document.getElementById("output");
  var reader = new FileReader();
  reader.addEventListener("load", async function (event2) {
    output.src = event2.target.result;
    var imagebase64 = event2.target.result.replace(
      /^data:image\/[a-z]+;base64,/,
      ""
    );
    // Prediksi model disini
    if (model == null) {
      alert("Model belum selesai dimuat");
      return;
    }
    var label = [
      "Ayam Goreng",
      "Ayam Pop",
      "Daging Rendang",
      "Dendeng Batokok",
      "Gulai Ikan",
      "Gulai Tambusu",
      "Gulai Tunjang",
      "Telur Balado",
      "Telur Dadar",
    ];

    
    let img = tf.browser.fromPixels(output);
    img = img.resizeNearestNeighbor([150, 150]);
    img = img.div(tf.scalar(255));
    img = img.expandDims();
    let dataPrediksi = await model.predict(img).data();
    dataPrediksi = Array.from(dataPrediksi).map((value, idx) => {
      return {
        class: label[idx],
        confidence: value,  
      };
    });
    dataPrediksi.sort((x, y) => y.confidence - x.confidence);
    console.log(dataPrediksi);
    
    hasilPrediksi.innerHTML = dataPrediksi[0].class;
    // Reset isian array
    dataPrediksi = null;
  });

  reader.readAsDataURL(event.target.files[0]);
};
