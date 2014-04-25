//
// Copyright (c) 2014 Zden Hlinka ( Satori, s.r.o. ) - zden@satori.sk - Zd3N.com - satori.sk
// GNU GPL license
//

var PI = 3.1415926;

function copy_object_position(dst, src)
{
	dst.pos_x = src.pos_x;
	dst.pos_y = src.pos_y;
	dst.pos_z = src.pos_z;
	dst.ang_x = src.ang_x;
	dst.ang_y = src.ang_y;
	dst.and_z = src.ang_z;
}

function create_3d_point(x, y, z)
{
	this.x = x;
	this.y = y;
	this.z = z;
	this.rx = this.ry = this.rz = this.xt = this.yt = 0;
}

function create_3d_face(a, b, c)
{
	this.a = a;
	this.b = b;
	this.c = c;
	this.n = 0;
	this.id = 0;
}

function create_3d_wire(p1, p2)
{
	this.p1 = p1;
	this.p2 = p2;
}

function load_3d_object(obj, scale_in)
{
	scale = typeof scale_in != "number" ? 1 : scale_in;
	this.vertex_num = obj[0];
	this.wire_num = obj[1];
	this.face_num = obj[2];
	this.point = new Array(this.vertex_num + this.face_num);
	this.wire = new Array(this.wire_num);
	this.face = new Array(this.face_num);

	var p = 3;
	for (a = 0; a < this.vertex_num; a++, p += 3)
		this.point[a] = new create_3d_point(obj[p]*scale, obj[p+1]*scale, obj[p+2]*scale);

	for (a = 0; a < this.wire_num; a++, p += 2)
		this.wire[a] = new create_3d_wire(obj[p], obj[p+1]);
		
	for (a = 0; a < this.face_num; a++, p += 3)
		this.face[a] = new create_3d_face(obj[p], obj[p+1], obj[p+2]);

	p = this.vertex_num;
	for (a = 0; a < this.face_num; a++, p++)
	{
		fa = this.face[a].a; fb = this.face[a].b; fc = this.face[a].c;
		v1x = this.point[fb].x - this.point[fa].x;
		v1y = this.point[fb].y - this.point[fa].y;
		v1z = this.point[fb].z - this.point[fa].z;
		v2x = this.point[fc].x - this.point[fa].x;
		v2y = this.point[fc].y - this.point[fa].y;
		v2z = this.point[fc].z - this.point[fa].z;
		nx = v1y * v2z - v2y * v1z;
		ny = v2x * v1z - v1x * v2z;
		nz = v1x * v2y - v2x * v1y;
		d = Math.sqrt(nx * nx + ny * ny + nz * nz);
		nx /= d; ny /= d; nz /= d;
		this.point[p] = new create_3d_point(nx, ny, nz);
		this.face[a].n = p;
		this.face[a].id = a;
	}

	this.zoom = 128;
	this.pos_x = 0;
	this.pos_y = -500;
	this.pos_z = 100;
	this.ang_x = this.ang_y = this.ang_z = 0;
	
	this.min_x = this.min_y = this.min_z = 0;
	this.max_x = this.max_y = this.max_z = 0;
	this.dist_x = this.dist_y = this.dist_z = 0;
}

// ---

function swap(obj, firstIndex, secondIndex){
    var temp = obj.face[firstIndex];
    obj.face[firstIndex] = obj.face[secondIndex];
    obj.face[secondIndex] = temp;
}

function partition(obj, left, right) {

	var pivot_rand = Math.floor((right + left) / 2);
    var pivot   = (obj.point[obj.face[pivot_rand].a].rz),
        i       = left,
        j       = right;


    while (i <= j) {

        while (obj.point[obj.face[i].a].rz < pivot) {
            i++;
        }

        while (obj.point[obj.face[j].a].rz > pivot) {
            j--;
        }

        if (i <= j) {
            swap(obj, i, j);
            i++;
            j--;
        }
    }

    return i;
}

