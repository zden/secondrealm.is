//
// Copyright (c) 2014 Zden Hlinka ( Satori, s.r.o. ) - zden@satori.sk - Zd3N.com - satori.sk
// GNU GPL license
//

var NETWORK_BROS = 8;
var NETWORK_ITEMS = 384;


var NETWORK_TRIPPERS = 18;
var NETWORK_MORPH_TIME = 2000;

var network_type = 0;

var network_medusa_on = 0;
var network_medusa_start_time = 0;
var network_kula_on = 0;
var network_kula_start_time = 0;
var network_end_on = 0;
var network_end_morph_on = 0;
var network_end_morph_start_time = 0;
var network_end_morph_level;
var network_trip_morph_level = 0;
var network_trip_morph_on = 0;
var network_trip_morph_start_time = 0;
var network_poly_rnd = 0;
var network_demo_title_time = -1;

function create_network_point(x1,y1,z1, x2, y2, z2)
{
	this.x = this.y = this.z = 0;
	this.x1 = x1;
	this.y1 = y1;
	this.z1 = z1;
	this.x2 = x2;
	this.y2 = y2;
	this.z2 = z2;
	this.rx = this.ry = this.rz = this.xt = this.yt = 0;
	this.bro1 = Array(NETWORK_BROS);
	this.bro1_dist = Array(NETWORK_BROS);
	this.bro2 = Array(NETWORK_BROS);
	this.bro2_dist = Array(NETWORK_BROS);
}

function create_network_dist()
{
	this.i = this.dist = 0;
}

function create_network_trip()
{
	this.start = this.end = this.pos = this.x = this.y = this.z = 0;
}

function create_network(items)
{
	this.count = items;
	this.point = new Array(items);
	this.dist = new Array(items);
	for (a = 0; a < items; a++)
	{
		this.point[a] = new create_network_point(-500+Math.random()*1000, -500+rnd(1000), -512 + Math.random()*1000, -500+Math.random()*1000, -500+rnd(1000), -512 + Math.random()*1000);
		this.dist[a] = new create_network_dist();
	}
	this.zoom = 128;
	this.pos_x = 0;
	this.pos_y = 0;
	this.pos_z = 0;
	this.ang_x = this.ang_y = this.ang_z = 0;
	this.trip = new Array(NETWORK_TRIPPERS);
	for (a = 0;  a < NETWORK_TRIPPERS; a++)
		this.trip[a] = new create_network_trip();
}

function network_trippers(net)
{
	for (a = 0; a < NETWORK_TRIPPERS; a++)
	{
		net.trip[a].start = rnd(NETWORK_ITEMS-1);
		net.trip[a].end = net.point[net.trip[a].start].bro1[rnd(NETWORK_BROS-1)];
	}
}

function network_brothers(net)
{
	for (a = 0; a < net.count; a++)
	{
		var x, y, z;

		for (aa = 0; aa < NETWORK_ITEMS; aa++)
		{
			net.dist[aa].i = aa;
			x = net.point[aa].x1 - net.point[a].x1;
			y = net.point[aa].y1 - net.point[a].y1;
			z = net.point[aa].z1 - net.point[a].z1;
			net.dist[aa].dist = Math.sqrt(x*x + y*y + z*z);
		}
		net.dist.sort(function(a,b){return a.dist - b.dist});

		for (b = 0; b < NETWORK_BROS; b++)
		{
			net.point[a].bro1[b] = net.dist[b+1].i;
			net.point[a].bro1_dist[b] = net.dist[b+1].dist;
		}
// -----------
		for (aa = 0; aa < NETWORK_ITEMS; aa++)
		{
			net.dist[aa].i = aa;
			x = net.point[aa].x2 - net.point[a].x2;
			y = net.point[aa].y2 - net.point[a].y2;
			z = net.point[aa].z2 - net.point[a].z2;
			net.dist[aa].dist = Math.sqrt(x*x + y*y + z*z);
		}
		net.dist.sort(function(a,b){return a.dist - b.dist});

		for (b = 0; b < NETWORK_BROS; b++)
		{
			net.point[a].bro2[b] = net.dist[b+1].i;
			net.point[a].bro2_dist[b] = net.dist[b+1].dist;
		}
	}
}

