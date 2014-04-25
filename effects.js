//
// Copyright (c) 2014 Zden Hlinka ( Satori, s.r.o. ) - zden@satori.sk - Zd3N.com - satori.sk
// GNU GPL license
//

var color_background = new	RGB(0xF0, 0xFF, 0xF0);
var color_background2 = new	RGB(0xF0, 0xE8, 0xF0);
var color_black = new		RGB(0, 0, 0);
var color_orange = new		RGB(0xFF, 0x80, 0);
var color_white = new		RGB(0xFF, 0xFF, 0xFF);
var color_red = new			RGB(0xff,0,0);
var color_blue = new		RGB(0,0,0xff);
var color_pattern;

var color_world = new RGB(0x30, 0x20, 0xA0);

var color_8080FF = new	RGB(0x80,0x80,0xff);
var color_FF8000 = new	RGB(0xff,0x80,0);
var color_000080 = new	RGB(0,0,0x80);
var color_FA0000 = new	RGB(0xfa,0,0);
var color_FF00FF = new	RGB(0xff,0,0xff);
var color_8080FF = new	RGB(0x80,0x80,0xFF);
var color_FF4000 = new	RGB(0xff,0x40,0);
var color_FFFF80 = new	RGB(0xff,0xff,0x80);
var color_FF0000 = new	RGB(0xff,0,0);
var color_FFA000 = new	RGB(0xFF, 0xA0, 00);
var color_000080 = new	RGB(0,0,0x80);
var color_20A0FF = new	RGB(0x20,0xa0,0xff);
var color_800000 = new	RGB(0x80,0,0);
var color_0080FF = new	RGB(0, 0x80, 0xFF);
var color_A0A0A0 = new RGB(0xA0, 0xA0, 0xA0);
var color_A00000 = new RGB(0xA0,0,0);
var color_FFE0E0 = new	RGB(0xff, 0xe0, 0xe0);
var color_8000A0 = new RGB(0x80, 0, 0xa0);
var color_BFBFBF = new	RGB(0xbf, 0xbf, 0xbf);
var color_808080 = new	RGB(0x80, 0x80, 0x80);
var color_00A0FF = new	RGB(0, 0xa0, 0xff);
var color_4397F5 = new RGB(0x43, 0x97, 0xf5);
var color_5495CE = new RGB(0x54, 0x95, 0xce);
var color_66C1F8 = new RGB(0x66, 0xc1, 0xf8);
var color_86D8FE = new RGB(0x86, 0xd8, 0xfe);
var color_A08000 = new RGB(0xA0, 0x80, 00);
var color_FFFF00 = new RGB(0xFF, 0xFF, 00);
var color_F89934 = new RGB(0xF8, 0x99, 0x34);
var color_FFC32D = new RGB(0xFF,0xC3,0x2D);
var color_0014C0 = new RGB(0,20,192);
var color_8014C0 = new RGB(128,20,192);
var color_FF1420 = new RGB(255,20,32);
var color_FF0080 = new RGB(255,0,128);
var color_00809B = new RGB(0,128,155);
var color_FF8020 = new RGB(255,128,32);
var color_FF8080 = new RGB(0xFF,0x80,0x80);
var color_004000 = new RGB(0, 0x40, 0);
var color_0020FF = new RGB(0, 0x20, 0xFF);
var color_FF2000 = new RGB(0xFF, 0x20, 0);
var color_404040 = new RGB(0x40, 0x40, 0x40);
var color_604020 = new RGB(0x60, 0x40, 0x20);
var color_DCC800 = new RGB(220, 200, 0);
var color_0014FF = new RGB(0,20,255);
var color_0080FF = new RGB(0,128,255);
var color_808080_pat = new RGB(0x80,0x80,0x80);

function effects_init()
{
	color_pattern =	new RGB(0,0,0);
	color_pattern.str = pattern_chess;
}

// ### BOX ###

var box_sync = 0, box_stype = 0;

function box_triangle_pulse(context, x1, y1, x2, y2, x3, y3, col, alfa, id)
{
	var mul = 1 + (( (id + ((box_sync/250) % 64)) % 32)/10)*Math.sin((time*id)/1000000);
	
	mul *= (1 + Math.sin(time/2000 + x1 / X_RES)/4);

	x1 -= X_MID; x2 -= X_MID; x3 -= X_MID;
	y1 -= Y_MID; y2 -= Y_MID; y3 -= Y_MID;
	x1 *= mul; x2 *= mul; x3 *= mul;
	y1 *= mul; y2 *= mul; y3 *= mul;
	x1 += X_MID; x2 += X_MID; x3 += X_MID;
	y1 += Y_MID; y2 += Y_MID; y3 += Y_MID;

	triangle(context, x1, y1, x2, y2, x3, y3, col, alfa);
}

function box_triangle(context, x1, y1, x2, y2, x3, y3, col, alfa, id)
{
	triangle(context, x1, y1, x2, y2, x3, y3, col, alfa);
}

var box_num = [ -1, -1, -1, -1, -1, -1, -1, -1 ];
var box_pos = [ 0, 0, 0, 0, 0, 0, 0, 0 ];
var box_num_time = 0;

function box_paint()
{
	var a;

	if (!web_gl && !map_end_img_loaded) return;

	clear_canvas(color_background, 1);

	put_ch = put_ch_dot;
	var t = (Math.floor(timeline_fx_time/200) + rnd(2)) % 4;
	
	if (t == 0)
		print_at(context, 0, 0, font6x6, string_fromline(string_box,Math.floor(timeline_fx_time / 200)), color_black, 5+rnd(16)/128, 1, 0);
	else
	if (t == 1)
		print_at(context, X_REL(25), 0, font6x6, string_fromline(string_box,Math.floor(timeline_fx_time / (400+rnd(50)))), color_black, 4+sin(5000,0.5), 0.5, 0);
	else
	if (t == 2)
		print_at(context, X_REL(75)+sin(2500,5), -16+sin(2000,5), font6x6, string_fromline(string_box,Math.floor(timeline_fx_time / (600+sin(3000,200)))), color_black, 3, 0.5, 0);
	if (t == 3)
		print_at(context, X_REL(90), 0, font6x6, string_fromline(string_box,Math.floor(timeline_fx_time / 800)), color_black, 1.5, 0.15+sin(1000,0.1), 0);

	var al = 0, all;
	if (timeline_fx_time >= 2000)
	{
		if (timeline_fx_time > 4000 && box_num_time <= timeline_fx_time)
		{
			box_next_num();
			box_num_time = timeline_fx_time + 750;
		}
		if (timeline_fx_time < 4000)
			al = (timeline_fx_time - 2000)/2000;
		else
		if (timeline_fx_time > 17750)
		{
			al = 1 - (timeline_fx_time - 17750)/1000;
			if (al < 0) al = 0;
		}
		else
			al = 1;
	}
		
	object_buddah.pos_x = 150;
	object_buddah.pos_y = 50+sin(4000,10);
	object_buddah.pos_z = 40;
	object_buddah.ang_x = 4*PI/2;
	object_buddah.ang_y = 4*PI/2;
	object_buddah.ang_z = PI;
	rotate_3d_object(object_buddah);
	transform_3d_object(object_buddah);
	bounds_3d_object(object_buddah);
	flat_render_func = triangle;
	var num = object_buddah.face_num, aaa = al*4;
	if (aaa > 1) aaa = 1;
	object_buddah.face_num = Math.floor(num * al);
	flat_3d_simple(object_buddah, color_red, 0.25*al);

	var bsync = Math.abs(sin(5000, box_sync) + sin(200, box_sync) + cos(11, box_sync));
	for (a = 0; a < object_buddah.vertex_num; a+=3)
		object_buddah.point[a].xt += X_RES*0.75 + bsync;//(box_sync != 0 ? rnd(32) : 0);
	bounds_3d_object(object_buddah);
	flat_3d_simple(object_buddah, color_black, 0.025*al);
	object_buddah.face_num = num;

	var obj, col, col2, y, b;
	for (a = 0; a < 8; a++)
	{
		if (box_num[a] != -1)
		{
			if (!box_num[a])
			{
				obj = object_bin0;
				col = col2 = color_black;
				y = 14;
			}
			else
			{
				obj = object_bin1;
				col = color_orange;
				col2 = color_red;
				y = 0;
			}
			all = box_pos[a]/16;
			if (all > 1) all = 1;
				
			obj.pos_x = 133;
			obj.pos_y = -box_pos[a]+y+sin(4000,10);
			obj.pos_z = 30;
			obj.ang_x = 4*PI/2;
			obj.ang_y = 4*PI/2;
			obj.ang_z = PI;
			rotate_3d_object(obj);
			transform_3d_object(obj);
			bounds_3d_object(obj);
			flat_render_func = triangle;
			flat_3d_simple(obj, col, 0.25*al*all);
			
			for (b = 0; b < obj.vertex_num; b++)
			{
				if (b & 3 == 3)
					obj.point[b].xt += X_RES*0.75 +bsync/80;
				else
					obj.point[b].xt += X_RES*0.70 - bsync/5;
			}
			bounds_3d_object(obj);
			flat_3d_simple(obj, col2, 0.025*al*all);
		}
	}

		
	rotate_3d_object(object_ball);
	rotate_3d_object(object_box);

	pat = new RGB(0,0,0);
	pat.str = pattern_chess;
	object_box.zoom = 4000;
	transform_3d_object(object_box);
	bounds_3d_object(object_box);
	
	object_smallbox.zoom = 300+box_sync/50;
	object_smallbox.pos_z = 200;
	rotate_3d_object(object_smallbox);
	transform_3d_object(object_smallbox);
	bounds_3d_object(object_smallbox);
	paint_3d_wire(object_smallbox, 1, pat, 0.67, 0);

	image_set_draw(box_glow);
	image_draw(context, (canvas.width - 1024)/2, (canvas.height - 1024)/2, 1024, 1024, box_glow, 0.7); //0.7);
	image_end_draw();

	bounds_3d_object(object_ball);
	deform_3d_object(object_ball, timeline_fx_time+box_sync, 8000+sin(5600,box_sync), 1.23+box_sync, 20+box_sync/200, 30+box_sync/300);
	object_ball.zoom = 1000 + box_sync/4;
	transform_3d_object(object_ball);
	bounds_3d_object(object_ball);
	if (box_stype)
		paint_3d_func = box_triangle_pulse;
	else
		paint_3d_func = triangle;
	if (!hi_det) paint_skip = 2;
	if (timeline_fx_time > 15000)
	{
		c = (timeline_fx_time - 15000)/4000;
		if (c > 1) c = 1;
		col1 = RGB_cross(color_FF0000, color_0080FF, c);
		col2 = RGB_cross(color_DCC800, color_0014FF, c);
		col3 = RGB_cross(color_FFA000, new RGB(0x60,0x9A,0xD5), c);
	}
	else
	{
		col1 = color_FF0000;
		col2 = color_DCC800;
		col3 = color_FFA000;
	}
		
	paint_3d_object(object_ball, col1, col2, col3);
	paint_skip = 1;
	paint_3d_line_move(object_ball, timeline_fx_time, 1000, 20 + (!hi_det ? 30 : 0) - (web_gl ? 5 : 0));

	paint_3d_wire(object_box, 96+(Math.floor(time/560))%16, color_004000, 0.15, 1);
	
}

