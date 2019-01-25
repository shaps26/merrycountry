const request = require('sync-request');
const rp = require('request-promise');
const $ = require('cheerio');
const url = 'http://www.atlas-monde.net/?s=';


class GlobeController {

    constructor(io){
        this.io = io;
        io.sockets.on('connection', function(socket){
            socket.on('globesearchresult', function(searchvalue){
                console.log("globesearchresult test"+searchvalue);
                var isTable=true;
                rp(url+searchvalue)
                    .then(function(html) {
                        var title= $('.title h1', html);
                        title= $(title[0]).text();
                        var drapeau = $('.gallery-icon a', html);
                        drapeau= $(drapeau[2]).html();
                        var text_info = $('.main p', html);
                        var text_info1 = $(text_info[1]).html();
                        var text_info2 = $(text_info[2]).html();
                        socket.emit('globesearchresult', {title: title, drapeau: drapeau, text_info1: text_info1, text_info2: text_info2});
                    })
                    .catch(function(err) {
                        //handle error
                    });
            });
        });
    }

    getView(req, res){
        var dataView = {
            "type" : "Globe"
        };
        res.end(JSON.stringify(dataView));
    }


    postAction(req, res){
        switch(req.params.actionId){
            case "test":
            case "whatis":
                console.log(req.body.searchValue);
                var requestUrl="https://restcountries.eu/rest/v2/name/";
                requestUrl += req.body.searchValue;
                console.log(requestUrl);
                var wikiReq = request('GET', requestUrl,{cache:'file'});
                var response = JSON.parse(wikiReq.getBody('utf8'));
                var textResponse ="La capitale est " + response[0].capital +", la population est de " + response[0].population +" habitants. Situé en " + response[0].region +", on y parle " + response[0].languages[0].nativeName +" et on y paye avec des  " + response[0].currencies[0].name;
                if(!textResponse){
                    res.end(JSON.stringify({resultText: "je n'ai pas d'informations"}));
                }else{
                    res.end(JSON.stringify({resultText: textResponse}));
                }

            default:
                res.end(JSON.stringify({}));
                break;

        }
    }
}

function parseDataSend(data){
    if(data.indexOf(" ")){
        var pieces = data.split(" ");
        data="";
        for ( var i in pieces){
            if(pieces[i].length>3){
                data += pieces[i].charAt(0).toUpperCase();
                data += pieces[i].substr(1);
                if(i!==pieces.length - 1){
                    data+="_";
                }
            }
        }
    }
    return data;
}

/*
function parseDataResponse(response){
    if(response){
        if(response.query){
            for(var i in response.query.pages){
                if(response.query.pages[i].extract){
                    if(response.query.pages[i].extract.indexOf('\n')!==-1){
                        var textResponse= response.query.pages[i].extract.substr(0, response.query.pages[i].extract.indexOf('\n'));
                    }else{
                        var textResponse= response.query.pages[i].extract;
                    }
                    if(textResponse.length > 300){
                        textResponse= textResponse.substr(0, textResponse.indexOf("."));
                    }
                    console.log(textResponse);
                    return textResponse;
                }
            }
        }
        console.log(response);
    }
    return false;
}
*/

module.exports = GlobeController;