let body = document.body;
body.addEventListener('dragover', function (e) {
  e.stopPropagation();
  e.preventDefault();
  this.style.background = '#e1e7f0';
}, false);

body.addEventListener('dragleave', function (e) {
  e.stopPropagation();
  e.preventDefault();
  this.style.background = '#ffffff';
}, false);


body.addEventListener('drop', function (e) {
  e.stopPropagation();
  e.preventDefault();
  this.style.background = '#ffffff'; //背景色を白に戻す
  let files = e.dataTransfer.files; //ドロップしたファイルを取得

  for (let i = 0; i < files.length; i++) {
    let fr = new FileReader();
    fr.readAsBinaryString(files[i]);
    fr.onload = function () {
      const xhr = new XMLHttpRequest()
      data = JSON.stringify({
        "path": files[i].path.replace(/\\/g, '/'),
      })
      console.log(data)
      xhr.open('POST', '/update_graph')
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onload = () => {
        console.log(xhr.status);
        let data = JSON.parse(xhr.responseText);
        let arr = ['data']
        // for (let i = 0; i < data.figure.length; i++) {
        for (let i = 0; i < 1024; i++) {
          arr.push(data.figure[i])
        }

        let x = [...Array(arr.length)].map((_, i) => i) //=> [ 0, 1, 2, 3, 4 ...],

        var ctx = document.getElementById("wavePlot");
        var wavePlot = new Chart(ctx, {
          type: 'line',
          data: {
            labels: x,
            datasets:
              [
                {
                  label: files[0].name,
                  data: arr,
                  borderColor: "rgba(255,0,0,1)",
                  backgroundColor: "rgba(0,0,0,0)"
                }
              ]
          },
          options: {
            elements: {
              point: {
                radius: 0
              }
            }
          }
        });

      };
      xhr.onerror = () => {
        console.log(xhr.status);
        console.log("error!");
      };

      xhr.send(data);
    };
  }
}, true);