function box_next_num()
{
	for (a = 0; a < 7; a++)
	{
		box_num[a] = box_num[a+1];
		box_pos[a] = box_pos[a+1];
	}
	box_num[7] = rnd(2) ? 1 : 0;
	box_pos[7] = 0;
}

function box_pump(time, dur)
{
	box_sync = 4096 - (4096*time)/dur;
	box_stype = 0;
}

function box_pump2(time, dur)
{
	box_sync = 4096 - (4096*time)/dur;
	box_stype = 1;
}

function box_pump_end()
{
	box_sync = 0;
}

function box_move(move)
{
	object_smallbox.pos_z = object_box.pos_z = object_ball.pos_z = 100;
	object_smallbox.pos_y = cos(100, box_sync/4000);
	object_box.pos_y = 0;
	object_ball.pos_y = sin(1000-box_sync/10, box_sync/800);
	object_box.ang_y = object_ball.ang_y = time / 9000;
	object_smallbox.ang_y = - time / 9000;
	object_box.ang_z = object_ball.ang_z = time / 12000;
	object_ball.ang_y = box_sync / 3000;
	object_ball.ang_x = time / 1200;
	object_smallbox.ang_z =time / 12000;
	object_smallbox.ang_x = (box_stype ? 1 : -1) * box_sync / 5000;
	
	if (timeline_fx_time > 18000)
	{
		c = (timeline_fx_time - 18000)/20;
		object_ball.pos_z -= c;
		object_smallbox.pos_z -= c;
		object_box.pos_z -= c;
		object_ball.ang_z += move/20;
	}

	for (a = 0; a < 8; a++)
		if (box_num[a] != -1)
			box_pos[a] += move/50;
}

// ### BTC ###

function btc_callback(x,y)
{
}

function btc_color_func(np)
{
	if (np.z == 0)
		return(color_FF8000);
	else
	if (np.x == 0)
		return(color_FFFF00);
	else
	if (np.y == 0)
		return(color_A08000);
	else
		return(color_FFA000);		
}

function hexa_triangle(context, x1, y1, x2, y2, x3, y3, col, alfa, id)
{
	xd = X_MID - x1;
	yd = Y_MID - y1;
	dist = Math.sqrt(xd*xd + yd*yd);
	if (dist < 100)
	{
		triangle(context, x1, y1, x2, y2, x3, y3, color_0014C0, alfa, id);
	}
	else
	if (dist < 200)
	{
		triangle(context, x1, y1, x2, y2, x3, y3, color_8014C0, alfa, id);
	}
	else
	if (dist < 300)
	{
		triangle(context, x1, y1, x2, y2, x3, y3, color_FF1420, alfa, id);
	}
	else
		triangle(context, x1, y1, x2, y2, x3, y3, color_red, alfa, id);
}

function btc_paint()
{
	if (timeline_fx_time < 2000)
		al = 0.9*timeline_fx_time/2000;
	else
		al = 0.9;
	clear_canvas(color_background, al);

// - gox
	if (btc_gox.ready && timefx_less(sec(7)))
	{
		al = 1 - (timeline_fx_time / 7000);
	items = btc_gox.array.length - 1;
	items_paint = Math.floor((350*timeline_fx_time)/2000);
	items = 350;
	div = 3000 - timeline_fx_time/1.5;
	if (div < 5) div = 5;
	div2 = div/4;
	div3 = div/1000;
	xp = -1;
	sk = (hi_det ? 1 : 4);
	for (a = 0; a < items; a += sk)
	{
		x = (a * X_RES) / items;
		y = btc_gox.array[items-a][7];
		y = Y_RES-(Y_RES * y) / div;
		if (a < items_paint)
		{
			if (xp != -1)
				line(context, xp, yp, x, y, color_black, 0.5*al, LINE_2);
			line(context, xp, Y_RES, xp, Y_RES - btc_gox.array[items-a][5]/div2, color_808080, 0.25*al, LINE_2);
			if (hi_det) triangle(context, xp, Y_RES, xp, Y_RES - btc_gox.array[items-a][2]/div3, x, Y_RES, color_orange, 0.5*al);
		}
		xp = x;
		yp = y;
	}
	}
	
	rotate_3d_object(object_btc);
	transform_3d_object(object_btc);
	bounds_3d_object(object_btc);
	flat_render_func = triangle;
	flat_callback = btc_callback;
	flat_color_func = btc_color_func;
	if (!hi_det) flat_hor_start = -0.15;
	flat_3d_object(object_btc, COL_FUNC | ALFA | ALFA_REV);
	flat_hor_start = 0;
	paint_3d_wire_hor(object_btc, 1+(hi_det ? 0 : 8), color_red, 0.05, 0);

	if (timeline_fx_time > 6500)
	{
		al = timeline_fx_time - 6500;
		al /= 2000;
		if (al > 1) al = 1;
		object_btc.pos_x = -12+(1-al)*-5;
		object_btc.pos_y = 3;
		object_btc.pos_z = 4+rnd(32)/1024;
		object_btc.ang_x = PI/2;
		object_btc.ang_y = 0;
		object_btc.ang_z = PI;
		rotate_3d_object(object_btc);
		transform_3d_object(object_btc);
		bounds_3d_object(object_btc);
		paint_3d_wire_hor(object_btc, 1+rnd(8)+(hi_det ? 0 : 4), (rnd(2) == 1 ? color_white: color_black), (0.075+rnd(8)/256)*al, 0);
	}
	
	if (timefx_more(sec(2)))
	{
		flat_render_func = hexa_triangle;
		rotate_3d_object(object_hexa);
		bounds_3d_object(object_hexa);
		transform_3d_object(object_hexa);
	
		al = sec_dif(2)/100000;
		if (al > 1) al = 1;
		if (!hi_det) flat_hor_start = -40;
		flat_3d_simple(object_hexa, color_red, al*0.75);
		flat_hor_start = 0;
	}
	
	if (timefx_more(sec(4)))
	{
		al = sec_dif(4)/2000;
		if (al > 1) al = 1;
		put_ch = put_ch_dot;
		print_at(context, 70, Y_RES-100, font6x6, string_satoshi, color_black, 2.7, al*1, 0);
	}

}

function btc_move(move)
{
	object_btc.pos_z = 2-Math.abs(Math.sin(timeline_fx_time/3000))*2;
	object_btc.pos_x = object_btc.pos_y = 0;

	object_btc.ang_x = PI/2;
	object_btc.ang_z = PI+Math.sin(timeline_fx_time / 1000)/3;

		if (timeline_fx_time > 5000)
		object_btc.ang_y = Math.sin((timeline_fx_time - 5000)/6455);
	else
		object_btc.ang_y = 0;
	
//
	object_hexa.pos_x = 0;
	object_hexa.pos_y = 0;
	object_hexa.pos_z = 100-timeline_fx_time/100;
	object_hexa.ang_x = 0;
	object_hexa.ang_y = 0;
	object_hexa.ang_z = 0;
	
}

// ### NETHEMBA ###

function nethemba_flat_color(np)
{
	if (np.z == 0)
		return(color_4397F5);
	else
	if (np.x == 0)
		return(color_5495CE);
	else
	if (np.y == 0)
		return(color_66C1F8);
	else
		return(color_86D8FE);
	
}

var NETHEMBA_POINTS = 200;
var nethemba_point_list = new Array(NETHEMBA_POINTS*2);
var nethemba_face_pos = new Array(256);

function nethemba_flat_logo(context, x1, y1, x2, y2, x3, y3, col, alfa, id)
{
	add = nethemba_face_pos[id & 0xff];;

	alfa = alfa - (add/200);
	if (alfa < 0) alfa = 0;
	if (id & 1)
		add *= -1;

	triangle_pattern(context, x1, y1-add, x2, y2-add*2, x3, y3-add*3, pattern_chess, alfa);
}

function nethemba_flat_logo2(context, x1, y1, x2, y2, x3, y3, col, alfa, id)
{
	add = nethemba_face_pos[id & 0xff];;

	if (id & 1)
		add *= -1;

	triangle_pattern(context, x1-add, y1, x2+add, y2, x3-add*2, y3, pattern_chess, alfa);
}

