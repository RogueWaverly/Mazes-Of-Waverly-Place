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
var MazeArray;

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
	document.getElementById('mazeDiv').innerHTML += MazeArray[0];
	for(var i=1; i<2*rows+1; i++)
	{
		document.getElementById('mazeDiv').innerHTML += MazeArray[i];
	}
	document.getElementById('mazeDiv').innerHTML += "<p id='end'>End</p>";
}

function updateHRow(row)
{
	MazeArray[2*row] = "<p class='mazeRow'>";
	
	for(var i=0; i<cols; i++)
	{
		MazeArray[2*row] += "+";
		if(HWallArray[row][i] === 1)
			MazeArray[2*row] += "&mdash;&mdash;";
		else
			MazeArray[2*row] += "&nbsp;&nbsp;";
	}
	MazeArray[2*row] += "+</p>";
}

function updateVRow(row)
{
	MazeArray[2*row+1] = "<p class='mazeRow'>";
	
	if(VWallArray[row][0] === 1)
		MazeArray[2*row+1] += "|";
	else
		MazeArray[2*row+1] += "&nbsp;";
	for(var i=1; i<cols+1; i++)
	{
		if(isPlaying && PlayerPos.i === row && PlayerPos.j === i-1)
			MazeArray[2*row+1] += "&rsaquo;&lsaquo;";
		else
			MazeArray[2*row+1] += "&nbsp;&nbsp;";
		if(VWallArray[row][i] === 1)
			MazeArray[2*row+1] += "|";
		else
			MazeArray[2*row+1] += "&nbsp;";
	}
	MazeArray[2*row+1] += "</p>";
}

// Make Maze

function initMaze()
{
	MazeArray = new Array(2*rows+1);
	for(var i=0; i<2*rows+1; i++)
		MazeArray[i] = "";

	HWallArray = new Array(rows+1);
	for(var i=0; i<rows+1; i++)
	{
		HWallArray[i] = new Array(cols);
		for(var j=0; j<cols; j++)
			HWallArray[i][j] = 1;
		updateHRow(i);
	}

	VWallArray = new Array(rows);
	for(var i=0; i<rows; i++)
	{
		VWallArray[i] = new Array(cols+1);
		for(var j=0; j<cols+1; j++)
			VWallArray[i][j] = 1;
		updateVRow(i);
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
	updateHRow(0);
	updateHRow(rows);
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
			updateHRow(i);
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
			updateVRow(i);
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
		switch(key)
		{
			case 65:
			case 37:			// A - left
			{
				e.preventDefault();
				if(VWallArray[PlayerPos.i][PlayerPos.j] === 0)
				{
					PlayerPos.j--;
					updateVRow(PlayerPos.i);
					displayMaze();
				}
				break;
			}
			case 87:
			case 38:			// W - up
			{
				e.preventDefault();
				if(PlayerPos.i > 0 && HWallArray[PlayerPos.i][PlayerPos.j] === 0)
				{
					PlayerPos.i--;
					updateVRow(PlayerPos.i+1);
					updateVRow(PlayerPos.i);
					displayMaze();
				}
				break;
			}
			case 68:
			case 39:			// S - right
			{
				e.preventDefault();
				if(VWallArray[PlayerPos.i][PlayerPos.j+1] === 0)
				{
					PlayerPos.j++;
					updateVRow(PlayerPos.i);
					displayMaze();
				}
				break;
			}
			case 83:
			case 40:			// S - down
			{
				e.preventDefault();
				if(HWallArray[PlayerPos.i+1][PlayerPos.j] === 0)
				{
					PlayerPos.i++;
					if(PlayerPos.i !== rows)
					{
						updateVRow(PlayerPos.i);
						updateVRow(PlayerPos.i-1);
						displayMaze();
					}
					else
					{
						isPlaying = false;
						updateVRow(PlayerPos.i-1);
						displayMaze();
						document.getElementById('mazeDiv').innerHTML+="<h2 id='youWon'>You Won!</h2>";
					}
				}
				break;
			}
		}
		
}