
var tsub = 0;//3*60000 + 48262;//53405;//1*60000+12527;//48262;//14082;//36514; //60000+12527;//53405;//60000+12527;//59510; //12527; // 53405;

var canvas = 0, context = 0;

var fps = 0, time = 0, time_last = 0;

var hi_det = 0;

function paint_fps()
{
	fps = (1000 / (time-time_last));

	put_ch = put_ch_full;
	print_at(context, 8, 16, font6x6, "fps:"+Math.floor(fps), RGB(0,0,0), 2, 1, 0);
}

function rnd(n)
{
  return Math.floor( Math.random() * n );
}

function sin(t,a)
{
	return(Math.sin((timeline_fx_time / t)*2*3.1415926)*a);
}

function cos(t,a)
{
	return(Math.cos((timeline_fx_time / t)*2*3.1415926)*a);
}


// CSV parser from somewhere at internet.. to read gox data
function CSVToArray(strData, strDelimiter)
{
    	// Check to see if the delimiter is defined. If not,
    	// then default to comma.
    	strDelimiter = (strDelimiter || ",");

    	// Create a regular expression to parse the CSV values.
    	var objPattern = new RegExp(
    		(
    			// Delimiters.
    			"(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

    			// Quoted fields.
    			"(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

    			// Standard fields.
    			"([^\"\\" + strDelimiter + "\\r\\n]*))"
    		),
    		"gi"
    		);


    	// Create an array to hold our data. Give the array
    	// a default empty first row.
    	var arrData = [[]];

    	// Create an array to hold our individual pattern
    	// matching groups.
    	var arrMatches = null;


    	// Keep looping over the regular expression matches
    	// until we can no longer find a match.
    	while (arrMatches = objPattern.exec( strData )){

    		// Get the delimiter that was found.
    		var strMatchedDelimiter = arrMatches[ 1 ];

    		// Check to see if the given delimiter has a length
    		// (is not the start of string) and if it matches
    		// field delimiter. If id does not, then we know
    		// that this delimiter is a row delimiter.
    		if (
    			strMatchedDelimiter.length &&
    			(strMatchedDelimiter != strDelimiter)
    			){

    			// Since we have reached a new row of data,
    			// add an empty row to our data array.
    			arrData.push( [] );

    		}


    		// Now that we have our delimiter out of the way,
    		// let's check to see which kind of value we
    		// captured (quoted or unquoted).
    		if (arrMatches[ 2 ]){

    			// We found a quoted value. When we capture
    			// this value, unescape any double quotes.
    			var strMatchedValue = arrMatches[ 2 ].replace(
    				new RegExp( "\"\"", "g" ),
    				"\""
    				);

    		} else {

    			// We found a non-quoted value.
    			var strMatchedValue = arrMatches[ 3 ];

    		}


    		// Now that we have our value string, let's add
    		// it to the data array.
    		arrData[ arrData.length - 1 ].push( strMatchedValue );
    	}

    	// Return the parsed data.
    	return( arrData );
}
// ---