function nethemba_flat_pulse(context, x1, y1, x2, y2, x3, y3, col, alfa, id)
{
	var mul = 1 + (( (id + ((time/250) % 16)) % 8)/10)*Math.sin((time*id)/1000000);
	
	mul *= (1 + Math.sin(time/5000 + x1 / X_RES)/4);

	x1 -= X_MID; x2 -= X_MID; x3 -= X_MID;
	y1 -= Y_MID; y2 -= Y_MID; y3 -= Y_MID;
	x1 *= mul; x2 *= mul; x3 *= mul;
	y1 *= mul; y2 *= mul; y3 *= mul;
	x1 += X_MID; x2 += X_MID; x3 += X_MID;
	y1 += Y_MID; y2 += Y_MID; y3 += Y_MID;
	alfa *= (mul % 1);

	add = nethemba_face_pos[id & 0xff];;

	triangle(context, x1, y1-add, x2, y2-add, x3, y3-add, col, alfa);
}

function nethemba_add_point(id, x, y)
{
	if (x < 0 || x > X_RES) return;
	id %= (NETHEMBA_POINTS - 1);
	id &= 0xfffe;
	nethemba_point_list[id] = x;
	nethemba_point_list[id+1] = y;
}

function nethemba_paint()
{
	clear_canvas(color_background, 0.9);
//
	if (timefx_less(26000))
	{
		for (a = 0; a < 256; a++)
		{
			nethemba_face_pos[a] = 1400 + Math.sqrt(a*a)*3.1415926;
			nethemba_face_pos[a] -= timeline_fx_time/8;
			if (nethemba_face_pos[a] < 0) nethemba_face_pos[a] = 0;
		}
	}
	else
	{
		for (a = 0; a < 256; a++)
		{
			nethemba_face_pos[a] = a/10 + (a/10)*Math.sin(timeline_fx_time/100*a+1);
			nethemba_face_pos[a] -= (timeline_fx_time - 26000)/16;
			if (nethemba_face_pos[a] < 0) nethemba_face_pos[a] = 0;
		}
	}

	context.globalAlpha = 1;

	rotate_3d_object(object_text_nethemba);
	transform_3d_object(object_text_nethemba);
	bounds_3d_object(object_text_nethemba);
	
	rotate_3d_object(object_text_nethemba_flat);
	transform_3d_object(object_text_nethemba_flat);
	bounds_3d_object(object_text_nethemba_flat);

	obj = object_text_nethemba_flat;
	var aa = 0;
	if (timeline_fx_time < 25000)
		aa = (0.1*timeline_fx_time) / 25000;
	else
		aa = 0.1;
	
	var sh = 1;
	if (timeline_fx_time < sec(15))
		sh = 1 + (sec(15) - timeline_fx_time) / 1000;

	image_set_draw(img_b);
	if (hi_det)
	for (a = 0; a < obj.face_num;  a += 2)
	{
		al = (aa*(obj.point[obj.face[a].a].yt & 0xf))/0xf;
		context.globalAlpha = al;
		xt = obj.point[obj.face[a].a].xt - 64;
		yt = obj.point[obj.face[a].a].yt - 64;
		xt = (xt - X_MID)*sh + X_MID;
		yt = (yt - Y_MID)*sh + Y_MID;

		image_draw(context, xt, yt, 128, 128, img_b, al);
	}
	image_end_draw();

	flat_render_func = nethemba_flat_pulse;
	flat_callback = nethemba_add_point;
	flat_color_func = nethemba_flat_color;
	if (!hi_det) flat_skip = 2;
	flat_3d_object(object_text_nethemba, ALFA | ALFA_REV | COL_FUNC);
	flat_skip = 1;
	
	x = y = xp = yp = -1;

	c = NETHEMBA_POINTS-6;
	if (!hi_det) { al = 0.025; c >>= 2; } else al = 0.05;
	for (a = 0; a < c; a += 4)
	{
		x = nethemba_point_list[a];
		y = nethemba_point_list[a+1];
		x2 = nethemba_point_list[a+3];
		y2 = nethemba_point_list[a+2];
		x3 = nethemba_point_list[a+4];
		y3 = nethemba_point_list[a+5];

		add = nethemba_face_pos[a & 0xff]/5;

		triangle(context, x, y+add, x2, y2+add, x3, y3+add, color_FF8000, al);

		x2 = x + (x-X_MID)*(1+(x3-X_MID)/100);
		y2 = y + (y-Y_MID)*(1+(y3-Y_MID)/100);
		line(context, x-add, y+add*2, x2+add, y2-add*2, color_FFA000, 0.15, 0.4);

	}
	line_paint_buffer();
	triangle_paint_buffer_gl();

	if (timefx_less(26000))
		flat_render_func = nethemba_flat_logo;
	else
		flat_render_func = nethemba_flat_logo2;

	flat_3d_simple(object_text_nethemba_flat, color_FF8000, 1);
	
	if (hi_det && timefx_more(sec(15)) && timefx_less(sec(34)))
	{
		al = 1;
		if (timeline_fx_time > 33000)
		{
			al = 1 - (timeline_fx_time - 33000)/1000;
		}
		t = timeline_fx_time - 15000;
		if (t > 2000 && rnd(16) == 8)
			str = string_flash(string_intro, t, 50);
		else
			str = string_sequence(string_intro, t, 40);
		put_ch = put_ch_dot;
		print_at(context, X_REL(1), Y_REL(85), font6x6, str, color_black, 2, al, rnd(8+rnd(8)) == 4);
	}
}

function nethemba_move(move)
{
	var z = 0;
	if (timeline_fx_time < 15000)
		z = 100 - timeline_fx_time/150;

	object_text_nethemba_flat.pos_z = object_text_nethemba.pos_z = 50+z+1.5+Math.sin(timeline_fx_time / 3000)*1;
	object_text_nethemba_flat.pos_x = object_text_nethemba.pos_x = Math.sin(3+timeline_fx_time / 4000)*100;
	object_text_nethemba_flat.pos_y = object_text_nethemba.pos_y = 0;

	object_text_nethemba.ang_y = Math.sin(5+timeline_fx_time / 3000)/10;
	object_text_nethemba.ang_x = 3.14/2+3.14;
	object_text_nethemba.ang_z = 3.14+Math.sin(timeline_fx_time / 2000)/5;

	object_text_nethemba_flat.ang_y = Math.sin(5+timeline_fx_time / 3000)/10;
	object_text_nethemba_flat.ang_x = 3.14/2+3.14;
	object_text_nethemba_flat.ang_z = 3.14+Math.sin(timeline_fx_time / 2000)/5;
	
	if (timeline_fx_time > sec(28))
	{
		object_text_nethemba_flat.pos_x += sec_dif(28)/42; // 40
		object_text_nethemba_flat.pos_y -= sec_dif(28)/300;
	}

}

var nethemba_end_img;
var nethemba_end_img_loaded = 0;

function nethemba_end()
{
	if (!web_gl)
	{
		nethemba_end_img = new Image();
		nethemba_end_img.src = canvas.toDataURL("image/raw");
		nethemba_end_img.onload = function func() { nethemba_end_img_loaded = 1; };
	}
	else
		swap_framebuffer_gl();
}

function nethemba_fade(time, dur)
{
	yt = time/1.777;
	if (!web_gl)
	{
		if (!nethemba_end_img_loaded) return;
		context.globalAlpha = 1 - time/dur;
		context.drawImage(nethemba_end_img, 0, 0, X_RES, Y_RES, -time/10, -yt/10, X_RES+time/5, Y_RES+yt/5);
	}
	else
		paint_fade_texture_gl(0, 0, X_RES, Y_RES, -time/10, -yt/10, X_RES+time/5, Y_RES+yt/5, 1 - time/dur);
}

////////////////////
/// medusa

function medusa_deform(obj)
{
	for (a = 0; a < obj.vertex_num; a++)
	{
		if (obj.point[a].rx > 0) 
		{
			obj.point[a].ry += sin(3000, 2*obj.point[a].rz/10)+cos(10+a/1.5, 2*obj.point[a].rx/30) + cos(3333, 1.5*obj.point[a].rz/13.3)+sin(6.66+a, 1.0*obj.point[a].rx/44);
			obj.point[a].rx += Math.abs( sin(3000, 0.5*obj.point[a].rx/100)+cos(10+a/1.5, 0.25*obj.point[a].rz/300) + cos(3333, 0.5*obj.point[a].rx/10)+sin(6.66+a, 0.25*obj.point[a].rz/440) );
		}
		else
			obj.point[a].rx += Math.abs( sin(3000, 15*obj.point[a].rx/100)+cos(10+a/1.5, 0.25*obj.point[a].rz/300) + cos(3333, 0.5*obj.point[a].rx/10)+sin(6.66+a, 0.25*obj.point[a].rz/440) );
			obj.point[a].ry += Math.abs( sin(3000, 2*obj.point[a].rz/10)+cos(10+a/1.5, 2*obj.point[a].rx/30) + cos(3333, 1.5*obj.point[a].rz/13.3)+sin(6.66+a, 1.0*obj.point[a].rx/44) );
	}
}

function medusa_flat(context, x1, y1, x2, y2, x3, y3, col, alfa, id)
{
	if (x1 > X_MID-128 && x1 < X_MID+192)
	{
		if (x1 > X_MID-32 && x1 < X_MID+128)
			col = color_FF8000; //A0A0FF";
		triangle(context, x1, y1, x2, y2, x3, y3, col, alfa);
	}
}

function medusa_paint(fx_start)
{
	tt = time - fx_start;
	
	rotate_3d_object(object_medusa);
	medusa_deform(object_medusa);
	transform_3d_object(object_medusa);
	transform_shift(object_medusa, -X_RES/3 + tt / 4, sin(3000,12)+cos(1500,13));
	bounds_3d_object(object_medusa);
	paint_blob(object_medusa, img_blob, 0.45, 8+(!hi_det ? 100 : 0));
	paint_3d_wire(object_medusa, 1+(!hi_det ? 15 : 0), color_FF00FF, 0.025+(!hi_det ? 0.3 : 0), 0);
	flat_render_func = medusa_flat;
	if (!hi_det) flat_hor_start = -1;
	flat_3d_simple(object_medusa, color_8080FF, 0.25);
	flat_hor_start = 0;
}