function network_rotate(net)
{
	var tx, ty, tz;
	
	var mid_x = canvas.width/2;
	var mid_y = canvas.height/2;

	for (a = 0; a < net.count; a++)
	{
		if (network_end_morph_on)
		{
			dist = Math.sqrt(net.point[a].x1*net.point[a].x1 + net.point[a].y1*net.point[a].y1 + net.point[a].z1*net.point[a].z1);
			dif = dist - 300;
			dif *= network_end_morph_level; //(timeline_fx_time * dif) / 10000;
			net.point[a].x = net.point[a].x1 - dif*(net.point[a].x1/dist);
			net.point[a].y = net.point[a].y1 - dif*(net.point[a].y1/dist);
			net.point[a].z = net.point[a].z1 - dif*(net.point[a].z1/dist);
		}
		else
		if (network_medusa_on)
		{
			net.point[a].x = net.point[a].x2;
			net.point[a].y = net.point[a].y2;
			net.point[a].z = net.point[a].z2;
		}
		else
		if (!network_type)
		{
			var cf = ((timeline_fx_time % NETWORK_MORPH_TIME)/NETWORK_MORPH_TIME);
			var r = Math.floor(timeline_fx_time / NETWORK_MORPH_TIME);
			if (!(r & 1))
				cf = Math.cos(3.1415926*2*cf)*0.5+0.5;
			net.point[a].x = net.point[a].x1 + (net.point[a].x1 - net.point[a].x2) * cf;//(0.5+cos(4000,0.5));
			net.point[a].y = net.point[a].y1 + (net.point[a].y1 - net.point[a].y2)*cf; //(0.5+cos(4000,0.5));
			net.point[a].z = net.point[a].z1 + (net.point[a].x1 - net.point[a].z2)*cf;//(0.5+cos(4000,0.5));
		}
		else
		{
			net.point[a].x = net.point[a].x1;
			net.point[a].y = net.point[a].y1;
			net.point[a].z = net.point[a].z1;
		}
		
		//--> rotate around y-axis

		tx = ((net.point[a].x) * Math.cos(net.ang_y)) - ((net.point[a].z) * Math.sin(net.ang_y));
		tz = ((net.point[a].x) * Math.sin(net.ang_y)) + ((net.point[a].z) * Math.cos(net.ang_y));

		//--> rotate around x-axis
		net.point[a].rz = (tz * Math.cos(net.ang_x)) - ((net.point[a].y) * Math.sin(net.ang_x));
		ty = (tz * Math.sin(net.ang_x)) + ((net.point[a].y) * Math.cos(net.ang_x));

		//--> rotate around z-axis
		net.point[a].rx = (tx * Math.cos(net.ang_z)) + (ty * Math.sin(net.ang_z));
		net.point[a].ry = (ty * Math.cos(net.ang_z)) - (tx * Math.sin(net.ang_z));

		net.point[a].rx += net.pos_x;
		net.point[a].ry += net.pos_y;
		net.point[a].rz -= net.pos_z;

		net.point[a].xt = mid_x + (net.zoom * net.point[a].rx) / net.point[a].rz;
		net.point[a].yt = mid_y - (net.zoom * net.point[a].ry) / net.point[a].rz;
	}

}

network = new create_network(NETWORK_ITEMS);
network_brothers(network);
network_trippers(network);

// -------------------------------------------------------------------------------------
// -------------------------------------------------------------------------------------