function sort_3d_faces(obj, left, right) {

    var index;

    if (obj.face_num > 1) {

        left = typeof left != "number" ? 0 : left;
        right = typeof right != "number" ? obj.face_num - 1 : right;

        index = partition(obj, left, right);

        if (left < index - 1) {
            sort_3d_faces(obj, left, index - 1);
        }

        if (index < right) {
            sort_3d_faces(obj, index, right);
        }

    }
}

function rotate_3d_object(obj)
{
	var tx, ty, tz;
	
	var all = obj.vertex_num + obj.face_num;

	var tx = ty = tz = 0.001;
	for (a = 0; a < all; a++)
	{
		xy = ((obj.point[a].y) * Math.cos(obj.ang_x)) - ((obj.point[a].z) * Math.sin(obj.ang_x));
		xz = ((obj.point[a].y) * Math.sin(obj.ang_x)) + ((obj.point[a].z) * Math.cos(obj.ang_x));
		
		obj.point[a].rz = (xz * Math.cos(obj.ang_y)) - ((obj.point[a].x) * Math.sin(obj.ang_y));
		yx = (xz * Math.sin(obj.ang_y)) + ((obj.point[a].x) * Math.cos(obj.ang_y));
		obj.point[a].rx = (yx * Math.cos(obj.ang_z)) - (xy * Math.sin(obj.ang_z));
		obj.point[a].ry = (yx * Math.sin(obj.ang_z)) + (xy * Math.cos(obj.ang_z));
	}

}

function bounds_3d_object(obj)
{
	var min_x = 9999999999999, max_x = -999999999999;
	var min_y = 9999999999999, max_y = -999999999999;
	var min_z = 9999999999999, max_z = -999999999999;

	for (a = 0; a < obj.vertex_num; a++)
	{
		if (obj.point[a].rx < min_x) min_x = obj.point[a].rx;
		if (obj.point[a].rx > max_x) max_x = obj.point[a].rx;
		if (obj.point[a].ry < min_y) min_y = obj.point[a].ry;
		if (obj.point[a].ry > max_y) max_y = obj.point[a].ry;
		if (obj.point[a].rz < min_z) min_z = obj.point[a].rz;
		if (obj.point[a].rz > max_z) max_z = obj.point[a].rz;
	}

	obj.min_x = min_x; obj.max_x = max_x;
	obj.min_y = min_y; obj.max_y = max_y;
	obj.min_z = min_z; obj.max_z = max_z;
	obj.dist_x = max_x - min_x;
	obj.dist_y = max_y - min_y;
	obj.dist_z = max_z - min_z;
}

function transform_3d_object(obj)
{
	var mid_x = X_RES/2;
	var mid_y = Y_RES/2;

	for (a = 0; a < obj.vertex_num; a++)
	{
		obj.point[a].rx += obj.pos_x;
		obj.point[a].ry += obj.pos_y;
		obj.point[a].rz -= obj.pos_z;

		obj.point[a].xt = mid_x + (obj.zoom * obj.point[a].rx) / obj.point[a].rz;
		obj.point[a].yt = mid_y - (obj.zoom * obj.point[a].ry) / obj.point[a].rz;
	}
}

function deform_3d_object(obj, time, speed, speed_mul, amp1, amp2)
{
	min_y = obj.min_y;
	dist = obj.dist_y;

	for (a = 0; a < obj.vertex_num; a++)
	{
		y = obj.point[a].ry - min_y;
		y = amp1*Math.sin(y/3+ ((time % speed)*3.1415926*2)/speed);
		if (y < 0) y *= -1;
		obj.point[a].rx *= 1+y/dist;
		obj.point[a].ry *= 1+y/dist;
	}
//

	var min_x = obj.min_z, max_z = obj.max_z;

	dist = obj.dist_x;

	speed *= speed_mul;
	for (a = 0; a < obj.vertex_num; a++)
	{
		x = obj.point[a].rx - min_x;
		x = amp2*Math.sin(x/4+ ((time % speed)*3.1415926*2)/speed);
		if (x < 0) x *= -1;
		obj.point[a].ry *= 1+x/dist;
		obj.point[a].rz *= 1+x/dist;
	}
}

