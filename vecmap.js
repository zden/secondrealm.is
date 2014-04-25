//
// Copyright (c) 2014 Zden Hlinka ( Satori, s.r.o. ) - zden@satori.sk - Zd3N.com - satori.sk
// GNU GPL license
//

var MAP_SHOW_TIME = 5000;

function load_world(obj)
{
	this.world = obj;
	this.stlon = -12;
	this.enlon = 40;
	this.stlat = 61;
	this.enlat = this.stlat - (this.enlon - this.stlon) / 2;
	this.zoom = 128;
}

function set_whole_world(obj)
{
	obj.stlon = -180;
	obj.enlon = 180;
	obj.stlat = 90;
	obj.enlat = -90;
	obj.zoom = 1;
	return;
	aspect = X_RES / Y_RES;
	if (aspect > 1) aspect -= 1;
	obj.enlat = obj.stlat - aspect*(obj.enlon - obj.stlon) / 2;
}

function map_paint_world(obj, time, range)
{
	var p = 0;
	
	all = obj.world[p++];

	lon_ = lon__ = lat_ = lat__ = 0;

	time_dist = timeline_fx_time / 4;
	max = Math.sqrt(X_MID*X_MID + Y_MID*Y_MID);
	var laa;
	if (hi_det)
	{
		col = color_808080_pat;
		col.str = pattern_chess;
	}
	else
		col = color_808080;

	for (i = 0; i < all; i++)
	{
		lines = obj.world[p++];

		for (ii = pp = 0; ii < lines; ii++)
		{
			lon_ = obj.world[p++];
			lat_ = obj.world[p++];
			if (lon_ >= obj.stlon && lon_ < obj.enlon && lat_ < obj.stlat && lat_ >= obj.enlat)
			{
				lon_ = (X_RES * (lon_ - obj.stlon)) / (obj.enlon - obj.stlon);
				lat_ = (Y_RES * (obj.stlat - lat_)) / (obj.stlat - obj.enlat);
				if (Math.abs(lon_ - lon__) > range && Math.abs(lat_ - lat__) > range)
				{
					if (timeline_fx_time < MAP_SHOW_TIME)
					{
						dx = (lon_ - X_MID); dy = (lat_ - Y_MID);
						dist = Math.sqrt(dx*dx + dy*dy);
						if (dist > time_dist)
						laa = 0;
							else
						laa = 1;
					}
					else
						laa = 1;
					if (!sk && pp > 0)
						line(context, lon__, lat__, lon_, lat_, col, laa, 3);
					lon__ = lon_; lat__ = lat_; pp++;
				}
				sk = 0;
			}
			else
				sk = 1;
		}
	}
	line_paint_buffer();
}

function map_paint_zoom(obj, time, speed)
{
	if (time < 8000)
	{
		obj.stlon = -12-2 + time/speed;
		obj.enlon = 35-2 - time/speed;
		obj.stlat = 60-5 - time/speed/2 + time/speed/1.5;
	}
	else
	{
		time -= 8000;
		obj.stlon += 0.01;
		obj.enlon += 0.005;
		obj.stlat -= 0.0005;
	}
	aspect = X_RES / Y_RES;
	if (aspect > 1) aspect -= 1;
	obj.enlat = obj.stlat - aspect*(obj.enlon - obj.stlon) / 2;
}

function map_paint_cities(obj)
{
	var a, p = 0, c, pp = 0;

	c = data_vector_cities[p++];
	var pos = new Array(c*2);

	var alfa = get_alfa_timed(7000);

	for (a = 0; a < c; a++)
	{
		name = data_vector_cities[p++];
		lon_ = data_vector_cities[p++];
		lat_ = data_vector_cities[p++];
		dir = data_vector_cities[p++];
		size = data_vector_cities[p++];

		if (lon_ >= obj.stlon && lon_ < obj.enlon && lat_ < obj.stlat && lat_ >= obj.enlat)
		{
			lon_ = (X_RES * (lon_ - obj.stlon)) / (obj.enlon - obj.stlon);
			lat_ = (Y_RES * (obj.stlat - lat_)) / (obj.stlat - obj.enlat);
			circle_fill(context, lon_, lat_, 3+(size*2), color_FFA000, alfa);
			image_set_draw(img_city[a]);
			image_draw(context, lon_ + (!dir ? 15 : - 95), lat_ - (a ? 10 : -5), img_city[a].width, img_city[a].height, img_city[a], alfa*0.75);
			image_end_draw();
			pos[pp++] = lon_; pos[pp++] = lat_;
		}
	}
	triangle_paint_buffer_gl();
}

