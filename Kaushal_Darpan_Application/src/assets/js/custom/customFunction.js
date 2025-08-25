var tableToExcel = (function () {
  var today = new Date();
  var uri = 'data:application/vnd.ms-excel;base64,'
    , template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[ifgte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>'
    , base64 = function (s) { return window.btoa(unescape(encodeURIComponent(s))) }
    , format = function (s, c) { return s.replace(/{(\w+)}/g, function (m, p) { return c[p]; }) }
  getFormattedDate = function () {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = today.getMonth(); //January is 0!
    var yyyy = today.getFullYear();
    var monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
    return dd + ' ' + monthNames[mm] + ' ' + yyyy;
  };
  return function (table, name, fileName) {
    if (!table.nodeType) table = document.getElementById(table)
    var date = getFormattedDate();
    var Heading = '<caption><h2>Kaushal Darpan</h2></caption>';
    var ctx = { worksheet: name || 'Worksheet', table: Heading + table.innerHTML }
    //window.location.href = uri + base64(format(template, ctx))
    var link = document.createElement('a');
    link.download = fileName + '_' + date + '.xls';
    link.href = uri + base64(format(template, ctx));
    link.click();
  }
})()