var paint_3d_func = 0;
var paint_skip = 1;

function paint_3d_object(obj, col1, col2, col3)
{
	dist = obj.dist_z;
	min_z = obj.min_z;
	a = 0;

	for (a = 0; a < obj.face_num; a += paint_skip)
	{
		if (obj.point[obj.face[a].n].rz >= 0)
		{
			alfa = ((obj.point[obj.face[a].a].rz+obj.point[obj.face[a].b].rz+obj.point[obj.face[a].c].rz)/3 - min_z)/dist;
			alfa *= (1-obj.point[obj.face[a].n].rz);
			paint_3d_func(context, obj.point[obj.face[a].a].xt, obj.point[obj.face[a].a].yt, obj.point[obj.face[a].b].xt, obj.point[obj.face[a].b].yt, obj.point[obj.face[a].c].xt, obj.point[obj.face[a].c].yt, alfa > 0.75 ? col1 : alfa < 0.1 ? col2 : col3, 0.25+alfa*0.75, obj.face[a].id);
		}
	}
	triangle_paint_buffer_gl();
}

var ALFA = 1;
var ALFA_REV = 2;
var COL_FUNC = 4;
var flat_render_func = 0;
var flat_color_func = 0;

function flat_norm(context, x1, y1, x2, y2, x3, y3, col, alfa, id)
{
	triangle(context, x1, y1, x2, y2, x3, y3, pattern_chess, alfa);
}

function flat_pulse(context, x1, y1, x2, y2, x3, y3, col, alfa, id)
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
	triangle(context, x1, y1, x2, y2, x3, y3, col, alfa);
}

var flat_hor_start = 0;
var flat_skip = 1;

function flat_3d_simple(obj, col, alfa_in)
{
	sort_3d_faces(obj);

	if (flat_render_func == 0) flat_render_func = flat_norm;
	dist = obj.dist_z;
	min_z = obj.min_z;
	a = 0;

	for (a = 0; a < obj.face_num; a+=flat_skip)
	{
		alfa = obj.point[obj.face[a].n].rz * alfa_in;
		if (obj.point[obj.face[a].a].rz < flat_hor_start && obj.point[obj.face[a].b].rz < flat_hor_start && obj.point[obj.face[a].c].rz < flat_hor_start)
		{
			flat_render_func(context, obj.point[obj.face[a].a].xt, obj.point[obj.face[a].a].yt, obj.point[obj.face[a].b].xt, obj.point[obj.face[a].b].yt, obj.point[obj.face[a].c].xt, obj.point[obj.face[a].c].yt, col, alfa, obj.face[a].id);
		}
	}
	triangle_paint_buffer_gl();
}

function flat_3d_simple_cut(obj, zs, ze, col, alfa_in, alfaz)
{
	sort_3d_faces(obj);

	if (flat_render_func == 0) flat_render_func = flat_norm;
	dist = alfaz - zs;
	min_z = zs;
	a = 0;
	for (a = 0; a < obj.face_num; a+= flat_skip)
	{
		alfa = obj.point[obj.face[a].n].rz * alfa_in;
		if (obj.point[obj.face[a].a].rz < zs && obj.point[obj.face[a].b].rz < zs && obj.point[obj.face[a].c].rz < zs && obj.point[obj.face[a].a].rz > ze && obj.point[obj.face[a].b].rz > ze && obj.point[obj.face[a].c].rz > ze)
		{
			alfa *= (1 - ((obj.point[obj.face[a].a].rz+obj.point[obj.face[a].b].rz+obj.point[obj.face[a].c].rz)/3 - min_z)/dist);
			
			flat_render_func(context, obj.point[obj.face[a].a].xt, obj.point[obj.face[a].a].yt, obj.point[obj.face[a].b].xt, obj.point[obj.face[a].b].yt, obj.point[obj.face[a].c].xt, obj.point[obj.face[a].c].yt, col, alfa, obj.face[a].id);
		}
	}
	triangle_paint_buffer_gl();
}

var flat_callback = 0;

