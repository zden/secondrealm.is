//
// Copyright (c) 2014 Zden Hlinka ( Satori, s.r.o. ) - zden@satori.sk - Zd3N.com - satori.sk
// GNU GPL license
//

var RES_X = 1024;
var RES_Y = 768;

var pattern_chess, pattern_chess_n;

var web_gl = 0;

var LINE_2 = 2;

var img_chess, img_chess_n;

function gfxlib_init()
{
	if (!web_gl)
	{
		img_chess = new Image();
		img_chess.src = 'data/chess2.png';
		img_chess.onload = function() { pattern_chess = context.createPattern(img_chess, 'repeat'); }

		img_chess_n = new Image();
		img_chess_n.src = 'data/nethemba_chess.png';
		img_chess_n.onload = function() { pattern_chess_n = context.createPattern(img_chess_n, 'repeat'); }
	}
	
	X_RES = canvas.width;
	Y_RES = canvas.height;
	X_MID = X_RES/2;
	Y_MID = Y_RES/2;
	FONT_ARIAL_20 = "bold 20px Arial";
	FONT_LUCIDA_20 = "20px Lucida Console";
	FONT_LUCIDA_30 = "30px Lucida Console";
	
	if (!hi_det && !web_gl)
	{
		triangle_pattern = triangle_pattern_canvas_low;
	}
}

function X_REL(percent)
{
	return (X_RES * percent) / 100;
}

function Y_REL(percent)
{
	return (Y_RES * percent) / 100;
}

var imgs_used = 0;
var imgs_loaded = 0;

function load_pic(file)
{
	img = new Image();
	img.onload = function func() { imgs_loaded++; }
	img.crossOrigin = "anonymous";
	img.src = "data/"+file;
	imgs_used++;
	return(img);
}

//

function rgbColor(r,g,b)
{
  return 'rgb(' + r + ',' + g + ',' + b + ')';
}

function RGB(r,g,b)
{
	this.r = r/255;
	this.g = g/255;
	this.b = b/255;
	this.str = 'rgb(' + r + ',' + g + ',' + b + ')'; //"#"+r.toString(16)+g.toString(16)+b.toString(16)+"00"; //rgbColor(r,g,b);
	return this;
}

function RGB_cross(col1, col2, c)
{
	c *= 255;
	this.r = (col1.r*255 + (col2.r - col1.r) * c);
	this.g = (col1.g*255 + (col2.g - col1.g) * c);
	this.b = (col1.b*255 + (col2.b - col1.b) * c);
	this.str = 'rgb(' + Math.floor(this.r) + ',' + Math.floor(this.g) + ',' + Math.floor(this.b) + ')';

	this.r = this.r / 255;
	this.g = this.g / 255;
	this.b = this.b / 255;
	return this;
}

function draw_text(context, x, y, text, font, col, alfa)
{
	return;
	context.globalAlpha = alfa;
	context.fillStyle = col.str;
	context.font = font;
	context.fillText(text, x, y);
}

function line_canvas(context, xs, ys, xe, ye, col, alfa, line_size)
{
//	line_size = typeof line_size_in != "number" ? 2 : line_size_in;
	context.beginPath();
	context.moveTo(xs, ys);
	context.lineTo(xe, ye);
	context.lineWidth = line_size;
	context.strokeStyle = col.str;
	context.globalAlpha = alfa;
	context.stroke();
}

function triangle_canvas(context, x1, y1, x2, y2, x3, y3, col, alfa)
{
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.lineTo(x3, y3);
	context.lineTo(x1, y1);
	context.strokeStyle = col.str;
	context.lineWidth = 1;
	context.globalAlpha = alfa;
	context.closePath();
	context.fillStyle = col.str;
 	context.fill();
}

function triangle_pattern_canvas(context, x1, y1, x2, y2, x3, y3, col, alfa)
{
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.lineTo(x3, y3);
	context.lineTo(x1, y1);
	context.globalAlpha = alfa;
	context.closePath();
    context.fillStyle = pattern_chess;
  	context.fill();
}

triangle_pattern_canvas_low


function triangle_pattern_canvas_low(context, x1, y1, x2, y2, x3, y3, col, alfa)
{
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.lineTo(x3, y3);
	context.lineTo(x1, y1);
	context.globalAlpha = alfa/2;
	context.closePath();
    context.fillStyle = color_black.str;
  	context.fill();
}


function triangle_pattern2_canvas(context, x1, y1, x2, y2, x3, y3, col, alfa)
{
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.lineTo(x3, y3);
	context.lineTo(x1, y1);
	context.globalAlpha = alfa;
	context.closePath();
    context.fillStyle = pattern_chess_n;
  	context.fill();
}

function rect_canvas(x1, y1, wid, hei, col, alfa)
{
	context.beginPath();
	context.globalAlpha = alfa;
	context.rect(x1, y1, wid, hei);
	context.fillStyle = col.str;
	context.fill(); 
}

function polygon_canvas(context, x1, y1, x2, y2, x3, y3, x4, y4, col, alfa)
{
	context.beginPath();
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.lineTo(x3, y3);
	context.lineTo(x4, y4);
	context.lineTo(x1, y1);
	context.strokeStyle = col.str;
	context.globalAlpha = alfa;
	context.closePath();
	context.fillStyle = col;
  	context.fill();
}
	
