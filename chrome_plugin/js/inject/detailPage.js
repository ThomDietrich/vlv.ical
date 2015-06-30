function addDownloadButtonDetailPage() {
  var tbodies = $(document.body).find('tbody');
  var hasValidContent = false;

  for (var i = 0; i < tbodies.length; i++) {
    var tr = $(tbodies[i]).find('tr');
    for (var j = 0; j < tr.length; j++) {
    	var obj = tr[j];
      var data = getDetailData(obj);

      if (data !== null && data !== undefined) {
        if (data.name !== "" &&
            (data.begin instanceof String || data.begin instanceof Array) &&
            (data.end instanceof String || data.end instanceof Array)) {
          obj.className = "detailTr";
          if (!hasValidContent) {
            hasValidContent = true;
          }
        }
      }
    }
  }

  $('.detailTr').on('mouseover', function() {
  	this.style.background = "#a2dda8";
  });

  $('.detailTr').on('mouseout', function() {
  	this.style.background = "white";
    $('.downloadDetail').remove();
  });

  $('.detailTr').on('click', function() {
    var el = this;
    bootbox.confirm("Wollen sie den ausgewählten Termin herunterladen?", function(result) {
         if (result) {
          downloadDetail(el);
        }
    }); 
  });

  if (hasValidContent) {
      $('#openSelectionBox').remove();
      $('#emptyBox').prepend('<div class="detailInfoBox"><span class="glyphicon glyphicon-info-sign" aria-hidden="true"></span> Zum Download anklicken</div>');
    }
}