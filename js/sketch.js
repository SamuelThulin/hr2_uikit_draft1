let dataBG;
let dataArray;
let bgDict;
let startBgVal;
let amSynth, fmSynth, fmSynth2, amSynth2, noiseSynth, membraneSynth;
let noiseOsc;
let amAutoF, amAutoP, fmAutoF, fmAutoP, fatAutoF, fatAutoP, amAutoLF, fmAutoLF, fatAutoLF, amTrem, fmTrem, fatTrem, amFilter, amFiltLFO, fmFilter, fmFiltLFO, fatFilter, fatFiltLFO;
let amPanner, fmPanner, amPanner2;
let chooseVal;
let dateTimeDisplay;
let selBg = 4;
let loop1, loop2, loop3, loop4, loop5, loop6, loop7, loop8;
bgDict = new p5.TypedDict();
let notesArray = ["B1", "G1", "G2", "D3", "C3", "F#3", "A3", "B2", "D2", "G3", "A2", "C2", "G3", "F#2", "B3", "C3", "A1", "B3", "D3", "G1", "B1", "F#1"]
// new effects
let amVib, amVerb, fmVerb, autoFilt1, pingPong1, fbDelay1, fmVerb2, autoFilt2;

let hussar;
let points;
let fontSize = 250;
let fft;
let volumeSlider, volumeLabel;
let projectTitle;
let instructions;
let startButton;
let stopButton;
let aboutLink;
let bgInfo;


// preload table data
function preload() {
  dataBG = loadTable(
    'BG_parse_text_3.csv',
    'csv',
    'header');
  hussar = loadFont("Hussar.otf");
}