function circle_canvas(context, x, y, r, col, alfa)
{
	if (r <= 0) return;
	context.globalAlpha = alfa;
	context.beginPath();
	context.arc(x, y, r, 0, 2 * Math.PI, false);
	context.lineWidth = 1;
	context.strokeStyle = col.str;
	context.stroke();
}

function circle_fill_canvas(context, x, y, r, col, alfa)
{
	if (r <= 0) return;
	context.globalAlpha = alfa;
	context.beginPath();
	context.arc(x, y, r, 0, 2 * Math.PI, false);
	context.fillStyle = col.str;
	context.fill();
	context.lineWidth = 0;
	context.strokeStyle = col.str;
	context.stroke();
}

function rnd(n)
{
	return Math.floor( Math.random() * n );
}

function load_font(data)
{
	this.width = data[0];
	this.height = data[1];
	this.widthb = data[2];
	this.shifts = data[3];
	this.startchar = data[4];
	this.endchar = data[5];
	this.firstshift = data[6];

	c = (this.endchar - this.startchar + 1)*this.widthb*this.height;
	this.data = new Array(c);
	for (a = 0; a < c; a++)
	{
		this.data[a] = data[a+7];
	}
}

function put_pixel(context, x, y, col)
{
	context.fillStyle = "black";
	context.fillRect(x<<1, y<<1, 1, 1);
	context.globalAlpha = 1;
	return;
}

var put_ch = put_ch_dot;

function put_ch_full(context, x, y, font, ch, col, size, alfa)
{
	var a, b, w = font.shifts ? font.data[font.firstshift + ch] : font.width;
	var bit = [ 128, 64, 32, 16, 8, 4, 2, 1 ];

	context.fillStyle = col.str;
	var alfa2 = 0.25*alfa;
	for (a = 0; a < font.height; a++)
		for (b = 0; b < w; b++)
			if ((font.data[(ch*font.height*font.widthb) + (a*font.widthb) + (b > 7 ? 1 : 0)] & bit[b > 7 ? b - 8 : b]))
			{
				var aa = a*size, bb = b*size;
				if (!web_gl)
				{
					context.globalAlpha = alfa;
					context.fillRect(x + bb, y + aa, size, size);
				}
				else
					rect_gl(x + bb, y + aa, size, size, col, alfa);
			}
}

function put_ch_dot(context, x, y, font, ch, col, size, alfa)
{
	var a, b, w = font.shifts ? font.data[font.firstshift + ch] : font.width;
	var bit = [ 128, 64, 32, 16, 8, 4, 2, 1 ];

	context.fillStyle = col.str;
	var alfa2 = 0.25*alfa;
	for (a = 0; a < font.height; a++)
		for (b = 0; b < w; b++)
			if ((font.data[(ch*font.height*font.widthb) + (a*font.widthb) + (b > 7 ? 1 : 0)] & bit[b > 7 ? b - 8 : b]))
			{
				var aa = a*size, bb = b*size;
				xx = x+bb; yy = y+aa;
				if (!web_gl)
				{
					context.globalAlpha = alfa;
					context.fillRect(xx, yy, 1, 1);
				}
				else
					pixel_gl(x + bb, y + aa, col, alfa);			
			}
}

function print_at(context, x, y, font, text, col, size, alfa, rnd_)
{
	var a, xx = x, yy = y, ch;

	var yy_add = font.height * size;
	for (a = 0; a < text.length; a++)
	{
		ch = text.charCodeAt(a);
		switch (ch) {
			case 10:	yy += yy_add;
						xx = x;
						if (yy > Y_RES) return;
						break;
			default:	put_ch(context, xx, yy, font, ch- font.startchar, col, size, alfa);
						xx += ( font.shifts ? font.data[font.firstshift + (ch - font.startchar)] : font.width ) * size;
						if (rnd_)
							xx += (-1 + rnd(3));	
						break;
		};
	}
	if (put_ch == put_ch_dot)
		triangle_paint_buffer_gl();
}

function clear_canvas_canvas(col, alfa)
{
	context.setTransform(1, 0, 0, 1, 0, 0);
	context.beginPath();
	context.rect(0, 0, canvas.width, canvas.height);
	context.fillStyle = col.str;
	context.globalAlpha = alfa;
	context.fill();
}

function image_set_draw_canvas(image)
{
}

function image_end_draw_canvas()
{
}

function image_draw_canvas(context, x, y, wid, hei, img, alfa)
{
		context.globalAlpha = alfa;
		context.drawImage(img, x, y, wid, hei);
}

function line_paint_buffer_canvas()
{
}

//

var line = line_canvas;
var triangle = triangle_canvas;
var triangle_pattern = triangle_pattern_canvas;
var triangle_pattern2 = triangle_pattern2_canvas;
var rect = rect_canvas;
var polygon = polygon_canvas;
var clear_canvas = clear_canvas_canvas;
var image_draw = image_draw_canvas;
var image_set_draw = image_set_draw_canvas;
var image_end_draw = image_end_draw_canvas;
var circle = circle_canvas;
var circle_fill = circle_fill_canvas;
var line_paint_buffer = line_paint_buffer_canvas;