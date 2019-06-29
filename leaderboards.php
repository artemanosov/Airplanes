<?php

  if(isset($_GET['name'])){
    $name = $_GET['name'];
    $score = $_GET['score'];
    //connect to the database
    $connection = mysqli_connect("localhost", "root", "");
    if(!$connection){
      print "<h1>Could not connect to the databse</h1>";
    }
    //open the database01
    $database = "leaderboards";
    if(!mysqli_select_db($connection,$database)){
      print "<h1>Could not open database</h1>";
    }
    else{
      //insert a new record of a player into the database
      $query = "INSERT INTO players (playerName,playerScore) VALUES ('$name','$score')";
      $result = mysqli_query($connection,$query);
      //get top five player
      $query = "SELECT playerName,playerScore FROM players ORDER BY playerScore LIMIT 5";
      $result = mysqli_query($connection,$query);
      $count = 0;
      $array = array();
      while($row = mysqli_fetch_row($result)){
        $array[$count] = new stdClass();
        $array[$count]->name = $row[0];
        $array[$count]->score = $row[1];
        $count++;
      }
      $myJSON = json_encode($array);
      echo $myJSON;
      mysqli_close($connection);
    }
  }
?>
