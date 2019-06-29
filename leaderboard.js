function requestLeaderboard(){
  var name = document.getElementById('textfield').value;
  var xhr = new XMLHttpRequest();
  var url = "/comp486/Airplanes/leaderboards.php?name="+name+"&score="+playerStats.points;
  xhr.open("GET", url, true);

  xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        var response = xhr.responseText;
        var json = JSON.parse(xhr.responseText);
        var table = document.createElement('table');
        for(var i=0;i<5;i++){
          var tr = document.createElement('tr');
          var tc = document.createElement('td');
          tc.innerHTML = json[i].name;
          tr.appendChild(tc);
          tc = document.createElement('td');
          tc.innerHTML = json[i].score;
          tr.appendChild(tc);
          table.appendChild(tr);
        }
        document.getElementById('textform').style.display = "none";
        var leaderboard = document.getElementById('leaderboard');
        leaderboard.appendChild(table);
        leaderboard.style.display = "block";
      }
  };
  xhr.send();
}

function showForm(){
  var container = document.getElementById("textform");
  container.style.display = 'block';
  document.getElementById('button').addEventListener('click',requestLeaderboard,true);
}
