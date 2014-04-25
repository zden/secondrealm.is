//
// Copyright (c) 2014 Zden Hlinka ( Satori, s.r.o. ) - zden@satori.sk - Zd3N.com - satori.sk
// GNU GPL license
//

function fader_bmp(time, duration)
{
	v = Math.floor( (time*512)/duration );
	
	p = 0;
	for (y = 0; y < 30; y++)
		for (x = 0; x < 40; x++, p++)
		{
			m = data_fader_map[p];
			m = fader_intro_tab[m+v];
			context.globalAlpha = m / 255;
			xx = (x * X_RES) / 40;
			w = (((x+1) * X_RES) / 40) - xx;
			yy = (y * Y_RES) / 30;
			h = (((y+1) * Y_RES) / 30) - yy;
			context.drawImage(img_intro_fader, xx, yy, w, h);
		}
}

function fader_intro(time, duration)
{
	v = Math.floor( (time*512)/duration );
	b = 255 - (v >> 1);
	document.body.style.background = rgbColor(b,b,b);

	p = 0;
	for (y = 0; y < 30; y++)
		for (x = 0; x < 40; x++, p++)
		{
			m = data_fader_map[p];
			m = fader_intro_tab[m+v];
			xx = (x * X_RES) / 40;
			w = (((x+1) * X_RES) / 40) - xx;
			yy = (y * Y_RES) / 30;
			h = (((y+1) * Y_RES) / 30) - yy;
			rect(xx, yy, w, h, color_white, m/255);
		}
	triangle_paint_buffer_gl();
}

var fader_intro_tab = new Array(768);

for (a = 0; a < 256; a++)
{
	fader_intro_tab[a] = 255;
	fader_intro_tab[a+256] = 255 - a;
	fader_intro_tab[a+512] = 0;
}


function fader_flash(time, duration)
{
	rect(0, 0, X_RES-1, Y_RES-1, color_808080, 0.5 - (time/duration/2));
	triangle_paint_buffer_gl();
}

function fader_flash_red(time, duration)
{
	rect(0, 0, X_RES-1, Y_RES-1, color_FF8080, 0.5 - (time/duration/2));
	triangle_paint_buffer_gl();
}


function fader_test(time, duration)
{
	var imageData = context.getImageData(0, 0, X_RES, Y_RES);
	var data = imageData.data;

	for(var i = 0; i < data.length; i += 4)
	{
		data[i] = 255;
	}

	context.putImageData(imageData, 400, 400);
}

function wave_fade(time, dur)
{
	var v = Math.floor( (time*512)/dur );
	
	var p = 0;
	var al;
	for (y = 0; y < 30; y++)
		for (x = 0; x < 40; x++, p++)
		{
			m = data_fader_map[p];
			m = fader_intro_tab[m+v];
			context.globalAlpha = m / 255;
			xx = (x * X_RES) / 40;
			w = (((x+1) * X_RES) / 40) - xx;
			yy = (y * Y_RES) / 30;
			h = (((y+1) * Y_RES) / 30) - yy;
			if (m > 64 && m < 192)
			{
				al = (1 - m/255)*(512-v)/512;
				line(context, xx, yy+h+m/2, xx+w, yy+h+m/3, RGB(0,0,0), al, 1);
			}
		}
	line_paint_buffer();
}
