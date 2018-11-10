

function updateStats(){
  $.getJSON( "/stats", function( data ) {
    console.log(data)
    data.sort((a, b) => b.polen - a.polen);
    let leaderboard = $("#leaderboard")
    leaderboard.html("");
    var items = [];
    if(data.length > 0){
      for(let i = 0; i < data.length; i++){
        items.push( "<li><span class='name'>"+data[i].username+"</span><span class='score'>" + data[i].polen + "</span></li>" );
      }
      leaderboard.html(items.join(""));
    } else {
      leaderboard.html("No statistics");
    }
  });
}




$(document).ready(()=>{
  updateStats();
  setInterval(updateStats, 1000);
})