function flat_3d_object(obj, flags)
{
	sort_3d_faces(obj);

	if (flat_render_func == 0) flat_render_func = flat_norm;
	dist = obj.dist_z;
	min_z = obj.min_z;
	a = 0;
	col = color_FF8000;
	for (a = 0; a < obj.face_num; a += flat_skip)
	{
		alfa = 1;
		if (obj.point[obj.face[a].a].rz < flat_hor_start && obj.point[obj.face[a].b].rz < flat_hor_start && obj.point[obj.face[a].c].rz < flat_hor_start)
		{

			b = (1-obj.point[obj.face[a].n].rz)*255;

			if (flags & ALFA)
				alfa = ((obj.point[obj.face[a].a].rz+obj.point[obj.face[a].b].rz+obj.point[obj.face[a].c].rz)/3 - min_z)/dist;
			if (flags & ALFA_REV)
				alfa *= (1 - Math.abs(obj.point[obj.face[a].n].rz));
			if (flags & COL_FUNC)
				col = flat_color_func(obj.point[obj.face[a].n]);
				
			zz = Math.abs(obj.point[obj.face[a].n].rz);
			alfa *= (0.5+zz/2);
			
			flat_render_func(context, obj.point[obj.face[a].a].xt, obj.point[obj.face[a].a].yt, obj.point[obj.face[a].b].xt, obj.point[obj.face[a].b].yt, obj.point[obj.face[a].c].xt, obj.point[obj.face[a].c].yt, col, alfa, obj.face[a].id);
			flat_callback(obj.face[a].id, obj.point[obj.face[a].a].xt, obj.point[obj.face[a].a].yt);
		}
	}
	triangle_paint_buffer_gl();
}

function paint_3d_object_flat(obj, skip, col)
{
	a = 0;

	for (a = 0; a < obj.face_num; a += skip)
	{
		alfa = Math.sqrt(obj.point[obj.face[a].n].rz*obj.point[obj.face[a].n].rz);
		alfa = (alfa * (250+obj.point[obj.face[a].a].rz)) / 500;
		triangle_pattern(context, obj.point[obj.face[a].a].xt, obj.point[obj.face[a].a].yt, obj.point[obj.face[a].b].xt, obj.point[obj.face[a].b].yt, obj.point[obj.face[a].c].xt, obj.point[obj.face[a].c].yt, col, alfa);
	}
	triangle_paint_buffer_gl();
}

function paint_3d_wire(obj, step, col, alfa_in, alfa_neg)
{
	min_z = obj.min_z;
	dist = obj.dist_z;

	for (a = 0, b = -1; a < obj.wire_num; a += step)
	{
		alfa = (obj.point[obj.wire[a].p1].rz+obj.point[obj.wire[a].p2].rz)/2;
		alfa -= min_z;
		alfa = alfa/dist;
		if (alfa_neg)
			alfa = 1 - alfa;
		alfa = (alfa * alfa_in);
		line(context, obj.point[obj.wire[a].p1].xt, obj.point[obj.wire[a].p1].yt, obj.point[obj.wire[a].p2].xt, obj.point[obj.wire[a].p2].yt, col, alfa, LINE_2);
		if (step > 1 && b != -1)
		{
			alfa = ((obj.point[obj.wire[b].p2].rz+obj.point[obj.wire[a].p1].rz)/2 - min_z)/dist;
			alfa = (alfa * alfa_in);
			line(context, obj.point[obj.wire[b].p2].xt, obj.point[obj.wire[b].p2].yt, obj.point[obj.wire[a].p1].xt, obj.point[obj.wire[a].p1].yt, col, alfa, LINE_2);
		}
		b = a;
	}
	line_paint_buffer();
}

var wire_hor = 0;

