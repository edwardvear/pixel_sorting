
var canv = document.createElement("CANVAS");
var ctx = canv.getContext('2d');

var img = new Image()
img.crossOrigin = 'anonymous';
img.onload = process_image;
img.src = 'https://upload.wikimedia.org/wikipedia/commons/6/65/I_See_You.jpg';


function process_image() {
	canv.width = 600;
	canv.height = 2*canv.width*(img.naturalHeight/img.naturalWidth);
	document.body.appendChild(canv);
	ctx.drawImage(img, 0, 0, canv.width, canv.height/2);
	let imData = ctx.getImageData(0, 0, canv.width, canv.height/2);
	let newImData = pixelSort(imData);
	ctx.putImageData(newImData, 0, canv.height/2);
}


function pixelSort(data) {
	let rows = getSortedRows(data);
	let newData = rowsToImageData(rows, data.width, data.height);
	return newData;
}

function rowsToImageData(rows, width, height) {
	let newData = new ImageData(width, height);
	for (let r = 0; r < height; r++) {
		for (let c = 0; c < width; c++) {
			let idx = (r*width + c)*4;
			newData.data[idx] = rows[r][c][0];
			newData.data[idx+1] = rows[r][c][1];
			newData.data[idx+2] = rows[r][c][2];
			newData.data[idx+3] = rows[r][c][3];
		}
	}
	return newData;
}

function getSortedRows(data) {
	let rows = []
	for (let r = 0; r < data.height; r++) {
		let row = []
		for (let c = 0; c < data.width; c++) {
			let idx = (r*data.width + c)*4;
			let px = [];
			px.push(data.data[idx]);
			px.push(data.data[idx+1]);
			px.push(data.data[idx+2]);
			px.push(data.data[idx+3]);
		  row.push(px);
		}
		let startx = Math.random()*data.width;
		let endx = startx + Math.random()*(data.width-startx);
		sortRowSlice(row, startx, endx);
		rows.push(row);
	}
	return rows;
}

function sortRowSlice(row, startx, endx) {
	var slice = row.slice(startx, endx);
	slice.sort(pixelCompare);
	row.splice(startx, slice.length, ...slice);
}

function pixelCompare(a, b) {
	asum = a.reduce((acc,val) => acc + val);
	bsum = b.reduce((acc,val) => acc + val);
	return bsum - asum ;
}
