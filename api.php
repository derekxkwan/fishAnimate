<?
function loadCsv(){
$counter = 1;
$data = array();
$fp = fopen('./Group 6, Day 1.csv', 'rb');
while(!feof($fp)){
$data[] = fgetcsv($fp);
}
fclose($fp);
$csvArr = array();
for($i=1; $i<count($data); $i++){
if(count($data[$i]) >= 2){
if(!array_key_exists("s".$data[$i][1], $csvArr)){
$csvArr[$data[$i][1]."^".$data[$i][2]] = $data[$i][3];
$counter = 1;
}
else{
$counter = $counter + 1;
$csvArr[$data[$i][1]."~".$counter."~"."^".$data[$i][2]] = $data[$i][3];

}


}

}


echo json_encode($csvArr);
};

?>
