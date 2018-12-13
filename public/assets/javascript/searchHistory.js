function getSearchHistory() {

    $.getJSON("/api/searchhistory/1", function(data){
        
        if(data){
            var $appendMasterDiv = $("<div>").css('width', '100%').css('margin', '0 auto');
            for (var i = 0; i < data.length; i++) { //loop thru headers
                var rawDate = ""; //must explicity instantiate empty vars to
                var day = "";     //prevent scenario where next record in the loop
                var month = "";   //has empty fields in places where the current record
                var year = "";    //has actual data - the wrong data will bleed forward
                var formattedDate = "";  //if not cleared out before each iteration
                var keyword = "";;
                var resultsCount = 0;
                var savedCount = 0;
                var relatedResults = [];

                rawDate = new Date(data[i].date);
                day = rawDate.getDate();
                month = rawDate.getMonth();
                year = rawDate.getFullYear();
                formattedDate =  month + '-' + day + '-' + year; 
                keyword = data[i].keyword;
                resultsCount = data[i].results;
                savedCount = data[i].saveds;
                relatedResults = data[i].relatedResults; 

                var $appendPara = $("<p>");
                $appendPara.addClass("list-group");
                var paraContent = "<h3>Searched for \'" + keyword + "\' on " + formattedDate + "</h3>";
                $appendPara.append(paraContent);
  
                if(relatedResults[0].length>0){
                    var rowData = relatedResults[0]; 
                        for(let k=0; k<rowData.length; k++){ 
                            var $appendRow = $("<div>");
                            $appendRow.addClass("list-group-item");

                            if(rowData[k].saved==true){
                                $appendRow.css('color', '#0000FF').css('padding', '2px 0');
                                var secondRowContent = "";
                                if(rowData[k].cuisines.length>0){ secondRowContent = "Cuisines: " + rowData[k].cuisines;}
                                if(secondRowContent.length>0){ secondRowContent += "&nbsp; &nbsp;"};
                                if(rowData[k].googleRating){ secondRowContent += "Rating: " + rowData[k].googleRating;}
                                if(secondRowContent.length>0){ secondRowContent += "&nbsp; &nbsp;"};
                                if(rowData[k].website){secondRowContent += "Website: <a href=" + rowData[k].website + " target=_blank>click here</a>";}
                                else if((!rowData[k].website)&&(rowData[k].zomatoMenu)){secondRowContent += "Menu: <a href=" + rowData[k].zomatoMenu + " target=_blank>click here</a>";}

                                if(secondRowContent.length==0){
                                    $appendRow.html("<b>" + rowData[k].name + "</b>, " + rowData[k].street + "  (saved)");
                                }
                                else if(secondRowContent.length>0){
                                    $appendRow.html("<b>" + rowData[k].name + "</b>, " + rowData[k].street + "  (saved)<br>" + secondRowContent);
                                }
                            }//end if saved=true

                            else if(rowData[k].saved==false){
                                $appendRow.css('color', "#666");
                                $appendRow.html("<b>" + rowData[k].name + "</b>, " + rowData[k].street);
                            }//end else if saved=false
                            $appendPara.append($appendRow);
                        }//end for k loop
                    $appendMasterDiv.append($appendPara);
                }//end if relatedResults > 0 rows

            $("#searchHistoryList").empty().append($appendMasterDiv);
        }//end for i loop

      }//end if data

      else { $("#searchHistoryList").empty().html("No saved searches for this user."); }
    });//end getJSON articles
    
}//end function getSearchHistory

$(document).ready(function(){
    $(".menuProfileStyle").on('click', 
        function(){
            var nextPage = "../index.html";
            location.replace(nextPage);
        }
    );
    $("#searchHistoryList").empty().html("We are collecting the information you requested.<br>Please stand by.");
    getSearchHistory();
});