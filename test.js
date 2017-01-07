var fs = require('graceful-fs');
var fileExists = require('file-exists');
var readlineSync = require('readline-sync');
var os = require("os");  
var path = require('path');

//file stores the path to the file to compress
var dir = readlineSync.question('Enter the path to the file directory you want to compress/decompress: ');
var fileName = readlineSync.question('Enter the file name: ');
var whatToDo = readlineSync.question('Compress or Decompress?: ("C" or "D"): ');

var file = path.join(dir, fileName);
var extension = path.extname(fileName);
var fname = path.basename(fileName, extension);

var content = fs.readFileSync(file, 'utf8');


var bin; //binaryCode
var singleData;
var nodeStack = new Array;
var freqTable = new Array;


if(whatToDo == 'C' || whatToDo == 'c'){

	var updatedNodeStack = formNodeStack(content, nodeStack);
	var binTree = makeHuffmanTree(updatedNodeStack);
	compression(binTree);

}

else if(whatToDo == 'D' || whatToDo == 'd'){
	var charStack  = getCharStack(content);
	var huffmanTree = makeHuffmanTree(charStack);
	decompression(huffmanTree, content);

}


//formNodeStack(content, nodeStack);
 //compression(tree);

//<-------Structures---------->
function Node(char, freq){
	this.char = char;
	this.freq = freq;
	this.left = null;
	this.right = null;
}


function charInfo(char, freq){
	this.char = char;
	this.freq = freq; 
}
//<-------structures End---->



function charExists(character, nodeStack){
	var len = nodeStack.length;
	for(var k = 0; k < len; k++){
		if(nodeStack[k].char == character){
			nodeStack[k].freq++; //inrease the frequence by 1 
			freqTable[k].freq++;
			return true;
		}
	}
	return false;
}



function formNodeStack(content, nodeStack){
	var count = content.length;
	
	for(var i = 0; i < count; i++){
		
		if(!(charExists(content[i], nodeStack, freqTable))){ //add new node if char does not exists in the nodeStack
			
			var newNode = new Node(content[i], 1);
			nodeStack.push(newNode);
			var newChar = new charInfo(content[i], 1);
			freqTable.push(newChar);
		
		}
	}

	nodeStack.sort(function(a, b){
		return parseFloat(b.freq)-parseFloat(a.freq);
	})
	return nodeStack;

} 


function subTree(smallNodeOne, smallNodeTwo){
	var char = smallNodeOne.char + smallNodeTwo.char; //merging the characters to make efficient encoding later
	var freq = smallNodeOne.freq + smallNodeTwo.freq;
	var node = new Node(char, freq);
	node.left = smallNodeOne;
	node.right = smallNodeTwo;
	return node;
}

function makeHuffmanTree(nodeStack){
	
	var arrLen = nodeStack.length;
	
	if(arrLen == 1 ){
		//console.log(nodeStack[0].char);
		return nodeStack[0]; //root of the Huffman Tree
	
	}
	else{ //if the length is only 1, then we have our tree at nodeStack[0]

		var smallNodeOne = nodeStack.pop(); 
		var smallNodeTwo = nodeStack.pop(); 

		var subTreeNode = subTree(smallNodeOne, smallNodeTwo);
		nodeStack.push(subTreeNode);

		nodeStack.sort(function(a, b){ //sorts in decending order
			return parseFloat(b.freq) - parseFloat(a.freq);
		});
		return makeHuffmanTree(nodeStack); 
	}
}

function getBinary(tree, char){
	
	if(tree.right && tree.right.char && tree.right.char.indexOf(char) > -1){
		bin += '1';
		return getBinary(tree.right, char);
	}

	else if(tree.left && tree.left.char && tree.left.char.indexOf(char) > -1){
		bin += '0';
		return getBinary(tree.left, char);
	}

	else { //tree.left= tree.right == null

		return bin;
	}

}

function convert(data){
	var content = '';
	var len = data.length; 
	console.log(len);
	if(len >= 8){
		for(var i = 0; i < len; i += 8){
			var eightBits = data.substr(i, i+8);
			var bitsToChar = String.fromCharCode(parseInt(eightBits, 2));
			content += bitsToChar;
			//data = data.substring(8);
		}
	}

	return content;
}
//Compression...

function compression(tree){
	var contentLen = content.length;
	var data = '';
	var charBits;
	var charLength = freqTable.length;
	var restData = '';

	data += charLength; //first item before ',' will be the total number of characters to read before reading binary.
	
	for(var j = 0; j < charLength; j++){
		data+= ','+freqTable[j].char+freqTable[j].freq;
	}
	data += ',';
	charBits = data.length;


	for(var k = 0; k < contentLen; k++){
		bin = '';
		var currentChar = content[k];
		var binary = getBinary(tree, currentChar);
		restData += binary;
	} 

	restData = convert(restData);
	data += restData;

	var writeFile = path.join(dir, fname+'_compressed.txt');
	fs.writeFileSync(writeFile, data);

	//calculations
	var bits = data.length - charBits;
	var compressedBytes = bits/8 + charBits;
	var originalBytes = content.length; //original file
	var spaceSaving = 1 - compressedBytes/originalBytes;

	//printing calculations
	console.log('Original File size: '+originalBytes +' bytes');
	console.log('Compressed File Size: '+compressedBytes +' bytes');
	console.log('Compression ratio: '+ (Math.round((originalBytes/compressedBytes)*100)/100));
	console.log('Space Saving: '+ (Math.round(spaceSaving*100)) + '%');

	console.log('file compression done!');		

	return;
}


function beforeComa(contentData){
	if(contentData[0] == ','){
		return singleData;
	}
	else{
		singleData += contentData[0];
		
		return beforeComa(contentData.substring(1)); //removes the first char
	}
}


function getCharStack(data){

	singleData = '';
	var count = beforeComa(data);
	data = data.substring(count.length + 1);
	var charCount = parseInt(count);
	
	for(var i = 0; i < charCount; i++){
		singleData = '';
		var char = data[0];
		data = data.substring(1);
		var freq = beforeComa(data);
		data = data.substring(freq.length+1);
		freq = parseInt(freq);
		var newNode = new Node(char, freq);
		nodeStack.push(newNode);
	}

	content = data;
	nodeStack.sort(function(a, b){ //sorts in decending order
			return parseFloat(b.freq) - parseFloat(a.freq);
	});
	return nodeStack;
}

//Decompression
function toBits(data){
	var len = data.length;
	var PADDING = "00000000"
	var result = '';

	for (var i = 0; i < len; i++) {
  		var compact = data.charCodeAt(i).toString(2)
  		var padded  = compact.substring(0, PADDING.length - compact.length) + compact;
  		result += padded;
	}
	console.log(result);
	return result;
}

function decompression(hufTree, data){
	var dataLen = data.length;
	//console.log(dataLen);
	//console.log(data);
	data = toBits(data);

	var originalData = '';
	var currTree = hufTree;

	for(var i = 0; i < dataLen; i++){
		
		if(data[i] == '0'){
			currTree = currTree.left;
		}
		if(data[i] == '1'){
			currTree = currTree.right;
		}
		if(currTree.left == null && currTree.right == null){  
			originalData += currTree.char;
			currTree = hufTree;
		}
	}

	fs.writeFileSync(path.join(dir, fname)+'_original.txt', originalData); //write a '.txt' file	
	console.log('Decompression successful. File: '+path.join(dir, fname)+'_original.txt');
	return;
}