function medusa_move(move)
{
	object_medusa.ang_z = -PI/2+cos(3000,0.1);
	object_medusa.ang_y += move/5000;
	object_medusa.pos_z = 35;
	object_medusa.pos_y = -5
}

// rove

function rove_flat(context, x1, y1, x2, y2, x3, y3, col, alfa, id)
{
	g = id & 0xff;
	col = new RGB(g, g >> 2, 0);
	x1 += sin(300, x2/50);
	triangle(context, x1, y1, x2, y2, x3, y3, col, alfa);
}

function rove_paint()
{	
	rotate_3d_object(object_rove);
	medusa_deform(object_rove);
	transform_3d_object(object_rove);
	bounds_3d_object(object_rove);

	if (hi_det)
	{
		paint_blob(object_rove, img_blob, 1, 8);
		paint_3d_wire(object_rove, 1, color_FF00FF, 0.025, 0);
	}

	flat_render_func = rove_flat;
	if (!hi_det) flat_hor_start = -5;
	flat_3d_simple(object_rove, color_8080FF, 0.25);
	flat_hor_start = 0;
}

function rove_move(move)
{
	object_rove.ang_z = -PI/2+cos(3000,0.2);
	object_rove.ang_x = PI/2;
	object_rove.ang_y += move/10000;
	object_rove.ang_z += move/100;
	object_rove.pos_z = 10;
	object_rove.pos_y = -5
}

// wir

function wir_paint()
{
	rotate_3d_object(object_wir);

	bounds_3d_object(object_wir);
	deform_3d_object(object_wir, timeline_fx_time, 8000+cos(5600,1000), 100.23+100, 200+1/200, 300+1/30);
	transform_3d_object(object_wir);

	if (!hi_det) flat_hor_start = -100;
	flat_render_func = triangle;
	flat_3d_simple(object_wir, color_FF8000, 0.4);
	flat_hor_start = 0;
}

function wir_paint2(time_start, dist, alfa)
 {
	object_wir.pos_y = 0;
	object_wir.pos_x = 0;
	object_wir.ang_x = PI/2+sin(3777, 0.5);
	object_wir.ang_z = -PI/2+sin(6000,1);
	object_wir.ang_y = PI;
	object_wir.pos_z = 250-(dist << 2);

	rotate_3d_object(object_wir);
	
	bounds_3d_object(object_wir);
	deform_3d_object(object_wir, timeline_fx_time, 8000+cos(5600,1000), 100.23+100, 200+1/200, 300+1/30);
	transform_3d_object(object_wir);
	flat_render_func = triangle;
	flat_hor_start = -1100+(time-time_start)/40+(dist << 2);
	flat_3d_simple(object_wir, color_FF4000, 0.4*alfa);	
	flat_hor_start -= 150+(dist << 2);
	flat_3d_simple(object_wir, color_FFFF80, 0.4*alfa);
	flat_hor_start = 0;
}

function wir_move(move)
{
	object_wir.pos_y = 200;
	object_wir.pos_x = 0;
	object_wir.ang_x = PI/2;
	object_wir.ang_z = -PI/2+sin(3000,0.2);
	object_wir.ang_y = PI;
	object_wir.pos_z = 250;
}

function wir_move2(move, dist)
{
	object_wir.pos_y = -250;
	object_wir.pos_x = 250;
	object_wir.ang_x = 0.1;
	object_wir.ang_z = -PI/2+sin(3000,0.2);
	object_wir.ang_y = PI/2-0.2;
	object_wir.pos_z = 100;
}

// kula

var kula_max_dist;

function kula_render_flat(context, x1, y1, x2, y2, x3, y3, col, alfa, id)
{
	dist = Math.sqrt((X_MID-x1)+(X_MID-x1)+(Y_MID-y1)*(Y_MID-y1));
	if (dist < kula_max_dist)
	{
		if (id & 0x8)
			triangle_pattern(context, x1, y1, x2, y2, x3, y3, color_pattern, alfa);
		else
			triangle(context, x1, y1, x2, y2, x3, y3, id & 0x4 ? color_FFA000 : col, alfa);
	}
}

function kula_paint(fx_time)
{
	kula_max_dist = (timeline_fx_time-fx_time)/2;
	rotate_3d_object(object_kula);
	
	bounds_3d_object(object_kula);
	transform_3d_object(object_kula);
	flat_render_func = kula_render_flat;
	flat_3d_simple(object_kula, color_red, 0.7);
}

function kula_move(move)
{
	object_kula.pos_z = 10;
	object_kula.pos_y = object_kula.pos_x = 0;
	object_kula.ang_x = PI/2+ cos(4000,1);
	object_kula.ang_z = -PI/2+sin(3000,1);
	object_kula.ang_y = PI;
}

// circle

function circle_render_flat(context, x1, y1, x2, y2, x3, y3, col, alfa, id)
{
	if (id & 0x8)
		triangle_pattern(context, x1, y1, x2, y2, x3, y3, color_pattern, alfa);
	else
		triangle(context, x1, y1, x2, y2, x3, y3, id & 0x4 ? color_FFA000 : col, alfa);
}

function circle_render_flat_low(context, x1, y1, x2, y2, x3, y3, col, alfa, id)
{
	triangle(context, x1, y1, x2, y2, x3, y3, id & 0x8 ? color_808080 : id & 0x4 ? color_FFA000 : col, alfa);
}

function circle_paint(fx_time)
{
	rotate_3d_object(object_circle);
	
	bounds_3d_object(object_circle);
	transform_3d_object(object_circle);

	if (hi_det)
		flat_render_func = circle_render_flat;
	else
		flat_render_func = circle_render_flat_low;
	
	if (timeline_fx_time < 6000)
		al = 0.5;
	else
		al = 0.5 * (1 - ((timeline_fx_time - 6000)/1500));
	if (!hi_det)
	{
		flat_skip = 2;
		flat_hor_start = -1;
	}
	flat_3d_simple(object_circle, color_FF0000, al);
	flat_skip = 1;
	flat_hor_start = 0;
}

function circle_move(move)
{
	object_circle.pos_z = 12+sin(10000,10);
	object_circle.pos_y = object_circle.pos_x = 0;
	object_circle.ang_x = PI/2+ cos(4000,0.1);
	object_circle.ang_z = -PI/2+sin(3000,0.1);
	object_circle.ang_y = PI;
}

///////////////// CALM

var whiz_pos = 0;
var calm_fade_type = 0;

function whiz_triangle(context, x1, y1, x2, y2, x3, y3, col, alfa, id)
{
	if ((id & 0x7) == whiz_pos)
	{
		triangle(context, x1+rnd(256)-128, y1, x2+sin(2000,200), y2, x3, y3, color_FF0080, alfa, id);
	}
	x2 += -32+rnd(64);
	x3 += -32+rnd(64);
	if (id & 0x2)
		triangle(context, x1, y1, x2, y2, x3, y3, color_00809B, alfa/2, id);
		
	if (!(id % 9))
		triangle(context, x1, y1, x2, y2, x3, y3, color_FF8020, alfa, id);
}

var calm_type = 0;

function calm_paint()
{
	if (calm_type)
	{
		tunel_paint();
		return;
	}
	clear_canvas(color_background, 0.1);

	aa = timeline_fx_time/2;
	for (c = 0; c < 16; c++)
	{
	
		for (x = 16; x < X_RES - 16 + c*32; x += 256)
			line(context, x+c*16-aa, aa, x+c*8+aa, Y_RES-1-x/2, color_white, x/X_RES, 1);
		
		for (y = 16; y < X_RES - 16 + c*32; y += 256)
			line(context, -aa, y+c*16, X_RES-1-y/2+c*26, y-c*8-aa, color_white, y/Y_RES, 1);
		
	}
		
	line_paint_buffer();

	xx = X_RES-100;
	y = Y_RES-aa/3.5;
	if (y >= Y_MID-256 && y <= Y_MID+256)
	{
		a = 1-(Math.abs(Y_MID-y)/256)
	}
	else
		a = 0;
	y = y + (Y_MID - 64 - y)*a;

	if (y > -10 && y < Y_RES+10)
	for (a = 100; a < xx; a += 4)
	{
		line(context, a+aa, y, a-aa, y+250, color_white, a/X_RES/3);
	}
	line_paint_buffer();

	al = 1;
	if (timeline_fx_time > 4250)
	{
		al = 1 - (timeline_fx_time - 4250)/1000;
		if (al < 0) al = 0;
	}
	put_ch = put_ch_full;
	print_at(context, 50, y+20, font6x6, string_dali, color_black, 6.5, 0.35*al, 0);
	triangle_paint_buffer_gl();
	if (hi_det)
	{
		put_ch = put_ch_dot;
		print_at(context, 50+3, y+20+3, font6x6, string_dali, color_white, 6.5, 1*al, 0);
	}

	
	whiz_pos = (timeline_fx_time / 2) % 8;
	rotate_3d_object(object_circle);
	bounds_3d_object(object_circle);
	transform_3d_object(object_circle);
	flat_render_func = whiz_triangle;
	t = object_circle.face_num;
	object_circle.face_num = rnd(t);
	if (timeline_fx_time > 2750)
		object_circle.face_num -= ((timeline_fx_time - 2750) >> 1);
	if (!hi_det) flat_hor_start = -2;
	flat_3d_simple(object_circle, color_red, 0.5);
	flat_hor_start = 0;
	object_circle.face_num = t;
	
	sk = (hi_det ? 4 : 12);
	for (c = 0; c < object_circle.face_num; c+=sk)
	{
		x1 = object_circle.point[object_circle.face[c].a].xt;
		y1 = object_circle.point[object_circle.face[c].a].yt;
		x2 = object_circle.point[object_circle.face[c].b].xt;
		y2 = object_circle.point[object_circle.face[c].b].yt;

		if (object_circle.point[object_circle.face[c].a].rz < 0 &&
			object_circle.point[object_circle.face[c].b].rz < 0 &&
			object_circle.point[object_circle.face[c].c].rz < 0)
		{
			dx = (x2-x1)/16;
			dy = (y2-y1)/16;
			xx = x1; yy = y1;
			for (a = 0; a < 16; a++)
			{
				if (a)
				{
					if ((c+a+rnd(2)) & 0x2)
						line(context, xx, yy, xx+dx, yy+dy, color_red, 0.25, LINE_2);
				}
				xx += dx;
				yy += dy;
			}
		}
	
	}

	line_paint_buffer();

	if (timeline_fx_time > 2500)
	{
		al = timeline_fx_time - 2500;
		al /= 2000;
		if (al > 1) al = 1;
		object_lievik.pos_x = -12;
		object_lievik.pos_y = 3;
		object_lievik.pos_z = 4;
		object_lievik.ang_x = PI/2+al/2;
		object_lievik.ang_y = 0;
		object_lievik.ang_z = PI;
		rotate_3d_object(object_lievik);
		transform_3d_object(object_lievik);
		bounds_3d_object(object_lievik);
		paint_3d_wire_hor(object_lievik, 1+rnd(8)+(hi_det ? 0 : 4), (rnd(2) == 1 ? color_white: color_red), (0.075+rnd(8)/256)*al, 0);
	}

}