function loadXMLDoc(data, process)
{
	var xmlhttp;

	if (window.XMLHttpRequest)
	{
		xmlhttp=new XMLHttpRequest();
	}
	else
	{
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	xmlhttp.onreadystatechange=function() { if (xmlhttp.readyState == 4 && (xmlhttp.status == 200 || xmlhttp.status  == 0)) { data.ready = 1; data.data = xmlhttp.responseText; process(data); }  }
	xmlhttp.open("GET",data.file,true);
	xmlhttp.setRequestHeader("Content-Type", "text/plain;charset=UTF-8");
	//xmlhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	xmlhttp.send();
}

//
// Copyright (c) 2014 Zden Hlinka ( Satori, s.r.o. ) - zden@satori.sk - Zd3N.com - satori.sk
// GNU GPL license
//

// ##
// ## TIMELINE
// ##

// ** EFFECTS **

function timeline_reset()
{
	timeline_pos = 0;
	timeline_fx_paint = timeline_fx_move = timeline_fx_end = 0;
	timeline_fx_time_start = timeline_fx_time = -1;

	timeline_fader_pos = 0;
	timeline_fader_paint = 0, timeline_fader_end = 0;
	timeline_fader_duration;
	timeline_fader_time_start = timeline_fader_time = -1;
	
	timeline_sync_pos = 0;
	timeline_sync_call = 0, timeline_sync_param;
	timeline_sync_time_start = -1;
}

var timeline_pos = 0;
var timeline_fx_paint = timeline_fx_move = timeline_fx_end = 0;
var timeline_fx_time_start = timeline_fx_time = -1;
var timeline_fx_time;

function timeline_rewind(tdata)
{
	c = tdata.length;
	while (timeline_pos < c && tdata[timeline_pos][0] < tsub) timeline_pos++;
}

function timeline(tdata)
{
	c = tdata.length;
	if (timeline_pos >= c) return;
	if (tdata[timeline_pos][0] - tsub <= time)
	{
		cc = timeline_effect.length;
		for (a = 0; a < cc; a++)
		{
			if (tdata[timeline_pos][1] == timeline_effect[a][0])
			{
				if (timeline_fx_end) timeline_fx_end();
				timeline_fx_paint = timeline_effect[a][1];
				timeline_fx_move = timeline_effect[a][2];
				timeline_fx_end = timeline_effect[a][3];
				timeline_fx_time_start = time;

				break;
			}
		}
		
		timeline_pos++;
	}
}

// ** FADERS **

var timeline_fader_pos = 0;
var timeline_fader_paint = 0, timeline_fader_end = 0;
var timeline_fader_duration;
var timeline_fader_time_start = timeline_fader_time = -1;

function timeline_fader_rewind(tdata)
{
	c = tdata.length;
	while (timeline_fader_pos < c && tdata[timeline_fader_pos][0] < tsub) timeline_fader_pos++;
}

function timeline_fader(tdata)
{
	c = tdata.length;
	if (timeline_fader_pos >= c) return;
	if (tdata[timeline_fader_pos][0] - tsub <= time)
	{
		cc = timeline_fader_list.length;
		for (a = 0; a < cc; a++)
		{
			if (tdata[timeline_fader_pos][1] == timeline_fader_list[a][0])
			{
				timeline_fader_paint = timeline_fader_list[a][1];
				timeline_fader_end = timeline_fader_list[a][2];
				timeline_fader_duration = tdata[timeline_fader_pos][2];
				timeline_fader_time_start = time;

				break;
			}
		}
		
		timeline_fader_pos++;
	}
}

// ** SYNC

var timeline_sync_pos = 0;
var timeline_sync_call = 0, timeline_sync_param;
var timeline_sync_time_start = -1;

function timeline_sync_rewind(tdata)
{
	c = tdata.length;
	while (timeline_sync_pos < c && tdata[timeline_sync_pos][0] < tsub) timeline_sync_pos++;
}

function timeline_sync(sdata)
{
	c = sdata.length;

	if (timeline_sync_pos >= c) return;
	if (sdata[timeline_sync_pos][0] - tsub <= time)
	{
		cc = timeline_sync_list.length;
		for (a = 0; a < cc; a++)
		{
			if (sdata[timeline_sync_pos][1] == timeline_sync_list[a][0])
			{
				timeline_sync_call = timeline_sync_list[a][1];
				timeline_sync_param = sdata[timeline_sync_pos][2];
				timeline_sync_call(timeline_sync_param);
				break;
			}
		}

		timeline_sync_pos++;
	}
}

// __________________
// ### STRINGAZ ###

function string_flash(string, time_, speed)
{
	var l = string.length;
	
	var pos = time_ % speed;
	pos %= l;
	
	return( string.substring(0, pos-1) );
}

function string_sequence(string, time_, speed)
{
	var l = string.length;
	
	var pos = Math.floor(time_ / speed);
	if (pos > l) pos = l+1;
	
	return( string.substring(0, pos-1) );
}

function string_fromline(string, line)
{
	var a;
	var l = string.length;
;
	for (a = 0; line && a < l; a++)
	{
		if (string.charAt(a) == '\n') line--;
	}
	
	return( string.substring(a, l) );

}

// timed

function get_alfa_timed(dur)
{
	if (timeline_fx_time < dur)
		return(timeline_fx_time / dur);
	return 1;
}

function min(m)
{
	return(m*60000);
}

function sec(s)
{
	return(s*1000);
}

function sec_dif(s)
{
	return(timeline_fx_time - s*1000);
}

function timefx_more(tt)
{
	return (timeline_fx_time > tt);
}

function timefx_less(tt)
{
	return(timeline_fx_time < tt);
}

// #############################

function demo_frame(canvas, context)
	{
		if (demo_paused)
		{
			requestAnimFrame(function() { demo_frame(canvas, context); });
			return;
		}

		time = (new Date()).getTime() - time_start;
		var move = time - time_last;

		timeline(timeline_data);
		timeline_fx_time = time - timeline_fx_time_start;
		timeline_fader(timeline_fader_data);
		timeline_fader_time = time - timeline_fader_time_start;
		if (timeline_fader_time > timeline_fader_duration)
		{
			if (timeline_fader_end)
				timeline_fader_end();
			timeline_fader_paint = 0;
		}
		timeline_sync(timeline_sync_data);

// -----------------------------------------

	timeline_fx_move(move);
	timeline_fx_paint();
	if (timeline_fader_paint)
		timeline_fader_paint(timeline_fader_time, timeline_fader_duration);

// -------------------------------------------------------------------


	//paint_fps();
	time_last = time;
	
	if (web_gl) paint_screen_gl();

        if (run_demo)
        	requestAnimFrame(function() { demo_frame(canvas, context); });
    }
	
// -------------

var img_nethemba, img_, img_b, box_glow, map_overlay, img_logo, img_intro_fader, img_r;
var img_city= new Array(7);

img_ = load_pic("dot_.png");
img_b = load_pic("dotb.png");
img_r = load_pic("dotr.png");
img_rm = load_pic("dotrm.png");
box_glow = load_pic("boxglow.png");
map_overlay = load_pic("mapshade.png");
img_intro_fader = load_pic("intro_white.png");
img_blob = load_pic("blob.png");
img_wbg = load_pic("wbg.png");
img_dotstr = load_pic("dotstr.png");
img_over1 = load_pic("over1.png");
img_over2 = load_pic("over2.png");
img_over3 = load_pic("over3.png");
img_overstr1 = load_pic("overstr1.png");
img_overstr2 = load_pic("overstr2.png");
img_overstr3 = load_pic("overstr3.png");
img_overgrt1 = load_pic("overgrt1.png");
img_overgrt2 = load_pic("overgrt2.png");
img_splash = load_pic("splash.png");

img_city = new Array(7);
img_city_ba = load_pic("img_c_ba.png");
img_city_ph = load_pic("img_c_ph.png");
img_city_vie = load_pic("img_c_vie.png");
img_city_lin = load_pic("img_c_lin.png");
img_city_tht = load_pic("img_c_tht.png");
img_city_nr = load_pic("img_c_nr.png");
img_city_rz = load_pic("img_c_rz.png");
img_city[0] = img_city_ba;
img_city[1] = img_city_ph;
img_city[2] = img_city_vie;
img_city[3] = img_city_lin;
img_city[4] = img_city_tht;
img_city[5] = img_city_nr;
img_city[6] = img_city_rz;

function demo_reset()
{
	timeline_reset();
	clear_canvas(canvas, color_white, 1);
	
	box_sync = 0, box_stype = 0;

	box_num = [ -1, -1, -1, -1, -1, -1, -1, -1 ];
	box_pos = [ 0, 0, 0, 0, 0, 0, 0, 0 ];
	box_num_time = 0;

	nethemba_end_img_loaded = 0;
	whiz_pos = 0;
	calm_fade_type = 0;
	calm_type = 0;
	tunel_path = 0;

	puzzle = [ 0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0,  0, 0, 0, 0, 0 ];
	tunel_flash_val = 0;

	credits_pos = 0;
	credits_start_time = 0;

	tunel_move_type = 0;

	satori_tick_time = -1

	world_ang_x = 0;
	world_ang_y = 0;
	world_ang_z = 0;
	world_line_paint = 0;
	world_pos_z = 310;

	world_flash_val = 0;
	world_end_time = -1;
	world_reshow_time = -1;

	network_type = 0;

	network_medusa_on = 0;
	network_medusa_start_time = 0;
	network_kula_on = 0;
	network_kula_start_time = 0;
	network_end_on = 0;
	network_end_morph_on = 0;
	network_end_morph_start_time = 0;
	network_end_morph_level;
	network_trip_morph_level = 0;
	network_trip_morph_on = 0;
	network_trip_morph_start_time = 0;
	network_poly_rnd = 0;
	network_demo_title_time = -1;

	network_end_img_loaded = 0;

	network_snap_end = 0;

	map_end_img_loaded = 0;
}