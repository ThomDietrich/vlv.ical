/*
 * injects download buttons into the webpage
 */
 
 function getDatetoString(){
  var now = new Date();

   var year = now.getFullYear();
   
   var month = now.getMonth() + 1;
   if (month < 10) {
    month = "0" + month;
   }

   var day = now.getDate();
   var hours = now.getHours();
   var minutes = now.getMinutes();
   
   var dateString = year + month + day + "_" + hours + minutes;
   return dateString;
 }
 
function injectDownloadButtons() {
  
  // adds a download button that only downloads an array of selected objects
  var downloadSelected = document.createElement('input');
  downloadSelected.type = 'button';
  downloadSelected.id = 'downloadSelected';
  downloadSelected.className = 'downloadButton primary-btn';
  downloadSelected.value = 'Download';

  var box = $('#downloadArea');
  box.prepend(downloadSelected);

  $("#downloadSelected").on('click', function(entryInfo){
    var filename = "vlv_ical_export_" + getDatetoString();
    downloadSelection(filename);
  });
}

function injectSelectAllButton() {
  var selectAll = $('<button id="selectAll" class="selectAll">Select All / Unselect All</input>');
  selectAll.insertBefore(subjects[0]);
  $('<p>&nbsp;</p>').insertBefore(subjects[0]);
  
  $("#selectAll").on('click', function(entryInfo){
    var bool = load('selection').length < subjects.length;
    for (var i = 0; i < subjects.length; i++) {
      var object = subjects[i];
      if (bool) {
        if(!containsObject(getIdOfLecture(object), load('selection'))) {
          addToCart(object);
        }
      } else {
        if(containsObject(getIdOfLecture(object), load('selection'))) {
          deleteFromCart(object);
          updateSelection();
        }
      }
    }
    openBox();
  });
}

/*
 * injects buttons to add subjects to an array, like a shopping cart
 */
function injectAddButtons(subjects) {
  for (var i = 0; i < subjects.length; i++){
    var object = subjects[i];
    var name = subjects[i].childNodes[1].childNodes[0].data;
    subjects[i].childNodes[1].childNodes[0].data = null;
    var r = $('<button class="addButton">' + name + '</button>');
    r.insertBefore(subjects[i].childNodes[1].childNodes[0]);

    var oldElement = object.childNodes[1].childNodes[2];
    var newElement = $('<button class="moreInfoButton" onclick="window.open(\'' + oldElement.href + '\', \'_blank\')">weitere Informationen</button>');
    newElement.insertBefore(oldElement);
    $(object.childNodes[1].childNodes[3]).remove();
  }
  
  $(".addButton").on('click', function(){
    $(this).toggleClass('active');
    var object = this.parentNode.parentNode;
    var selection = load('selection');
    if(!containsObject(getIdOfLecture(object), selection)) {
      addToCart(object);
    } else {
      removeFromCart(object);
    }
  });
}