function setup() {
  
  textFont(hussar);
  textSize(fontSize);
  points = [];

//UI Stuff


  
  //need to think strategically about where, what and when to send toDestination(); and about signal flow. For example and lfo is written like this lfo.connect(synth), whereas an effect is like this synth.connect(effect); whatever is in the brackets needs to go toDestination(); you can make it  go toDestination(); elsewhere than in the setup function though
  amSynth = new Tone.AMSynth();
  fmSynth = new Tone.FMSynth();
  amSynth2 = new Tone.AMSynth();
  fmSynth2 = new Tone.FMSynth();
  noiseSynth = new Tone.NoiseSynth();
  membraneSynth = new Tone.MembraneSynth();
  noiseOsc = new Tone.Noise("pink");
  amVib = new Tone.Vibrato(4, 1);
  amVerb = new Tone.Reverb(4);
  fmVerb = new Tone.Reverb(2);
  fmVerb2 = new Tone.Reverb(3);
  autoFilt1 = new Tone.AutoFilter(0.5, 60, 8);
  autoFilt2 = new Tone.AutoFilter(0.3, 30, 8);
  pingPong1 = new Tone.PingPongDelay(0.3, 0.1);
  fbDelay1 = new Tone.FeedbackDelay(0.1, 0.5);

  amPanner = new Tone.Panner(-0.75);
  fmPanner = new Tone.Panner(0.75);
  amPanner2 = new Tone.Panner(0.3);
  // amAutoF = new Tone.AutoFilter(1, 60, 8);
  // amAutoLF = new Tone.AutoFilter(0.1, 260, 8);
  // amAutoP = new Tone.AutoPanner(0.5);
  // amTrem = new Tone.Tremolo(0.2, 1);
  // amFilter = new Tone.Filter(1500, "highpass");
  // amFiltLFO = new  Tone.LFO(0.1, 32.78, 2093);
  // fmAutoF = new Tone.AutoFilter(1, 60, 3);
  // fmAutoLF = new Tone.AutoFilter(0.1, 260, 8);
  // fmAutoP = new Tone.AutoPanner(0.5);
  // fmFilter = new Tone.Filter(1500, "highpass");
  // fmFiltLFO = new  Tone.LFO(0.1, 32.78, 2093);
  // fmTrem = new Tone.Tremolo(0.3, 1);
  // fatAutoF = new Tone.AutoFilter(1, 60, 3);
  // fatAutoLF = new Tone.AutoFilter(0.1, 260, 8);
  // fatAutoP = new Tone.AutoPanner(0.5);
  // fatTrem = new Tone.Tremolo(0.4, 1);
  fatFilter = new Tone.Filter(3000, "highpass");
  fatFiltLFO = new Tone.LFO(0.1, 32.78, 2093);
  // console.log(LFO.output);
  //initialize where to start from in the table, so that there's enough room to retrieve values before and after the central value
  startBgVal = 3;
  // create a Dictionary key-value pair for each BG value, starting with key 3 to make sure it corresponds with table values
  for (i = startBgVal; i < dataBG.getRowCount() - startBgVal; i++) {
    bgDict.create(i, [dataBG.getNum(i, "mmol/L")]);
    // count 3 backwards and add these to the array of values stored at each key, then count 3 forwards and add these to the array of values stored at each key - this works, but maybe it could be cleaned up a bit
    e = startBgVal;
    f = 0;
    while (e > 0) {
      e = e - 1;
      bgDict.set(i, append(bgDict.get(i), dataBG.getNum(i - startBgVal + e, "mmol/L")));
    }
    while (f < 3) {
      f = f + 1;
      bgDict.set(i, append(bgDict.get(i), dataBG.getNum(i + f, "mmol/L")));
    }


  }
  console.log(bgDict.size());
  console.log(bgDict.get(3));
  //makes it possible to download the results of the above - this could save processing power - instead of calculating the bgDict every time from scratch, I could do it once locally and then load the CSV file as a Table and refer to those values; could cut out a processing step...
  //bgDict.saveTable();
  // projectTitle = createDiv("Hemo-resonance #2");
  // projectTitle.style('align-self', 'center');
  // projectTitle.style('font-family', 'Arial').style('font-size', '30px');
  // instructions = createP("Select a date and time from the drop-down menu to hear the blood-sugar reading creatively sonified" );
  // instructions.style('font-family', 'Arial').style('font-size', '16px').style("margin", "2px");
  // instructions.style('align-self', 'center');
  // instructions.style("flex-direction", "row");
  //   bgInfo = createP("(all values in mmol/L)" );
  // bgInfo.style('font-family', 'Arial').style('font-size', '16px').style("margin", "5px");
  // bgInfo.style('align-self', 'center');
  // bgInfo.style("flex-direction", "row");
  //create the dropdown list

  //Create array of options to be added
//var array = ["Volvo","Saab","Mercades","Audi"];

//Create and append the options
// for (var i = 0; i < array.length; i++) {
//   var option = document.createElement("option");
//   option.setAttribute("value", array[i]);
//   option.text = array[i];
//   document.getElementById("chooseValNEW").appendChild(option);
// }

for (var i = startBgVal; i < bgDict.size(); i++) {
  var option = document.createElement("option");
  option.setAttribute("value", [i]);
  option.text = dataBG.get(i, "Weekday") + " " + dataBG.get(i, "Date") + " " + dataBG.get(i, "Time");
  document.getElementById("chooseValNEW").appendChild(option);
}




  // chooseVal = createSelect();
  // chooseVal.style('font-family', 'Arial').style('font-size', '12px').style("margin", "5px");
  // chooseVal.style('align-self', 'center');
  // chooseVal.style("flex-direction", "row");
  // //populate the drop downlist with the values
  // chooseVal.option("-----------");
  // for (i = startBgVal; i < bgDict.size(); i++) {
  //   chooseVal.option(dataBG.get(i, "Weekday") + " " + dataBG.get(i, "Date") + " " + dataBG.get(i, "Time"), [i]);
  // }
  
  //get the dictionary key for the value that is selected from the dropdown list - this can then retrieve the corresponding value array to drive the synths
  //chooseVal.changed(valSelectEvent);
  document.getElementById("chooseValNEW").addEventListener("change", valSelectEvent);
  document.getElementById("chooseValNEW").addEventListener("click", run);
  //chooseVal.mousePressed(run);
  fft = new Tone.FFT(1024);
  Tone.Destination.connect(fft);

                          
  createCanvas(800, 600);
  // volumeSlider = createSlider(-60, 0, 0, 0);
  // volumeSlider.style('align-self', 'flex-start');
  // volumeSlider.style('flex-grow', '0');
  // volumeSlider.input(function() {
  // Tone.Destination.volume.value = volumeSlider.value();
  // });

  document.getElementById("volSliderNEW").oninput = function(){
    Tone.Destination.volume.value = document.getElementById("volSliderNEW").value;
  }



  volumeLabel = createDiv("Volume");
  volumeLabel.style('align-self', 'flex-start');
  volumeLabel.style('font-family', 'Arial').style('font-size', '12px');
  //window.confirm("sometext");
  //selBg = int(random(startBgVal, dataBG.getRowCount() - startBgVal*2));
  //chooseVal.selected(selBg);
  // aboutLink = createA("https://samuelthulin.com/projects/hemo-resonance2/", "about", "_blank");
  // aboutLink.style('font-family', 'Arial').style('font-size', '16px');
  startButton = createButton("start");
  startButton.mousePressed(valSelectEvent);
  stopButton = createButton("stop");
  stopButton.mousePressed(stopEvent);
  startButton.hide();
  stopButton.hide();

  amSynth.chain(amVib, amVerb, Tone.Destination);
  fmSynth.chain(fmVerb, Tone.Destination);
  amSynth2.chain(amVib, autoFilt2.start(), Tone.Destination);
  fmSynth2.chain(fmVerb2, autoFilt1, Tone.Destination);
  noiseSynth.chain(pingPong1, autoFilt1, Tone.Destination);
  noiseSynth.volume.value = -10;
  membraneSynth.chain(fbDelay1, Tone.Destination);
  membraneSynth.volume.value = -10;
  noiseOsc.volume.value = -50;
  noiseOsc.chain(Tone.Destination);

}