function paint_3d_wire_hor(obj, step, col, alfa_in, alfa_neg)
{
	min_z = obj.min_z;
	dist = obj.dist_z;

	for (a = 0, b = -1; a < obj.wire_num; a += step)
	{
		if (obj.point[obj.wire[a].p1].rz < wire_hor && obj.point[obj.wire[a].p2].rz < wire_hor)
		{
			alfa = (obj.point[obj.wire[a].p1].rz+obj.point[obj.wire[a].p2].rz)/2;
			alfa -= min_z;
			alfa = alfa/dist;
			if (alfa_neg)
				alfa = 1 - alfa;
			alfa = (alfa * alfa_in);
			line(context, obj.point[obj.wire[a].p1].xt, obj.point[obj.wire[a].p1].yt, obj.point[obj.wire[a].p2].xt, obj.point[obj.wire[a].p2].yt, col, alfa, LINE_2);
			if (step > 1 && b != -1)
			{
				alfa = ((obj.point[obj.wire[b].p2].rz+obj.point[obj.wire[a].p1].rz)/2 - min_z)/dist;
				alfa = (alfa * alfa_in);
				line(context, obj.point[obj.wire[b].p2].xt, obj.point[obj.wire[b].p2].yt, obj.point[obj.wire[a].p1].xt, obj.point[obj.wire[a].p1].yt, col, alfa, LINE_2);
			}
			b = a;
		}
	}
	line_paint_buffer();
}

function paint_3d_line_move(obj, time, speed, step)
{
	c = Math.floor((time / speed) % step);
	cc = (c+1)%step
	m = (time % speed)/speed;
	var b = -1;
	min_z = obj.min_z;
	dist = obj.dist_z;
	col1 = new RGB(255,0,0);
	col2 = new RGB(0xFF,0x80,0);
	alfa_mul = 0.33;
	if (web_gl) alfa_mul += 0.3;
	for (a = 0; a < obj.wire_num-step; a += step)
	{
		alfa = alfa_mul*((obj.point[obj.wire[a].p1].rz - min_z) / dist);

		xx = obj.point[obj.wire[a+c].p1].xt + (obj.point[obj.wire[a+cc].p1].xt - obj.point[obj.wire[a+c].p1].xt)*m;
		yy = obj.point[obj.wire[a+c].p1].yt + (obj.point[obj.wire[a+cc].p1].yt - obj.point[obj.wire[a+c].p1].yt)*m;
		xx2 = obj.point[obj.wire[a+c].p2].xt + (obj.point[obj.wire[a+cc].p2].xt - obj.point[obj.wire[a+c].p2].xt)*m;
		yy2 = obj.point[obj.wire[a+c].p2].yt + (obj.point[obj.wire[a+cc].p2].yt - obj.point[obj.wire[a+c].p2].yt)*m;
		line(context, xx, yy, xx2, yy2, col1, alfa, LINE_2);
		if (b != -1)
			line(context, xxp, yyp, xx, yy, col2, alfa/3, LINE_2);
		b = a;
		xxp = xx2;
		yyp = yy2;
	}
	line_paint_buffer();

}

function paint_blob(obj, img, alfa, skip)
{
	image_set_draw(img);
	for (a = 0; a < obj.vertex_num; a += skip)
	{
		if (obj.point[a].rz > 0)
		{
			z = img.width + 200-Math.abs(obj.point[a].rz)/5;
			al = alfa - (z / 1000);
			if (al < 0) al = 0;
			if (z > 0)
			{
				image_draw(context, obj.point[a].xt-z/2, obj.point[a].yt-z/2, z, z, img, al);
			}
		}
	}
	image_end_draw();
}

function paint_blob_cut(obj, img, sz, ez, alfa, skip)
{
	image_set_draw(img);
	for (a = 0; a < obj.vertex_num; a += skip)
	{
		if (obj.point[a].rz > sz && obj.point[a].rz < ez)
		{
			z = img.width + 200-Math.abs(obj.point[a].rz)/5;
			al = alfa - (z / 1000);
			if (al < 0) al = 0;
			if (z > 0)
			{
				image_draw(context, obj.point[a].xt-z/2, obj.point[a].yt-z/2, z, z, img, al);
			}
		}
	}
	image_end_draw();
}


// ---

function transform_shift(obj, x_add, y_add)
{
	for (a = 0; a < obj.vertex_num; a++)
	{
		obj.point[a].xt += x_add;
		obj.point[a].yt += y_add;
	}
}

// ---