function map_paint_height(obj)
{
	var xs = 256, ys = 150;
	var size = xs*ys;

	var x = 0, y = 0;
	var lon_st = -13.0078125, lat_st = 60.1171875, step = 0.17578125, step_h = step*4;
	var lon = lon_st, lat = lat_st;
	
	var alfa = get_alfa_timed(7000);

	col = color_A0A0A0;
	if (hi_det) col.str = pattern_chess;
	for (a = 0; a < size; a +=4)
	{
		h = data_europe_high[a] * alfa;
		ls = a & 0xff;
		if (!ls)
		{
			lon = lon_st;
			lat -= step;
		}
		x = (X_RES * (lon - obj.stlon)) / (obj.enlon - obj.stlon);
		y = (Y_RES * (obj.stlat - lat)) / (obj.stlat - obj.enlat) - h/4;

		if (ls && lon >= obj.stlon && lon < obj.enlon && lat < obj.stlat && lat >= obj.enlat && h > 32)
		{
			line(context, xp, yp, x, y, col, (h/256)*alfa, LINE_2);
		}

		xp = x;
		yp = y;
		hp = h;
		lon += step_h;
	}
	line_paint_buffer();
}

function map_paint()
{
	if (!web_gl && !nethemba_end_img_loaded) return;
	clear_canvas(color_background, 0.9);

	map_paint_world(object_world, time, 1);
	map_paint_cities(object_world);
	map_paint_height(object_world);

	image_set_draw(map_overlay);
	image_draw(context, 0, 0, X_RES, Y_RES, map_overlay, 1);
	image_end_draw();
	
	if (timefx_more(5))
	{
		al = 1;
		if (timeline_fx_time > 17000)
		{
			al = timeline_fx_time - 17000;
			al /= 1000;
			if (al > 1) al = 1;
			al = 1 - al;
		}
		t = timeline_fx_time - 5000;
		if (t > 2000 && rnd(16) == 8)
			str = string_flash(string_map, t, 50);
		else
			str = string_sequence(string_map, t, 40);
		put_ch = put_ch_full;
		print_at(context, +50+2, 50+2, font6x6, str, color_404040, 2, 0.25*al, rnd(8+rnd(8)) == 4);
		triangle_paint_buffer_gl();
		print_at(context, +50, 50, font6x6, str, color_black, 2, 0.75*al, rnd(8+rnd(8)) == 4);
		triangle_paint_buffer_gl();
	}
}

function map_move(move)
{
	map_paint_zoom(object_world, timeline_fx_time, 1000);
}

//

var map_end_img;
var map_end_img_loaded = 0;

function map_end()
{
	if (!web_gl)
	{
		map_end_img = new Image();
		map_end_img.src = canvas.toDataURL("image/raw");
		map_end_img.onload = function func() { map_end_img_loaded = 1; };
	}
	else
		swap_framebuffer_gl();
}

function map_fade(time, dur)
{
	v = Math.floor( (time*512)/dur );

	p = 0;
	for (y = 0; y < 30; y++)
		for (x = 0; x < 40; x++, p++)
		{
			m = data_fader_map[p];
			m = fader_intro_tab[m+v];
			al = m / 255;
			xx = (x * X_RES) / 40;
			w = (((x+1) * X_RES) / 40) - xx;
			yy = (y * Y_RES) / 30;
			h = (((y+1) * Y_RES) / 30) - yy;
			if (!web_gl)
			{
				context.globalAlpha = al;
				context.drawImage(map_end_img, xx, yy, w, h, xx, yy, w, h);
			}
			else
				paint_fade_texture_gl(xx, yy, w, h, xx, yy, w, h, al);

			if (m > 64 && m < 192)
			{
				al = (1 - m/255)*(512-v)/512;
				line(context, xx, yy+h+m/2, xx+w, yy+h+m/3, color_black, al, 1);
			}
		}
	line_paint_buffer();
}