function network_paint()
{
	ca = get_alfa_timed(10000)*0.9;
	clear_canvas(color_background, ca);

	if (network_end_morph_on)
	{
			t = time - network_end_morph_start_time;
			if (t < 5000)
				network_end_morph_level = t/5000;
			else
				network_end_morph_level = 1;
	}

	if (network_medusa_on)
	{
		network_paint3();
		return;
	}
	if (network_type)
	{
		network_paint2();
		return;
	}

	network_rotate(network);

	ex = 0;
	tr = NETWORK_TRIPPERS;

	if (timefx_less(10000))
		nc = (network.count * timeline_fx_time) / 10000;
	else
	{
		tt = timeline_fx_time;
		tt %= NETWORK_MORPH_TIME;
		nc = network.count - (tt * network.count)/NETWORK_MORPH_TIME/1.2;
		nc = Math.floor(nc);
		
		ex = 1;
		
		tr = timeline_fx_time;
		tr %= (NETWORK_MORPH_TIME*2);
		tr = (tr * NETWORK_TRIPPERS) / (NETWORK_MORPH_TIME*2);
		tr = Math.floor(tr);
	}
	
	if (!hi_det)
		nc >>= 1;

//		

	if (ex && nc < network.count/2)
	{
		rotate_3d_object(object_wir);
	
		bounds_3d_object(object_wir);
		medusa_deform(object_wir);
		transform_3d_object(object_wir);
		//flat_render_func = triangle;
		tc = object_wir.face_num;
		object_wir.face_num = object_wir.face_num - Math.floor((tc * tr)/NETWORK_TRIPPERS);
		if (!hi_det)
			object_wir.face_num -= 500;
		if (object_wir.face_num < 0) object_wir.face_num = 0;
		if (hi_det)
		flat_render_func = function fff(context, x1, y1, x2, y2, x3, y3, col, alfa, id)
									{
										if (id & 0x8)
											triangle_pattern(context, x1, y1, x2, y2, x3, y3, color_pattern, alfa);
										else
											triangle(context, x1, y1, x2, y2, x3, y3, /*id & 0x8 ? pattern_chess : */ id & 0x4 ? color_FFA000 : col, alfa);
									};
		else
			flat_render_func = triangle;

		
		flat_3d_simple(object_wir, color_red, 0.4);
		object_wir.face_num = tc;

	}

	image_set_draw(img_);
	aldiv = 1000;
	if (!hi_det) aldiv = 1500;
	for (a = 0; a < nc; a++)
	{
		if (network.point[a].rz > 0)
		{
			z = 32 + 200-network.point[a].rz/5;
			al = 0.25 - (z / aldiv);
			if (al < 0) al = 0;
			if (z > 0)
			{
				image_draw(context, network.point[a].xt-z/2, network.point[a].yt-z/2, z, z, img_, al);
			}
		}
		if (!hi_det) a += 3;
	}
	image_end_draw();


	for (a = 0; a < nc; a+=2)
	{
		b1 = network.point[a].bro2[0];
		b2 = network.point[a].bro2[1];
		b3 = network.point[a].bro2[3];
		if (network.point[a].rz > 0 && network.point[b1].rz > 0 && network.point[b2].rz > 0)
			triangle(context, network.point[a].xt, network.point[a].yt, network.point[b1].xt, network.point[b1].yt,network.point[b2].xt, network.point[b2].yt, color_000080, 0.05);

		if (network.point[a].rz > 0 && network.point[b1].rz > 0 && network.point[b3].rz > 0)
			triangle(context, network.point[a].xt, network.point[a].yt, network.point[b1].xt, network.point[b1].yt,network.point[b3].xt, network.point[b3].yt, color_20A0FF, 0.1);

		if (network.point[b1].rz > 0 && network.point[b2].rz > 0 && network.point[b3].rz > 0)
			triangle(context, network.point[b1].xt, network.point[b1].yt, network.point[b2].xt, network.point[b2].yt,network.point[b3].xt, network.point[b3].yt, color_FF8000, 0.05);

		if (network.point[a].rz > 0 && network.point[b2].rz > 0 && network.point[b3].rz > 0)
			triangle(context, network.point[a].xt, network.point[a].yt, network.point[b2].xt, network.point[b2].yt,network.point[b3].xt, network.point[b3].yt, color_blue, 0.01);
		if (!hi_det) a += 2;
	}
	triangle_paint_buffer_gl();

// ________
// ________		
	for (a = 0; a < nc; a+=2)
	{
		b1 = network.point[a].bro1[0];
		b2 = network.point[a].bro1[1];
		b3 = network.point[a].bro1[3];
		if (network.point[a].rz > 0 && network.point[b1].rz > 0 && network.point[b2].rz > 0)
			triangle(context, network.point[a].xt, network.point[a].yt, network.point[b1].xt, network.point[b1].yt,network.point[b2].xt, network.point[b2].yt, color_800000, 0.1);

		if (network.point[a].rz > 0 && network.point[b1].rz > 0 && network.point[b3].rz > 0)
			triangle(context, network.point[a].xt, network.point[a].yt, network.point[b1].xt, network.point[b1].yt,network.point[b3].xt, network.point[b3].yt, color_FFA000, 0.2);

		if (network.point[b1].rz > 0 && network.point[b2].rz > 0 && network.point[b3].rz > 0)
			triangle(context, network.point[b1].xt, network.point[b1].yt, network.point[b2].xt, network.point[b2].yt,network.point[b3].xt, network.point[b3].yt, color_FF8000, 0.1);

		if (network.point[a].rz > 0 && network.point[b2].rz > 0 && network.point[b3].rz > 0)
			triangle(context, network.point[a].xt, network.point[a].yt, network.point[b2].xt, network.point[b2].yt,network.point[b3].xt, network.point[b3].yt, color_blue, 0.1);
			
		if (!hi_det) a += 2;
	}
	triangle_paint_buffer_gl();


// trippers
	if (timefx_more(5000) && timefx_less(15000))
		tral = (timeline_fx_time - 5000) / 10000;
	else
	if (timefx_less(5000))
		tral = 0;
	else
		tral = 1;

	image_set_draw(img_r);
	for (a = 0; a < tr; a++)
	{
		d = network.trip[a].pos;
		s = network.trip[a].start;
		e = network.trip[a].end;
		network.trip[a].x = network.point[s].xt + (network.point[e].xt - network.point[s].xt) * d;
		network.trip[a].y = network.point[s].yt + (network.point[e].yt - network.point[s].yt) * d;
		network.trip[a].z = network.point[s].rz + (network.point[e].rz - network.point[s].rz) * d;
		
		if (network.trip[a].z > 0)
		{
			image_draw(context, network.trip[a].x-16, network.trip[a].y-16, 32, 32, img_r, tral);
		}
	}
	image_end_draw();
	network.trip.sort(function(a,b){return a.y - b.y});
	for (a = 0; a < tr - 1; a++)
	{
		line(context, network.trip[a].x, network.trip[a].y, network.trip[a+1].x, network.trip[a+1].y, color_000080, 0.5*tral, LINE_2);
	}
	line_paint_buffer();

	for (a = 0; a < tr; a += 3)
	{
		triangle_pattern2(context, network.trip[a].x, network.trip[a].y, network.trip[a+1].x, network.trip[a+1].y, network.trip[a+2].x, network.trip[a+2].y, color_000080, 0.35*tral);
	}
	triangle_paint_buffer_gl();

	network.trip.sort(function(a,b){return a.x - b.x});
	for (a = 0; a < tr - 1; a++)
	{
		line(context, network.trip[a].x, network.trip[a].y, network.trip[a+1].x, network.trip[a+1].y, color_000080, 0.5*tral, LINE_2);
	}
	line_paint_buffer();
	
	for (a = 0; a < tr; a += 3)
	{
		triangle_pattern2(context, network.trip[a].x, network.trip[a].y, network.trip[a+1].x, network.trip[a+1].y, network.trip[a+2].x, network.trip[a+2].y, color_000080, 0.35*tral);
	}
	triangle_paint_buffer_gl();

// ---------------------

	var cf = ((timeline_fx_time % NETWORK_MORPH_TIME)/NETWORK_MORPH_TIME);

	for (a = 0; a < nc; a+=2)
	{
		for (c = 0; c < NETWORK_BROS; c++)
		{
			b = network.point[a].bro1[c];
			if (a == b) continue;
			if (network.point[a].rz > 0 && network.point[b].rz > 0)
			{
				z = (network.point[a].rz + network.point[b].rz);
				if (z > 255) z = 255; z = 255 - z;

				al1 = network.point[a].z/1024;
				if (al1 < 0) al1 *= -1;
				_x1 = network.point[a].xt;
				_y1 = network.point[a].yt;
				_x2 = network.point[b].xt;
				_y2 = network.point[b].yt;
				line(context, network.point[a].xt+1, network.point[a].yt+1, network.point[b].xt+1, network.point[b].yt+1, color_8000A0, al1*0.25, 1.5);

				b = network.point[a].bro2[c];
				if (a == b) continue;
				if (network.point[a].rz > 0 && network.point[b].rz > 0)
				{
					z = (network.point[a].rz + network.point[b].rz);
					if (z > 255) z = 255; z = 255 - z;

					al2 = network.point[a].z/1024;
					if (al2 < 0) al2 *= -1;
					__x1 = network.point[a].xt;
					__y1 = network.point[a].yt;
					__x2 = network.point[b].xt;
					__y2 = network.point[b].yt;
					
					x1 = _x1 + (__x1 - _x1)*cf;
					y1 = _y1 + (__y1 - _y1)*cf;
					x2 = _x2 + (__x2 - _x2)*cf;
					y2 = _y2 + (__y2 - _y2)*cf;
					
					line(context, x1, y1, x2, y2, color_BFBFBF, (al1 + (al2 - al1)*cf)*0.5, 1.5);
				}
			
			}
		}
		if (!hi_det) a += 2;
	}
	line_paint_buffer();
	
// trip text

	put_ch = put_ch_full;
	for (a = 0; a < tr; a++)
	{	
		if (network.trip[a].z > 0)
		{
			dist = (X_MID - network.trip[a].x);
			dist *= dist;
			dist += (Y_MID - network.trip[a].y)*(Y_MID - network.trip[a].y);
			dist = Math.sqrt(dist)/100;
			al = 0.1*tral * (network.trip[a].z / 30);
			if (hi_det || a & 1)
			{
				circle_fill(context, network.trip[a].x, network.trip[a].y, 8+network.trip[a].z/100, color_white, al);
				circle(context, network.trip[a].x, network.trip[a].y, 5+network.trip[a].z/100, color_000080, al);
			}
		}
	}
	triangle_paint_buffer_gl();
	line_paint_buffer();
	cnt = 0;
	for (a = 0; a < tr; a++)
	{	
		if (network.trip[a].z > 0)
		{
			dist = (X_MID - network.trip[a].x);
			dist *= dist;
			dist += (Y_MID - network.trip[a].y)*(Y_MID - network.trip[a].y);
			dist = Math.sqrt(dist)/100;
			al = 0.1*tral * (network.trip[a].z / 30);
			if ((hi_det || a & 1) && cnt < 6)
			{
				print_at(context, network.trip[a].x - 128+(dist), network.trip[a].y - 128 + dist, font6x6, string_network[cnt % 6], color_000080, 0.5+dist, al/* *(1 - (network.trip[a].z / 20)) */, 0);
				cnt++;
			}
		}
	}
	triangle_paint_buffer_gl();
}

