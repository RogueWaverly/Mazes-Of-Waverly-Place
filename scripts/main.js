// Set user

var myHeading = document.querySelector('h1');
var changeUserButton = document.getElementById('changeUserButton');

function setUserName()
{
	var myName = prompt('Please enter your name.');
	if(myName !== null)
	{
		localStorage.setItem('name', myName);
		myHeading.textContent = 'Welcome, ' + myName + ", to Waverly Place!";
	}
}

if(!localStorage.getItem('name'))
{
	setUserName();
}
else
{
	var storedName = localStorage.getItem('name');
	myHeading.textContent = 'Welcome, ' + storedName + ", to Waverly Place!";
}

changeUserButton.onclick = function()
{
 	setUserName();
}

// Toggle image when clicked

var myImage = document.querySelector('img');

myImage.onclick = function()
{
	var mySrc = myImage.getAttribute('src');
	if(mySrc === 'images/find-your-wei.png')
	{
		myImage.setAttribute ('src','images/lose-yourself.webp');
	}
	else
	{
		myImage.setAttribute ('src','images/find-your-wei.png');
	}
}

// Shuffle Array

var shuffleButton = document.getElementById('shuffleButton');
var thisArray = ['A','B','C','D','E','F','G'];

// display an array in a given div
function displayArray(array, id)
{
	document.getElementById(id).innerHTML = "<ol>";

	for(var i=0; i<array.length; i++)
	{
		document.getElementById(id).innerHTML += "<li>" + array[i] + "</li>";
	}

	document.getElementById(id).innerHTML += "</ol>";
}

// swap two elements at given indices in a given array
function swap(array, i, j)
{
	var itemAtJ = array[j];
	array[j] = array[i];
	array[i] = itemAtJ;
}

// shuffle a given array
// Fisher-Yates shuffle algorithm
// Time: O(N)
// Space: additional O(1)
// Every permutation is equally likely
function shuffleArray(array)
{
	for(var i=0; i<array.length; i++)
	{
		var randomIndex = Math.floor((Math.random() * array.length));
		swap(array, i, randomIndex);
	}
}

displayArray(thisArray,'arrayDiv');

shuffleButton.onclick = function()
{
	shuffleArray(thisArray);
	displayArray(thisArray,'arrayDiv');
}

// Make Maze

var rows = 0;
var cols = 0;

var edgeCount = 0;

var rowMinusButton = document.getElementById('rowMinusButton');
var rowPlusButton = document.getElementById('rowPlusButton');
var colMinusButton = document.getElementById('colMinusButton');
var colPlusButton = document.getElementById('colPlusButton');

var mazeButton = document.getElementById('mazeButton');

function displayRowCol()
{
	document.getElementById('rowColDiv').innerHTML = "<p>Rows: " + rows + "</p><p>Columns: " + cols + "</p>";
}

displayRowCol();

rowMinusButton.onclick = function()
{
	if(rows > 0)
	{
		rows--;
		displayRowCol();
	}	
}
rowPlusButton.onclick = function()
{
	rows++;
	displayRowCol();
}
colMinusButton.onclick = function()
{
	if(cols > 0)
	{
		cols--;
		displayRowCol();
	}
}
colPlusButton.onclick = function()
{
	cols++;
	displayRowCol();
}

var HWallArray;
var VWallArray;
var PointsArray;
var EdgeIndexArray;

function displayZeroError()
{
	document.getElementById('mazeDiv').innerHTML = "<p>Both Rows and Columns should be greater than 0.</p>";
}

function displayMaze()
{
	document.getElementById('mazeDiv').innerHTML = "<p id='start'>Start</p>";
	displayHRow(0);
	for(var i=0; i<rows; i++)
	{
		displayVRow(i);
		displayHRow(i+1);
	}
	document.getElementById('mazeDiv').innerHTML += "<p id='end'>End</p>";
}

function displayHRow(row)
{
	document.getElementById('mazeDiv').innerHTML += "<p>";
	
	for(var i=0; i<cols; i++)
	{
		document.getElementById('mazeDiv').innerHTML += "+";
		if(HWallArray[row][i] === 1)
			document.getElementById('mazeDiv').innerHTML += "~~";
		else
			document.getElementById('mazeDiv').innerHTML += "&nbsp;&nbsp;";
	}
	document.getElementById('mazeDiv').innerHTML += "+</p>";
}

function displayVRow(row)
{
	document.getElementById('mazeDiv').innerHTML += "<p>";
	
	if(VWallArray[row][0] === 1)
		document.getElementById('mazeDiv').innerHTML += "|";
	else
		document.getElementById('mazeDiv').innerHTML += "&nbsp;";
	for(var i=1; i<cols+1; i++)
	{
		document.getElementById('mazeDiv').innerHTML += "&nbsp;&nbsp;";
		if(VWallArray[row][i] === 1)
			document.getElementById('mazeDiv').innerHTML += "|";
		else
			document.getElementById('mazeDiv').innerHTML += "&nbsp;";
	}
	document.getElementById('mazeDiv').innerHTML += "</p>";
}

function initMaze()
{
	HWallArray = new Array(rows+1);
	for(var i=0; i<rows+1; i++)
	{
		HWallArray[i] = new Array(cols);
		for(var j=0; j<cols; j++)
			HWallArray[i][j] = 0;
	}

	VWallArray = new Array(rows);
	for(var i=0; i<rows; i++)
	{
		VWallArray[i] = new Array(cols+1);
		for(var j=0; j<cols+1; j++)
			VWallArray[i][j] = 0;
	}

	edgeCount = (rows-1)*cols + rows*(cols-1);
	EdgeIndexArray = new Array(edgeCount);
	for(var i=0; i<edgeCount; i++)
		EdgeIndexArray[i] = i;
}

function makeBorder()
{
	for(var i=0; i<cols-1; i++)
	{
		HWallArray[0][i+1] = 1;
		HWallArray[rows][i] = 1;
	}
	for(var i=0; i<rows; i++)
	{
		VWallArray[i][0] = 1;
		VWallArray[i][cols] = 1;
	}
}

function decideToBuild(edgeNum)
{
	
}

mazeButton.onclick = function()
{
	if(rows > 0 && cols > 0)
	{
		initMaze();
		makeBorder();
		shuffleArray(EdgeIndexArray);
		for(var i=0; i<EdgeIndexArray.length; i++)
			decideToBuild(EdgeIndexArray[i]);
		displayMaze();
	}
	else
	{
		displayZeroError();
	}
}