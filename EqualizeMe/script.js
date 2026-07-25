function choose(sound){

let result=document.getElementById("result");


if(sound=="bass"){

result.innerHTML=
"You prefer: Bass ";

}


else if(sound=="balanced"){

result.innerHTML=
"You prefer: Balanced  ";

}


else{

result.innerHTML=
"You prefer: Clarity ";

}


}