function calm_fade(time, dur)
{
	calm_type = rnd(dur) < time ? 1 : 0
}

function calm_fade_end()
{
	calm_type = 0;
}

function calm_fade_type_sync(ft)
{
	calm_fade_type = ft;
}

function calm_move(move)
{
	if (calm_type)
	{
		tunel_move();
		return;
	}
	object_circle.pos_z = sin(10000,3);
	object_circle.pos_x = 0;
	object_circle.pos_y = object_circle.pos_x = 0;
	object_circle.ang_y = cos(40000,PI/2);
	object_circle.ang_z = -PI/2+sin(3000,0.1);
}

///////////////// TUNEL

var tunel_path = 0;

function wir_triangle(context, x1, y1, x2, y2, x3, y3, col, alfa, id)
{
	xm1 = (x1+x2)/2;
	xm2 = (x2+x3)/2;
	ym1 = (y1+y2)/2;
	ym2 = (y2+y3)/2;
	triangle(context, xm1, ym1, x1, y1, x3, y3, color_FF8000, alfa);
	line(context, xm1, ym1, xm2, ym2, color_red, alfa, LINE_2);
	triangle_pattern(context, xm1, y2, xm2, y3, x1, ym2, color_black, alfa);
}

function wir_paint3()
{
//
	object_wir.ang_x = PI/2;
	object_wir.ang_z = -PI/2;
	object_wir.ang_y = PI;

	rotate_3d_object(object_wir);
	
	bounds_3d_object(object_wir);
	transform_3d_object(object_wir);
	flat_render_func = wir_triangle;
	flat_hor_start = -125 - (hi_det ? 0 : 50);
	flat_3d_simple(object_wir, color_FF4000, 0.4);
	line_paint_buffer();
	flat_hor_start = 0;
}

function tunel_triangle(context, x1, y1, x2, y2, x3, y3, col, alfa, id)
{	
	xm1 = (x1+x2)/2;
	xm2 = (x2+x3)/2;
	ym1 = (y1+y2)/2;
	ym2 = (y2+y3)/2;
	xm1 += sin(1500, 10)+cos(1300,5);
	xm2 += cos(1700, 20);
	ym1 += sin(700, 20)+cos(1100,7);
	ym2 += cos(1800, 10);
	
	triangle_pattern(context, xm1, y2, xm2, y3, x1, ym2, color_20A0FF, alfa);
	line(context, xm1, ym1, xm2, ym2, color_0080FF, alfa, LINE_2);
	xm1 = x3+(x1-xm2);
	ym2 = y2+(y3-ym1);
	triangle(context, xm1, ym1, x1, y1, x3, y3, color_00A0FF, alfa);
}

function tunel_paint()
{
	clear_canvas(color_background, 0.7);

	wir_paint3();

	aa = Y_RES;
	if (timeline_fx_time < 1500)
	{
		aa = (aa * timeline_fx_time)/1500;
	}
	sk = (hi_det ? 2 : 4);
	for (a = 0; a < aa; a += sk)
	{
		y = a;
		y += sin(300+a,4)+cos(1300-a, 8);
		line(context, 0, y, 100, y, color_808080, a/Y_RES, 1);
		y = Y_RES - 1 - a;
		y += sin(600+a,3)+cos(800-a, 4)+rnd(2);
		line(context, X_RES-100, y, X_RES-1, y, color_808080, a/Y_RES, 1);
	}
	xx = X_RES-100;
	y = Y_RES/2 + sin(5000, 370)+cos(2000, 400)+sin(3333, 300)+cos(6666,250)+sin(8888,360);
	sk = (hi_det ? 4 : 8);
	if (y > -10 && y < Y_RES+10)
	for (a = 100; a < xx; a += sk)
	{
		line(context, a, y, a, y+10, color_808080, a/X_RES, 1);
	}
	line_paint_buffer();

	put_ch = put_ch_full;
	yy = y;
	yy /= 32;
	yy = Math.floor(yy)*32;
	str = (yy % 99).toString() + "%" + Math.floor(y/128).toString() + "x" + Math.floor((y)/(10+rnd(8))).toString();
	str2 = str.substring(0, 7);
	print_at(context, X_RES - 512, y+20, font6x6, str2, color_black, 10, 0.25, 0);
	
	rotate_3d_object(object_tunel);
	off = timeline_fx_time/1000;
	for (a = 0; a < object_tunel.vertex_num; a++)
	{
		object_tunel.point[a].rx += Math.sin(off+object_tunel.point[a].rz/20)*30;
	}
	bounds_3d_object(object_tunel);
	transform_3d_object(object_tunel);
	flat_render_func = triangle;
	paint_blob(object_tunel, img_blob, 1, 100 + (hi_det ? 0 : 200));
	
	s = -300 + sin(3000, 300);
	flat_3d_simple_cut(object_tunel, (hi_det ? 0 : -50), s, color_black, 0.5, -700);

	flat_render_func = tunel_triangle;
	flat_3d_simple_cut(object_tunel, s + (hi_det ? 0 : -100), -150 + s, color_black, 0.5, -700);
	line_paint_buffer();
	
	flat_render_func = triangle;
	flat_3d_simple_cut(object_tunel, -150+s + (hi_det ? 0 : -100), -700, color_black, 0.5, -700);

}

var puzzle = [ 0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0 ];
var tunel_flash_val = 0;

function tunel_triangle2(context, x1, y1, x2, y2, x3, y3, col, alfa, id)
{
	yy = 300;
	if (id & 0xff > 128)
	{
		col = color_red;
		yy += id>>8;
	}
	triangle(context, x1, yy-(y1/4), x2, yy-(y2/4), x3, yy-(y3/4), col, alfa);
}

var credits = [ "CODEART", 350, 640, object_zden, -250,
				"MODELS", 320, 730, object_ubik, -290,
				"MUSIC", 290, 450, object_raiden, -180,
				"MODELS", 320, 560, object_maali, -225,
				"MUSIC", 290, 430, object_manmade, -170,
				];

var credits_pos = 0;
var credits_start_time = 0;

function credits_set(param)
{
	credits_pos = param;
	credits_start_time = timeline_fx_time;
}

var tunel_reshow_time = -1;
var tunel_reshow_val = 0;