function stopEvent(){
  clearInterval(loop1);
  clearInterval(loop2);
  clearInterval(loop3);
  clearInterval(loop4);
  clearInterval(loop5);
  clearInterval(loop6);
  clearInterval(loop7);
  clearInterval(loop8);
}
  

 ////////////////In Target Range functions:
 function amSynthLoopTarget() {
  amSynth.detune.value = bgDict.get(selBg)[1];
  amVerb.wet.value = random(0, 1.0);
  amSynth.envelope.attack = bgDict.get(selBg)[1] * random(0.001, 0.1);
  amSynth.triggerAttackRelease(notesArray[int(bgDict.get(selBg)[1])], bgDict.get(selBg)[1] * random(0.05, 0.3));
  amVib.frequency.rampTo(bgDict.get(selBg)[1] * random(0.01, 0.2), 2);
}
  function fmSynthLoopTarget() {
  fmSynth.detune.value = bgDict.get(selBg)[4];
  fmVerb.wet.value = random(0, 1.0);
  fmSynth.envelope.attack = bgDict.get(selBg)[4] * random(0.001, 0.1);
  fmSynth.triggerAttackRelease(notesArray[int(bgDict.get(selBg)[4])], bgDict.get(selBg)[4] * random(0.05, 0.4));
}
  function amSynth2LoopTarget() {
  amSynth2.detune.value = bgDict.get(selBg)[2];
  amSynth2.envelope.attack = bgDict.get(selBg)[2] * random(0.001, 0.1);
  amSynth2.triggerAttackRelease(notesArray[int(bgDict.get(selBg)[2])], bgDict.get(selBg)[2] * random(0.05, 0.4));
}
function fmSynth2LoopTarget() {
  fmVerb2.wet.value = random(0, 1.0);
  fmSynth2.detune.value = bgDict.get(selBg)[5];
  fmSynth2.harmonicity.rampTo(random([1, 2, 3]), 0.1);
  fmSynth2.envelope.attack = bgDict.get(selBg)[5] * random(0.001, 0.1);
  fmSynth2.triggerAttackRelease(notesArray[int(bgDict.get(selBg)[5])], bgDict.get(selBg)[5] * random(0.05, 0.4));
}
  function noiseSynthLoopTarget() {
  noiseSynth.envelope.decay = bgDict.get(selBg)[3] * 0.05;
  noiseSynth.envelope.attack = bgDict.get(selBg)[3] * 0.05;
  pingPong1.delayTime.value = bgDict.get(selBg)[3] * random(0.005, 0.15);
  pingPong1.wet.value = bgDict.get(selBg)[3] * 0.03;
  noiseSynth.triggerAttackRelease(1);
}
  function membraneSynthLoopTarget() {
  fbDelay1.delayTime.rampTo(bgDict.get(selBg)[6] * random(0.001, 0.1));
  fbDelay1.wet.value = random(0, 1.0);
  membraneSynth.triggerAttackRelease(notesArray[int(bgDict.get(selBg)[6])], bgDict.get(selBg)[6] * random(0.05, 0.4));
}
////////////////Low functions:
  function amSynthLoopLow() {
  amSynth.detune.value = bgDict.get(selBg)[1];
  amVerb.wet.value = random(0, 1.0);
  amSynth.envelope.attack = bgDict.get(selBg)[1] * random(0.001, 0.01);
  amSynth.triggerAttackRelease(notesArray[int(bgDict.get(selBg)[1])], bgDict.get(selBg)[1] * random(0.02, 0.1));
  amVib.frequency.rampTo(bgDict.get(selBg)[1] * random(0.01, 0.2), 1);
}
  function fmSynthLoopLow() {
  fmSynth.detune.value = bgDict.get(selBg)[4];
  fmVerb.wet.value = random(0, 1.0);
  fmSynth.envelope.attack = bgDict.get(selBg)[4] * random(0.001, 0.01);
  fmSynth.triggerAttackRelease(notesArray[int(bgDict.get(selBg)[4])], bgDict.get(selBg)[4] * random(0.02, 0.1));
}
  function amSynth2LoopLow() {
  amSynth2.detune.value = bgDict.get(selBg)[2];
  amSynth2.envelope.attack = bgDict.get(selBg)[2] * random(0.001, 0.1);
  amSynth2.triggerAttackRelease(notesArray[int(bgDict.get(selBg)[2])], bgDict.get(selBg)[2] * random(0.02, 0.1));
}
function fmSynth2LoopLow() {
  fmVerb2.wet.value = random(0, 1.0);
  fmSynth2.detune.value = bgDict.get(selBg)[5];
  fmSynth2.harmonicity.rampTo(random([1, 2, 3]), 0.1);
  fmSynth2.envelope.attack = bgDict.get(selBg)[5] * random(0.001, 0.1);
  fmSynth2.triggerAttackRelease(notesArray[int(bgDict.get(selBg)[5])], bgDict.get(selBg)[5] * random(0.02, 0.1));
}
  function noiseSynthLoopLow() {
  noiseSynth.envelope.decay = bgDict.get(selBg)[3] * 0.01;
  noiseSynth.envelope.attack = bgDict.get(selBg)[3] * 0.01;
  pingPong1.delayTime.value = bgDict.get(selBg)[3] * random(0.005, 0.15);
  pingPong1.wet.value = bgDict.get(selBg)[3] * 0.03;
  noiseSynth.triggerAttackRelease(1);
}
  function membraneSynthLoopLow() {
  fbDelay1.delayTime.rampTo(bgDict.get(selBg)[6] * random(0.001, 0.01));
  fbDelay1.wet.value = random(0, 1.0);
  membraneSynth.triggerAttackRelease(notesArray[int(bgDict.get(selBg)[6])], bgDict.get(selBg)[6] * random(0.05, 0.4));
}
  ////////////////High functions:
  function amSynthLoopHigh() {
  amSynth.detune.value = bgDict.get(selBg)[1];
  amVerb.wet.value = random(0.2, 1.0);
  amSynth.envelope.attack = bgDict.get(selBg)[1] * random(0.01, 0.1);
  amSynth.triggerAttackRelease(notesArray[int(bgDict.get(selBg)[1])], bgDict.get(selBg)[1] * random(0.09, 0.6));
  amVib.frequency.rampTo(bgDict.get(selBg)[1] * random(0.01, 0.1), 1);
}
  function fmSynthLoopHigh() {
  fmSynth.detune.value = bgDict.get(selBg)[4];
  //fmSynth.modulationIndex.rampTo(random([10, 20, 30]), 1);
  fmVerb.wet.value = random(0.5, 1.0);
  fmSynth.envelope.attack = bgDict.get(selBg)[4] * random(0.01, 0.1);
  fmSynth.envelope.decay = 2;
  fmSynth.envelope.decayCurve = "linear";
  fmSynth.envelope.sustain = 0.5;
  fmSynth.triggerAttackRelease(notesArray[int(bgDict.get(selBg)[4])], bgDict.get(selBg)[4] * random(0.09, 0.6));
}
  function amSynth2LoopHigh() {
  amSynth2.detune.value = bgDict.get(selBg)[2];
  amSynth2.envelope.attack = bgDict.get(selBg)[2] * random(0.01, 0.1);
    amSynth2.envelope.decay = 2;
  amSynth2.envelope.sustain = 0.5;
    amSynth2.envelope.decayCurve = "linear";
  amSynth2.triggerAttackRelease(notesArray[int(bgDict.get(selBg)[2])], bgDict.get(selBg)[2] * random(0.09, 0.6));
}
function fmSynth2LoopHigh() {
  fmVerb2.wet.value = random(0.3, 1.0);
  fmSynth2.detune.value = bgDict.get(selBg)[5];
  fmSynth2.harmonicity.rampTo(random([1, 2, 3]), 0.3);
  fmSynth2.envelope.attack = bgDict.get(selBg)[5] * random(0.01, 0.1);
  fmSynth2.envelope.decay = 2;
  fmSynth2.envelope.sustain = 0.5;
  fmSynth2.envelope.decayCurve = "linear";
  fmSynth2.triggerAttackRelease(notesArray[int(bgDict.get(selBg)[5])], bgDict.get(selBg)[5] * random(0.09, 0.6));
}
  function noiseSynthLoopHigh() {
  noiseSynth.envelope.decay = bgDict.get(selBg)[3] * 0.1;
  noiseSynth.envelope.attack = bgDict.get(selBg)[3] * 0.1;
  pingPong1.delayTime.value = bgDict.get(selBg)[3] * random(0.005, 0.15);
  pingPong1.wet.value = bgDict.get(selBg)[3] * 0.03;
  noiseSynth.triggerAttackRelease(1);
}
  function membraneSynthLoopHigh() {
  fbDelay1.delayTime.rampTo(bgDict.get(selBg)[6] * random(0.01, 0.1));
  fbDelay1.wet.value = random(0, 1.0);
  membraneSynth.triggerAttackRelease(notesArray[int(bgDict.get(selBg)[6])], bgDict.get(selBg)[6] * random(0.05, 0.4));
}

