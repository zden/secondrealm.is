var colorLocation;
var textureAlpha;
var texCoordLocation;

var positionLocation;
var colorlistLocation;
var positionLocation_txt;

var triangle_buffer, triangle_color_buffer;
var triangle_txt_buffer;

var program_flat, program_txt;

var texCoordBuffer;

var texture;
var texture_list;

var frameBuffer;
var frameBufferTexture;
var frameBufferTextureFade;

function webgl_init()
{
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
	gl.enable(gl.BLEND);
//	gl.enable(gl.LINE_SMOOTH);
	gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);

	vertexShader = createShaderFromScriptElement(gl, "2d-vertex-shader-flat");
	fragmentShader = createShaderFromScriptElement(gl, "2d-fragment-shader-flat");
	program_flat = createProgram(gl, [vertexShader, fragmentShader]);

	vertexShader_txt = createShaderFromScriptElement(gl, "2d-vertex-shader-txt");
	fragmentShader_txt = createShaderFromScriptElement(gl, "2d-fragment-shader-txt");
	program_txt = createProgram(gl, [vertexShader_txt, fragmentShader_txt]);

	gl.useProgram(program_flat);
// flat
	positionLocation = gl.getAttribLocation(program_flat, "a_position");
	colorlistLocation = gl.getAttribLocation(program_flat, "a_color");

	var resolutionLocation = gl.getUniformLocation(program_flat, "u_resolution");
	colorLocation = gl.getUniformLocation(program_flat, "u_color");
// txt
	positionLocation_txt = gl.getAttribLocation(program_txt, "a_position");
	texCoordLocation = gl.getAttribLocation(program_txt, "a_texCoord");
	var resolutionLocation_txt = gl.getUniformLocation(program_txt, "u_resolution");
	textureAlpha = gl.getUniformLocation(program_txt, "t_alpha");

	texCoordBuffer = gl.createBuffer();
	
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	gl.enableVertexAttribArray(texCoordLocation);
	gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		0.0,  0.0,
		1.0,  0.0,
		0.0,  1.0,
		0.0,  1.0,
		1.0,  0.0,
		1.0,  1.0]), gl.STATIC_DRAW);
	
	gl.uniform2f(resolutionLocation, canvas.width, canvas.height);

	gl.useProgram(program_txt);

	texture_list = new Array();
	texture_list.push(img_blob, img_, img_b, img_r, img_rm, box_glow, map_overlay, img_dotstr, img_over1, img_over2, img_over3,
								img_overstr1, img_overstr2, img_overstr3, img_overgrt1, img_overgrt2, img_wbg, img_splash,
								img_city[0],img_city[1],img_city[2],img_city[3],img_city[4],img_city[5],img_city[6]);

	texture = new Array(texture_list.length);
	for (a = 0; a < texture_list.length; a++)
	{
		texture[a] = gl.createTexture();
		gl.bindTexture(gl.TEXTURE_2D, texture[a]);

		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture_list[a]);
	} 
	
	gl.uniform2f(resolutionLocation_txt, canvas.width, canvas.height);
	gl.useProgram(program_flat);

	triangle_color_buffer = gl.createBuffer();
	triangle_buffer = gl.createBuffer();
	triangle_txt_buffer = gl.createBuffer();
	
	gl.enableVertexAttribArray(positionLocation);
	
	gl.enableVertexAttribArray(colorlistLocation);

	gl.enableVertexAttribArray(positionLocation_txt);
	gl.vertexAttribPointer(positionLocation_txt, 2, gl.FLOAT, false, 0, 0);
// -------------
	line = line_gl;
	triangle = triangle_gl;
	triangle_pattern = triangle_pattern_gl;
	triangle_pattern2 = triangle_pattern2_gl;
	rect = rect_gl;
	polygon = blank;
	clear_canvas = clear_canvas_gl;
	image_draw = image_draw_gl;
	image_set_draw = image_set_draw_gl;
	image_end_draw = image_end_draw_gl;
	circle = circle_gl;
	circle_fill = circle_fill_gl;
	line_paint_buffer = line_paint_buffer_gl;