function tunel2_paint()
{
	clear_canvas(color_background, 0.7);

	if (tunel_flash_val != 0)
		cr = Math.floor(20 * tunel_flash_val) % 5;
	else
		cr = credits_pos;
	cro = cr*5;
	c_title = credits[cro];
	c_title_wid = credits[cro+1];
	c_obj_wid = credits[cro+2];
	obj_c = credits[cro+3];
	obj_x = credits[cro+4];

	if (timefx_less(2000))
		show = timeline_fx_time / 2000;
	else
		show = 1;
	show = Math.sin(show*PI/2);

	show3d = show;
	if (tunel_reshow_time != -1)
	{
		if (timeline_fx_time - tunel_reshow_time < tunel_reshow_val)
		{
			show3d = (timeline_fx_time - tunel_reshow_time) / tunel_reshow_val;
			show3d = Math.sin(show3d*PI/2);
		}
		else
		{
			tunel_reshow_time = -1;
			show3d = show;
		}
	}
	show_cr = show;
	if (timeline_fx_time - credits_start_time < 2000)
	{
		show_cr = (timeline_fx_time - credits_start_time) / 2000;
	}

	rotate_3d_object(object_tunel);
	off = timeline_fx_time/1000;
	for (a = 0; a < object_tunel.vertex_num; a++)
	{
		object_tunel.point[a].rx += Math.sin(off+object_tunel.point[a].rz/20)*300;
		object_tunel.point[a].ry += Math.sin(off+object_tunel.point[a].rz/30)*400;
	}
	bounds_3d_object(object_tunel);
	transform_3d_object(object_tunel);

	paint_blob(object_tunel, img_blob, 1, 100+(hi_det ? 0 : 200));
	flat_render_func = tunel_triangle2;
	flat_3d_simple_cut(object_tunel, -50+(1-show3d)*-650+(hi_det ? 0 : -100), hi_det ? -700 : -400, color_orange, 0.5, -700);

	wire_hor = -100+(1-show3d)*-1200;
	paint_3d_wire_hor(object_tunel, 16+(hi_det ? 0 : 16), color_black, 0.5);

	xr = Math.floor(X_RES*show_cr);

	var tx = -1;
	sk = (hi_det ? 2 : 4);
	for (a = 0; a < xr; a += sk)
	{
		x = a;
		x += sin(400+a,6)+cos(2200-a, 10);
		ye = Y_RES-100;
		if (a > 100 && a < c_title_wid)
			ye = Y_RES-50;
		else
		if (a > c_obj_wid && a < 1280)
			ye -= (((a % 44)*x) % 16)*8;
		if (a == 100)
		{
			tx = x;
		}
		line(context, x, Y_RES-1, x, ye, color_808080, a/Y_RES, 1);
	}
	line_paint_buffer();


	var x, y;
	var shift = -600 + show3d*600;
	cn = hi_det ? 5 : 4;
	xs = Math.floor((show3d+0.1)*cn);
	ys = Math.floor((1-show3d)*cn);
	for (x = 0; x < xs; x++)
		for (y = ys; y < cn; y++)
		{
			v = puzzle[y*5+x];
			circle(context, 100+x*100, shift+100+y*100, 50, (v == puzzle[y*5+(x+1)%5] || v == puzzle[((y+1)%5)*5 + x])? color_0020FF : color_FF2000, 0.5);
			if (v) circle_fill(context, 100+x*100, shift+100+y*100, v, ((x+y)%8 == v>>1) ? color_red : color_808080, 0.5);
			if (v & 1)
				line(context, 100+x*100, shift+100+y*100, 100+(x+1)*100, shift+100+(y+1)*100, color_orange, 1, 1);
			else
			if (v & 2)
				line(context, 100+x*100, shift+100+y*100, 100+(x+1)*100, shift+100+(y-1)*100, color_orange, 1, 1);
			else
			if (v & 4)
				line(context, 100+x*100, shift+100+y*100, 100+(x-1)*100, shift+100+(y+1)*100, color_orange, 1, 1);
			else
			if (v & 8)
			{
				xx = sin(300+x*100+y*222, 20+x*20)+X_MID;
				triangle(context, 100+x*100+xx, shift+100+y*100, 100+(x-1)*100+xx, shift+100+(y-1)*100, 100+(x-1)*100+xx, shift+100+(y+1)*100, color_blue, 0.1);
			}
		}
		
	triangle_paint_buffer_gl();
	line_paint_buffer();

	a = rnd(25);
	puzzle[a] += (rnd(2) ? 1 : 14);
	puzzle[a] %= 16;
	
	flat_render_func = tunel_triangle;
	flat_3d_simple_cut(object_tunel, -100+(1-show3d)*-300+(hi_det ? 0 : -75), hi_det ? -400 : -350, color_black, 0.5, -700);

	if (tx == -1) tx = 100;
	put_ch = put_ch_full;
	sh = show_cr+0.25;
	if (sh > 1) sh = 1;
	print_at(context, tx + 10, Y_RES-100+(1-sh)*256, font6x6, c_title, color_red, 5, 0.25, 0);
	if (hi_det)
	{
		put_ch = put_ch_dot;
		triangle_paint_buffer_gl();
		print_at(context, tx + 10+2, Y_RES-100+2+(1-sh)*256, font6x6, c_title, color_white, 5, 1, 0);
	}

	obj_c.pos_x = obj_x;
	obj_c.pos_y = 203+(1-show_cr)*384;
	obj_c.pos_z = 100;
	obj_c.ang_x = 4*PI/2;
	obj_c.ang_y = 4*PI/2;
	obj_c.ang_z = PI;
	rotate_3d_object(obj_c);
	transform_3d_object(obj_c);
	bounds_3d_object(obj_c);
	flat_render_func = triangle;
	flat_3d_simple(obj_c, color_red, 0.5);
}

function tunel_reshow(param)
{
	tunel_reshow_time = timeline_fx_time;
	tunel_reshow_val = param;
}

var tunel_move_type = 0;

function tunel_movement(param)
{
	tunel_move_type = param;
}

function tunel_move(move)
{
	if (!tunel_move_type)
	{
		t = Math.floor(timeline_fx_time / 500);
		a = t;
		sh = data_camera[0]; shh = sh << 1;
		a %= data_camera[0];
		a++;
		b = a+1;
		thm = 500;
		c = (timeline_fx_time % thm)/thm;
		c *= 10;
	}
	else
	{
		t = Math.floor(timeline_fx_time / 2000);
		a = t;
		sh = data_camera[0]; shh = sh << 1;
		a %= data_camera[0];
		a++;
		b = a+1;
		thm = 2000;
		c = (timeline_fx_time % thm)/thm;
		c *= 20+tunel_flash_val*50;
	}

	object_wir.pos_z = object_tunel.pos_z = data_camera[a+shh] + (data_camera[b+shh] - data_camera[a+shh])*c;
	object_wir.pos_y = object_tunel.pos_y = data_camera[a+sh] + (data_camera[b+sh] - data_camera[a+sh])*c;
	object_wir.pos_x = object_tunel.pos_x = data_camera[a] + (data_camera[a] - data_camera[b])*c - sin(3000, 50);

	if (!tunel_move_type)
	{
		dx = data_camera[a] - data_camera[b];
		dy = data_camera[a+sh] - data_camera[b+sh];
		dz = data_camera[a+shh] - data_camera[b+shh];
		sr = Math.sqrt(dx*dx+dy*dy+dz*dz);
		object_wir.ang_x = object_tunel.ang_x = dx/sr;
		object_wir.ang_y = object_tunel.ang_y = dy/sr;
		object_wir.ang_z = object_tunel.ang_z = dz/sr;
	}
	else
	{
		object_tunel.ang_x = PI;
		object_tunel.ang_z = 0;
		object_tunel.ang_y = PI/4*tunel_flash_val;
	}
	return;
	
	object_tunel.ang_x = 0;
	object_tunel.ang_z = -PI/2;
	object_tunel.ang_y = PI;
}

function tunel_path_sync(param)
{
	tunel_path = param;
	switch(tunel_path)
	{
		case 0: data_camera = data_camera1; break;
		case 1: data_camera = data_camera2; break;
		case 2: data_camera = data_camera3; break;
	}
}

function tunel_flash_end()
{
	tunel_flash_val = 0;
}

var tunel_flash_type_val = 0;

function tunel_flash_type(param)
{
	tunel_flash_type_val = param;
}

function tunel_flash(time, dur)
{
	var a = time*8 / dur, aa;
	tunel_flash_val = time/dur;
	if (a > 4) a -= 4;

	var i1, i2, i3;
	switch (tunel_flash_type_val)
	{
		case 0:
			i1 = img_over1;
			i2 = img_over2;
			i3 = img_over3;
			break;
		case 1:
			i1 = img_overstr1;
			i2 = img_overstr2;
			i3 = img_overstr3;
			break;
		case 2:
			i1 = img_overgrt1;
			i2 = img_overgrt2;
			i3 = img_overstr3;
			break;
	}
	
	tr = 8+rnd(8);
	for (c = 0; c < tr; c++)
	{
		triangle(context, 0, Y_MID+cos(22+c,Y_MID-c), X_MID+rnd(256)-128, Y_MID+rnd(256)-128, X_RES, Y_MID+sin(320+c,Y_MID+a*2), color_white, c/tr/4);
	}
	triangle_paint_buffer_gl();
	
	
	var f = 1 - time/dur;
	var sh1 = rnd(32)-16; sh1 *= f;
	var sh2 = rnd(48)-24; sh2 *= f;
	var sh3 = rnd(64)-32; sh3 *= f;
	if (a < 2)
	{
		aa = a;
		if (aa > 1)
			aa = 2 - aa;
		image_set_draw(i1);
		image_draw(context, 0, sh1, X_RES, Y_RES, i1, aa);
	}
	if (a > 1 && a < 3)
	{
		aa = a-1;
		if (aa > 1)
			aa = 2 - aa;
		image_set_draw(i2);
		image_draw(context, 0, sh2, X_RES, Y_RES, i2, aa);
	}
	if (a > 2 && a < 4)
	{
		aa = a-2;
		if (aa > 1)
			aa = 2 - aa;
		image_set_draw(i3);
		image_draw(context, 0, sh3, X_RES, Y_RES, i3, aa);
	}
	image_end_draw();
}

//
// Satori
//

var satori_tick_time = -1, satori_tick_val;

function satori_triangle(context, x1, y1, x2, y2, x3, y3, col, alfa, id)
{
	triangle(context, x1, y1, x2, y2, x3, y3, col, alfa, id);
}

var ltpx, ltpy;
function line_triangle(context, x1, y1, x2, y2, x3, y3, col, alfa, id)
{
	var mx = (x1+x2+x3)/3, my = (y1+y2+y3)/3;
	x1 = mx + (x1 - mx)*alfa;
	y1 = my + (y1 - my)*alfa;
	x2 = mx + (x2 - mx)*alfa;
	y2 = my + (y2 - my)*alfa;
	x3 = mx + (x3 - mx)*alfa;
	y3 = my + (y3 - my)*alfa;
	
	al = (Math.abs(X_MID-mx)+Math.abs(Y_MID-my))/(X_RES*2)*alfa;
	al = Math.sqrt(al*al);
	if (al > 0.05) al += 0.2;
	
	line(context, x1, y1, x2, y2, col, al, LINE_2);
	line(context, x2, y2, x3, y3, col, al, LINE_2);
	line(context, x3, y3, x1, y1, col, al, LINE_2);

	
	alfa *= 0.4;
	x1 = mx + (x1 - mx)*alfa;
	y1 = my + (y1 - my)*alfa;
	x2 = mx + (x2 - mx)*alfa;
	y2 = my + (y2 - my)*alfa;
	x3 = mx + (x3 - mx)*alfa;
	y3 = my + (y3 - my)*alfa;
	triangle(context, x1, y1, x2, y2, x3, y3, color_F89934, alfa, id);

	if (id)
	{
		lx = (mx+ltpx)/2;
		ly = (my+ltpy)/2;
		lx = Math.abs(X_MID-lx);
		ly = Math.abs(Y_MID-ly);
		al = (lx+ly)/(2*X_MID);

		if (al > 0.25)
			line(context, ltpx, ltpy, mx, my, color_red, al-0.25, LINE_2);
	}
	ltpx = mx;
	ltpy = my;
}