// ******************************************************************************

function network_paint2()
{
	network_rotate(network);

	nc = network.count;
	if (!hi_det) nc >>= 1;
	
	if (network_poly_rnd)
	{
		for (a =0 ; a < nc; a++)
		{
			network.point[a].xt += -(network_poly_rnd >> 1) + rnd(network_poly_rnd);
			network.point[a].yt += -(network_poly_rnd >> 1) + rnd(network_poly_rnd);
		}
	}

	if (network_end_morph_on)
	{
		image_set_draw(img_r);
		for (a = 0; a < NETWORK_TRIPPERS; a++)
		{
			d = network.trip[a].pos;
			s = network.trip[a].start;
			e = network.trip[a].end;
			network.trip[a].x = network.point[s].xt + (network.point[e].xt - network.point[s].xt) * d;
			network.trip[a].y = network.point[s].yt + (network.point[e].yt - network.point[s].yt) * d;
			network.trip[a].z = network.point[s].rz + (network.point[e].rz - network.point[s].rz) * d;
		
			circle(context, network.trip[a].x, network.trip[a].y, 5+network.trip[a].z/100, color_000080, (hi_det ? (!web_gl ? 1 : 0.2) : 0.5));

			image_draw(context, network.trip[a].x-16, network.trip[a].y-16, 32, 32, img_r, 1);

		}
	}

	image_set_draw(img_);
	aldiv = 500;
	if (!hi_det) aldiv = 650;
	for (a = 0; a < nc; a++)
	{
		if (network.point[a].rz > 0)
		{
			z = 32 + 200-network.point[a].rz/5;
			al = 0.5 - (z / aldiv);
			if (al < 0) al = 0;
			if (z > 0)
			{
				image_draw(context, network.point[a].xt-z/2, network.point[a].yt-z/2, z, z, img_, al);
			}
		}
		if (!hi_det) a+=4;
	}
	image_end_draw();

	if (network_kula_on)
		kula_paint(network_kula_start_time);

	cut_off = 50;
	almul = 1;
	if (!hi_det)
		almul = 1.5;
	for (a = 0; a < nc; a++)
	{
		b1 = network.point[a].bro1[0];
		b2 = network.point[a].bro1[1];
		b3 = network.point[a].bro1[3];
		if (network.point[a].rz > cut_off && network.point[b1].rz > cut_off && network.point[b2].rz > cut_off)
			triangle(context, network.point[a].xt, network.point[a].yt, network.point[b1].xt, network.point[b1].yt,network.point[b2].xt, network.point[b2].yt, color_800000, 0.1*almul);

		if (network.point[a].rz > cut_off && network.point[b1].rz > cut_off && network.point[b3].rz > cut_off)
			triangle(context, network.point[a].xt, network.point[a].yt, network.point[b1].xt, network.point[b1].yt,network.point[b3].xt, network.point[b3].yt, color_FFA000, 0.2*almul);

		if (network.point[b1].rz > cut_off && network.point[b2].rz > cut_off && network.point[b3].rz > cut_off)
			triangle(context, network.point[b1].xt, network.point[b1].yt, network.point[b2].xt, network.point[b2].yt,network.point[b3].xt, network.point[b3].yt, color_FF8000, 0.1*almul);

		if (network.point[a].rz > cut_off && network.point[b2].rz > cut_off && network.point[b3].rz > cut_off)
			triangle(context, network.point[a].xt, network.point[a].yt, network.point[b2].xt, network.point[b2].yt,network.point[b3].xt, network.point[b3].yt, color_white, 0.1*almul);

		if (!hi_det) a++;
	}
	triangle_paint_buffer_gl();

	col = color_black;
	if (network_kula_on || network_end_on)
		col = color_white;
	aldiv = 1024;
	if (!hi_det)  aldiv = 768;

	for (a = 0; a < nc; a+=2)
	{
		for (c = 0; c < NETWORK_BROS; c++)
		{
			b = network.point[a].bro1[c];
			if (a == b) continue;
			if (network.point[a].rz > 0 && network.point[b].rz > 0)
			{
				z = (network.point[a].rz + network.point[b].rz);
				if (z > 255) z = 255; z = 255 - z;

				al = network.point[a].z/aldiv;
				if (al < 0) al *= -1;
				line(context, network.point[a].xt, network.point[a].yt, network.point[b].xt, network.point[b].yt, col, al, LINE_2);
			}
		}
		if (!hi_det) a += 2;
	}
	line_paint_buffer();
	
	if (network_end_morph_on)
	{
		wir_paint2(network_end_morph_start_time, network_poly_rnd, 1);
	
		if (network_trip_morph_on)
		{
			network_trip_morph_level = (time - network_trip_morph_start_time) / 23;
			if (network_trip_morph_level > 350)
				network_trip_morph_level = 350;
		}

		almul = 1;
		if (!hi_det) almul = 1.5;

		for (a = 0; a < NETWORK_TRIPPERS; a++)
			for (b = 0; b < NETWORK_TRIPPERS; b+=2)
			{
				if (a != b)
				{
					dx = network.trip[a].x - network.trip[b].x;
					dy = network.trip[a].y - network.trip[b].y;
					dz = network.trip[a].z - network.trip[b].z;
					dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
					if (dist > 128 && dist < 512)
					{
						xp = yp = 0;
						cc = 16; cu = 0; cd = 50;
						for (c = 0; c < cc; c++, cu += cd)
						{
							x = network.trip[a].x + ((network.trip[b].x - network.trip[a].x)*c)/(cc-1);
							y = network.trip[a].y + ((network.trip[b].y - network.trip[a].y)*c)/(cc-1);
							if (c > 1 && c < cc-1)
							{
								x += Math.sin(timeline_fx_time/10+b*100)*2;;
								y += Math.sin(timeline_fx_time/10+a*100)*2;
							}
							x -= X_MID; y -= Y_MID;
							dist = Math.sqrt(x*x + y*y);
							
							x = (X_MID + x) + sin(20000,network_trip_morph_level)*(x/dist);//+cos(10000, 150)*(x/dist);
							y = (Y_MID + y) + sin(20000,network_trip_morph_level)*(y/dist);//+sin(10000, 150)*(y/dist);
							
							al = ((time/100 + c) % 5)/4;
							al *= (network.trip[a].z+500)/1000;
							al *= almul;
							if (c)
							{
								if (c & 1)
									line(context, x+1, y+1, xp+1, yp+1, color_black, 0.3*al, 1);
								line(context, x, y, xp, yp, color_0080FF /*coll[Math.floor(dist / 25)]*/, 0.5*al, 1, LINE_2);
							}
							xp = x;
							yp = y;
							if (c == 9) cd = -50;
						}
					}
				}
				if (!hi_det) b++;
			}
			line_paint_buffer();
			
			c = 160; ang = (2*PI)/c; dist = X_RES / 3.2;
			if ((time - network_end_morph_start_time) < 7000)
				dist += (7000 - (time - network_end_morph_start_time))/30;
			aa = (time - network_end_morph_start_time) / 10000;
			for (a = 0; a < c; a++, aa += ang)
			{
				x = X_MID + Math.sin(aa)*(dist);
				y = Y_MID + Math.cos(aa)*(dist);
				
				if (!(a % 10))
				{
					dist_add = 100;
					al = 0.3;
				}
				else
				{
					dist_add = 50;
					al = 0.15;
				}
				
				xp = X_MID + Math.sin(aa)*(dist+dist_add);
				yp = Y_MID + Math.cos(aa)*(dist+dist_add);
				
				line(context, x, y, xp, yp, color_A0A0A0, al, LINE_2);
			}
			line_paint_buffer();

		if (network_demo_title_time != -1)
		{
			t = time - network_demo_title_time;
			al = 1;
			if (t > 10000)
			{
				al = 1 - (t-10000)/5000;
				if (al < 0)
				{
					al = 0;
					network_demo_title_time = -1;
				}
			}
			
			str = string_sequence("secondrealm.is", time-network_demo_title_time, 120);
			put_ch = put_ch_full;
			x = X_RES - 290;
			print_at(context, x, Y_RES-50, font6x6, str, color_808080, 3, 0.5*al, 0);
			triangle_paint_buffer_gl();
			if (hi_det)
			{
				put_ch = put_ch_dot;
				print_at(context, x+1, Y_RES-50+1, font6x6, str, color_white, 3, 0.7*al, 0);
			}
		}

	}
	
	almul = 1;
	if (!hi_det)
		almul = 1.5;
	for (a = 0; a < nc; a++)
	{
		b1 = network.point[a].bro1[0];
		b2 = network.point[a].bro1[1];
		b3 = network.point[a].bro1[3];
		if (network.point[a].rz > 0 && network.point[a].rz <= cut_off && network.point[b1].rz > 0 && network.point[b1].rz <= cut_off && network.point[b2].rz > 0 && network.point[b2].rz <= cut_off)
			triangle(context, network.point[a].xt, network.point[a].yt, network.point[b1].xt, network.point[b1].yt,network.point[b2].xt, network.point[b2].yt, color_800000, 0.1*almul);

		if (network.point[a].rz > 0 && network.point[a].rz <= cut_off && network.point[b1].rz > 0 && network.point[b1].rz <= cut_off && network.point[b3].rz > 0 && network.point[b3].rz <= cut_off)
			triangle(context, network.point[a].xt, network.point[a].yt, network.point[b1].xt, network.point[b1].yt,network.point[b3].xt, network.point[b3].yt, color_FFA000, 0.2*almul);

		if (network.point[b1].rz > 0 && network.point[b1].rz <= cut_off && network.point[b2].rz > 0 && network.point[b2].rz <= cut_off && network.point[b3].rz > 0 && network.point[b3].rz <= cut_off)
			triangle(context, network.point[b1].xt, network.point[b1].yt, network.point[b2].xt, network.point[b2].yt,network.point[b3].xt, network.point[b3].yt, color_FF8000, 0.1*almul);

		if (network.point[a].rz > 0 && network.point[a].rz <= cut_off && network.point[b2].rz > 0 && network.point[b2].rz <= cut_off && network.point[b3].rz > 0 && network.point[b3].rz <= cut_off)
			triangle(context, network.point[a].xt, network.point[a].yt, network.point[b2].xt, network.point[b2].yt,network.point[b3].xt, network.point[b3].yt, color_white, 0.1*almul);

	}
	triangle_paint_buffer_gl();

	
	if (network_end_on && timeline_fx_time< 7500)
		circle_paint();
}