//
	frameBufferTextureFade = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, frameBufferTextureFade);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1280, 720, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

	frameBufferTexture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, frameBufferTexture);
	gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
	gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1280, 720, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

	frameBuffer = gl.createFramebuffer();
	gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, frameBufferTexture, 0);
	
	rect_gl(0, 0, 1280, 720, color_white, 1);
}

function image_set_draw_gl(image)
{
	gl.useProgram(program_txt);

	for (a = 0; a < texture_list.length; a++)
	{
		if (texture_list[a] == image)
		{
			gl.bindTexture(gl.TEXTURE_2D, texture[a]);
			return;
		}
	}
	alert("panic");
}

function image_end_draw_gl()
{
	gl.useProgram(program_flat);
}

function image_draw_gl(context, x1, y1, wid, hei, image, alfa)
{
	gl.uniform4f(textureAlpha, 1, 1, 1, alfa);

	x2 = x1 + wid;
	y2 = y1 + hei;
	gl.bindBuffer(gl.ARRAY_BUFFER, triangle_txt_buffer);
	gl.vertexAttribPointer(positionLocation_txt, 2, gl.FLOAT, false, 0, 0);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		x1, y1,
		x2, y1,
		x1, y2,
		x1, y2,
		x2, y1,
		x2, y2]), gl.STATIC_DRAW);
		
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		0.0,  0.0,
		1.0,  0.0,
		0.0,  1.0,
		0.0,  1.0,
		1.0,  0.0,
		1.0,  1.0]), gl.STATIC_DRAW);

		
		
    gl.drawArrays(gl.TRIANGLES, 0, 6);
}

function blank()
{
}

var line_gl_array = new Array;
line_gl_array = [];
var line_color_gl_array = new Array;
line_color_gl_array = [];
var line_gl_num = 0;
var line_gl_size = 2;

function line_gl(context, xs, ys, xe, ye, col, alfa, size)
{
	line_gl_array.push(xs, ys, xe, ye);
	line_color_gl_array.push(col.r, col.g, col.b, alfa, col.r, col.g, col.b, alfa);
	line_gl_num++;
	line_gl_size = size;
}

function line_paint_buffer_gl()
{
	if (!line_gl_num) return;

	l = line_gl_array.length;

	var va = new Float32Array(l);
	for (a = 0; a < l; a++)
		va[a] = line_gl_array[a];

	gl.bindBuffer(gl.ARRAY_BUFFER, triangle_buffer);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
	gl.bufferData(gl.ARRAY_BUFFER, va, gl.STATIC_DRAW);
	
	l = line_color_gl_array.length;
	var ca = new Float32Array(l);
	for (a = 0; a < l; a++)
		ca[a] = line_color_gl_array[a];
		
	gl.bindBuffer(gl.ARRAY_BUFFER, triangle_color_buffer);
	gl.vertexAttribPointer(colorlistLocation, 4, gl.FLOAT, false, 0, 0);
	gl.bufferData(gl.ARRAY_BUFFER, ca, gl.STATIC_DRAW);
	
	gl.lineWidth(line_gl_size);
	gl.uniform4f(colorLocation, 1, 1, 1, 1);
	gl.drawArrays(gl.LINES, 0, 2*line_gl_num);
	
	va.length = 0;
	ca.length = 0;
	line_gl_array.length = 0;
	line_color_gl_array.length = 0;
	line_gl_num = 0;
}

var triangle_gl_array = new Array();
triangle_gl_array = [];
var triangle_color_gl_array = new Array();
triangle_color_gl_array = [];
var triangle_gl_num = 0;

function triangle_clean_buffer_gl()
{
	triangle_gl_array= [];
	triangle_color_gl_array = [];
	triangle_gl_num = 0;
}

function triangle_gl(context, x1, y1, x2, y2, x3, y3, col, alfa)
{
	triangle_gl_array.push(x1, y1, x2, y2, x3, y3);
	triangle_color_gl_array.push(col.r, col.g, col.b, alfa,  col.r, col.g, col.b, alfa,  col.r, col.g, col.b, alfa);
	triangle_gl_num++;
}