//function that executes whenever the dropdown list is changed. Feeds the bgDict values to the synth
function valSelectEvent() {
//Tone.start();
  //Tone.context.resume();
  //selBg = chooseVal.value();
  selBg = document.getElementById("chooseValNEW").value;
  stopEvent();
  
///could re-write this to pull from each of the above functions for every reading in the soundscape, rather than all readings in the soundscape functioning in terms of whether [0] is low, target, or high. Have each one depend on whether IT is low, target, or high. Would just involve breaking the below into more if-then statements.3 for every value 
  if(bgDict.get(selBg)[1]<4.0){
  loop1 = setInterval(amSynthLoopLow, bgDict.get(selBg)[1] / 2 * 1000);
  console.log("low");
  }
  if(bgDict.get(selBg)[4]<4.0){
  loop2 = setInterval(fmSynthLoopLow, bgDict.get(selBg)[4] / 2 * 1000);
  console.log("low");
  } 
    if(bgDict.get(selBg)[2]<4.0){
  loop3 = setInterval(amSynth2LoopLow, bgDict.get(selBg)[2] / 2 * 1000);
  console.log("low");
  }
    if(bgDict.get(selBg)[5]<4.0){
  loop4 = setInterval(fmSynth2LoopLow, bgDict.get(selBg)[5] / 2 * 1000);
  console.log("low");
  }
    if(bgDict.get(selBg)[3]<4.0){
  loop5 = setInterval(noiseSynthLoopLow, bgDict.get(selBg)[3] / 1.5 * 1000);
  console.log("low");
  }
    if(bgDict.get(selBg)[6]<4.0){
  loop6 = setInterval(membraneSynthLoopLow, bgDict.get(selBg)[6] / 2 * 1000);
  console.log("low");
  }
  
  
  if(bgDict.get(selBg)[1]>=8.0){
  loop1 = setInterval(amSynthLoopHigh, bgDict.get(selBg)[1] / 1.5 * 1000);
  }
  if(bgDict.get(selBg)[4]>=8.0){
  loop2 = setInterval(fmSynthLoopHigh, bgDict.get(selBg)[4] / 1.5 * 1000);
  }
    if(bgDict.get(selBg)[2]>=8.0){
  loop3 = setInterval(amSynth2LoopHigh, bgDict.get(selBg)[2] / 1.5 * 1000);
  }
    if(bgDict.get(selBg)[5]>=8.0){
  loop4 = setInterval(fmSynth2LoopHigh, bgDict.get(selBg)[5] / 1.5 * 1000);
  }
    if(bgDict.get(selBg)[3]>=8.0){
  loop5 = setInterval(noiseSynthLoopHigh, bgDict.get(selBg)[3] / 1.5 * 1000);
  }
    if(bgDict.get(selBg)[6]>=8.0){
  loop6 = setInterval(membraneSynthLoopHigh, bgDict.get(selBg)[6] / 1.5 * 1000);
  }

if(8.0>bgDict.get(selBg)[1] && bgDict.get(selBg)[1]>=4.0){
  loop1 = setInterval(amSynthLoopTarget, bgDict.get(selBg)[1] / 2 * 1000);
  console.log("in range");
} 
if(8.0>bgDict.get(selBg)[4] && bgDict.get(selBg)[4]>=4.0){
  loop2 = setInterval(fmSynthLoopTarget, bgDict.get(selBg)[4] / 2 * 1000);
  console.log("in range");
} 
  if(8.0>bgDict.get(selBg)[2] && bgDict.get(selBg)[2]>=4.0){
  loop3 = setInterval(amSynth2LoopTarget, bgDict.get(selBg)[2] / 2 * 1000);
  console.log("in range");
} 
  if(8.0>bgDict.get(selBg)[5] && bgDict.get(selBg)[5]>=4.0){
  loop4 = setInterval(fmSynth2LoopTarget, bgDict.get(selBg)[5] / 2 * 1000);
  console.log("in range");
} 
  if(8.0>bgDict.get(selBg)[3] && bgDict.get(selBg)[3]>=4.0){
  loop5 = setInterval(noiseSynthLoopTarget, bgDict.get(selBg)[3] / 1.5 * 1000);
  console.log("in range");
} 
  if(8.0>bgDict.get(selBg)[6] && bgDict.get(selBg)[6]>=4.0){
  loop6 = setInterval(membraneSynthLoopTarget, bgDict.get(selBg)[6] / 2 * 1000);
  console.log("in range");
} 

//////////draw the number/////////////

  points = hussar.textToPoints(String(bgDict.get(selBg)[0].toFixed(1)), width / 3, height / 1.25, fontSize, {
    sampleFactor: 0.4 //seems like this isn't working properly
  })
  console.log("points" + points.length);
  //chooseVal.position(width/2, height/2);
}

/*function dateTimeDisplayText() {
  textSize(12);
  textFont('Helvetica');
  //text("hi", width/3, height/1.1); 
  text(dataBG.get(selBg, "Weekday") + " " + dataBG.get(selBg, "Date") + " " + dataBG.get(selBg, "Time"), width / 3, height / 1.1);

}*/

function draw() {
  //clear();
  background("black");


  
  let freqPoints = fft.getValue();

  for (let i = 0; i < points.length; i++) {
    ellipse(points[i].x + freqPoints[i], points[i].y + freqPoints[i], 5, 5);
    //ellipse(points[i].x, points[i].y, 3, 3);
    //console.log(points[i].x);
    //textSize(24);
    //text("hi", width/3, height/1.1); 
    //text(dataBG.get(selBg, "Weekday") + " " + dataBG.get(selBg, "Date") + " " + dataBG.get(selBg, "Time"), width/3, height/1.1);
    //dateTimeDisplayText();

  }
}


function run (){
  if (Tone.context.state !== "running"){
Tone.start();
    console.log("not running");
  }
}

/*function run() {
  //Tone.context.resume();
  Tone.start();
}
//document.getElementById("playButton").addEventListener("click", run);*/