// ---------------

function network_paint3()
{
	network_rotate(network);
	
	nc = network.count;
	if (!hi_det) nc >>= 1;

// -----

	if (network_medusa_on == 2)
	{
		wir_paint();
		rove_paint();
	}

	image_set_draw(img_r);
	for (a = 0; a < NETWORK_TRIPPERS; a++)
	{
		d = network.trip[a].pos;
		s = network.trip[a].start;
		e = network.trip[a].end;
		network.trip[a].x = network.point[s].xt + (network.point[e].xt - network.point[s].xt) * d;
		network.trip[a].y = network.point[s].yt + (network.point[e].yt - network.point[s].yt) * d;
		network.trip[a].z = network.point[s].rz + (network.point[e].rz - network.point[s].rz) * d;
		
		if (network_medusa_on == 1 && network.trip[a].z > 0)
		{
			image_draw(context, network.trip[a].x-16, network.trip[a].y-16, 32, 32, img_r, 1);
		}
	}
	image_end_draw();

	if (network_medusa_on == 1)
	{
		aladd = 0;
		if (!hi_det) aladd = 0.02;
	for (a = 0; a < nc; a+=2)
	{
		b1 = network.point[a].bro2[0];
		b2 = network.point[a].bro2[1];
		b3 = network.point[a].bro2[3];
		if (network.point[a].rz > 0 && network.point[b1].rz > 0 && network.point[b2].rz > 0)
			triangle(context, 256, network.point[a].yt, network.point[b1].xt, network.point[b1].yt,network.point[b2].xt, network.point[b2].yt, color_000080, 0.005+aladd);

		if (network.point[a].rz > 0 && network.point[b1].rz > 0 && network.point[b3].rz > 0)
			triangle(context, X_RES-256, network.point[a].yt, network.point[b1].xt, network.point[b1].yt,network.point[b3].xt, network.point[b3].yt, color_FA0000, 0.025+aladd);

		if (!hi_det) a += 2;
	}
	triangle_paint_buffer_gl();
	}

	var dist = 999999999999; dist_i = 0;
	for (a = 0; a < NETWORK_TRIPPERS; a++)
	{
		if (network.trip[a].z > 0)
		{
			dist_n = Math.abs(X_MID - network.trip[a].x) + Math.abs(Y_MID - network.trip[a].y);
			if (dist_n < dist)
			{
				dist = dist_n;
				dist_i = a;
			}
		}
	}
// ----
	image_set_draw(img_);
	for (a = 0; a < nc; a++)
	{
		if (network.point[a].rz > 0)
		{
			z = 32 + 200-network.point[a].rz/5;
			al = 0.3 - (z / 1000);
			if (al < 0) al = 0;
			if (z > 0)
			{
				image_draw(context, network.point[a].xt-z/2, network.point[a].yt-z/2, z, z, img_, al/2);
			}
		}
		if (!hi_det) a++;
	}
	image_end_draw();

	if (network_medusa_on == 2)
	{
	
			
	pos_x = X_MID + cos(2040, 200) + sin(666, 277);
	pos_y = Y_MID + cos(1030, 130) + sin(666, 177);
	aldiv = 4024;
	if (!hi_det) aldiv = 2048;
	for (a = 0; a < nc; a+=2)
	{
		for (c = 0; c < NETWORK_BROS; c++)
		{
			b = network.point[a].bro2[c];
			if (a == b) continue;
			if (network.point[a].rz > 0 && network.point[b].rz > 0)
			{
				z = (network.point[a].rz + network.point[b].rz);
				if (z > 255) z = 255; z = 255 - z;

				al = network.point[a].z/aldiv;
				if (al < 0) al *= -1;
				if (Math.abs(pos_x - network.point[a].xt) < 64)
				{
					col = color_A00000;
					x_add = 32;
				}
				else
				if (Math.abs(pos_y - network.point[b].yt) < 64)
				{
					col = color_black;
					x_add = 16;
				}
				else
				{
					col = color_white;
					x_add = 0;
				}
				line(context, network.point[a].xt + x_add, network.point[a].yt + x_add, network.point[b].xt + x_add, network.point[b].yt + x_add, col, al, LINE_2);
			}
		}
		if (!hi_det) a += 1;
	}
	line_paint_buffer();

	str = string_sequence(string_wecare, time-network_medusa_start_time, 120);
	put_ch = put_ch_full;
	print_at(context, 50, Y_RES-60, font6x6, str, color_000080, 3, 0.7, 0);
	triangle_paint_buffer_gl();
	if (hi_det)
	{
		put_ch = put_ch_dot;
		print_at(context, 50+1, Y_RES-60+1, font6x6, str, color_white, 3, 0.7, 0);
	}
	
	}
	else
	{
		aladd = 0;
		if (!hi_det) aladd = 0.05;
	for (a = 0; a < nc; a+=2)
	{
		for (c = 0; c < NETWORK_BROS; c++)
		{
			b = network.point[a].bro2[c];
			if (a == b) continue;
			if (network.point[a].rz > 0 && network.point[b].rz > 0)
			{
				z = (network.point[a].rz + network.point[b].rz);
				if (z > 255) z = 255; z = 255 - z;

				al = network.point[a].z/4024;
				if (al < 0) al *= -1;
				line(context, network.point[a].xt, network.point[a].yt, network.point[b].xt, network.point[b].yt, color_blue, al/2+aladd, LINE_2);
			}
		}
		if (!hi_det) a+=2;
	}
	line_paint_buffer();
	}

	if (network_medusa_on == 1)
		medusa_paint(network_medusa_start_time);
}

