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
rowMinusButton.disabled = true;
var rowPlusButton = document.getElementById('rowPlusButton');
var colMinusButton = document.getElementById('colMinusButton');
var colPlusButton = document.getElementById('colPlusButton');

var inputText = document.getElementById('inputText').value;

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
	if(rows > 4)
	{
		rows--;
		rowPlusButton.disabled = false;
		displayRowCol();
		if(rows === 4)
			rowMinusButton.disabled = true;
	}	
}
rowPlusButton.onclick = function()
{
	if(rows < 30)
	{
		rows++;
		rowMinusButton.disabled = false;
		displayRowCol();
		if(rows === 30)
			rowPlusButton.disabled = true;
	}
}
colMinusButton.onclick = function()
{
	if(cols > 3)
	{
		cols--;
		colPlusButton.disabled = false;
		displayRowCol();
		if(cols === 3)
			colMinusButton.disabled = true;
	}
}
colPlusButton.onclick = function()
{
	if(cols < 30)
	{
		cols++;
		colMinusButton.disabled = false;
		displayRowCol();
		if(cols === 30)
			colPlusButton.disabled = true;
	}
}

var HWallArray;
var VWallArray;
var PointsArray;
var EdgeIndexArray;
var MazeArray;

var PlayerPos = {i:0, j:0};

var isPlaying = false;

function isInputValid()
{
	inputText = document.getElementById('inputText').value;
	if(inputText.length > 14)
		return false;
	for(var i=0; i<inputText.length; i++)
		if(inputText.charAt(i) > '9' || inputText.charAt(i) < '0')
			return false;
	return true;
}
function displayInputError()
{
	document.getElementById('mazeDiv').innerHTML = "<p class='error'>Input should only contain digits and have at most 14 characters.</p>";
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
		else if(HWallArray[row][i] === 2)
			MazeArray[2*row] += "==";
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
	else if(VWallArray[row][0] === 2)
		MazeArray[2*row+1] += "&#8214;";
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
		else if(VWallArray[row][i] === 2)
			MazeArray[2*row+1] += "&#8214;";
		else
			MazeArray[2*row+1] += "&nbsp;";
	}
	MazeArray[2*row+1] += "</p>";
}

// Make Maze

