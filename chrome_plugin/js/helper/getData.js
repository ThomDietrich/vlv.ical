/*
 * returns the root element, which is the highest element on the page we work with
 */
function getRootElement() {
  return $(document.getElementsByClassName("stupla_fs09")[0]).parents().eq(4)[0];
}

/*
 * returns an array of all events present on the page
 */
function getElements(root) {
  var elements = root.getElementsByTagName('div');
  var result = [];
  for (var i = 0; i < elements.length; i++) {
    if (getDayOfWeek(elements[i]) != null &&
        getTime(elements[i]) != "  -  ") {
      result.push(elements[i]);
    }
  }
  return result;
}

function getIdOfLecture(object) {
  return object.id;
}

function getNameOfLecture(object) {
    return object.childNodes[1].childNodes[0].innerText;
}

function getSpeakerOfLecture(object) {
  return object.childNodes[3].innerText.slice(12);
}

function getDayOfWeek(object) {
  return object.childNodes[5].childNodes[3].childNodes[0].childNodes[3].innerText;
}

function getTime(object) {
  return object.childNodes[5].childNodes[3].childNodes[0].childNodes[7].innerText;
}

function getLastUpdated(object) {
  return object.childNodes[5].childNodes[3].childNodes[0].childNodes[13].innerText.slice(13);
}

function getData(object) {
  var data = [];
  var raw = getTypes(object);

  for (var i = 0; i < raw.length; i++) {
    var type = raw[i];
    var events = [];

    for (var j = 0; j < type.objs.length; j++) {
      var obj = type.objs[j];
      var tmpData = {
        "dayOfWeek": obj.childNodes[3].innerText,
        "dates": obj.childNodes[5].innerText,
        "time": obj.childNodes[7].innerText,
        "location": obj.childNodes[9].innerText,
        "targetGroup": obj.childNodes[11].innerText,
        "lastUpdated": obj.childNodes[13].innerText.slice(13)
      };

      events.push(tmpData);
    }

    var tmpTypeData = {
      "type": type.type,
      "events": events
    };

    data.push(tmpTypeData);

  }
  return data;
}

function getTypes(object) {
  var result = [];

  var tbodies = $(object).find('tbody');
  for (var i = 0; i < tbodies.length; i++) {
    var obj = tbodies[i];
    var type = $(obj.childNodes[0].childNodes[1]).attr('axis');
    var count = 0;
    var objs = [];

    var objs = $(obj).find('tr');
    var objects = [];
    for (var j = 0; j < objs.length; j++) {
      objects.push(objs[j]);
    }

    result[i] = {
      "type": type,
      "count": count,
      "objs": objects
    }
  }

  return result;
}

function convertData(obj) {
    var data = {
    id: "",
    name: "",
    origName: "",
    objects: [], // gets dataObjects
    link: []
  }
  var dataObjects;

  var objData = getData(obj);

  data.id = getIdOfLecture(obj);
  data.name = getNameOfLecture(obj);
  data.origName = data.name;
  data.link = getDomPath(obj);
  var comment = getSpeakerOfLecture(obj);
  
  for (var i = 0; i < objData.length; i++) {
    for (var j = 0; j < objData[i].events.length; j++) {
      var obj = objData[i].events[j];

      var timeData = [obj.dates, obj.time];
      var time = parseTime(timeData, obj.dayOfWeek);
      var repeat = parseIntervall(obj.dates);
      var begin;
      var end;
      var until = null;

      if(!Array.isArray(time[0])){
      begin     = time[0];
      end       = time[1];

      } else {
        begin = [];
        end = [];
        until = [];
        time.forEach(function(event, i, eventArray){
          begin.push(event[0]);
          end.push(event[2]);
          until.push(event[1]);
        });
      }

      /*
       * has to be outsourced to some kind of setting
       */
      var setTypeName = true;

      var typeName;
      if (setTypeName) {
        var type;
        if (objData[i].type !== undefined) {
          switch(objData[i].type) {
            case "Vorlesungen:":
              type = "Vorlesung";
              break;
            case "Vorlesungen (Fakultativ):":
              type = "Vorlesung";
              break;
            case "Übungen:":
              type = "Übung";
              break;
            case "Klausur:":
              type = "Klausur";
              break;
            case "Seminar:":
              type = "Seminar";
              break;
            case "Seminare (Fakultativ):":
              type = "Seminar (Fakultativ)";
              break;
            case "Praktika:":
              type = "Praktikum";
              break;
            default:
              type = objData[i].type;
              break;
          }
        } else {
          type = "";
        }

        typeName = data.name + " " + type;
      } else {
        typeName = data.name;
      }

      dataObjects = { type: objData[i].type,
                    name: typeName,
                    location: obj.location, 
                    begin: begin,
                    end:   end,
                    until: until,
                    weekly: repeat,
                    lastUpdated: obj.lastUpdated,
                    comment:  comment};
      data.objects.push(dataObjects);
    }
  }
  return data;
}