function line_triangle2(context, x1, y1, x2, y2, x3, y3, col, alfa, id)
{
	var mx = (x1+x2+x3)/3, my = (y1+y2+y3)/3;
	
	alfa *= 0.4;
	x1 = mx - (x1 + mx)*alfa*((id+Math.floor(mx)) & 0xff)/256;
	y1 = my - (y1 + my)*alfa*((id+Math.floor(my)) & 0xff)/256;
	x2 = mx - (x2 + mx)*alfa;
	y2 = my - (y2 + my)*alfa;
	x3 = mx - (x3 + mx)*alfa;
	y3 = my - (y3 + my)*alfa;
	x1 += X_MID * 0.7;
	x2 += X_MID * 0.7;
	x3 += X_MID * 0.7;
	y1 += Y_MID * 0.75;
	y2 += Y_MID * 0.75;
	y3 += Y_MID * 0.75;
	triangle(context, x1, y1, x2, y2, x3, y3, color_white, alfa, id);
}

function satori_lievik_flat(context, x1, y1, x2, y2, x3, y3, col, alfa, id)
{
	if (id < 64)
	{
		triangle(context, x1, y1, x2, y2, x3, y3, color_808080, alfa, id);
		if (alfa > 0) circle(context, x1, y1, alfa*32, color_orange, alfa);
	}
	else
	if (id < 128)
	{
		triangle(context, x1, y1, x2, y2, x3, y3, color_A0A0A0, alfa, id);
		if (alfa > 0) circle_fill(context, x1, y1, alfa*16, color_red, alfa/3);
	}
	else
	if (id < 256)
	{
		triangle(context, x1, y1, x2, y2, x3, y3, color_404040, alfa, id);
		if (alfa > 0)
			circle(context, x1, y1, alfa*16, color_white, alfa);
	}
	else
		triangle(context, x1, y1, x2, y2, x3, y3, color_604020, alfa, id);
}

function satori_paint()
{	
	clear_canvas(color_background, 0.9);

	if (timefx_less(1000))
	{
		show = timeline_fx_time / 1000;
	}
	else
		show = 1;
	
	rotate_3d_object(object_satori);
	transform_3d_object(object_satori);
	bounds_3d_object(object_satori);
	
	rotate_3d_object(object_lievik);
	transform_3d_object(object_lievik);
	bounds_3d_object(object_lievik);
	flat_render_func = satori_lievik_flat;
	if (!hi_det) flat_hor_start = -100;
	flat_3d_simple(object_lievik, color_808080, 0.5);
	flat_hor_start = 0;
	line_paint_buffer();
	paint_blob(object_lievik, img_blob, 1, 1+(hi_det ? 0 : 8));

	flat_render_func = satori_triangle;
	flat_3d_simple(object_satori, color_FFC32D, 0.5);

	flat_render_func = line_triangle;
	if (!hi_det) flat_hor_start = -35;
	flat_3d_simple(object_satori, color_black, 1);
	flat_hor_start = 0;
	line_paint_buffer();


	flat_render_func = line_triangle2;
	if (!hi_det) flat_hor_start = -50;
	flat_3d_simple(object_satori, color_black, 1);
	flat_hor_start = 0;

	var sy = 200+(1-show)*200;
	ae = Math.floor((X_RES-200)*show);
	sk = (hi_det ? 2 : 4);
	for (a = 200; a < ae; a += sk)
	{
		x = a;
		x += sin(400+a,6)+cos(1200-a, 10);
		line(context, x, Y_MID+sy-rnd(32), x, Y_MID+sy+50+rnd(32), satori_tick_time == -1 ? color_orange : color_black, a/Y_RES, 1);
	}
	line_paint_buffer();


	object_tsatori.pos_x = 0;
	object_tsatori.pos_y = 200+(1-show)*200;
	object_tsatori.pos_z = 100;
	object_tsatori.ang_x = 4*PI/2;
	object_tsatori.ang_y = 4*PI/2;
	object_tsatori.ang_z = PI;
	rotate_3d_object(object_tsatori);
	transform_3d_object(object_tsatori);
	bounds_3d_object(object_tsatori);
	flat_render_func = triangle;
	flat_3d_simple(object_tsatori, color_red, 0.5);

	sy = 200;
	sx = (1-show)*400;
	put_ch = put_ch_full;
	print_at(context, 32-sx, Y_MID+sy+100, font6x6, "2014", color_red, 5, 0.25, 0);
	if (hi_det)
	{
		put_ch = put_ch_dot;
		print_at(context, 32-sx+2, Y_MID+sy+100+2, font6x6, "2014", color_white, 5, 1, 0);
		triangle_paint_buffer_gl();
	}
	
	if (hi_det && timefx_less(250))
	{
		v = Math.floor( (timeline_fx_time*512)/250 );
		b = 255 - (v >> 1);

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
				rect(xx, yy, w, h, color_orange, m/255);		
			}
		triangle_paint_buffer_gl();
	}
}

function satori_tick(param)
{
	satori_tick_time = timeline_fx_time;
	satori_tick_val = param;
}

function satori_move()
{
	za = 0;
	if (satori_tick_time != -1)
	{
		if (timeline_fx_time - satori_tick_time < satori_tick_val)
		{
			za = timeline_fx_time - satori_tick_time;
			za = 1-(Math.floor(za/150)*150)/satori_tick_val;
			za *= 30;
		}
		else
			satori_tick_time = -1;
	}
	
	object_satori.pos_x = 0;
	object_satori.pos_y = 0;
	object_satori.pos_z = 60-za;
	object_satori.ang_x = 4*PI/2+sin(4000, PI/8);
	object_satori.ang_y = 4*PI/2+cos(6000, PI/8);
	object_satori.ang_z = PI+timeline_fx_time/2000;

	object_lievik.pos_x = 0;
	object_lievik.pos_y = 0;
	object_lievik.pos_z = 100-za*20;
	object_lievik.ang_x = PI/2+sin(10000, PI/8);
	object_lievik.ang_y = 4*PI/2-cos(12000, PI/16);
	object_lievik.ang_z = PI-timeline_fx_time/4444;
}

// greets

function grt_obj(n)
{
	switch(n)
	{
		case 0: return object_asd;
		case 1: return object_flt;
		case 2: return object_farb;
		case 3: return object_kwl;
		case 4: return object_elude;
		case 5: return object_outracks;
		default: return object_kwl;
	}
}

function greets_paint()
{	
	clear_canvas(color_background, 0.9);
	
	o = Math.floor(timeline_fx_time / 1200);
	ds = timeline_fx_time % 1200;
	var al = 1;
	if (ds < 500)
		al = ds/500;
	else
	if (ds > 1000)
		al = 1-(ds-1000)/200;
	
	obj = grt_obj(o);

	rotate_3d_object(obj);
	transform_3d_object(obj);
	bounds_3d_object(obj);
	
	
	
	rotate_3d_object(object_lievik);
	transform_3d_object(object_lievik);
	bounds_3d_object(object_lievik);
	flat_render_func = satori_lievik_flat;
	if (!hi_det) flat_hor_start = -100;
	flat_3d_simple(object_lievik, color_808080, 0.5);
	flat_hor_start = 0;
	line_paint_buffer();
	paint_blob(object_lievik, img_blob, 1, 1+(hi_det ? 0 : 8));

	flat_render_func = satori_triangle;
	if (!hi_det) flat_hor_start = -2;
	flat_3d_simple(obj, color_FFC32D, 0.5*al);
	flat_hor_start = 0;

	flat_render_func = line_triangle;
	flat_3d_simple(obj, color_black, 1*al);
	line_paint_buffer();

	show = 0;
	if (timeline_fx_time < 1000)
	{
		show = 1 - timeline_fx_time/1000;
	}

	put_ch = put_ch_full;
	print_at(context, 32-show*200, Y_MID+300, font6x6, "GREETS", color_red, 5, 0.25, 0);
	if (hi_det)
	{
		put_ch = put_ch_dot;
		print_at(context, 32-(show*200)+2, Y_MID+300+2, font6x6, "GREETS", color_white, 5, 1, 0);
		triangle_paint_buffer_gl();
	}

	if (hi_det && timefx_less(250))
	{
		v = Math.floor( (timeline_fx_time*512)/250 );
		b = 255 - (v >> 1);

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
				rect(xx, yy, w, h, color_orange, m/255);
			}
		triangle_paint_buffer_gl();
	}
}

function greets_move()
{	
	o = Math.floor(timeline_fx_time / 1200);
	ds = timeline_fx_time % 1200;
	obj = grt_obj(o);
	
	obj.pos_x = 0;
	obj.pos_y = 0;
	obj.pos_z = 60-ds/50;//-za;
	obj.ang_x = 4*PI/2+sin(4000, PI/16);
	obj.ang_y = 4*PI/2+cos(6000, PI/16);
	obj.ang_z = PI;
	
	if (o == 3)
		obj.pos_y += 50;
	else
	if (o == 5)
		obj.pos_x += 20;

	object_lievik.pos_x = 0;
	object_lievik.pos_y = 0;
	object_lievik.pos_z = 100;
	object_lievik.ang_x = PI/2+sin(10000, PI/8);
	object_lievik.ang_y = 4*PI/2-cos(12000, PI/16);
	object_lievik.ang_z = PI-timeline_fx_time/4444;
}

// one world

var world_ang_x = 0;
var world_ang_y = 0;
var world_ang_z = 0;
var world_line_paint = 0;
var world_pos_z = 310;

var world_flash_val = 0;
var world_end_time = -1;
var world_reshow_time = -1;

function world_reshow(param)
{
	world_reshow_time = timeline_fx_time;
}

function world_flash(time, dur)
{
	world_flash_val = 1 - time/dur;
}

function world_flash_end()
{
	world_flash_val = 0;
}

function world_end(time, dur)
{
	world_end_time = timeline_fx_time;
}

