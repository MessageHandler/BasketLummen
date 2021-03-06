var vblprotocol = "https";
var vblbase = "vblcb.wisseq.eu/VBLCB_WebService/data";
var imgbas = "https://vblcb.wisseq.eu/vbldata/organisatie/";

var vbl = new function(){
    var self = this;

    this.getRequest = function(uri, callback){
        var xhttp = new XMLHttpRequest();
        xhttp.onload = function () { callback(JSON.parse(xhttp.responseText)); };
        xhttp.onerror = function xhrError () { console.error(this.statusText); }
        xhttp.open("GET", uri, true);
        xhttp.setRequestHeader("Content-type", "application/json");
        xhttp.send();    
    }
    this.getUrl = function(path, query){
        return vblprotocol + "://" + vblbase + "/" + path + "?" + query;
    }


    this.orgDetail = function(vblOrgId, callback){
        self.getRequest(self.getUrl("OrgDetailByGuid", "issguid=" + vblOrgId), function(org){
            callback(org);           
        });
    }

    this.teamDetail = function(teamId, callback){
        self.getRequest(self.getUrl("TeamDetailByGuid", "teamGuid=" + teamId), function(teams){
            callback(teams);           
        });
    }

    this.members = function(vblOrgId, callback){
        self.getRequest(self.getUrl("RelatiesByOrgGuid", "orgguid=" + vblOrgId), function(members){
            callback(members);            
        });
    }

    this.matches = function(vblOrgId, callback){
        self.getRequest(self.getUrl("OrgMatchesByGuid", "issguid=" +  vblOrgId), function(matches){
            callback(matches);            
        });
    }
    this.teamMatches = function(teamId, callback){
        var cleanId = teamId.replace(/%20/g, "+");
        self.getRequest(self.getUrl("TeamMatchesByGuid", "teamGuid=" +  cleanId), function(matches){
            callback(matches);            
        });
    }
    this.matchDetails = function(matchId, callback){
        self.getRequest(self.getUrl("MatchesByWedGuid", "issguid=" +  matchId), function(matches){
            callback(matches);            
        });
    }
    this.putUitslag = function(matchId, thuis, uit, pin, teamThuisGUID, teamUitGUID, callback, error){
        var uitslag = ("   " + thuis).slice(-3) + "-" + ("   " + uit).slice(-3);
        var uri = self.getUrl("UitslagByWedGuidCodeEnPin", "issguid=" +  matchId + "&score=" + uitslag + "&code1=" + pin + "&code2=" + teamThuisGUID + teamUitGUID);
        self.getRequest(uri, function(result){
           if(result === "ok"){
              callback(uitslag); 
            }
            else{
                    error();
            }          
        });
    }

    this.teamimage = function(teamid){
            return imgbas + "/" + teamid.substring(0, 8) + "_Small.jpg";
    }

}
