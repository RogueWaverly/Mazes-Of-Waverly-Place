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

// Make Maze

var rows = 4;
var cols = 5;

var edgeCount = 0;

var rowMinusButton = document.getElementById('rowMinusButton');
var rowPlusButton = document.getElementById('rowPlusButton');
var colMinusButton = document.getElementById('colMinusButton');
var colPlusButton = document.getElementById('colPlusButton');

var mazeButton = document.getElementById('mazeButton');

// Display Rows and Cols

function displayRowCol()
{
	document.getElementById('rowCount').innerHTML = rows;
	document.getElementById('colCount').innerHTML = cols;
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
	if(cols < 30)
	{
		cols++;
		displayRowCol();
	}
}

var HWallArray;
var VWallArray;
var PointsArray;
var EdgeIndexArray;

var PlayerPos = {i:0, j:0};

var isPlaying = false;

function displayZeroError()
{
	document.getElementById('mazeDiv').innerHTML = "<p id='zeroError'>Both Rows and Columns should be greater than 0.</p>";
}

// Display Maze

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
			document.getElementById('mazeDiv').innerHTML += "&mdash;&mdash;";
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
		if(isPlaying && PlayerPos.i === row && PlayerPos.j === i-1)
			document.getElementById('mazeDiv').innerHTML += "&rsaquo;&lsaquo;";
		else
			document.getElementById('mazeDiv').innerHTML += "&nbsp;&nbsp;";
		if(VWallArray[row][i] === 1)
			document.getElementById('mazeDiv').innerHTML += "|";
		else
			document.getElementById('mazeDiv').innerHTML += "&nbsp;";
	}
	document.getElementById('mazeDiv').innerHTML += "</p>";
}

// Make Maze

function initMaze()
{
	HWallArray = new Array(rows+1);
	for(var i=0; i<rows+1; i++)
	{
		HWallArray[i] = new Array(cols);
		for(var j=0; j<cols; j++)
			HWallArray[i][j] = 1;
	}

	VWallArray = new Array(rows);
	for(var i=0; i<rows; i++)
	{
		VWallArray[i] = new Array(cols+1);
		for(var j=0; j<cols+1; j++)
			VWallArray[i][j] = 1;
	}

	PointsArray = new Array(rows);
	for(var i=0; i<rows; i++)
	{
		PointsArray[i] = new Array(cols);
		for(var j=0; j<cols; j++)
			PointsArray[i][j] = {parA: i, parB: j, rank: 0};
	}

	edgeCount = (rows-1)*cols + rows*(cols-1);
	EdgeIndexArray = new Array(edgeCount);
	for(var i=0; i<edgeCount; i++)
		EdgeIndexArray[i] = i;
}

function makeExits()
{
	HWallArray[0][0] = 0;
	HWallArray[rows][cols-1] = 0;
}

function shuffleExits()
{
	PlayerPos.i = 0;
	shuffleArray(HWallArray[0]);
	for(var i=0; i<cols; i++)
		if(HWallArray[0][i] === 0)
			PlayerPos.j = i;
	shuffleArray(HWallArray[rows]);
}

function findParent(p)
{
	var parent = {i: p.parA, j: p.parB};
	while(PointsArray[parent.i][parent.j] != PointsArray[PointsArray[parent.i][parent.j].parA][PointsArray[parent.i][parent.j].parB])
		parent = {i: PointsArray[parent.i][parent.j].parA, j: PointsArray[parent.i][parent.j].parB};
	return parent;
}

function joinSets(a, b)
{
	if(PointsArray[a.i][a.j].rank < PointsArray[b.i][b.j].rank)
	{
		PointsArray[a.i][a.j].parA = b.i;
		PointsArray[a.i][a.j].parB = b.j;
	}
	else if(PointsArray[a.i][a.j].rank > PointsArray[b.i][b.j].rank)
	{
		PointsArray[b.i][b.j].parA = a.i;
		PointsArray[b.i][b.j].parB = a.j;
	}
	else
	{
		PointsArray[a.i][a.j].parA = b.i;
		PointsArray[a.i][a.j].parB = b.j;
		PointsArray[b.i][b.j].rank++;
	}
}

function decideToBuild(edgeNum)
{
	var numOfHWalls = (rows-1)*cols;
	var i, j;

	if(edgeNum < numOfHWalls)	// HWall
	{
		i = Math.floor(edgeNum/cols)+1;
		j = edgeNum%cols;
		var topSetParent = findParent(PointsArray[i-1][j]);
		var botSetParent = findParent(PointsArray[i][j]);
		if(topSetParent.i !== botSetParent.i || topSetParent.j !== botSetParent.j)
		{
			joinSets(topSetParent, botSetParent);
			HWallArray[i][j] = 0;
		}
	}
	else						// VWall
	{
		edgeNum -= numOfHWalls;
		i = edgeNum%rows;
		j = Math.floor(edgeNum/rows)+1;
		var leftSetParent = findParent(PointsArray[i][j-1]);
		var rightSetParent = findParent(PointsArray[i][j]);
		if(leftSetParent.i !== rightSetParent.i || leftSetParent.j !== rightSetParent.j)
		{
			joinSets(leftSetParent, rightSetParent);
			VWallArray[i][j] = 0;
		}
	}
}

mazeButton.onclick = function()
{
	if(rows > 0 && cols > 0)
	{
		isPlaying = true;
		initMaze();
		makeExits();
		shuffleExits();
		shuffleArray(EdgeIndexArray);
		for(var i=0; i<EdgeIndexArray.length; i++)
			decideToBuild(EdgeIndexArray[i]);
		displayMaze();
	}
	else
	{
		displayZeroError();
		isPlaying = false;
	}
}

// Play Maze

window.onkeyup = function(e)
{
	var key = e.keyCode ? e.keyCode : e.which;
	if(isPlaying)
		if(key == 65 || key == 37)			// A - left
		{
			if(VWallArray[PlayerPos.i][PlayerPos.j] === 0)
			{
				PlayerPos.j--;
				displayMaze();
			}
		}
		else if(key == 87 || key == 38)		// W - up
		{
			if(PlayerPos.i > 0 && HWallArray[PlayerPos.i][PlayerPos.j] === 0)
			{
				PlayerPos.i--;
				displayMaze();
			}
		}
		else if(key == 68 || key == 39)		// S - right
		{
			if(VWallArray[PlayerPos.i][PlayerPos.j+1] === 0)
			{
				PlayerPos.j++;
				displayMaze();
			}
		}
		else if(key == 83 || key == 40)		// S - down
		{
			if(HWallArray[PlayerPos.i+1][PlayerPos.j] === 0)
			{
				PlayerPos.i++;
				displayMaze();
				if(PlayerPos.i === rows)
				{
					isPlaying = false;
					document.getElementById('mazeDiv').innerHTML+="<p>You Won!</p>";
				}
			}
		}
}