function triangle_paint_buffer_gl()
{
	if (!triangle_gl_num) return;

	l = triangle_gl_array.length;
	var va = new Float32Array(l);
	for (a = 0; a < l; a++)
		va[a] = triangle_gl_array[a];

	gl.bindBuffer(gl.ARRAY_BUFFER, triangle_buffer);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
	gl.bufferData(gl.ARRAY_BUFFER, va, gl.STATIC_DRAW);

	l = triangle_color_gl_array.length;
	var ca = new Float32Array(l);
	for (a = 0; a < l; a++)
		ca[a] = triangle_color_gl_array[a];
		
	gl.bindBuffer(gl.ARRAY_BUFFER, triangle_color_buffer);
	gl.vertexAttribPointer(colorlistLocation, 4, gl.FLOAT, false, 0, 0);
	gl.bufferData(gl.ARRAY_BUFFER, ca/*.subarray(0, triangle_gl_num*12)*/, gl.STATIC_DRAW);

    gl.uniform4f(colorLocation, 0,0,0,0);//col.r, col.g, col.b, alfa);
    gl.drawArrays(gl.TRIANGLES, 0, 3*triangle_gl_num);
	
	va.length = 0;
	ca.length = 0;
	triangle_gl_array.length = 0;
	triangle_color_gl_array.length = 0;
	triangle_gl_num = 0;
}

function triangle_pattern_gl(context, x1, y1, x2, y2, x3, y3, pattern, alfa)
{
	triangle_gl(context, x1, y1, x2, y2, x3, y3, color_808080, alfa/2);
	return;
	triangle_gl_array[0] = x1;
	triangle_gl_array[1] = y1;
	triangle_gl_array[2] = x2;
	triangle_gl_array[3] = y2;
	triangle_gl_array[4] = x3;
	triangle_gl_array[5] = y3;
	gl.bufferData(gl.ARRAY_BUFFER, triangle_gl_array, gl.STATIC_DRAW);
    gl.uniform4f(colorLocation, 0.5, 0.5, 0.5, alfa);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function triangle_pattern2_gl(context, x1, y1, x2, y2, x3, y3, pattern, alfa)
{
	triangle_gl(context, x1, y1, x2, y2, x3, y3, color_00A0FF, alfa/2);
return;
	triangle_gl_array[0] = x1;
	triangle_gl_array[1] = y1;
	triangle_gl_array[2] = x2;
	triangle_gl_array[3] = y2;
	triangle_gl_array[4] = x3;
	triangle_gl_array[5] = y3;
	gl.bufferData(gl.ARRAY_BUFFER, triangle_gl_array, gl.STATIC_DRAW);
    gl.uniform4f(colorLocation, 0.0, 0.2, 0.5, alfa);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}

function rect_gl(x1, y1, wid, hei, col, alfa)
{
	x2 = x1 + wid;
	y2 = y1 + hei;
	triangle_gl(0, x1, y1, x2, y1, x1, y2, col, alfa);
	triangle_gl(0, x1, y2, x2, y1, x2, y2, col, alfa);
}

var pixel_gl_array = new Array;
pixel_gl_array = [];
var pixel_color_gl_array = new Array;
pixel_color_gl_array = [];
var pixel_gl_num = 0;

function pixel_gl(x1, y1, col, alfa)
{
	triangle_gl(context, x1, y1, x1, y1+1, x1+1, y1+1, col, alfa*1.2, 1);
	triangle_gl(context, x1, y1, x1+1, y1, x1+1, y1+1, col, alfa*1.2, 1);
	return;
	pixel_gl_array.push(x1, y1);
	pixel_gl_num++;
}

function pixel_paint_buffer_gl()
{
	if (!pixel_gl_num) return;

	l = pixel_gl_array.length;
	var va = new Float32Array(l);
	for (a = 0; a < l; a++)
		va[a] = pixel_gl_array[a];

	gl.bindBuffer(gl.ARRAY_BUFFER, triangle_buffer);
	gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
	gl.bufferData(gl.ARRAY_BUFFER, va, gl.STATIC_DRAW);

	l = pixel_color_gl_array.length;
	var ca = new Float32Array(l);
	for (a = 0; a < l; a++)
		ca[a] = pixel_color_gl_array[a];
		
	gl.bindBuffer(gl.ARRAY_BUFFER, triangle_color_buffer);
	gl.vertexAttribPointer(colorlistLocation, 4, gl.FLOAT, false, 0, 0);
	gl.bufferData(gl.ARRAY_BUFFER, ca, gl.STATIC_DRAW);

    gl.uniform4f(colorLocation, 0,0,0,0);//col.r, col.g, col.b, alfa);
    gl.drawArrays(gl.LINES, 0, pixel_gl_num*2);
	
	va.length = 0;
	ca.length = 0;
	pixel_gl_array.length = 0;
	pixel_color_gl_array.length = 0;
	pixel_gl_num = 0;
}

function circle_fill_gl(context, xm, ym, r, col, alfa)
{
	seg = 16;
	ang = 2*3.1415926 / seg;
	var a;

	for (a = 0; a <= seg; a++)
	{
		x = xm + Math.sin(ang * a) * r;
		y = ym + Math.cos(ang * a) * r;
		if (a)
		{
			triangle_gl(context, xm, ym, xp, yp, x, y, col, alfa);
		}
		xp = x;
		yp = y;
	}
}

function circle_gl(context, xm, ym, r, col, alfa)
{
	seg = 16;
	ang = 2*3.1415926 / seg;
	var a;

	for (a = 0; a <= seg; a++)
	{
		x = xm + Math.sin(ang * a) * r;
		y = ym + Math.cos(ang * a) * r;
		if (a)
		{
			line_gl(context, xp, yp, x, y, col, alfa, 1);
		}
		xp = x;
		yp = y;
	}
}

function clear_canvas_gl(col, alfa)
{
	rect_gl(0, 0, X_RES, Y_RES, col, alfa*0.777);
	triangle_paint_buffer_gl();
}

function paint_screen_gl()
{
	gl.useProgram(program_txt);
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.bindTexture(gl.TEXTURE_2D, frameBufferTexture);

	gl.uniform4f(textureAlpha, 1, 1, 1, 1);

	gl.bindBuffer(gl.ARRAY_BUFFER, triangle_buffer);
	gl.vertexAttribPointer(positionLocation_txt, 2, gl.FLOAT, false, 0, 0);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		0, 0,
		X_RES, 0,
		0, Y_RES,
		0, Y_RES,
		X_RES, 0,
		X_RES, Y_RES]), gl.STATIC_DRAW);
		
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		0.0,  1.0,
		1.0,  1.0,
		0.0,  0.0,
		0.0,  0.0,
		1.0,  1.0,
		1.0,  0.0]), gl.STATIC_DRAW);
		
    gl.drawArrays(gl.TRIANGLES, 0, 6);
	gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, frameBufferTexture, 0);
	gl.useProgram(program_flat);
}