function initMaze()
{
	if(cols < 2*inputText.length+1)
	{
		cols = 2*inputText.length+1;
		displayRowCol();
	}

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

function initInput()
{
	var r0 = Math.floor(rows/2)-1;
	var r1 = r0+1;
	var r2 = r1+1;
	for(var i=0; i<inputText.length; i++)
	{
		var c0 = Math.floor((cols-2*inputText.length-1)/2)+1+2*i;
		var c1 = c0+1;
		var c2 = c1+1;
		switch(inputText.charAt(i))
		{
			case '0':
				HWallArray[r0][c0] = 2;	// top HWall
				HWallArray[r2][c0] = 2;	// bot HWall

				VWallArray[r0][c0] = 2;	// topL VWall
				VWallArray[r0][c1] = 2;	// topR VWall
				VWallArray[r1][c0] = 2;	// botL VWall
				VWallArray[r1][c1] = 2;	// botR VWall
				break;
			case '1':
				VWallArray[r0][c1] = 2;	// topR VWall
				VWallArray[r1][c1] = 2;	// botR VWall
				break;
			case '2':
				HWallArray[r0][c0] = 2;	// top HWall
				HWallArray[r1][c0] = 2;	// mid HWall
				HWallArray[r2][c0] = 2;	// bot HWall

				VWallArray[r0][c1] = 2;	// topR VWall
				VWallArray[r1][c0] = 2;	// botL VWall
				break;
			case '3':
				HWallArray[r0][c0] = 2;	// top HWall
				HWallArray[r1][c0] = 2;	// mid HWall
				HWallArray[r2][c0] = 2;	// bot HWall

				VWallArray[r0][c1] = 2;	// topR VWall
				VWallArray[r1][c1] = 2;	// botR VWall
				break;
			case '4':
				HWallArray[r1][c0] = 2;	// mid HWall

				VWallArray[r0][c0] = 2;	// topL VWall
				VWallArray[r0][c1] = 2;	// topR VWall
				VWallArray[r1][c1] = 2;	// botR VWall
				break;
			case '5':
				HWallArray[r0][c0] = 2;	// top HWall
				HWallArray[r1][c0] = 2;	// mid HWall
				HWallArray[r2][c0] = 2;	// bot HWall

				VWallArray[r0][c0] = 2;	// topL VWall
				VWallArray[r1][c1] = 2;	// botR VWall
				break;
			case '6':
				HWallArray[r0][c0] = 2;	// top HWall
				HWallArray[r1][c0] = 2;	// mid HWall
				HWallArray[r2][c0] = 2;	// bot HWall

				VWallArray[r0][c0] = 2;	// topL VWall
				VWallArray[r1][c0] = 2;	// botL VWall
				VWallArray[r1][c1] = 2;	// botR VWall
				break;
			case '7':
				HWallArray[r0][c0] = 2;	// top HWall

				VWallArray[r0][c1] = 2;	// topR VWall
				VWallArray[r1][c1] = 2;	// botR VWall
				break;
			case '8':
				HWallArray[r0][c0] = 2;	// top HWall
				HWallArray[r1][c0] = 2;	// mid HWall
				HWallArray[r2][c0] = 2;	// bot HWall

				VWallArray[r0][c0] = 2;	// topL VWall
				VWallArray[r0][c1] = 2;	// topR VWall
				VWallArray[r1][c0] = 2;	// botL VWall
				VWallArray[r1][c1] = 2;	// botR VWall
				break;
			case '9':
				HWallArray[r0][c0] = 2;	// top HWall
				HWallArray[r1][c0] = 2;	// mid HWall
				HWallArray[r2][c0] = 2;	// bot HWall

				VWallArray[r0][c0] = 2;	// topL VWall
				VWallArray[r0][c1] = 2;	// topR VWall
				VWallArray[r1][c1] = 2;	// botR VWall
				break;
		}
	}
	updateHRow(r0);
	updateHRow(r1);
	updateHRow(r2);
	updateVRow(r0);
	updateVRow(r1);
}

function isAvail(edgeNum)
{
	var numOfHWalls = (rows-1)*cols;
	var i, j;

	if(edgeNum < numOfHWalls)	// HWall
	{
		i = Math.floor(edgeNum/cols)+1;
		j = edgeNum%cols;
		if(HWallArray[i][j] === 2)
			return false;
	}
	else						// VWall
	{
		edgeNum -= numOfHWalls;
		i = edgeNum%rows;
		j = Math.floor(edgeNum/rows)+1;
		if(VWallArray[0][0] === 2)
			return false;
	}
	return true;
}
function decideToBuild(edgeNum)
{
	var numOfHWalls = (rows-1)*cols;
	var i, j;

	if(isAvail(edgeNum))
	{
		if(edgeNum < numOfHWalls)	// HWall
		{
			i = Math.floor(edgeNum/cols)+1;
			j = edgeNum%cols;
			var topSetParent = findParent(PointsArray[i-1][j]);
			var botSetParent = findParent(PointsArray[i][j]);
			if(HWallArray[i][j] !== 2 && (topSetParent.i !== botSetParent.i || topSetParent.j !== botSetParent.j))
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
			if(VWallArray[i][j] !== 2 && (leftSetParent.i !== rightSetParent.i || leftSetParent.j !== rightSetParent.j))
			{
				joinSets(leftSetParent, rightSetParent);
				VWallArray[i][j] = 0;
				updateVRow(i);
			}
		}
	}
}

mazeButton.onclick = function()
{
	if(!isInputValid())
	{
		displayInputError();
		isPlaying = false;
	}
	else
	{
		isPlaying = true;
		initMaze();
		makeExits();
		shuffleExits();
		initInput();
		shuffleArray(EdgeIndexArray);
		for(var i=0; i<EdgeIndexArray.length; i++)
			decideToBuild(EdgeIndexArray[i]);
		displayMaze();
	}
}

// Play Maze

window.onkeyup = function(e)
{
	var key = e.keyCode ? e.keyCode : e.which;
	e.preventDefault();
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
				e.stopImmediatePropagation()
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
				e.stopImmediatePropagation()
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