// ----------------

function network_move(move)
{
	for (a = 0; a < NETWORK_TRIPPERS; a++)
	{
		network.trip[a].pos += (0.0005 + 0.0005*network_end_on) * move;
		if (network.trip[a].pos > 1)
		{
			network.trip[a].pos -= 1;
			network.trip[a].start = network.trip[a].end;
			network.trip[a].end = network.point[network.trip[a].start].bro1[rnd(NETWORK_BROS-1)];
		}
	}
	
	if (network_end_on)
	{
		network.pos_x = 0;
		network.pos_z = -320;
		network.pos_z += network_poly_rnd >> 1;
		network.ang_y += move/20000;
		network.ang_z += move/15600;
		network.ang_x = sin(50000, 2);
		circle_move(move);
		return;
	}
	
	network.pos_x = Math.sin(time / 6000)*256*sin(8000, -1) + cos(2000, 128)*sin(6000, 1) + sin (2500, 64);
	network.pos_z = sin(5000, 192) + sin(3000,48) + cos(2500, 24)*sin(5000, 1);
	network.ang_y = cos(55000, 3.14)+sin(40000, 3.14/2);
	network.ang_z += move/5560;
	network.ang_x = sin(50000, 3.1415926*2);
	
	if (network_medusa_on == 2)
		network.pos_z -= 750;
	
	kula_move(move);

	if (network_medusa_on == 1)
		medusa_move(move);
	else
	if (network_medusa_on == 2)
	{
		rove_move(move);
		wir_move(move);
	}
	else
		wir_move2(move);
}