function paint_fade_texture_gl(sx, sy, swid, shei, dx, dy, dwid, dhei, alfa)
{
	gl.useProgram(program_txt);

	gl.bindTexture(gl.TEXTURE_2D, frameBufferTextureFade);
	gl.uniform4f(textureAlpha, 1, 1, 1, alfa);

	gl.bindBuffer(gl.ARRAY_BUFFER, triangle_txt_buffer);
	gl.vertexAttribPointer(positionLocation_txt, 2, gl.FLOAT, false, 0, 0);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		dx, dy+dhei,
		dx+dwid, dy+dhei,
		dx, dy,
		dx, dy,
		dx+dwid, dy+dhei,
		dx+dwid, dy]), gl.STATIC_DRAW);
		
	gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
	gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);
	us = sx/X_RES; vs = 1 - sy/Y_RES;
	uw = swid/X_RES; vh = -shei/Y_RES;
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
		us,  vs+vh,
		us+uw,  vs+vh,
		us,  vs,
		us,  vs,
		us+uw,  vs+vh,
		us+uw,  vs]), gl.STATIC_DRAW);
		
    gl.drawArrays(gl.TRIANGLES, 0, 6);
	gl.useProgram(program_flat);
}

function swap_framebuffer_gl()
{
	var t = frameBufferTexture;
	frameBufferTexture = frameBufferTextureFade;
	frameBufferTextureFade = t;
	gl.bindFramebuffer(gl.FRAMEBUFFER, null);
	gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
	gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, frameBufferTexture, 0);
}