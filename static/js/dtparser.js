function fileUpload(fis) {
    // alert("파일네임: " + fis.value.substring(str.lastIndexOf("\\") + 1));
    var reader = new FileReader();
    reader.onload = function() {
        console.log(JSON.parse(reader.result));
    }
    console.log(fis.files[0]);
    console.log(reader);
    reader.readAsText(fis.files[0]);
}

var data = {};

var mainTable = document.getElementById('mainTable');
var content = document.getElementById('content');

var fieldJson = {};
var routeJson = {};

OVER_COLOR = "gray";
LEAVE_COLOR = "";
DOWN_COLOR = "black";
UP_COLOR = OVER_COLOR;

var TILE_SCHEMA = {
    'disable_properties' : true,
    schema: {
        type: "object",
        title: "Tile",
        properties: {
            Position: {
                type: "object",
                properties: {
                    X: {
                        type: "integer",
                        default: 0
                    },
                    Y: {
                        type: "integer",
                        default: 0
                    }
                }
            },
            Type: {
                type: "string",
                enum: [
                    "VE_NONE",
                    "VE_START",
                    "VE_NORMAL",
                    "VE_CLEAR",
                ],
                default: "VE_NONE"
            },
            Effect: {
                type: "object",
                properties: {
                    EffectType: {
                        type: "string",
                        enum: [
                            "VE_Battle",
                            "VE_BattleRandom",
                            "VE_BossBattle",
                            "VE_Heal",
                            "VE_GetGold",
                            "VE_GetItemRandom",
                            "VE_RouteChange"
                        ],
                        default: "VE_Heal"
                    },
                    IntValue: {
                        type: "integer",
                        default: 0
                    },
                    TextValue: {
                        type: "string",
                        default: "None"
                    }
                }
            },
            ArrowDirection: {
                type: "string",
                enum: ["VE_None", "VE_Left", "VE_Right", "VE_Up", "VE_Down"],
                default: "VE_None"
            },
            StoryType: {
                type: "string",
                enum: ["VE_None", "PreviousEffect", "AfterEffect"]
            },
            StoryCode: {
                type: "string"

            },
            IsRouteChange: {
                type: "boolean"

            },
            RouteIndex: {
                type: "integer"

            },
            IsMustStop: {
                type: "boolean"

            },
            IsRandomable: {
                type: "boolean"

            }
        }
    }
};

$.getJSON("data/DT_Field2.json", function(json) {
    fieldJson = json;
    $.getJSON("data/DT_Route2.json", function(json) {
        routeJson = json;
        drawField(fieldJson);
    });
});

function drawField(fields) {
    for (var i = 0; i < fields.length; ++i) {
        var field = fields[i];
        // create table
        var table = document.createElement('table');
        console.log(table.children);
        table.id = field['name'];
        table.className = "table";
        table.style = "-webkit-touch-callout: none;-webkit-user-select: none;-khtml-user-select: none;-moz-user-select: none;-ms-user-select: none;user-select: none;";

        document.getElementById('table_holder').appendChild(table);

        // add row and column
        for (var j = 0; j < field['Row']; ++j) {
            var row = table.insertRow(j);
            for (var k = 0; k < field['Column']; ++k) {
                var cell = row.insertCell(k);
                cell.innerHTML = ".";
                cell.onmouseover = function() {
                    this.style = "background-color:" + OVER_COLOR + ";"
                }
                cell.onmouseleave = function() {
                    this.style = "background-color:" + LEAVE_COLOR + ";"
                }
                cell.onmousedown = function() {
                    this.style = "background-color:" + DOWN_COLOR + ";"
                }
                cell.onmouseup = function() {
                    console.log("UP");
                    var obj = JSON.parse(this.children[0].innerHTML);
                    editor.setValue(obj)
                    this.style = "background-color:" + UP_COLOR + ";"
                }
            }
        }

        // draw each route
        for (var j = 0; j < field['RouteList'].length; ++j) {
            var routeName = field['RouteList'][j];
            for (var k = 0; k < routeJson.length; ++k) {
                if (routeJson[k]['Name'] == routeName)
                    drawRoute(table, routeJson[k]);
            }
        }
    }

}

function drawRoute(table, route) {
    var tileList = route['TileList'];
    for (var i = 0; i < tileList.length; ++i) {
        var pos = tileList[i]['Position'];
        var cell = table.rows[pos.Y].cells[pos.X];
        cell.innerHTML = tileList[i]['Effect']['EffectType'];
        cell.innerHTML += "<a style='display: none;'>" + JSON.stringify(tileList[i]) + "</a>";
    }
}

var editor = new JSONEditor(document.getElementById('editor_holder'), TILE_SCHEMA);

document.getElementById('submit').addEventListener('click', function() {
    console.log(editor.getValue());
});