function network_flash(time, dur)
{
	network_type = 1;
	if (!hi_det) return;
	rect(0, 0, X_RES-1, Y_RES-1, color_FFE0E0, 0.75 - (time/dur)/1.5);
	triangle_paint_buffer_gl();
}

function network_flash2(time, dur)
{
	network_type = 1;
	if (!hi_det) return;
	rect(0, 0, X_RES-1, Y_RES-1, color_white, 1 - (time/dur));
	triangle_paint_buffer_gl();
}

function network_flash_end(time, dur)
{
	network_type = 0;
}

function network_medusa(param)
{
	network_medusa_on = param;
	network_medusa_start_time = time;
}

function network_kula(param)
{
	network_kula_on = param;
	network_kula_start_time = time;
}

function network_end(param)
{
	network_end_on = param;
	network_medusa_on = 0;
	network_type = 1;
}

function network_end_morph(param)
{
	network_end_morph_on = param;
	network_end_morph_start_time = time;
}

function network_demo_title(param)
{
	network_demo_title_time = time;
}

var network_fade_use;

var network_end_img;
var network_end_img_loaded = 0;

var network_snap_end = 0;

function network_snap_end_sync(param)
{
	network_snap_end = param;
}


function network_fx_end()
{ return;
	if (!network_snap_end) return;

	if (!web_gl)
	{
		network_end_img = new Image();
		network_end_img.src = canvas.toDataURL("image/raw");
		network_end_img.onload = function func() { network_end_img_loaded = 1; };
	}
	else
		swap_framebuffer_gl();
}

function network_fade(time, dur)
{
	if (hi_det)
		wir_paint2(network_end_morph_start_time, network_poly_rnd, 1 - time/dur);

	network_fade_use = 1;
}

function network_fade_end()
{
	network_fade_use = 0;
}

function network_trip_morph(param)
{
	network_trip_morph_on = param;
	network_trip_morph_start_time = time;
}

function network_shake(time, dur)
{
	network_poly_rnd = Math.floor((time*100)/dur);
}