function paint_world(obj, time, range)
{
	var p = 0;

	if (timeline_fx_time < 3000)
	{
		if (timeline_fx_time > 2500)
			al = 1 - ((timeline_fx_time - 2500) / 500);
		else
			al = 1;
		rotate_3d_object(object_lievik);
		transform_3d_object(object_lievik);
		bounds_3d_object(object_lievik);
		flat_render_func = satori_lievik_flat;
		if (!hi_det) flat_hor_start = -100;
		flat_3d_simple(object_lievik, color_808080, 0.5*al);
		flat_hor_start = 0;
		line_paint_buffer();
		paint_blob(object_lievik, img_blob, 1*al, 1 + (hi_det ? 0 : 8));
		
	}
//
	all = obj.world[p++];
	world_line_paint %= all;

	lon_ = lon__ = lat_ = lat__ = 0;

	var laa, al;
	var sk = 0;
	var mx = 0, my = 0, mxp = X_MID, myp = Y_MID;
	var mz = 0;
	var pos = new Array();
	var upd = 0;
	var rnd_v = Math.floor((1 - world_flash_val) * 32);
	var flash = 1;
	if (world_flash_val != 0)
		flash = (1 - world_flash_val*0.85);
	var lang_add = 0;
	if (timeline_fx_time > 30000)
	{
		t = timeline_fx_time - 30000;
			lang_add= Math.cos(t/6000)*t/(77-t/350);
	}
	
	radi = new Array(32);
	ttt = (timeline_fx_time - world_end_time)/333;
	for (i = 0; i < 32; i++)
	{
		radi[i] = 0;
		if (world_flash_val != 0)
			radi[i] += Math.sin(world_flash_val*10*i)*world_flash_val*23
		if (world_end_time != -1)
		{
			radi[i] += i*ttt;
		}
	}

	if (world_flash_val != 0)
	{
		if (world_flash_val > 0.3 && world_flash_val < 0.7)
		{
			r = color_world.r + (0 - color_world.r)*world_flash_val;
			g = color_world.g + (100 - color_world.g)*world_flash_val;
			b = color_world.b + (200 - color_world.b)*world_flash_val;
		}
		else
		{
			r = color_world.r + (255 - color_world.r)*world_flash_val;
			g = color_world.g + (255 - color_world.g)*world_flash_val;
			b = color_world.b + (255 - color_world.b)*world_flash_val;
		}
		
		col = new RGB(Math.floor(r), Math.floor(g), Math.floor(b));
	}
	else
		col = color_world;

	if (world_reshow_time != -1)
	{
		t = timeline_fx_time - world_reshow_time;
		if (t < 1000)
		{
			all = Math.floor(all*t/1000);
		}
		else
			world_reshow_time = -1;
	}
		
	for (i = 0; i < all; i++)
	{
		lines = obj.world[p++];
		roo = 0;
		roo2 = 0;
		if (timeline_fx_time > 16000)
		{
			t = timeline_fx_time - 16000;
			t /= 1000; if (t > 15) t = 15;
			roo = sin((i & 0x1f)*100+1000,t);
			roo2 = cos((i & 0x1f)*100+1000,t);
		}		
		
		for (ii = pp = 0; ii < lines; ii++)
		{
			lon_ = roo+obj.world[p++];
			lat_ = roo2+obj.world[p++];
			
			
			rad = 300;
			rad += radi[i & 0x1f];
			if (timeline_fx_time > 10000)
			{
				t = timeline_fx_time - 10000;
				lat_ -= t / 100;
			}

			lang = 180;
			if (timeline_fx_time > 30000)
				lang += lang_add;

			lon_ang = (lon_/lang)*PI;
			lat_ang = (lat_/lang)*PI;
			gx = Math.cos(lon_ang)*Math.cos(lat_ang)*rad;
			gz = Math.sin(lon_ang)*Math.cos(lat_ang)*rad;
			gy = -Math.sin((lat_/180)*PI)*rad;

			cos_angx = Math.cos(world_ang_x);
			sin_angx = Math.sin(world_ang_x);
						
			cos_angy = Math.cos(world_ang_y);
			sin_angy = Math.sin(world_ang_y);

			cos_angz = Math.cos(world_ang_z);
			sin_angz = Math.sin(world_ang_z);

			xy = ((gy) * cos_angx) - ((gz) * sin_angx);
			xz = ((gy) * sin_angx) + ((gz) * cos_angx);
			rz = (xz * cos_angy) - ((gx) * sin_angy);
			yx = (xz * sin_angy) + ((gx) * cos_angy);
			rx = (yx * cos_angz) - (xy * sin_angz);
			ry = (yx * sin_angz) + (xy * cos_angz);

			rz += world_pos_z;
						
			lon_ = X_MID+(256*rx)/rz;
			lat_ = Y_MID+(256*ry)/rz;

			if (Math.abs(lon_ - lon__) > range && Math.abs(lat_ - lat__) > range && rz > 0)
			{
				mx += lon_; mx /= 2;
				my += lat_; my /= 2;
				mz += rz; mz /= 2;

					
					laa =  1-rz/700;
					if (laa < 0) laa = 0;
						
						
				if (!sk && pp > 0)
				{
						line(context, lon__, lat__, lon_, lat_, col, laa, 1);
				}
					
				lon__ = lon_; lat__ = lat_; pp++;
			}
		}
					
		if (i > world_line_paint && i <= world_line_paint + 64 || (world_flash_val != 0 && rnd(rnd_v) == 1))
		{
			pos.push(mx, my, mz);
			al = i - world_line_paint;
			if (al < 64)
				al /= 64;
			else
				al = 1 - (al - 64)/64;
			al *= (0.5+Math.sin(timeline_fx_time/200)*0.5);
			if ((i & 3) == 1)
				line(context, mx+1, my-1, mxp-1, myp+1, color_white, 0.23, 1);
			if ((i & 7) == 1)
				line(context, mx-1, my+1, mxp+1, myp-1, color_orange, 0.15, 1);
			line(context, mx, my, mxp, myp, color_red, 0.15, 1);
		}
		mxp += mx; myp += my;
		mxp /= 2; myp /= 2;
	}
	line_paint_buffer();

	if (timeline_fx_time > 2000)
	{
		al = timeline_fx_time - 2000;
		al /= 2000;
		if (al > 1) al = 1;
		
		
		image_set_draw(img_r);
		c = pos.length;

		for (a = 0; a < c; a += 3)
		{
			z = 32-pos[a+2]/50;
			zz = 32-pos[a+2]/20;
			if (zz > 0)
				image_draw(context, pos[a], pos[a+1], zz, zz, img_r, al-pos[a+2]/1000);
		}
		image_end_draw();
	}
	pos.length = 0;
	radi.length = 0;
}


function world_paint()
{
	clear_canvas(color_background, 0.9);

	set_whole_world(object_world);

	if (timeline_fx_time > 2000)
	{
		al = timeline_fx_time - 2000;
		al /= 2000;
		if (al > 1) al = 1;
		image_set_draw(img_wbg);
		image_draw(context, X_MID-512, Y_MID-512, 1024, 1024, img_wbg, 0.75*al);
		image_end_draw();
	}
	
	det = 0;
	if (timeline_fx_time < 2000)
		det = 1 - (timeline_fx_time / 2000);

	paint_world(object_world, time, 2+(hi_det ? 0 : 2));
	
	if (timeline_fx_time > 16000 && timeline_fx_time < 32000)
	{
		al = 1;
		if (timeline_fx_time > 30000)
		{
			al = timeline_fx_time - 30000;
			al /= 2000;
			al = 1-al;
		}

		str = string_sequence(string_tucker, timeline_fx_time-16000, 50);
		put_ch = put_ch_full;
		print_at(context, 55, Y_RES-100, font6x6, str, color_404040, 3, 0.5*al, 0);
		triangle_paint_buffer_gl();
		if (hi_det)
		{
			put_ch = put_ch_dot;
			print_at(context, 55+1, Y_RES-100+1, font6x6, str, color_white, 3, 1*al, 0);
		}
		
	}
	
	if (timeline_fx_time > 33000)
	{
		a = (world_flash_val != 0 || timeline_fx_time > 39000) ? 1 : 0 || (timeline_fx_time > 37000 ? rnd(3) == 1 : rnd(4) == 1);
		str = string_sequence(a ? "the future is decentralized" : "the future is bright", timeline_fx_time-33000, 150);
		put_ch = put_ch_full;
		print_at(context, X_MID-235, Y_MID-16, font6x6, str, color_404040, 3, 0.5*al, 0);
		triangle_paint_buffer_gl();
		if (hi_det)
		{
			put_ch = put_ch_dot;
			print_at(context, X_MID-235+1, Y_MID-16+1, font6x6, str, color_white, 3, 1*al, 0);
		}

	}
}

function world_move(move)
{
	world_ang_x += 0.00015*move;
	world_ang_y += 0.00015*move;
	world_ang_z += 0.00015*move;
	world_line_paint += move + move*world_flash_val;
	if (timeline_fx_time < 3000)
	{
		world_pos_z = 310 + (1-Math.sin(PI/2*(timeline_fx_time/3000)))*800;
	}
	else
	if (timeline_fx_time < 7000)
	{
		pos = (timeline_fx_time - 3000) / 4000;
		world_pos_z = 310 + pos*15;
	}
	else
		world_pos_z = 325;
		
	if (timeline_fx_time < 3000)
	{
		pos = timeline_fx_time / 3000;
		object_lievik.pos_x = 0;
		object_lievik.pos_y = 0;
		object_lievik.pos_z = 100-pos*3500;
		object_lievik.ang_x = PI/2+sin(10000, PI/8);
		object_lievik.ang_y = 4*PI/2-cos(12000, PI/16);
		object_lievik.ang_z = PI-timeline_fx_time/4444;
	}
}

// splash

function splash_paint()
{
	clear_canvas(color_black, 1);
	
	if (timeline_fx_time > 1000)
	{
		image_set_draw(img_splash);
		image_draw(context, 0, 0, X_RES, Y_RES, img_splash, 1);
		image_end_draw();
	}
}

function splash_move(move)
{
}