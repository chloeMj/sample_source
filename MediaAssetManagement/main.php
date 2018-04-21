<?php
session_start();
require_once($_SERVER['DOCUMENT_ROOT'].'/out.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/lib/functions.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/lib/lang.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/lib/config.php');

$thumb_box_margin = $db->queryOne("select value from bc_html_config where type='thumb_box_margin'");
$thumb_box_width = $db->queryOne("select value from bc_html_config where type='thumb_box_width'");
$thumb_box_height = $db->queryOne("select value from bc_html_config where type='thumb_box_height'");
$list_box_margin = $db->queryOne("select value from bc_html_config where type='list_box_margin'");
$list_box_width = $db->queryOne("select value from bc_html_config where type='list_box_width'");
$list_box_height = $db->queryOne("select value from bc_html_config where type='list_box_height'");

$user_id = $_SESSION['user']['user_id'];
$is_admin = $_SESSION['user']['is_admin'];
$user_email = $_SESSION['user']['user_email'];

//media 와 cg 모듈 구분

$check_pw = $db->queryOne("
	SELECT	COALESCE((
					SELECT	USE_YN
					FROM		BC_SYS_CODE A
					WHERE	A.TYPE_ID = 1
						AND	A.CODE = 'CHECK_PASSWORD_YN'), 'N') AS USE_YN
	FROM	(
			SELECT	USER_ID
			FROM		BC_MEMBER
			WHERE	USER_ID = 'admin') DUAL
");


$check_lang = $_SESSION['user']['lang'];
// SESSION TIME LIMIT
$session_time_limit = $db->queryOne("
							SELECT	REF1
							FROM	BC_SYS_CODE
							WHERE	CODE = 'SESSION_TIME_LIMIT'
						");

$user_option = $db->queryRow("
	SELECT	top_menu_mode, slide_thumbnail_size, first_page
	FROM		bc_member_option
	WHERE	member_id = (
		SELECT	member_id
		FROM		bc_member
		WHERE	user_id =  '".$user_id."'
	)
");
$first_page = trim($user_option['first_page']);

/**
  agent 접속 관련 부분 추가
  2016 . 08 22
  by hkh
*/

$hide_menu_flag = "false";

$adobe_plugin = array(
    'isPluginUse'=>'false',
    'isAgentnm'=>'',
    PREMIERE_AGENT_NM => array(
      "plugin_flag"=>'false',
      "menu_hide_flag"=>'false',
      "ud_content_id"=>0
    ),
    PHOTOSHOP_AGENT_NM => array(
      "plugin_flag"=>'false',
      "menu_hide_flag"=>'false',
      "ud_content_id"=>0,
      "bs_content_id"=>0
    )
);

try{

    if($_REQUEST['agent'] == PREMIERE_AGENT_NM){
      $peremiere_plugin_use_yn = $arr_sys_code['premiere_plugin_use_yn']['use_yn'];
      if($peremiere_plugin_use_yn != 'Y'){
          throw new Exception(_text('MSG02501'));
      }else {
          //걸정 관련 파일 확인
          //메뉴 보이게 할것인가?
          $adobe_plugin[PREMIERE_AGENT_NM]['plugin_flag'] = 'true';
          $adobe_plugin[isAgentnm] = PREMIERE_AGENT_NM;

          $premiere_menu_yn       = $arr_sys_code['premiere_plugin_use_yn']['ref1'];
          $premiere_ud_content_id = $arr_sys_code['premiere_plugin_use_yn']['ref2'];

          $adobe_plugin[PREMIERE_AGENT_NM]['ud_content_id'] = $premiere_ud_content_id;

          if($premiere_menu_yn == 'N'){
            //$premiere_menu_hide_flag = 'true';
            $adobe_plugin[PREMIERE_AGENT_NM]['menu_hide_flag'] = 'true';
            $hide_menu_flag  = 'true';
          }

          $adobe_plugin['isPluginUse'] = 'true';
      }
    }
    else if($_REQUEST['agent'] == PHOTOSHOP_AGENT_NM){
      $photoshop_plugin_use_yn = $arr_sys_code['photoshop_plugin_use_yn']['use_yn'];
      if($photoshop_plugin_use_yn != 'Y'){
          throw new Exception(_text('MSG02501'));
      }else {
          //걸정 관련 파일 확인
          //메뉴 보이게 할것인가?
          $adobe_plugin[PHOTOSHOP_AGENT_NM]['plugin_flag'] = 'true';
          $adobe_plugin[isAgentnm] = PHOTOSHOP_AGENT_NM;
          //$photoshop_plugin_flag = 'true';
          $photoshop_menu_yn       = $arr_sys_code['photoshop_plugin_use_yn']['ref1'];
          $photoshop_ud_content_id = $arr_sys_code['photoshop_plugin_use_yn']['ref2'];

          $adobe_plugin[PHOTOSHOP_AGENT_NM]['ud_content_id'] = $premiere_ud_content_id;
          $adobe_plugin[PHOTOSHOP_AGENT_NM]['bs_content_id'] = $arr_sys_code['photoshop_plugin_use_yn']['ref5'];

          if($photoshop_menu_yn == 'N'){
            //$photoshop_menu_hide_flag = 'true';
            $adobe_plugin[PHOTOSHOP_AGENT_NM]['menu_hide_flag'] = 'true';
            $hide_menu_flag  = 'true';
          }

          $adobe_plugin['isPluginUse'] = 'true';
      }
    }

}catch(Exception $e){
    die($e->getmessage());
}

?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=Edge" />
<meta http-equiv="X-UA-Compatible" content="IE=9" />
    <title><?=_text('MN00092')?>::<?=_text('MN00090')?></title>
	<link rel="SHORTCUT ICON" href="css/images/logo/Ariel.ico"/>
	<link rel="stylesheet" type="text/css" href="/npsext/resources/css/ext-all.css" />
	<link rel="stylesheet" type="text/css" href="/css/xtheme-proxima.css" />

	<link rel="stylesheet" type="text/css" href="/npsext/examples/ux/css/Portal.css" />
	<link rel="stylesheet" type="text/css" href="/npsext/examples/ux/css/MultiSelect.css" />
	<link rel="stylesheet" type="text/css" href="/npsext/examples/ux/css/ProgressColumn.css" />
	<link rel="stylesheet" type="text/css" href="/ext-3.3.0/examples/ux/css/ColumnHeaderGroup.css" />
	<link rel="stylesheet" type="text/css" href="/npsext/examples/ux/treegrid/treegrid.css" rel="stylesheet" />
	<link rel="stylesheet" type="text/css" href="/css/font-awesome.min.css">
	<link rel="stylesheet" type="text/css" href="/videojs/video-js.css">
	<link rel="stylesheet" type="text/css" href="/css/style.css" />
	<script type="text/javascript" src="/javascript/script.js"></script>
	
	<link rel="stylesheet" type="text/css" href="/js/jquery-ui-1.11.4/jquery-ui.min.css" />

	<style type="text/css">


	* {margin:0; padding:0;  list-style:none; outline: none;}
	.user-custom-container {
		background-color: #e6e6e6;
	}

	.app-msg .x-box-bl, .app-msg .x-box-br, .app-msg .x-box-tl, .app-msg .x-box-tr {
		background-image: url(/images/box-round-images/corners.gif);
	}

	.app-msg .x-box-bc, .app-msg .x-box-mc, .app-msg .x-box-tc {
		background-image: url(/images/box-round-images/tb.gif);
	}

	.app-msg .x-box-mc {
		color: darkorange;
		background-color: #c3daf9;
	}

	.app-msg .x-box-mc h3 {
		color: red;
	}

	.app-msg .x-box-ml {
		background-image: url(/images/box-round-images/l.gif);
	}

	.app-msg .x-box-mr {
		background-image: url(/images/box-round-images/r.gif);
	}

	.custom-nav-tab {
		background-color: #BDBDBD;
		padding: 0 0 0 4;
	}

	.tab-over-cls {
		background-color:red;
	}

	.readonly-class {
		background-color: #DADADA;
		background-image: none;
		border-color: #B5B8C8;
	}
	.notice_grid_css TD {
		/*background-color: #FFFFFF;*/
		border: 0px;
		/*background-image: none;*/
		padding: 0px;
		font-size: 12px;
	}

	.notice_grid_css .x-grid3-header-offset {
		background-color: #ffffff;
		border: 0px;
		/*background-image: none;*/
		padding: 0px;
		height: 0px;
	}

	.notice_grid_css .x-grid3-row {
		background-color: #ffffff;
		border: 0px;
		/*background-image: none;*/
		height: 19px;
		padding: 0px;

	}
	.x-ux-grid-pagesizer td, .x-ux-grid-pagesizer span, .x-ux-grid-pagesizer input, .x-ux-grid-pagesizer div, .x-toolbar select, .x-ux-grid-pagesizer label {
		font: 20px arial,tahoma,helvetica,sans-serif;
	}
	.x-ux-grid-pagesizer div .x-ux-grid-pagesizer text{
		display: block;
	    line-height: 36px;
		padding: 2px 2px 0;	}

	.multiline-row .x-grid3-td-1 .x-grid3-cell-inner,
	.multiline-row .x-grid3-td-2 .x-grid3-cell-inner,
	.multiline-row .x-grid3-td-3 .x-grid3-cell-inner {
	    word-break: break-all !important;
    	white-space: pre-wrap !important;
	}
	.header_small_mode #total_new_notice, .header_small_mode #total_new_content_all_tab, .header_small_mode #total_new_request{
	    /*float: right;
    	margin-top: 1px;*/
    	padding-left: 5px;
	}
	.header_big_mode #total_new_notice, .header_big_mode #total_new_content_all_tab, .header_big_mode #total_new_request{
	    float: right;
    	margin-top: -31px;
    	margin-right: 30px;
	}
	.new_count_icon{
	    background: red;
	    border: 2px solid red;
	    border-radius: 50%;
	}
	.more_tag_button:hover,.clear_tag_button:hover {
    	color: #907C7C;
	}
	.text_customize_11{
		font-size: 11px;
	    color: #211818;
	    /*font-weight: bold; */
	}
	#help_icon_meaning .x-window-body{
		background: white;
	}

	#a-search-field-tab .x-box-layout-ct {
		background-color: #eaeaea !important;
	}
	.fieldset-items{
	    margin-bottom: 0px !important;
    	padding: 0px 0px 0px 10px;
    	margin-left: -10px;
	}
	.fieldset-content-types{
		margin-bottom: 0px !important;
    	padding: 0px 0px 0px 10px;

	}

	#a-search-field .x-tab-panel-bwrap{
		border: 1px solid #CCCCCC;
	    padding: 10px 10px 10px 10px;

	}
	.fieldset-items .x-fieldset-bwrap {
		border-top: 1px solid #CCCCCC;
		padding-top: 10px;
	}

	#a-search-win.x-panel
	{
		border-bottom: 1px solid #ccc;
		z-index:10;
	}

	#a-search-win-xcollapsed {
      display: none !important;
   }
	#list_comment .reply{
	    padding: 7px 14px;
	    /* background-color: #e6e6e6; */
	    color: #666;
	}
	#list_comment .reply strong{font-size:12px;color:#009fe3;}
	#list_comment .reply .wrep_reply{margin-top:8px;border-top:1px solid #ccc;}
	#list_comment .reply .wrep_reply li:first-child{margin-top:-1px;}
	#list_comment .reply .wrep_reply li{position:relative;top:0;left:0;margin-top:14px;border-top:1px dotted #ccc;padding-top:11px;}
	#list_comment .reply .wrep_reply li .btn_del{position:absolute;top:11px;right:0;display:block;padding-left:11px;background:url(../css/images/del.png) no-repeat 0 3px;}
	#list_comment .reply .wrep_reply li dl dt{font-size:12px;}
	#list_comment .reply .wrep_reply li dl dt span{color:#333;}
	#list_comment .reply .wrep_reply li dl dd{margin-top:6px;}
	#list_comment a{color:#333;text-decoration:none;}
	.multiline_row_line, .multiline_row_line td div{
	 	word-break: break-all !important;
    	white-space: pre-wrap !important;
	}
	.tag_filter_selected{
		border: 2px solid;
	}

	/* I'm not happy to have to include this hack but since we're using floating elements */
	/* this is needed, if anyone have a better solution, please keep me posted! */
	/*
	.x-grid3-body:after { content: "."; display: block; height: 0; font-size: 0; clear: both; visibility: hidden; }
	.x-grid3-body { display: inline-block; }
	*/
	/* Hides from IE Mac \*/
	/*
	* html .x-grid3-body { height: 1%; }
	.x-grid3-body { display: block; }
	*/
	/* End Hack */
	/*!
	 * Ext JS Library 3.0.0
	 * Copyright(c) 2006-2009 Ext JS, LLC
	 * licensing@extjs.com
	 * http://www.extjs.com/license
	 */
	 .x-grid3-col-title{
		text-align: left;
	 }
	.x-grid3-td-title b {
		font-family:tahoma, verdana;
		display:block;
	}
	.x-grid3-td-title b i {
		font-weight:normal;
		font-style: normal;
		color:#000;
	}
	.x-grid3-td-title .x-grid3-cell-inner {
		white-space:normal;
	}
	.x-grid3-td-title a {
		color: #385F95;
		text-decoration:none;
	}
	.x-grid3-td-title a:hover {
		text-decoration:underline;
	}
	.details .x-btn-text {
		background-image: url(details.gif);
	}

	.x-resizable-pinned .x-resizable-handle-south{
		//11-11-16, 승수. 파일 없음. 	background:url(../../resources/images/default/sizer/s-handle-dark.gif);
		background-position: top;
	}
	.x-grid3-row-body p {
		margin:5px 5px 10px 5px !important;
	}
	.x-grid3-col-fileinfo{
		text-align: right;
	}

	.inner-body {
		margin: 0;
		padding: 0;
		background: #1b1b1b url(/images/web_bg_blue.jpg) top left repeat-x;
		font-family: Arial;
		font-size: 0.8em;
		width:100%;
	}

	.icon-506 {
		background-image:url(/led-icons/film.png) !important;
	}

	.icon-515 {
		background-image:url(/led-icons/music.png) !important;
	}

	.icon-57057 {
		background-image:url(/led-icons/book.png) !important;
	}

	.icon-518 {
		background-image:url(/led-icons/image_1.png) !important;
	}

	/* I'm not happy to have to include this hack but since we're using floating elements */
	/* this is needed, if anyone have a better solution, please keep me posted! */
	.x-grid3-body:after { content: "."; display: block; height: 0; font-size: 0; clear: both; visibility: hidden; }
	.x-grid3-body { display: inline-block; }
	/* Hides from IE Mac \*/
	* html .x-grid3-body { height: 1%; }
	.x-grid3-body { display: block; }
	/* End Hack */


	/*섬네일+리스트보기*/
	.ux-explorerview-detailed-icon-row { width: <?=$list_box_width?>; height: <?=$list_box_height+35?>; float: left; margin: <?=$list_box_margin?>; border: none; border: 1px solid #DCDCDC; }
	.ux-explorerview-detailed-icon-row .x-grid3-row-table { width: 100%;height: 65px; }
	.ux-explorerview-detailed-icon-row .x-grid3-row-table td.ux-explorerview-icon { width: 80px;  border: 0px solid blue; }
	.ux-explorerview-detailed-icon-row .x-grid3-row-table td.ux-explorerview-icon img { border: 0px solid yellow; margin: auto 0 auto 0; }
	.ux-explorerview-detailed-icon-row .x-grid3-row-table x-grid3-col x-grid3-cell { }

	/*섬네일보기*/
	.ux-explorerview-large-icon-row { width: <?=$thumb_box_width?>; height: 160px; float: left; margin: <?=$thumb_box_margin?>; border: 1px solid #DCDCDC; line-height:0; }
	.ux-explorerview-large-icon-row .x-grid3-row-table { width: 100%; line-height:0;}
	.ux-explorerview-large-icon-row .x-grid3-row-table td { text-align: center; vertical-align:middle; }
	.ux-explorerview-large-icon-row .x-grid3-row-table tr { line-height:0; }
	.ux-explorerview-large-icon-row .x-grid3-row-table img { display: block; vertical-align:middle;text-align:center;}
	.x-grid3-row .ux-explorerview-large-icon-row .x-grid3-row-table .x-grid3-col x-grid3-cell ux-explorerview-icon {}


	/*섬네일보기_image*/
	.ux-explorerview-large-icon-row_i { width: <?=$thumb_box_width?>; height: 175px; float: left; margin: <?=$thumb_box_margin?>; border: 1px solid #DCDCDC; line-height:0; }
	.ux-explorerview-large-icon-row_i .x-grid3-row-table { width: 100%; line-height:0;}
	.ux-explorerview-large-icon-row_i .x-grid3-row-table td {  }
	.ux-explorerview-large-icon-row_i .x-grid3-row-table tr { line-height:0; }
	.ux-explorerview-large-icon-row_i .x-grid3-row-table img { display: block; vertical-align:center;}



	/*.x-grid3-row .ux-explorerview-large-icon-row x-grid3-row-first x-grid3-row-selected*/
	/*.x-grid3-row .ux-explorerview-large-icon-row .x-grid3-row-selected {*/

	/*.x-grid3-row-selected {
		background-color:  #4682B4 !important;
	}*/

		/*섬네일보기*/
	.ux-explorerview-large-icon-row_t { width: 160px; height: 125px; float: left; margin: <?=$thumb_box_margin?>;  border: 1px solid #DCDCDC; line-height:0; }
	.ux-explorerview-large-icon-row_t .x-grid3-row-table { line-height:0;}
	.ux-explorerview-large-icon-row_t .x-grid3-scroller { width:100%;}

	.ux-explorerview-large-icon-row_t .x-grid3-row-table td { text-align: center;vertical-align:middle;  }
	.ux-explorerview-large-icon-row_t .x-grid3-row-table tr { line-height:0; }
	.ux-explorerview-large-icon-row_t .x-grid3-row-table img { display: block; vertical-align:middle;text-align: center;}

	/*미승인 콘텐츠 표시*/
	.x-grid3-row.ux-unaccept {
			background-color:#ffffcc !important;
		}

	.ux-unaccept.x-grid3-row-selected {
		background-color:#CCCCCC !important;
		background-image: none;
		border-color:#ACACAC;
	}
	.ux-unaccept .x-grid3-row-over {
		border-color:#ddd;
		background-color:#efefef;
		background-image:url(/npsext/resources/images/default/grid/row-over.gif);
	}





	.x-toolleft {
		float: left;
	}
	/*
	.x-tool-refresh20 {background-image: url(/css/h_img/win_refresh.png ) !important;repeat-x; width: 20px; height: 20px;margin: 0px 10px 0px 0px;}
	.x-tool-detail {background-image: url(/css/h_img/win_list.png) !important;repeat-x; width: 20px; height: 20px;margin: 0px 10px 0px 0px;}
	.x-tool-list {background-image: url(/css/h_img/win_look_list.png) !important;repeat-x;width: 20px; height: 20px;margin: 0px 10px 0px 0px;}
	.x-tool-tile {background-image: url(/css/h_img/win_look.png) !important;repeat-x;width: 20px; height: 20px;margin: 0px 10px 0px 0px;}
*/

	.gridBodyNotifyOver {
        border-color: #00cc33 !important;
    }
    .gridRowInsertBottomLine {
        border-bottom:1px dashed #00cc33;
    }
    .gridRowInsertTopLine {
        border-top:1px dashed #00cc33;
    }

    #loading-mask{
        position:absolute;
        left:0;
        top:0;
        width:100%;
        height:100%;
        z-index:20000;
        background-color:white;
		-webkit-transition: all 0.5s cubic-bezier(0.7,0,0.3,1);
		-moz-transition: all 0.5s cubic-bezier(0.7,0,0.3,1);
		-ms-transition: all 0.5s cubic-bezier(0.7,0,0.3,1);
		-o-transition: all 0.5s cubic-bezier(0.7,0,0.3,1);
		transition: all 0.5s cubic-bezier(0.7,0,0.3,1);
    }

	#loading{
    	border: 0px solid black;
        position:absolute;
        left:50%;
        top:50%;
        padding:2px;
        z-index:20001;
        height:auto;
		margin-top: -50px;
		margin-left: -144px;
		-webkit-transition: all 0.5s cubic-bezier(0.7,0,0.3,1);
		-moz-transition: all 0.5s cubic-bezier(0.7,0,0.3,1);
		-ms-transition: all 0.5s cubic-bezier(0.7,0,0.3,1);
		-o-transition: all 0.5s cubic-bezier(0.7,0,0.3,1);
		transition: all 0.5s cubic-bezier(0.7,0,0.3,1);
    }
    #loading a {
        color:#225588;
    }
    #loading .loading-indicator{
        //background:white;
        color:#444;
        font:bold 13px tahoma,arial,helvetica;
        padding:10px;
        margin:0;
        height:auto;
    }
    #loading-msg {
        font: normal 10px arial,tahoma,sans-serif;
    }

	#images-view .x-panel-body{
		background: white;
		font: 11px Arial, Helvetica, sans-serif;
	}
	#images-view .thumb{
		/*background: #dddddd; */
		padding: 3px;
	}
	#images-view .thumb img{
		display:table-cell;
		vertical-align:middle;
		margin:auto;
		width:auto;
		height:auto;
		max-width:128px;
		max-height:72px;
	}
	#images-view .thumb-wrap{
		float: left;
		margin: 4px;
		margin-right: 0;
		padding: 5px;
		position: relative;
	}
	.comments{
		background-color: blue;
	}
	#images-view .thumb-wrap span{
		display: block;
		overflow: hidden;
		text-align: center;
	}
    #images-view .thumb-wrap-disable{
		float: left;
		margin: 4px;
		margin-right: 0;
		padding: 5px;
		position: relative;
	}
	#images-view .thumb-wrap-disable span{
		display: block;
		overflow: hidden;
		text-align: center;
	}


	#images-view .x-view-over{
		//border:1px solid #dddddd;
		-webkit-box-shadow:inset 0px 0px 0px 1px #fa8c15;
		-moz-box-shadow:inset 0px 0px 0px 1px #fa8c15;
		box-shadow:inset 0px 0px 0px 1px #fa8c15;
		background: #efefef url(../../resources/images/default/grid/row-over.gif) repeat-x left top;
		//padding: 4px;
	}

	#images-view .x-view-selected{
		background: #eff5fb url(images/selected.gif) no-repeat right bottom;
		//border:1px solid #99bbe8;
		//padding: 4px;
		-webkit-box-shadow:inset 0px 0px 0px 1px #fa8c15;
		-moz-box-shadow:inset 0px 0px 0px 1px #fa8c15;
		box-shadow:inset 0px 0px 0px 1px #fa8c15;
	}
	#images-view .x-view-selected .thumb{
		background:transparent;
	}
	#images-view .sb-view-selected{
		background: #eff5fb url(images/selected.gif) no-repeat right bottom;
		//border:1px solid #99bbe8;
		//padding: 4px;
		-webkit-box-shadow:inset 0px 0px 0px 1px #fa8c15;
		-moz-box-shadow:inset 0px 0px 0px 1px #fa8c15;
		box-shadow:inset 0px 0px 0px 1px #fa8c15;
	}
	#images-view .sb-view-selected .thumb{
		background:transparent;
	}

	#images-view .loading-indicator {
		font-size:11px;
		background-image:url('../../resources/images/default/grid/loading.gif');
		background-repeat: no-repeat;
		background-position: left;
		padding-left:20px;
		margin:10px;
	}
	#images-view .line_separator{
		border-top: 1px solid #CCCCCC;
    	//padding-top: 5px;
	}
	#images-view .text_ellipsis{
		white-space: nowrap;
		text-overflow: ellipsis;
		margin-right: 76px;
		display: block;
		overflow: hidden;
		padding: 5px 0px 5px 0px;
	}
	#images-view .expand-collapse-image{
		//margin-left: 6px;
	}
	#images-view .drag_sub_story_board{
		width: 16px;
		float: right;
		margin: -19px 54px 0px 0px;
	}
	#images-view .sb_metadata{
		float:left;
		padding-top:10px;
		padding-left: 6px;
		height:85px;
	}
	#images-view .icon_square{
		font-size:19px;
		margin: 0px 0px 0px 10px;
		width: auto;
	}
	#images-view .icon_square_error{
		font-size:19px;
		color:#ff6600;
		margin: 0px 0px 0px 10px;
		width: auto;
	}
	#images-view .icon_file_thumb{
		font-size:10px;
		margin: 3px 0px 0px 13px;
		width: auto;
	}
	#images-view .icon_square_poster{
		font-size:19px;
		margin: 0px 0px 0px 10px;
		width: auto;
	}
	#images-view .icon_file_poster{
		font-size:11px;
		margin: 4px 0px 0px 12px;
		width: auto;
	}
	#images-view .icon_text_thumb{
		padding-top: 3px;
		padding-left: 10.5px;
		font-size: 10px;
		font-weight: bold;
		width: auto;
		cursor: context-menu;
	}
	#images-view .icon_text_loudness_thumb{
		padding-top: 3px;
		padding-left: 11.5px;
		font-size: 10px;
		font-weight: bold;
		width: auto;
		cursor: context-menu;
	}

	#catalog_info_tab .x-toolbar-cell .x-form-cb-label{
		top: 0px;
	}
	#catalog_info_tab .x-toolbar-cell .x-form-checkbox,#catalog_info_tab .x-form-check-wrap input{
		margin-top: 2px;
	}
	#catalog_info_tab .x-form-check-wrap{
		padding-right: 4px;
	}
	.cursor-class{
		cursor: pointer;
	}

	/*시스템 작업관리 자동 새로고침 CSS*/
	.x-box-layout-ct{
		background-color:#f0f0f0;
		font: normal 11px arial,tahoma,sans-serif;
		border:0px  solid #99bbe8 !important;
	}

	.mainnav-date {
		background-image: url(/led-icons/calendar_2.png) !important;
	}
	.mainnav-category {
		background-image: url(/led-icons/text_padding_bottom.png) !important;
	}

	.subnav-favorite {
		background-image: url(/led-icons/zicon.gif) !important;
	}
	.subnav-workflow {
		background-image: url(/led-icons/workicon.gif) !important;
	}

	.is-hidden-content {
		background-color: #DDA0DD;
	}

	.review-ready {
		background-color: red;
	}

	/*
	.content-status-reg-ready {
		background-color: #;
	}
	*/
	.content-status-reg-request {
		background-color: #FFD700;
	}
	/*
	.content-status-reg-complete {
		background-color: #;
	}
	*/
	.content-status-review-ready {
		background-color: #A9A9A9;
	}
	.content-status-review-complete {
		background-color: #778899;
	}
	.content-status-review-return {
		background-color: #E9967A;
	}
	.content-status-review-half {
		background-color: #DCDCDC;
	}

	.ct-override {
		background-color: red;
	}
	.wait_list_modified {
		background-color: #FFFFBB;
	}

	.x-list-body-inner dl {
	   border-bottom: 1px solid #DDDDDD;
	   border-right: 1px solid #DDDDDD;
	}

	/* progress */
	.x-grid3-td-progress-cell .x-grid3-cell-inner {
		font-weight: bold;
	}

	.x-grid3-td-progress-cell .high {
		background: transparent url(/npsext/examples/ux/images/progress-bg-green.gif) 0 -33px;
	}

	.x-grid3-td-progress-cell .medium {
		/*background: transparent url(/npsext/examples/ux/images/progress-bg-orange.gif) 0 -33px;*/
		background: transparent url(/npsext/examples/ux/images/progress-bg-middle.gif) 0 -33px;
	}

	.x-grid3-td-progress-cell .low {
		/*background: transparent url(/npsext/examples/ux/images/progress-bg-green.gif) 0 -33px;*/
		background: transparent url(/npsext/examples/ux/images/progress-bg-low.gif) 0 -33px;
	}

	.x-grid3-td-progress-cell .ux-progress-cell-foreground {
		color: #fff;
	}

        .ariel_user_add {
		background: url('/coquette/png/16x16/add_user.png') 0 4px no-repeat !important;
	}
	.ariel_wait {
		background: url('/led-icons/wait.png') 0 7px no-repeat !important
	}

	/* ¸Þ´º°ü·Ã  */
	/*
	.menu_bar
	{
		border: 0 solid #FFFFFF;
		-webkit-border-radius: 2px;
	   -moz-border-radius: 2px;
		border-radius: 2px;
		color: #FFFFFF;
		font-size: 12px;
		font-weight: 800;
		line-height: 21px;
		padding: 1px;
		text-decoration: none;
		background: #1B9DE9;
	}

	#menu li
	{
		float:left;
		width:110px;
		font-size:14px;
		font-family: ³ª´®°íµñ;
		text-align:center;
		cursor:pointer;
		height:30px;
		line-height:30px;
		-webkit-transition: all 0.25s ease-in-out;
		-moz-transition: all 0.25s ease-in-out;
		-ms-transition: all 0.25s ease-in-out;
		-o-transition: all 0.25s ease-in-out;
		transition: all 0.25s ease-in-out;
		border-radius:7px;
		font-weight:bold;
		color:#7f7f7f;
		position:relative;
	}

	.menu_t:hover > a
	{
		 color:#fff;
		 text-shadow: 1px 1px #7f7f7f;
		//background-color:#046BBF;
		///height:45px;
		//background: -webkit-linear-gradient(top,  #046BBF , #008BFD); /*Safari 5.1-6*/
		//background: -o-linear-gradient(top, #046BBF , #008BFD);  /*Opera 11.1-12*/
		//background: -moz-linear-gradient(top,#046BBF , #008BFD); /*Fx 3.6-15*/
		//background: linear-gradient(to top,#046BBF , #008BFD);  /*Standard*/
	}

	.menu_t:active > a
	{
		 color:#3b3b3b;
		 text-shadow: 0px;
	}

	.menu_t > a {
		font-family: ³ª´®°íµñ;
		letter-spacing: 0.01em;
		line-height: 200%;
		text-align: left;
		text-decoration: none;
		color: #7f7f7f;
		-webkit-transition: all 0.25s ease-in-out;
		-moz-transition: all 0.25s ease-in-out;
		-ms-transition: all 0.25s ease-in-out;
		-o-transition: all 0.25s ease-in-out;
		transition: all 0.25s ease-in-out;
	}


	.menu_t:after
	{
	  -webkit-transition: all 0.25s ease-in-out;
	  -moz-transition: all 0.25s ease-in-out;
	   -ms-transition: all 0.25s ease-in-out;
	   -o-transition: all 0.25s ease-in-out;
	  transition: all 0.25s ease-in-out;
	  content: "";
	  position: absolute;
	  top: 33px;
	  left: 50%;
	  margin-left: -10px;
	  width: 0px;
	  height 0px;
	  xxmargin: 0px auto;
	  border-left: 12px solid transparent;
	  border-right: 10px solid transparent;
	  //border-bottom: 10px solid #046BBF;
	  border-bottom: 10px solid #046bbf;
      filter: alpha(opacity=0);
	  -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=0)";
	   opacity: 0;
	}*/

	.menu_t:hover:after{
	   opacity: 1;
	   -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=100)";
	   filter: alpha(opacity=100);
	  border-bottom: 10px solid #046bbf;
	}

	.menu_active
	{
		color:#fff;
	}

	.menu_arrow {
		//border-bottom: 10px solid #046bbf;
		border-bottom: 10px solid #046bbf;
		border-left: 12px solid transparent;
		border-right: 10px solid transparent;
		content: "";
		left: 50%;
		margin-left: -10px;
		filter: alpha(opacity=1); /* For IE8 and earlier */
	   -ms-filter: "progid:DXImageTransform.Microsoft.Alpha(Opacity=1)";
	   opacity: 1;
		position: absolute;
		top: 33px;
		transition: all 0.25s ease-in-out 0s;
		width: 0;
	}

	.user_login
	{
		box-shadow:1px 1px 1px #f1f1f1;
		background-color: #000;
		border-radius: 7px;
		color: #fff;
		display: inline-block;
		height: 24px;
		line-height: 24px;
		padding: 4px 6px 2px 10px;
		 -webkit-transition: all 0.25s ease-in-out;
	  -moz-transition: all 0.25s ease-in-out;
	   -ms-transition: all 0.25s ease-in-out;
	   -o-transition: all 0.25s ease-in-out;
	  transition: all 0.25s ease-in-out;
	  cursor:pointer;
	}

	.user_login:hover
	{
		background-color: #3B3B3B;
	}

	.logout
	{
	  -webkit-transition: all 0.25s ease-in-out;
	  -moz-transition: all 0.25s ease-in-out;
	  -ms-transition: all 0.25s ease-in-out;
	  -o-transition: all 0.25s ease-in-out;
	  transition: all 0.25s ease-in-out;
	}

	.user_login:hover .logout
	{
	 -webkit-transform: rotate(90deg); /* Safari and Chrome */
	 -moz-transform: rotate(90deg);   /* Firefox */
	 -ms-transform: rotate(90deg);   /* IE 9 */
	 -o-transform: rotate(90deg);   /* Opera */
	 transform: rotate(90deg);
	}

	/*

		Panel
	*/
/*
	.x-tip {
		width: auto !important;
	}
	.x-tip-body {
		width: auto !important;
	}
	.x-tip-body span {
		width: auto !important;
	}

	.x-panel-body-noheader, .x-panel-mc .x-panel-body {
		border-top: 0px solid;
	}
	.x-tab-panel-header {
		//border:1px solid #d0d0d0;
		//padding-bottom: 0px;
		//border-bottom:0px solid #d0d0d0;
	}



	.x-panel-noborder .x-panel-tbar-noborder .x-toolbar {
		border-style: none;
		//border-width: 0 0 0px;
		//border-bottom:1px solid #d0d0d0;

	}

	.x-grid3-header {

		padding: 0px;
	}

	.x-panel-tbar-noborder
	{
		border-left:1px solid #d0d0d0;
		border-top:1px solid #d0d0d0;
	}
*/

	.x-tab-panel-header {
	  border: 1px 1px 0px 1px;
	  padding-bottom: 0px;
	}

	ul.x-tab-strip-top {
		background-color: #eaeaea;
		border-bottom-color: #d0d0d0;
		background-image: url("");
		margin: 5px 3px -1px;
	}

	/* 메인 사용자 정보 관련 css

	*/

	#main_notice_grid .x-panel-header
	{
	        padding-top:22px;
		padding-left:22px;
		padding-bottom:5px;
	   	font-size:14px;
		height:30px;
		line-height:30px;
		background-image:url("");
		background-color:#eaeaea;
	}

	#task_grid .x-panel-header
	{
	        padding-top:22px;
		padding-left:22px;
		padding-bottom:5px;
	   	font-size:14px;
		height:30px;
		line-height:30px;
		background-image:url("");
		background-color:#eaeaea;
		border-top:0px;
	}

	#show_user_info .x-panel-header , #manuals .x-panel-header,
	#nav_tab .x-panel-header, #more_search .x-panel-header, #harris_server .x-panel-header
	{
		font-size:14px;
		height:30px;
		line-height:30px;
		background-image:url("");
		background-color:#eaeaea;
	}

	#show_user_info .x-panel-header
	{
		border-bottom:0px;
	}

	#west-menu-media > .x-panel-header
	{
	    background-color: #FF7049;
	    padding: 2px;
	    /* width: 100%; */
	    margin: 0px;
	    border: 0px;
	    background-image: url("");
	}

	#menu-manual .x-panel-header
	{
		border-bottom:0px;
	}

	.user_span2
	{
		padding-left:10px;
	}

	#tab_warp .x-tab-panel-header
	{
		border-top:0px;
		border-bottom:0px;
	}

	#a-search-field-tab .x-tab-panel-header
	{
		border:0px;
	}

	#west-menu-media > .x-panel-header > .x-tool-collapse-west
	{
		position: absolute;
		    top: 15px;
		    right: 5px;
		    display: block;
		    z-index: 10;
	}

	#nav_tab .x-panel-header
	{
		border-bottom:0px;
	}

	#more_search .x-panel-header
	{
		border-top:1px solid #ddd;
	}


	.user_title
	{
		  font-size: 14px;
		  position: relative;
		  top: -2px;
		  color: #000;
		  margin-right: 5px;
		  /* margin-left: 3px; */
	}

	.user_title:hover
	{
		  font-size: 14px;
		  position: relative;
		  top: -2px;
		  color: #000;
		  margin-right: 5px;
		  /* margin-left: 3px; */
	}

	.main_title_header
	{
		font-size:20px;
		font-weight:600;
	}

	.icon_title
	{
		  font-size: 20px;
		  position: relative;
		  top: 2px;
		  color: #000;
		  margin-right: 5px;
		  margin-left: 3px;
	}


	#statistics_contain .x-panel-tbar-noborder
	{
		border: 0px none;
		border-bottom:1px solid #d0d0d0;
	}

	.x-resizable-over .x-resizable-handle, .x-resizable-pinned .x-resizable-handle {
		opacity: 0;
		filter: alpha(opacity=0); /* internet explorer */
		-ms-filter:"progid:DXImageTransform.Microsoft.Alpha(opacity=0)"; /*IE8*/
	}

	.x-tool-help {color:#2f2f2f;cursor:pointer;}
	.x-tool-help:before
	{
		content: "\f05a";
		display: inline-block;
		font: normal normal normal 14px/1 FontAwesome;
		font-size: inherit;
		text-rendering: auto;
		-webkit-font-smoothing: antialiased;
		font-size:14px;
		padding:3px;
		border: 1px solid rgba(255,255,255,0);
	}

	.x-tool-help-icon{
		color: #e1e1e1;
		cursor:pointer;
	}
	.x-tool-help-icon:before
	{
		content: "\f059";
		display: inline-block;
		font: normal normal normal 14px/1 FontAwesome;
		font-size: inherit;
		text-rendering: auto;
		-webkit-font-smoothing: antialiased;
		font-size:14px;
		padding:3px;
		border: 1px solid rgba(255,255,255,0);
	}
	.x-tool-help-over,.x-tool-help-icon-over
	{
		color:#0099DA;cursor:pointer;
	}

  .x-tool-ps_plugin_upload_icon{
		color: #e1e1e1;
		cursor:pointer;
	}
	.x-tool-ps_plugin_upload_icon:before
	{
		content: "\f1c5    PhotoShop Image Upload";
		display: inline-block;
		font: normal normal normal 14px/1 FontAwesome;
		font-size: inherit;
		text-rendering: auto;
		-webkit-font-smoothing: antialiased;
		font-size:14px;
		padding:3px;
		border: 1px solid rgba(255,255,255,0);
	}
	.x-tool-ps_plugin_upload_icon-over,.x-tool-ps_plugin_upload_icon-over
	{
		color:#0099DA;cursor:pointer;
	}

	.x-tool-detail {color:#e1e1e1;cursor:pointer;}
	.x-tool-detail:before
	{
		content: "\f039";
		display: inline-block;
		font: normal normal normal 14px/1 FontAwesome;
		font-size: inherit;
		text-rendering: auto;
		-webkit-font-smoothing: antialiased;
		font-size:14px;
		padding:3px;
		border: 1px solid rgba(255,255,255,0);
	}

	.x-tool-detail-over
	{
		color:#0099DA;cursor:pointer;
	}

	.x-tool-list {color:#e1e1e1;}
	.x-tool-list:before
	{
		content: "\f00b";
		display: inline-block;
		font: normal normal normal 14px/1 FontAwesome;
		font-size: inherit;
		text-rendering: auto;
		-webkit-font-smoothing: antialiased;
		font-size:14px;
		padding:3px;
		padding-right:5px;
		border: 1px solid rgba(255,255,255,0);
	}

	.x-tool-list-over
	{
		color:#0099DA;cursor:pointer;
	}


	.x-tool-thumb {color:#2f2f2f;}
	.x-tool-thumb:before
	{
		content: "\f009";
		display: inline-block;
		font: normal normal normal 14px/1 FontAwesome;
		font-size: inherit;
		text-rendering: auto;
		-webkit-font-smoothing: antialiased;
		font-size:14px;
		padding:3px;
		padding-right:5px;
		border: 1px solid rgba(255,255,255,0);
	}

	.x-tool-thumb-over
	{
		color:#0099DA;cursor:pointer;
	}

	.x-tool-refresh20
	{
		color:#e1e1e1;
		font: normal normal normal 14px/1 FontAwesome;
		display: inline-block;
		font-size: inherit;
		text-rendering: auto;
		-webkit-font-smoothing: antialiased;
		font-size:14px;
		padding:3px;
		border: 1px solid rgba(255,255,255,0);

	}

	.x-tool-refresh20:before
	{
		content: "\f01e";
	}

	.x-tool-refresh20-over
	{
		color:#0099DA;cursor:pointer;
	}


	.x-tool-tile {color:#e1e1e1;}
	.x-tool-tile:before
	{
		content: "\f009";
		display: inline-block;
		font: normal normal normal 14px/1 FontAwesome;
		font-size: inherit;
		text-rendering: auto;
		-webkit-font-smoothing: antialiased;
		font-size:14px;
		padding:3px;
		padding-right:5px;
		border: 1px solid rgba(255,255,255,0);
	}

	.x-tool-tile-over
	{
		color:#0099DA;cursor:pointer;
	}



	/*
	.x-panel-body {
		-moz-border-bottom-colors: none;
		-moz-border-left-colors: none;
		-moz-border-right-colors: none;
		-moz-border-top-colors: none;
		border-color: -moz-use-text-color #d0d0d0;
		border-image: none;
		border-style: none solid;
		border-width: 0 1px 1px;
		overflow: hidden;
		position: relative;
	}
	*/
	.thumb_img
	{
		display:table-cell;
		vertical-align:middle;
		margin:auto;
		width:auto;
		height:auto;
		max-width:150px;
		max-height:84px;
		-webkit-transition:all 0.7s ease;
		transition:all 0.7s ease;
	}

	.image_container:hover .thumb_img
	{
		-webkit-transform:scale(1.2);
		transform:scale(1.2);
	}

		/* 메뉴 기존 아이콘 삭제 */
	.tree_menu .x-tree-node-icon{ display:none;}

	/* 메뉴 빈공백에 대한 아이콘 삭제 */

	.tree_menu .x-tree-ec-icon { position:relative;top:13px;left:230px;}

	.tree_menu .x-tree-ec-icon .x-tree-elbow-minus { display:block;}
	.tree_menu .x-tree-ec-icon .x-tree-elbow-plus { display:block;}

		/*
			하위 메뉴가 있을 경우 배경 삭제
			- 아이콘을 before 를 이용하여 대체
		*/
		.tree_menu  .x-tree-elbow-minus
		{
			background: url(/css/images/arrow_up2.png);
			background-repeat: no-repeat;
			position: relative;
			left:230px;
		}

		.tree_menu  .x-tree-elbow-end-minus
		{
			background: url(/css/images/arrow_up2.png);
			background-repeat: no-repeat;
			position: relative;
			left:230px;
		}

		.tree_menu  .x-tree-elbow-plus
		{
			background: url(/css/images/arrow_down2.png);
			background-repeat: no-repeat;
			position: relative;
			left:230px;
		}
		.tree_menu  .x-tree-elbow-end-plus
		{
			background: url(/css/images/arrow_down2.png);
			background-repeat: no-repeat;
			position: relative;
			left:230px;
		}

	.tree_menu .x-tree-node-el {
		line-height: 35px;
		cursor: pointer;
		/*text-indent:15px;*/
		border-bottom:1px solid #f1f1f1;
		-webkit-transition: all 0.1s ease-in-out;
		-moz-transition: all 0.1s ease-in-out;
		-ms-transition: all 0.1s ease-in-out;
		-o-transition: all 0.1s ease-in-out;
		transition: all 0.1s ease-in-out;
	}

	/* 하위 메뉴가 존재하는 메뉴의 배경색을 설정할 수 있다. expand collapse 경우*/
	.tree_menu .x-tree-node-expanded , .tree_menu .x-tree-node-collapsed
	{
		background-color:#f1f1f1;
	}

	/* 메뉴가 선택되었을 경우*/
	.tree_menu .x-tree-selected
	{
		 /* fallback */
		  background-color: #0D9AC8;

		  /* Safari 4-5, Chrome 1-9 */
		  //background: -webkit-gradient(linear, left top, right top, from(#0D9AC8), to(#fff));

		  /* Safari 5.1, Chrome 10+ */
		 // background: -webkit-linear-gradient(left, #0D9AC8, #fff);

		  /* Firefox 3.6+ */
		  //background: -moz-linear-gradient(left, #0D9AC8, #fff);

		  /* IE 10 */
		  //background: -ms-linear-gradient(left, #0D9AC8, #fff);

		  /* Opera 11.10+ */
		  //background: -o-linear-gradient(left, #0D9AC8, #fff);
	}

	/*  선택되었을 경우 글자 색상 및 크기 변경*/
	.tree_menu .x-tree-node .x-tree-selected  a span {
		  color: #fff;
		  font-weight:800;
	}

	/*상단 메뉴, 미디어검색 아이콘속 글자(HD SD....)*/
	.fa-text{
		font-family:나눔고딕;
		font-weight:bold;
	}

	</style>

	<link rel="stylesheet" type="text/css" href="/npsext/resources/css/main_top.css" />
	<link rel="stylesheet" type="text/css" href="/css/proxima25.css" />
	<style>
	#main_top{

		height: 95px;

	}

	#alltotal
	{
		height: 97px;
	}



	form + .x-panel-footer.x-panel-btns {
	  border-top: 1px solid #ddd;
	  //background-color: #eaeaea;
	}


    .x-grid3-body .x-grid3-td-numberer,
    .x-grid3-body .x-grid3-row-selected .x-grid3-td-numberer{
		background-image: url("");
	}

	.x-grid3-row-table.x-grid3-row:last-child{
		border-bottom:0px;
	}

	.x-grid-group-hd {
	  border-bottom: 1px solid #e2e2e2;
	  border-bottom-color: #d0d0d0;
	}

	.color_black
	{
		color:#000;
	}

	.ext-mb-text
	{
		font-size:12px; font-family:'Nanum Gothic';
	}

	.x-panel.left-border-zero {
		border-right: 1px solid #d0d0d0;
		  border-top: 1px solid #d0d0d0;
		  border-bottom: 1px solid #d0d0d0;
	}

	.x-panel.right-border {
		border-right: 1px solid #d0d0d0;
	}

	.x-panel.top-border {
		border-top: 1px solid #d0d0d0;
	}

	.x-tab-panel.left-border {
		border-left: 1px solid #d0d0d0;
	}

	.to-loader-logo
	{
		font-size:14px;
		font-weight:bold;
	}


	#loading.loaded {
		opacity: 0;
		-webkit-transform: scale(1.5,1.5);
		-moz-transform: scale(1.5,1.5);
		-o-transform: scale(1.5,1.5);
		-ms-transform: scale(1.5,1.5);
		transform: scale(1.5,1.5);
	}

	#loading-mask.loaded{
		opacity: 0;
		-webkit-transform: scale(1.5,1.5);
		-moz-transform: scale(1.5,1.5);
		-o-transform: scale(1.5,1.5);
		-ms-transform: scale(1.5,1.5);
		transform: scale(1.5,1.5);
	}

	.ext-el-mask-msg {
	  border-color: #999;
	  background-color: transparent;
	  background-image: url("");
	  background-position: 0 -1px;
	}

	.ext-el-mask-msg div {
		background-color: transparent;
		color: #000;
		border:0px;
	}

	.ext-el-mask-msg {
		border:0px;
		background-color: transparent;
	}

	.ext-el-mask-msg div {
	  background-color: transparent;
	  border:0;
	  color: #11b3c5;
	  font-family:arial,tahoma,sans-serif;
	  letter-spacing: 0.01em;
	  font-size: 10px;
	}

	.mask_loading_msg
	{
		position:absolute;
		width:200px;
		left:0px;
		top:1px;
		font-size:10px;
		font-family:arial,tahoma,sans-serif;
	}



	.main_user .x-form-item
	{
		line-height:22px;
	}

	.main_user .x-form-item label
	{
		font-size:13px;
		color:#0D9AC8;
	}

	#tree-tab ul.x-tab-strip-top{
		display:none;
	}

	.disabled-row .x-grid3-row-table {
		background-color: #e8e8e8;
	}
	.x-grid3-row-selected.disabled-row .x-grid3-row-table {
		background-color:  #e3d5ef!important;
	}

	.detele-comment-icon{
		margin-top: 3px;
	}

	.hideMenuIconSpace a.x-menu-item{
		padding-left: 3px;
	}

	.hideMenuIconSpace a.x-menu-item .x-menu-item-text{

	}

	.hideMenuIconSpace i {
		padding-right: 6px;
		padding-left: 3px;
		font-size: 13px;
	}

	.fa-stack{
		width: 1.5em !important;
	}
	/* thumb_slider*/
	#thumb_slider {
		position:absolute;right:20px;top:165px;
	}
	#thumb_slider .x-panel-body {
		-moz-border-bottom-colors: none;
		-moz-border-left-colors: none;
		-moz-border-right-colors: none;
		-moz-border-top-colors: none;
		background: none repeat scroll 0 0 transparent;
		border-color: -moz-use-text-color;
		border-image: none;
		border-style: none solid solid;
		border-width: 0;
		overflow: hidden;
		position: relative;
	}

	#thumb_slider .x-panel-body {
		-moz-border-bottom-colors: none;
		-moz-border-left-colors: none;
		-moz-border-right-colors: none;
		-moz-border-top-colors: none;
		background: none repeat scroll 0 0 transparent;
		border-color: -moz-use-text-color;
		border-image: none;
		border-style: none solid solid;
		border-width: 0;
		overflow: hidden;
		position: relative;
	}
	/*.hide_icons .fa{letter-spacing: 3px;}*/

	/* Video JS */
	.video-js .vjs-current-time { display: block; }
	.video-js .vjs-time-divider { display: block;}
	.video-js .vjs-duration { display: block; }
	​.vjs-remaining-time .vjs-time-control .vjs-control .vjs-remaining-time-display { display: none; }
	.vjs-menu-button-popup .vjs-menu .vjs-menu-content {max-height: 28em;}
	.video-js .vjs-time-control {
		width: 9em;
		padding-left: 0em;
		padding-right: 0em;
		min-width: 0em;
	}
	.vjs-thumbnail {
		position:absolute;
		opacity: 0.9;
	}

	.vjs-control-bar {
		//width: 98% !important;
		//margin-left: 1%;
		//margin-right: 1%;
		//background-color: transparent !important;
		border-right: 10px solid rgba(43, 51, 63, 0);
		border-left: 10px solid rgba(43, 51, 63, 0);
	}
	.vjs-tip-inner-comments {
		text-align: left;
	}
	
	.vjs-skin-twitchy {
		color: #e6e6e6;
	}

	.vjs-skin-twitchy .vjs-big-play-button {
		top: 50%;
		left: 50%;
		transform: translateY(-50%) translateX(-50%);
		-moz-transform: translateY(-50%) translateX(-50%);
		-ms-transform: translateY(-50%) translateX(-50%);
		-webkit-transform: translateY(-50%) translateX(-50%);
		border: none;
		background-color: #1B1D1F;
		background-color: rgba(27, 29, 31, 0.9);
	}

	.vjs-skin-twitchy:hover .vjs-big-play-button,
	.vjs-skin-twitchy .vjs-big-play-button:focus {
		background-color: #33373a;
		background-color: rgba(51, 55, 58, 0.9);
	}
	.vjs-has-started .vjs-big-play-button {
		display: block;
	}

	.vjs-big-play-centered .vjs-big-play-button {
		margin-top: 0em;
		margin-left: 0em; 
	}

	.vjs-skin-twitchy .vjs-play-control {
		width: 3.5em;
	}

	.vjs-skin-twitchy .vjs-time-controls {
		-webkit-box-ordinal-group: 9;
		-moz-box-ordinal-group: 9;
		-ms-flex-order: 9;
		-webkit-order: 9;
		order: 9;
	}

	.vjs-skin-twitchy .vjs-current-time, .vjs-skin-twitchy .vjs-no-flex .vjs-current-time {
		display: block;
	}

	.vjs-skin-twitchy .vjs-duration, .vjs-skin-twitchy .vjs-no-flex .vjs-duration {
		display: block;
	}

	.vjs-skin-twitchy .vjs-time-divider {
		display: block;
		width: 0em;
	}

	.vjs-skin-twitchy .vjs-slider {
		background-color: rgba(0,0,0,0.5);
	}

	.vjs-skin-twitchy .vjs-load-progress div {
		background-color: rgba(51,51,51,0.5);
	}

	.vjs-skin-twitchy .vjs-load-progress {
		background-color: rgba(51,51,51,0.5);
	}

	.vjs-skin-twitchy .vjs-play-progress {
		//background-color: #b99beb;
		background-color: rgba(226,226,226,0.7);
	}

	.vjs-skin-twitchy .vjs-progress-holder.vjs-slider {
		margin: 0;
	}

	.vjs-skin-twitchy .vjs-play-progress.vjs-slider {
		margin: 0;
	}

	.vjs-skin-twitchy .vjs-control.vjs-progress-control {
		height: 0.3em;
		width: 100%;
	}

	.vjs-skin-twitchy:hover .vjs-control.vjs-progress-control {
		height: 3em;
		top: -3em;
	}

	.vjs-skin-twitchy:hover .vjs-control.vjs-progress-control .vjs-play-progress, .vjs-skin-twitchy:hover .vjs-control.vjs-progress-control .vjs-load-progress {
		height: 3em;
	}

	.vjs-skin-twitchy .vjs-progress-control {
		display: border-box;
		position: absolute;
		top: -0.3em;
		left: 0;
		right: 0;
	}

	.vjs-skin-twitchy .vjs-progress-control:hover .vjs-progress-holder {
		font-size: 1em;
	}

	.vjs-skin-twitchy .vjs-play-progress:before {
		display: none;
	}

	.vjs-skin-twitchy .vjs-progress-holder {
		height: 100%;
		-webkit-transition: height 0.5s;
		-moz-transition: height 0.5s;
		-ms-transition: height 0.5s;
		-o-transition: height 0.5s;
		transition: height 0.5s;
	}

	.vjs-skin-twitchy .vjs-progress-control:hover .vjs-mouse-display, .vjs-skin-twitchy .vjs-progress-control:hover .vjs-mouse-display:after{
		display: block;
		z-index: 10;
	}
	.vjs-mouse-display-none{
		display: none !important;
	}
	.vjs-skin-twitchy .vjs-progress-control:hover .vjs-play-progress:after {
		display: none;
		z-index: 10;
	}
	.vjs-skin-twitchy .vjs-mouse-display:after{
		font-size: 0.8em !important;
		right: -3.1em;
	}

	.vjs-skin-twitchy .vjs-volume-bar.vjs-slider-horizontal {
		width: 5em;
		height: 0.3em;
	}

	.vjs-skin-twitchy .vjs-volume-level {
		background-color: #b99beb;
	}

	.vjs-skin-twitchy .vjs-volume-bar.vjs-slider-horizontal .vjs-volume-level {
		width: 100%;
	}

	.vjs-skin-twitchy .vjs-volume-bar.vjs-slider-horizontal .vjs-volume-handle {
		left: 4.3em;
	}

	.vjs-skin-twitchy .vjs-mute-control {
		width: 2.5em;
	}

	.vjs-skin-twitchy .vjs-volume-bar .vjs-volume-handle:before {
		font-size: 2em;
		top: -0.35em;
		left: -0.1em;
		content: "��";
	}

	.vjs-skin-twitchy .vjs-custom-control-spacer {
		-webkit-box-flex: auto;
		-moz-box-flex: auto;
		-webkit-flex: auto;
		-ms-flex: auto;
		flex: auto;
		display:flex;
		justify-content:center;
		align-items:center;
	}
	.vjs-preview-customize .vjs-custom-control-spacer {
		margin-right: 7%;
	}

	.vjs-skin-twitchy .vjs-fullscreen-control {
		text-align: right;
		padding-right: 5px;
		-webkit-box-ordinal-group: 10;
		-moz-box-ordinal-group: 10;
		-ms-flex-order: 10;
		-webkit-order: 10;
		order: 10;
	}

	.vjs-skin-twitchy .vjs-fullscreen-control:before {
		position: relative;
	}

	.vjs-skin-twitchy .vjs-volume-menu-button {
		position:absolute;
		right:75px;
	}

	.vjs-mouse-display {
		display:block;
		opacity: 1;
		z-index:1000;
	}
	.set_in_out{
		font-size: 20px;
		font-weight: bold;
		margin-top: 2px;
	}
	.special-blue, .mark-sec-in, .mark-sec-out{
		background-color: #0446ff !important;
	}
	.mark-sec-in-shot-list, .mark-sec-out-shot-list{
		background-color: #49e821 !important;
	}
	.vjs-control-custom{
		cursor: pointer;
		outline: none;
		position: relative;
		text-align: center;
		margin: 0;
		padding: 0;
		height: 100%;
		width: 3em;
	}
	.vjs-control-space-custom{
		width: 2em;
	}
	.vjs-control-custom span{
		margin-top: 10px;
	}
	.vjs-control-custom p{
		margin-top: 9px;
	}
	.vjs-control-space{
		margin-left: 35px;
	}

  .x-tool-collapse-west + .x-panel-header-text
  {
    display:none;
  }

	/*Harris Top Menu*/
	.harris-higlight{ background-color:#7cc1d2; }
	.harris-complete{ background-color:#8bd674; }
	.harris-error{ background-color:#f19898; }

  #harris_server .x-panel-header {
    padding-top:9px !important;
  }

  #harris_server .x-tool-collapse-west + .x-panel-header-text
  {
    display:block;
  }

  #harris_server > .x-panel-header > .x-tool-collapse-west
  {
    position: absolute;
        top: 15px;
        right: 5px;
        display: block;
        z-index: 10;
  }

  .icon_title2:hover{
    color:#aaa;
  }

	</style>

</head>

<body>
	<div id="loading-mask"></div>
	<div id="loading">
				<span class="to-loader-logo loading-indicators" >Proxima Network Production System 3.0.0</span>
		        <div class="to-loader" style="text-align:center;">
					<div id='loading-msg'></div>
					<svg width="60px" height="60px" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
						<path class="to-loader-circlebg"
							fill="none"
							stroke="#dddddd"
							stroke-width="4"
							stroke-linecap="round"
							d="M40,10C57.351,10,71,23.649,71,40.5S57.351,71,40.5,71 S10,57.351,10,40.5S23.649,10,40.5,10z"/>
						<path id='to-loader-circle'
							fill="none"
							stroke="#11b3c5"
							stroke-width="4"
							stroke-linecap="round"
							stroke-dashoffset="192.61"
							stroke-dasharray="192.61 192.61"
							d="M40,10C57.351,10,71,23.649,71,40.5S57.351,71,40.5,71 S10,57.351,10,40.5S23.649,10,40.5,10z"
						/>
					</svg>
				</div>
    </div>



	<!--현이롤오버관련시작-->
	<script type="text/javascript">
	function MM_swapImgRestore() { //v3.0
	  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
	}
	function MM_preloadImages() { //v3.0
	  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
		var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
		if (a[i].indexOf("#")!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
	}

	function MM_findObj(n, d) { //v4.01
	  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
		d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
	  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
	  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
	  if(!x && d.getElementById) x=d.getElementById(n); return x;
	}

	function MM_swapImage() { //v3.0
	  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
	   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
	}

	var dev_flag = true;
	var total_jsload_count = 66;
	var jsload_count = 0;

	var now = new Date().getTime();

	function loader_view(page)
	{
		jsload_count++;

		var loadCircle   = document.getElementById('to-loader-circle');
		var scripts      = document.getElementsByTagName('script');
		var strokeLength = loadCircle.getTotalLength();
		var percent      = (jsload_count/total_jsload_count);
		//console.log(page+':'+jsload_count+':'+ (new Date().getTime() - now));
		loadCircle.setAttribute('stroke-dashoffset', (1-percent)*strokeLength);
		if(percent === 1)
		{
			setTimeout(function(){
				document.getElementById('loading').className = document.getElementById('loading').className+' loaded';
			},0);
			setTimeout(function() {
				document.getElementById('loading-mask').className = document.getElementById('loading-mask').className+' loaded';
			}, 100);
			setTimeout(function() {
				document.getElementById('loading-mask').parentNode.removeChild(document.getElementById('loading-mask'));
				document.getElementById('loading').parentNode.removeChild(document.getElementById('loading'));
			}, 1000);
		}
	}


	</script>
	<!--현이롤오버관련끝-->

		<script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading Core API...';</script>
        <script type="text/javascript" src="/npsext/adapter/ext/ext-base.js"></script>
        <script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Loading UI Components...';loader_view('ext-base.js');</script>
        <script type="text/javascript" src="/npsext/ext-all.js"></script>
        <script type="text/javascript">document.getElementById('loading-msg').innerHTML = 'Initializing...';loader_view('ext-all.js');</script>
        <script type="text/javascript" src="/javascript/lang.php"></script><script>loader_view('lang.php');</script>

        <script type="text/javascript" src="/javascript/common.js"></script><script>loader_view();</script>
        <script type="text/javascript" src="/javascript/grant.php"></script><script>loader_view();</script>

        <script type="text/javascript" src="/npsext/examples/ux/MultiSelect.js"></script><script>loader_view();</script>
        <script type="text/javascript" src="/npsext/examples/ux/ItemSelector.js"></script><script>loader_view();</script>

		<script type="text/javascript" src="/npsext/examples/ux/treegrid/TreeGridSorter.js"></script><script>loader_view();</script>
		<script type="text/javascript" src="/npsext/examples/ux/treegrid/TreeGridColumnResizer.js"></script><script>loader_view();</script>
		<script type="text/javascript" src="/npsext/examples/ux/treegrid/TreeGridNodeUI.js"></script><script>loader_view();</script>
		<script type="text/javascript" src="/npsext/examples/ux/treegrid/TreeGridLoader.js"></script><script>loader_view();</script>
		<script type="text/javascript" src="/npsext/examples/ux/treegrid/TreeGridColumns.js"></script><script>loader_view();</script>
		<script type="text/javascript" src="/npsext/examples/ux/treegrid/TreeGrid.js"></script><script>loader_view();</script>
		<script type="text/javascript" src="/npsext/examples/ux/ColumnHeaderGroup.js"></script><script>loader_view();</script>
		<script type="text/javascript" src="/npsext/examples/ux/BufferView.js"></script><script>loader_view();</script>
		<script type="text/javascript" src="/npsext/examples/ux/ProgressColumn.js"></script><script>loader_view();</script>

		<script type="text/javascript" src="/javascript/awesomeuploader/Ext.ux.AwesomeUploader.js"></script>
		<script type="text/javascript" src="/javascript/awesomeuploader/Ext.ux.AwesomeUploaderLocalization.js"></script>
		<script type="text/javascript" src="/javascript/awesomeuploader/Ext.ux.form.FileUploadField.js"></script>
		<script type="text/javascript" src="/javascript/awesomeuploader/Ext.ux.XHRUpload.js"></script>
		<script type="text/javascript" src="/javascript/awesomeuploader/swfupload.js"></script>
		<script type="text/javascript" src="/javascript/extjs.plugins/Ext.ux.plugins.TabStripContainer.js"></script>

        <!-- // 그룹관리 관련 RowExpand 추가 -->
        <script type="text/javascript" src="/npsext/examples/ux/RowExpander.js"></script><script>loader_view('RowExpander.js');</script>
        <script type="text/javascript" src="/npsext/examples/ux/CheckColumn.js"></script><script>loader_view('CheckColumn.js');</script>

		<script type="text/javascript" src="js/jquery.min.js"></script>
		<script type="text/javascript" src="js/jquery-ui-1.11.4/jquery-ui.min.js"></script>
		<script type="text/javascript" src="js/datepicker.js"></script>

		<script type="text/javascript" src="/javascript/ext.ux/dd.js"></script><script>loader_view('dd.js');</script>
        <script type="text/javascript" src="/javascript/functions.php"></script><script>loader_view('functions.php');</script>
        <script type="text/javascript" src="/javascript/ext.ux/Ext.ux.grid.PageSizer.js"></script><script>loader_view('Ext.ux.grid.PageSizer.js');</script>
		<script type="text/javascript" src="/javascript/ext.ux/categoryContextMenu.php?agent=<?=$_REQUEST['agent']?>"></script><script>loader_view('categoryContextMenu.php');</script>

        <script type="text/javascript" src="/javascript/ext.ux/Ext.ux.TreeCombo.js"></script><script>loader_view();</script>
		<script type="text/javascript" src="/javascript/ext.ux/Ext.ariel.ContentList.php"></script><script>loader_view('Ext.ariel.ContentList.php');</script>
        <script type="text/javascript" src="/javascript/ext.ux/Ext.ux.grid.ExplorerView.js"></script><script>loader_view('Ext.ux.grid.ExplorerView.js');</script>
		<script type="text/javascript" src="/javascript/ext.ux/Ariel.Nps.Main.php"></script><script>loader_view('Ariel.Nps.Main.php');</script>
        <script type="text/javascript" src="/javascript/ext.ux/Ariel.Nps.Media.php?agent=<?=$_REQUEST['agent']?>"></script><script>loader_view('Ariel.Nps.Media.php');</script>
        <script type="text/javascript" src="/javascript/ext.ux/Ariel.Nps.WorkManagement.php"></script><script>loader_view('Ariel.Nps.WorkManagement.php');</script>
		<script type="text/javascript" src="/javascript/ext.ux/Ariel.Nps.HarrisManagement.php"></script><script>loader_view('Ariel.Nps.HarrisManagement.php');</script>
        <script type="text/javascript" src="/javascript/ext.ux/Ariel.Nps.Statistic.php"></script><script>loader_view('Ariel.Nps.Statistic.php');</script>
        <script type="text/javascript" src="/javascript/ext.ux/Ariel.Nps.CueSheet.php"></script><script>loader_view('Ariel.Nps.CueSheet.php');</script>

		<script type="text/javascript" src="/javascript/ext.ux/Ariel.LoudnessLog.php"></script><script>loader_view('Ariel.LoudnessLog.php');</script>

		<script type="text/javascript" src="/javascript/ext.ux/Ariel.QuailityCheckLog.php"></script><script>loader_view('Ariel.QuailityCheckLog.php');</script>

		<script type="text/javascript" src="/javascript/ext.ux/Ariel.task.Monitor.js"></script><script>loader_view('Ariel.task.Monitor.js');</script>
		<script type="text/javascript" src="/store/metadata/Ariel.Nps.QC.php"></script><script>loader_view('Ariel.Nps.QC.php');</script>

		<script type="text/javascript" src="/javascript/withZodiac/Ariel.Nps.CheckRequest.php"></script><script>loader_view('Ariel.Nps.CheckRequest.php');</script><!-- 2015-10-19 proxima_zodiac 메뉴 추가 -->
		<script type="text/javascript" src="/javascript/withZodiac/Ariel.Nps.InfoReport.php"></script><script>loader_view('Ariel.Nps.InfoReport.php');</script><!-- 2015-10-19 proxima_zodiac 메뉴 추가 -->

		<script type="text/javascript" src="/javascript/ext.ux/Ariel.Nps.SystemManagement.php"></script><script>loader_view('Ariel.Nps.SystemManagement.php');</script><!-- 2016-01-25 개발자 시스템 메뉴 추가 -->

        <!-- Panel-->
		<script type="text/javascript" src="/javascript/component/Ariel.Panel.Main.js"></script><script>loader_view('Ariel.Panel.Main.js');</script>
		<script type="text/javascript" src="/javascript/component/Ariel.Panel.Main.Center.js"></script><script>loader_view('Ariel.Panel.Main.Center.js');</script>
		<script type="text/javascript" src="/javascript/component/Ariel.Panel.Monitor.php"></script><script>loader_view('Ariel.Panel.Monitor.php');</script>
		<script type="text/javascript" src="/javascript/component/Ariel.panel.archive.Result.js"></script><script>loader_view('Ariel.panel.archive.Result.js');</script>
		<script type="text/javascript" src="/javascript/component/Ariel.panel.review.Request.js"></script><script>loader_view('Ariel.panel.review.Request.js');</script>
		<script type="text/javascript" src="/javascript/component/Ariel.panel.review.Result.js"></script><script>loader_view('Ariel.panel.review.Result.js');</script>

		<script type="text/javascript" src="/javascript/withZodiac/Ariel.Panel.InfoReport.php"></script><script>loader_view('Ariel.Panel.InfoReport.php');</script><!-- 2015-10-30 proxima_zodiac 보도정보 패널 xtype : 'infoReport'-->
		<script type="text/javascript" src="/javascript/withZodiac/Ariel.Panel.InfoReportQ.php"></script><script>loader_view('Ariel.Panel.InfoReportQ.php');</script><!-- 2015-11-26 proxima_zodiac 보도정보 큐시트패널 xtype : 'infoReport'-->
		<script type="text/javascript" src="/javascript/withZodiac/Ariel.Panel.ListContent.php"></script><script>loader_view('Ariel.Panel.ListContent.php');</script><!-- 2015-11-04 proxima_zodiac 비디오/그래픽 탭패널 -->

        <!-- Menu -->
		<script type="text/javascript" src="/javascript/component/menu/Ariel.menu.Review.js"></script><script>loader_view('Ariel.menu.Review.js');</script>

        <!-- form -->
        <script type="text/javascript" src="/javascript/component/form/Ariel.form.review.Accept.js"></script><script>loader_view('Ariel.form.review.Accept.js');</script>
        <script type="text/javascript" src="/javascript/component/form/Ariel.form.review.Reject.js"></script><script>loader_view('Ariel.form.review.Reject.js');</script>
        <script type="text/javascript" src="/javascript/component/form/Ariel.form.review.Request.js"></script><script>loader_view('Ariel.form.review.Request.js');</script>
        <script type="text/javascript" src="/javascript/component/form/Ariel.form.review.Detail.js"></script><script>loader_view('Ariel.form.review.Detail.js');</script>
        <script type="text/javascript" src="/javascript/component/form/Ariel.form.Workflow.js"></script><script>loader_view('Ariel.form.Workflow.js');</script>
		<!--        <script type="text/javascript" src="/javascript/component/form/field/Ariel.form.field.Combo.js"></script>-->

        <!-- Window -->
		<script type="text/javascript" src="/javascript/component/window/Ariel.window.review.Accept.js"></script><script>loader_view();</script>
		<script type="text/javascript" src="/javascript/component/window/Ariel.window.review.Reject.js"></script><script>loader_view();</script>
		<script type="text/javascript" src="/javascript/component/window/Ariel.window.review.Request.js"></script><script>loader_view();</script>
		<script type="text/javascript" src="/javascript/component/window/Ariel.window.review.Detail.js"></script><script>loader_view();</script>
		<!--		<script type="text/javascript" src="/javascript/component/window/Ariel.window.Workflow.js"></script>-->

		<script type="text/javascript" src="/javascript/ext.ux/Ext.ux.netbox.InputTextMask.js"></script><script>loader_view();</script>
		<script type="text/javascript" src="/javascript/moment.js"></script><script>loader_view();</script>
		<script type="text/javascript" src="/javascript/lodash.min.js"></script><script>loader_view();</script>
		<script type="text/javascript" src="/javascript/ext.ux/Ext.ux.ProximaWindow.js"></script><script>loader_view();</script><!-- Proxima window -->
		<script type="text/javascript" src="/javascript/ext.ux/Ext.ux.ProximaMsgBox.js"></script><script>loader_view();</script><!-- Proxima MSG BOX -->

		<!-- Ext.Msg.alert -->
		<script type="text/javascript" src="/javascript/Ariel.override.js"></script><script>loader_view();</script>

		<!-- FlashNet 관련 -->
		<script type="text/javascript" src="/javascript/request.js" /></script><script>loader_view();</script>

		<script type="text/javascript" src="/npsext/src/locale/ext-lang-<?=$check_lang?>.js"></script><script>loader_view();</script>

		<script type="text/javascript" src="/javascript/extjs.plugins/Ext.us.PanelCollapsedTitle.js"></script><script>loader_view();</script>
		<!-- 카테고리 숨김시 제목 노출 기능 -->

		<!-- Color Field -->

		<script src="/javascript/colorfield/Ext.ux.ColorField.js" type="text/javascript"></script>
		<link rel="stylesheet" type="text/css" href="/javascript/colorfield/Ext.ux.ColorField.css" />

		<!-- JSZip -->
		<script src="/javascript/jszip/jszip.js" type="text/javascript"></script>
		<script src="/javascript/jszip/jszip-utils.js" type="text/javascript"></script>
		<script src="/javascript/jszip/FileSaver.js" type="text/javascript"></script>

		<!-- VideoJs -->
		<script src="/videojs/video.js"></script>
		<script src='/videojs/js/videojs_thumbnail.js'></script>
		<script type="text/javascript" src="/videojs/videojs.hotkeys.min.js"></script>
		<script type="text/javascript" src="/videojs/videojs-markers-0.5.0/src/videojs.markers.js"></script>
		<link href="/videojs/videojs-markers-0.5.0/dist/videojs.markers.css" rel="stylesheet">

	<script type="text/javascript">
	Ext.ns('Ariel');
	var global_detail;
	var current_focus = null;
	var advanceSearchWin = null;
	var cuesheetSearchWin = null;

    // global
    _env = 'development';

	/**
	AME 연동 부분 추가
	Premiere plugin 시
*/

		function _ame_archive(content_id){

			Ext.Ajax.request({
				url: '/plugin/ame/get_ame_task_id.php',
				//params: params,
				callback: function(self, success, response){
					if (success) {
						try {
							var r = Ext.decode(response.responseText);
							//console.log(r);
							//alert(r.success);
							if(r.success == 'true' || r.success == true){
										var task_id = r.task_id;
										//alert(task_id);
										if(task_id){
											//alert('CALL !!!');
											_ame_premiere_set_seq(content_id, task_id);

										}else {
											alert("작업 ID를 얻어오지 못하였습니다.");
										}
										
							}
						} catch (e) {
							alert('_ame_archive 작업 실패');
						}
					} else {

					}
				}
			});

		}

		function _ame_premiere_set_seq(content_id, task_id){
		//alert('_ame_premiere_set_seq CALL !!!');
			//var url = "http://10.153.135.78:8002";
			var url = "http://10.61.67.27:8002";
			var params = {};
			params.content_id = content_id;
			params.task_id     = task_id;
			alert(params.content_id);
			alert(params.task_id);
			var content_tab 	= Ext.getCmp('tab_warp');
			var active_tab 		= content_tab.getActiveTab();
			var content_grid 	= active_tab.get(0);
			var sel = content_grid.getSelectionModel().getSelected();

			var ori_path 	  = sel.get('premiere_media_path');
			var lowres_root   = sel.get('lowres_root');

			ori_path = ori_path.replace(/\\/gi, "/");

			if(ori_path.indexOf(lowres_root)<0){
				ori_path = lowres_root+"/"+ori_path;
			}	

			params.sequence = ori_path;

			//alert(params.sequence);
			url=url+"/?"+task_id+"&"+content_id+"&"+ori_path;


			$.ajax({
	            url:url,
	            success:function(data){
	                $('#time').append(data);
	            }
	        });


			return;
			
			Ext.Ajax.request({
				url: url,
				method :'get',
				//params: params,
				callback: function(self, success, response){
					alert(success);
					if (success) {
						try {
							var r = Ext.decode(response.responseText);

							if(r.success == 'true' || r.success == true){
								alert("작업이 등록되었습니다.");
							}
						} catch (e) {
							alert(' _ame_premiere_set_seq 작업 실패');
						}
					} else {

					}
				}
			});

		}

	function resizeImgs(self, url, size  )
	{
		var check, width, height;
		var imgObj = new Image();

		if (size && size.w)
		{
			width = size.w;
		}
		else
		{
			width = 150;
		}

		if (size && size.h)
		{
			height = size.h;
		}
		else
		{
			height = 84;
		}

		imgObj.src = url;

		if (imgObj.width == 0 || imgObj.height == 0) check = 0;

		if ( ( imgObj.width / width ) < 1 )
		{
			self.width = imgObj.width;
		}
		else
		{
			self.width = width;
		}

		if( ( imgObj.height/ height ) < 1 )
		{
			self.height = imgObj.height;
		}
		else
		{
			self.height = height;
		}
	}

	function resizeImg(self, size)
	{
		if (!Ext.isIE)
		{

		}
	//	self.display = none;
		if (size)
		{

			self.width = size.w;
			self.height = size.h;
		}
		else
		{
			//self.width = 150;
			//self.height = 83;
		}

	//	self.display = block;
	}

	function errorImg(self)
	{
		//self.src = '/img/incoming.jpg';
		if (!Ext.isIE)
		{

		}
	}

	function time() {
		return Math.floor(new Date().getTime() / 1000);
	}

	function show_url(url) {
		if(Ext.isEmpty(url)) {
			 return;
		}
		window.open(url);
	}

	function show_sgl_log(content_id) {
		var win = new Ext.Window({
			title: _text('MN01099'),//SGL log
			width: 500,
			modal: true,
			//height: 150,
			height: 600,
			miniwin: true,
			resizable: false,
			layout: 'vbox',
			buttonAlign: 'center',
			buttons: [{
				text : '<span style="position:relative;top:1px;"><i class="fa fa-close" style="font-size:13px;"></i></span>&nbsp;'+_text('MN00031'),
				scale: 'medium',
				handler: function(b, e){
					win.close();
				}
			}],
			items:[{
				xtype: 'grid',
				autoScroll: true,
				cls: 'proxima_customize',
				stripeRows: true,
				//border: false,
				enableHdMenu: false,
				//height: 120,
				height: 100,
				store: new Ext.data.ArrayStore({
					fields: ['volume','volume_group','status','archived_date']
				}),
				viewConfig: {
					loadMask: true,
					forceFit: true
				},
				columns: [
					{ header: _text('MN02213'), dataIndex: 'volume', sortable:'false' }//Volume Name
					,{ header: _text('MN02214'), dataIndex: 'volume_group', sortable:'false' }//Volume Group
					,{ header: _text('MN02215'), dataIndex: 'status', sortable:'false',width:70 }//Status
					,{ header: _text('MN02216'), dataIndex: 'archived_date', sortable:'false',width:120 }//ArchiveDate
				],
				sm: new Ext.grid.RowSelectionModel({
				})
			},{
				layout: 'fit',
				title: _text('MN00048'),//log
				flex: 1,
				html: '&nbsp',
				padding: 5,
				width: '100%',
				autoScroll: true,
				listeners: {
					render: function(self){
						win.refresh_data(win);
					}
				}
			}],
			refresh_data: function(self) {
				self.el.mask();
				Ext.Ajax.request({
					url: '/store/get_sgl_log_data.php',
					params: {
						content_id: content_id,
						mode: 'archive'
					},
					callback: function(opt, success, response){
						self.el.unmask();
						var res = Ext.decode(response.responseText);
						if(res.success) {
							self.items.get(1).update(res.msg);
							var grid = self.items.get(0);
							Ext.each(res.volume, function(i){
								grid.store.loadData([
									i
								], true);
							});
						}
					}
				});
			}
		});
		win.show();
	}


	function show_loudness_log2(content_id) {
		var loudness_list_store = new Ext.data.JsonStore({
			url:'/store/loudness/get_loudness_list.php',
			baseParams : {
				content_id: content_id
			},
			autoLoad: true,
			root: 'data',
			fields: [ 'loudness_id', 'jobUid', 'state', 'task_id', 'req_user_id', 'req_user_nm',
						{name: 'req_datetime',type:'date',dateFormat:'YmdHis'}, 'req_type' ]
		});

		var loudness_detail_store = new Ext.data.JsonStore({
			url:'/store/loudness/get_loudness_detail_list.php',
			root: 'data',
			fields: [ 'loudness_log_id', 'log', {name: 'creation_date',type:'date',dateFormat:'YmdHis'}, 'req_type' ]
		});

		function render_state(v){
			switch(v) {
				case '1' :
					v = _text('MN01039');
				break;
				case '2' :
					v = _text('MN00011');
				break;
				case '3' :
					v = _text('MN01049');
				break;
				case '13' :
					v = _text('MN00262');
				break;
				default :
					v = _text('MN02177');
				break;
			}

			return v
		}

		function render_type(v){
			switch(v) {
				case 'M' :
					v = _text('MN02243');
				break;
				case 'C' :
					v = _text('MN02244');
				break;
			}

			return v
		}


		var loudness_win = new Ext.Window({
				title: _text('MN02245'),//Loudness Log
				width: 500,
				modal: true,
				height: 600,
				miniwin: true,
				resizable: false,
				layout: 'vbox',
				buttons: [{
					text: _text('MN00031'),//닫기
					scale: 'medium',
					handler: function(b, e){
						loudness_win.close();
					}
				}],
				items:[{
					xtype: 'grid',
					autoScroll: true,
					enableHdMenu: false,
					flex: 1,
					store: loudness_list_store,
					viewConfig: {
						loadMask: true,
						forceFit: true
					},
					columns: [
						{ header: _text('MN02247'), dataIndex: 'loudness_id', sortable:false, hidden: true }//Loudness ID
						,{ header: _text('MN02248'), dataIndex: 'jobUid', sortable:false, hidden: true}//JobUid
						,{ header: _text('MN02246'), dataIndex: 'req_datetime', sortable:false, width:100, renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s'), align: 'center'}//req_datetime
						,{ header: _text('MN00222'), dataIndex: 'req_type', sortable:false, renderer: render_type, align: 'center' }//req_type
						,{ header: _text('MN00138'), dataIndex: 'state', sortable:false,width:70, renderer: render_state, align: 'center' }//Status
						,{ header: _text('MN00218'), dataIndex: 'req_user_nm', sortable:false, width:70, align: 'center' }//req_user_nm
					],
					sm: new Ext.grid.RowSelectionModel({
						singleSelect: true
					}),
					listeners: {
						rowclick: function(self, rowIndex, record) {
							var rowRecord = self.getSelectionModel().getSelected();
							loudness_detail_store.load({
								params: {
									loudness_id: rowRecord.get('loudness_id')
								}
							});
						}
					}
				},{
					xtype: 'grid',
					autoScroll: true,
					enableHdMenu: false,
					flex: 2,
					store: loudness_detail_store,
					viewConfig: {
						loadMask: true,
						forceFit: true
					},
					columns: [
						{ header: _text('MN00108'), dataIndex: 'creation_date', sortable:false, width:100, renderer: Ext.util.Format.dateRenderer('Y-m-d H:i:s'), align: 'center'}//creation_date
						,{ header: _text('MN02249'), dataIndex: 'loudness_id_log', sortable: false, hidden: true }//Loudness Log ID
						,{ header: _text('MN00048'), dataIndex: 'log', sortable: false}//log
					],
					sm: new Ext.grid.RowSelectionModel({
						singleSelect: true
					}),
					listeners: {
						rowdblclick: function(self, rowIndex, e){
							var rowRecord = self.getSelectionModel().getSelected();

							var log_win = new Ext.Window({
											title: _text('MN02245'),//Loudness Log
											width: 500,
											modal: true,
											height: 600,
											miniwin: true,
											resizable: false,
											layout: 'fit',
											buttons: [{
												text: _text('MN00031'),//닫기
												scale: 'medium',
												handler: function(b, e){
													log_win.close();
												}
											}],
											items:[{
												xtype: 'textarea',
												value : rowRecord.get('log')
											}]
							});

							log_win.show();

						}
					}
				}]
			});
		loudness_win.show();
	}

	function show_loudness_log(content_id) {
		var loudness_win = new Ext.Window({
				title: _text('MN02245'),//Loudness Log
				width: 700,
				modal: true,
				height: 600,
				miniwin: true,
				//resizable: false,
				buttonAlign: 'center',
				layout: 'fit',
				buttons: [{
					//text: _text('MN00031'),//닫기
					text : '<span style="position:relative;top:1px;"><i class="fa fa-close" style="font-size:13px;"></i></span>&nbsp;'+_text('MN00031'),
					scale: 'medium',
					handler: function(b, e){
						loudness_win.close();
					}
				}],
				items:[
					new Ariel.LoudnessLog({//1 : search
						content_id : content_id
					})
				]
		});

		loudness_win.show();
	}

	function show_qc_log(content_id) {
		var qc_win = new Ext.Window({
				title: _text('MN02344'),//Quality Check 로그
				width: 700,
				modal: true,
				height: 600,
				miniwin: true,
				//resizable: false,
				layout: 'fit',
				buttonAlign: 'center',
				buttons: [{
					text : '<span style="position:relative;top:1px;"><i class="fa fa-close" style="font-size:13px;"></i></span>&nbsp;'+_text('MN00031'),
					scale: 'medium',
					handler: function(b, e){
						qc_win.close();
					}
				}],
				items:[
					new Ariel.QualityCheckLog({//1 : search
						content_id : content_id
					})
				]
		});

		qc_win.show();
	}

	function change_tag_content(action, av_content_id_array, tag_category_id, reload_data) {

        Ext.Ajax.request({
            url: '/store/tag/tag_action.php',
            params: {
                action: action,
                content_id: Ext.encode(av_content_id_array),
				tag_category_id: tag_category_id
            },
            callback: function(opts, success, response) {
                try {
                   var r = Ext.decode(response.responseText, true);
                   if (r.success) {
                       	if(reload_data !== 'no_reload_data'){
                	   		Ext.getCmp('tab_warp').getActiveTab().get(0).getStore().reload();
                       	}else{
                       		Ext.getCmp('tag_list_in_content').reset_list_of_tag_form();
                       	}
                   } else {
                      Ext.Msg.alert(_text('MN00022'), r.msg);
                   }
                } catch(e) {
                   Ext.Msg.alert(_text('MN01098'), e.message + '(responseText: ' + response.responseText + ')');
                }
             }
        });
    }

	function moveSelectedRow(grid, direction, mode, start_index) {
		var v_start_index = 0;
		if (typeof start_index === 'undefined'){
			v_start_index = 0;
		} else {
			v_start_index = start_index;
		}
		var record = grid.getSelectionModel().getSelected();
		if (!record) {
			Ext.Msg.alert(_text('MN00022'), 'Select tag to move');
		}
		var index;

		if(mode == 'up' || mode == 'down'){
			index = grid.getStore().indexOf(record);
			if (direction < 0) {
				index--;
				if (index < v_start_index) {
					return;
				}
			} else {
				index++;
				if (index >= grid.getStore().getCount()) {
					return;
				}
			}
		}else if(mode == 'top'){
			index = v_start_index;
		}else if(mode == 'bottom'){
			index = grid.getStore().getCount()-1;
		}
		grid.getStore().remove(record);
		grid.getStore().insert(index, record);
		grid.getSelectionModel().selectRow(index, true);
	}

	function tag_management_windown(mode_load){
    	var win = new Ext.Window({
			title: _text('MN02234'),
			id: 'list_of_tag',
			width: 500,
			modal: true,
			height: 400,
			miniwin: true,
			resizable: false,
			layout: 'vbox',
			items: [
			{
				xtype : 'toolbar',
				//region : '',
				margins: '0 0 0 335px',
				height : 30,
				items : [
				{
				   	xtype: 'button',
				    //text: "<i class='fa fa-refresh fa-2x' title='refresh'></i>",
				    cls: 'proxima_button_customize',
				    text: '<span style="position:relative;top:1px;" title="'+_text('MN00139')+'"><i class="fa fa-refresh" style="font-size:13px;color:white;"></i></span>',
				    width: 30,
				    handler: function(b, e){
				    	Ext.getCmp('listing_tag').getStore().reload();
				    	Ext.getCmp('save_order_button').disable();
				    }
				},
				{
				   	xtype: 'button',
				   	cls: 'proxima_button_customize',
				   	text: '<i class="fa fa-angle-double-up" title="'+_text('MN02229')+'" style="font-size:13px;color:white;"></i>',
				    width: 30,
				    handler: function(b, e){
				    	var grid = Ext.getCmp('listing_tag');
				    	moveSelectedRow(grid, 0, 'top');
				    	Ext.getCmp('save_order_button').enable();
				    }
				},{
					xtype: 'button',
					cls: 'proxima_button_customize',
					text: '<i class="fa fa-angle-up" title="'+_text('MN02230')+'" style="font-size:13px;color:white;"></i>',
				    width: 30,
				    handler: function(b, e){

				    	var grid = Ext.getCmp('listing_tag');
				    	moveSelectedRow(grid, -1, 'up');
				    	Ext.getCmp('save_order_button').enable();
				    }

				},{
					xtype: 'button',
					cls: 'proxima_button_customize',
					text: '<i class="fa fa-angle-down" title="'+_text('MN02231')+'" style="font-size:13px;color:white;"></i>',
				    width: 30,
				    handler: function(b, e){
				    	var grid = Ext.getCmp('listing_tag');
				    	moveSelectedRow(grid, +1, 'down');
				    	Ext.getCmp('save_order_button').enable();
				    }

				},{
					xtype: 'button',
					cls: 'proxima_button_customize',
					text: '<i class="fa fa-angle-double-down" title="'+_text('MN02232')+'" style="font-size:13px;color:white;"></i>',
				    width: 30,
				    handler: function(b, e){
				    	var grid = Ext.getCmp('listing_tag');
				    	moveSelectedRow(grid, 0, 'bottom');
				    	Ext.getCmp('save_order_button').enable();
				    }

				}]

			},{
				xtype: 'grid',
				cls: 'proxima_customize',
				stripeRows: true,
				enableHdMenu: false,
				autoScroll: true,
				height: 300,
				id: 'listing_tag',
				store: new Ext.data.JsonStore({
					url: '/store/tag/tag_action.php',
					root: 'data',
					baseParams: {
						action: 'listing'
					},
					fields: ['tag_category_id','tag_category_title', 'tag_category_color', 'show_order']
				}),
				viewConfig: {
					loadMask: true,
					forceFit: true
				},
				columns: [
					//new Ext.grid.RowNumberer(),
					{ header: 'No', dataIndex: 'show_order', sortable:false, width: 10,},
					{ header: '', dataIndex: 'tag_category_id', sortable:'false', hidden: true }
					,{
						header: _text('MN02235'),
						dataIndex: 'tag_category_title',
						sortable:false,
						renderer: function(value, metaData, record, rowIndex, colIndex, store) {
				      		//return '<span style=\"font-weight:bold ;color:'+record.data.tag_category_color+';\">'+value+'</span>';
				      		return value;
				   		}
					}
					,{
						header: '',
						dataIndex: 'tag_category_color',
						sortable:false,
						width: 10,
						renderer: function(value, metaData, record, rowIndex, colIndex, store) {
				      		return '<i class="fa fa-circle" style=\"margin-left:5px;color:'+value+';\"></i>';
				   		}
					}
					//,{ header: 'show_order', dataIndex: 'show_order', sortable:true}
				],
				sm: new Ext.grid.RowSelectionModel({
				}),
				listeners: {
					afterrender: function(self){
						self.getStore().load();
					},
					rowdblclick: function(self, rowIndex, e){
						var sm = self.getSelectionModel().getSelected();
						var edit_tag = new Ext.Window({
							width: 300,
							height: 150,
							modal: true,
							miniwin: true,
							resizable: false,
							title: _text('MN02236'),
							cls: 'change_background_panel',
							layout: 'fit',
							buttons: [{
								text : '<span style="position:relative;top:1px;"><i class="fa fa-edit" style="font-size:13px;"></i></span>&nbsp;'+_text('MN00043'),
								scale: 'medium',
								handler: function(b, e){
									var tag_title_input_edit = Ext.getCmp('tag_title_input_edit').getValue();
									var tag_color_input_edit = Ext.getCmp('tag_color_input_edit').getValue();

									Ext.Ajax.request({
										url: '/store/tag/tag_action.php',
										params: {
											action: "update_tag",
											tag_category_id: sm.get('tag_category_id'),
											tag_category_title: tag_title_input_edit,
											tag_category_color: tag_color_input_edit
										},
										callback: function(opt, success, response){
											edit_tag.close();
											Ext.getCmp('listing_tag').getStore().reload();
											Ext.getCmp('tag_menu_list_data').menuReset();
											Ext.getCmp('tag_filters').tag_filter_reset();
											if(mode_load !== 'detail_content'){
												Ext.getCmp('tab_warp').getActiveTab().get(0).reload();
											}else{
												Ext.getCmp('tag_list_in_content').reset_list_of_tag_form();
											}
										}
									});

								}
							},{
								text : '<span style="position:relative;top:1px;"><i class="fa fa-close" style="font-size:13px;"></i></span>&nbsp;'+_text('MN00031'),
								scale: 'medium',
								handler: function(b, e){
									edit_tag.close();
								}
							}],
							items: [{
								xtype: 'form',
								frame: true,
								items: [{
									xtype: 'textfield',
									width: 150,
									allowBlank: false,
									fieldLabel: _text('MN02235'),
									id: 'tag_title_input_edit',
									value: sm.get('tag_category_title')
								},{
									xtype :'colorfield',
									width: 150,
			        				fieldLabel: _text('MN02237'),
			        				id: 'tag_color_input_edit',
			        				value: sm.get('tag_category_color'),
			        				//msgTarget: 'qtip',
			        				fallback: true

								}]
							}]
						});
						edit_tag.show();

					}
				}
			}
		],
		buttonAlign: 'center',
		fbar: [{
			text : '<span style="position:relative;top:1px;"><i class="fa fa-plus" style="font-size:13px;"></i></span>&nbsp;'+_text('MN00033'), // add
			scale: 'medium',
			handler: function(b, e){
				var create_new_tag =  new Ext.Window({
					title: _text('MN02238'),
					cls: 'change_background_panel',
					width: 300,
					modal: true,
					height: 150,
					miniwin: true,
					resizable: false,
					layout: 'fit',
					buttonAlign: 'center',
					buttons: [{
						text : '<span style="position:relative;top:1px;"><i class="fa fa-plus" style="font-size:13px;"></i></span>&nbsp;'+_text('MN00033'),
						scale: 'medium',
						handler: function(b, e){
							var tag_title_input = Ext.getCmp('tag_title_input').getValue();
							var tag_color_input = Ext.getCmp('tag_color_input').getValue();

							Ext.Ajax.request({
								url: '/store/tag/tag_action.php',
								params: {
									action: "add_tag",
									tag_category_title: tag_title_input,
									tag_category_color: tag_color_input
								},
								callback: function(opt, success, response){
									create_new_tag.close();
									Ext.getCmp('listing_tag').getStore().reload();
									Ext.getCmp('tag_menu_list_data').menuReset();
									Ext.getCmp('tag_filters').tag_filter_reset();
									if(mode_load !== 'detail_content'){
									}else{
										Ext.getCmp('tag_list_in_content').reset_list_of_tag_form();
									}
								}
							});
						}
					},{
						text : '<span style="position:relative;top:1px;"><i class="fa fa-close" style="font-size:13px;"></i></span>&nbsp;'+_text('MN00004'),
						scale: 'medium',
						handler: function(b, e){
							create_new_tag.close();
						}
					}],
					items:[{
						xtype: 'form',
						frame: true,
						items: [{
							xtype: 'textfield',
							allowBlank: false,
							width: 150,
							fieldLabel: _text('MN02235'),
							id: 'tag_title_input'
						},{
							xtype :'colorfield',
							width: 150,
	        				fieldLabel: _text('MN02237'),
	        				id: 'tag_color_input',
	        				value: '#FF0000',
	        				//msgTarget: 'qtip',
	        				fallback: true
						}]
					}]
				}); // end create new tag window
				create_new_tag.show();
			}
		},{
			action: 'update_tag',
			text : '<span style="position:relative;top:1px;"><i class="fa fa-edit" style="font-size:13px;"></i></span>&nbsp;'+_text('MN00043'),//edit
			scale: 'medium',
			handler: function(b, e){
				var hasSelection = Ext.getCmp('listing_tag').getSelectionModel().hasSelection();

				if(hasSelection){
					var sm = Ext.getCmp('listing_tag').getSelectionModel().getSelected();
					var edit_tag = new Ext.Window({
						width: 300,
						height: 150,
						modal: true,
						miniwin: true,
						resizable: false,
						title: _text('MN02236'),
						cls: 'change_background_panel',
						layout: 'fit',
						buttonAlign: 'center',
						buttons: [{
							text : '<span style="position:relative;top:1px;"><i class="fa fa-edit" style="font-size:13px;"></i></span>&nbsp;'+_text('MN00043'),//edit
							scale: 'medium',
							handler: function(b, e){
								var tag_title_input_edit = Ext.getCmp('tag_title_input_edit2').getValue();
								var tag_color_input_edit = Ext.getCmp('tag_color_input_edit2').getValue();

								Ext.Ajax.request({
									url: '/store/tag/tag_action.php',
									params: {
										action: "update_tag",
										tag_category_id: sm.get('tag_category_id'),
										tag_category_title: tag_title_input_edit,
										tag_category_color: tag_color_input_edit
									},
									callback: function(opt, success, response){
										edit_tag.close();
										Ext.getCmp('listing_tag').getStore().reload();
										Ext.getCmp('tag_menu_list_data').menuReset();
										Ext.getCmp('tag_filters').tag_filter_reset();
										if(mode_load !== 'detail_content'){
											Ext.getCmp('tab_warp').getActiveTab().get(0).reload();
										}else{
											Ext.getCmp('tag_list_in_content').reset_list_of_tag_form();
										}

									}
								});

							}
						},{
							//text: _text('MN00031'),
							text : '<span style="position:relative;top:1px;"><i class="fa fa-close" style="font-size:13px;"></i></span>&nbsp;'+_text('MN00004'),
							scale: 'medium',
							handler: function(b, e){
								edit_tag.close();
							}
						}],
						items: [{
							xtype: 'form',
							frame: true,
							items: [{
								xtype: 'textfield',
								allowBlank: false,
								width: 150,
								fieldLabel: _text('MN02235'),
								id: 'tag_title_input_edit2',
								value: sm.get('tag_category_title')
							},{
								xtype :'colorfield',
								width: 150,
		        				fieldLabel: _text('MN02237'),
		        				id: 'tag_color_input_edit2',
		        				value: sm.get('tag_category_color'),
		        				//msgTarget: 'qtip',
		        				fallback: true
							}]
						}]
					});
					edit_tag.show();
				}else{
					Ext.Msg.alert(_text('MN00022'), _text('MSG02079'));
				}
			}
		},{
			text : '<span style="position:relative;top:1px;"><i class="fa fa-trash" style="font-size:13px;"></i></span>&nbsp;'+_text('MN00034'),//delete
			scale: 'medium',
			handler: function(b, e){
				var hasSelection = Ext.getCmp('listing_tag').getSelectionModel().hasSelection();
				if(hasSelection){
					Ext.MessageBox.confirm(_text('MN00034'), _text('MSG02078'), function(btn){
					   	if(btn === 'yes'){
							var action = 'delete_tag';
							var sm = Ext.getCmp('listing_tag').getSelectionModel().getSelected();
							var tag_category_id = sm.data.tag_category_id;

							Ext.Ajax.request({
								url: '/store/tag/tag_action.php',
								params: {
									action: action,
									tag_category_id: tag_category_id,
								},
								callback: function(opt, success, response){
									Ext.getCmp('listing_tag').getStore().reload();
									Ext.getCmp('tag_menu_list_data').menuReset();
									Ext.getCmp('tag_filters').tag_filter_reset();
									if(mode_load !== 'detail_content'){
										Ext.getCmp('tab_warp').getActiveTab().get(0).reload();
									}else{
										Ext.getCmp('tag_list_in_content').reset_list_of_tag_form();
									}
								}
							});
					   }
					 });
				}else{
					Ext.Msg.alert(_text('MN00022'), _text('MSG02080'));
				}
			}
		},
		{
			text : '<span style="position:relative;top:1px;"><i class="fa fa-edit" style="font-size:13px;"></i></span>&nbsp;'+_text('MN02228'),
			id : 'save_order_button',
			disabled: true,
			scale: 'medium',
			handler: function(b, e){

				var grid = Ext.getCmp('listing_tag').getStore();
				var tag_id_order = [];
				grid.each(function(record) {
					tag_id_order.push(record.data.tag_category_id);
				});
				Ext.Ajax.request({
					url: '/store/tag/tag_action.php',
					params: {
						action: 'update_order_tag',
						tag_id_order: Ext.encode(tag_id_order)
					},
					callback: function(opt, success, response){
						Ext.getCmp('listing_tag').getStore().reload();
						Ext.getCmp('tag_menu_list_data').menuReset();
						Ext.getCmp('tag_filters').tag_filter_reset();
						Ext.getCmp('save_order_button').disable();
						if(mode_load !== 'detail_content'){
						}else{
							Ext.getCmp('tag_list_in_content').reset_list_of_tag_form();
						}
					}
				});



			}
		},
		{
			text : '<span style="position:relative;top:1px;"><i class="fa fa-close" style="font-size:13px;"></i></span>&nbsp;'+_text('MN00031'),
			scale: 'medium',
			handler: function(b, e){
				win.close();
			}
		}]

	});
	win.show();

	}

	function tag_filter_windown(){

    	var win = new Ext.Window({
			title: _text('MN02260'),
			id: 'list_of_tag_filter',
			width: 300,
			modal: true,
			height: 400,
			miniwin: true,
			resizable: false,
			layout: 'fit',
			items: [
			{
				xtype: 'grid',
				cls: 'proxima_customize',
				stripeRows: true,
				enableHdMenu: false,
				autoScroll: true,
				height: 300,
				id: 'listing_tag_filter',
				store: new Ext.data.JsonStore({
					url: '/store/tag/tag_action.php',
					root: 'data',
					baseParams: {
						action: 'listing'
					},
					fields: ['tag_category_id','tag_category_title', 'tag_category_color', 'show_order']
				}),
				viewConfig: {
					loadMask: true,
					forceFit: true
				},
				columns: [
					//new Ext.grid.RowNumberer(),
					//{ header: 'No', dataIndex: 'show_order', sortable:false, width: 10,},
					{
						//header: _text('MN02235'),
						dataIndex: 'tag_category_title',
						sortable:false,
						renderer: function(value, metaData, record, rowIndex, colIndex, store) {
				      		return '<i class=\"fa fa-circle\" style=\"margin-left:5px;color:'+record.data.tag_category_color+';\"></i>  '+value;
				      		//return value;
				   		}
					},
					{dataIndex: 'tag_category_id', sortable:'false', hidden: true }
					/*
					,{
						header: '',
						dataIndex: 'tag_category_color',
						sortable:false,
						width: 10,
						renderer: function(value, metaData, record, rowIndex, colIndex, store) {
				      		return '<i class="fa fa-circle" style=\"margin-left:5px;color:'+value+';\"></i>';
				   		}
					}*/
					//,{ header: 'show_order', dataIndex: 'show_order', sortable:true}
				],
				sm: new Ext.grid.RowSelectionModel({
				}),
				listeners: {
					afterrender: function(self){
						self.getStore().load();
					},
					rowclick: function(self, rowIndex, e){
						//alert('aa');
						var sm = self.getSelectionModel().getSelected();
						var content_tab = Ext.getCmp('tab_warp');
                        var active_tab = content_tab.getActiveTab();
                        var params = content_tab.mediaBeforeParam;
                        params.tag_category_id = sm.data.tag_category_id;
                        active_tab.get(0).reload(params);

                        win.close();
					}
				}
			}
		],
		buttonAlign: 'center',
		fbar: [
		/*
		{
			text: _text('MN02239'),
			scale: 'medium',
			handler: function(b, e){
				tag_management_windown();
			}
		},*/
		{
			text : '<span style="position:relative;top:1px;"><i class="fa fa-close" style="font-size:13px;"></i></span>&nbsp;'+_text('MN00031'),
			scale: 'medium',
			handler: function(b, e){
				win.close();
			}
		}]

	});
	win.show();

	}

	function tag_list_windown(av_content_id){
    	var win = new Ext.Window({
			title: _text('MN02310'),
			id: 'list_of_tag_filter',
			width: 300,
			modal: true,
			height: 400,
			miniwin: true,
			resizable: false,
			layout: 'fit',
			items: [
			{
				xtype: 'grid',
				cls: 'proxima_customize',
				stripeRows: true,
				enableHdMenu: false,
				autoScroll: true,
				height: 300,
				id: 'listing_tag',
				store: new Ext.data.JsonStore({
					url: '/store/tag/tag_action.php',
					root: 'data',
					baseParams: {
						action: 'listing'
					},
					fields: ['tag_category_id','tag_category_title', 'tag_category_color', 'show_order']
				}),
				viewConfig: {
					loadMask: true,
					forceFit: true
				},
				columns: [
					{
						dataIndex: 'tag_category_id', sortable:'false', hidden: true }
					,{
						dataIndex: 'tag_category_title',
						sortable:false,
						renderer: function(value, metaData, record, rowIndex, colIndex, store) {
				      		return '<i class=\"fa fa-circle\" style=\"margin-left:5px;color:'+record.data.tag_category_color+';\"></i>  '+value;
				   		}
					}

				],
				sm: new Ext.grid.RowSelectionModel({
				}),
				listeners: {
					afterrender: function(self){
						self.getStore().load();
					},
					rowclick: function(self, rowIndex, e){
						var sm = self.getSelectionModel().getSelected();
						var tag_category_id = sm.data.tag_category_id;
						var content_id_array_2 = [];
   						content_id_array_2.push({
							content_id: av_content_id
						});
						change_tag_content('change_tag_content', content_id_array_2, tag_category_id, 'no_reload_data');
                        win.close();
					}
				}
			}
			],
			buttonAlign: 'center',
			fbar: [
			{
				text: _text('MN00031'),
				scale: 'medium',
				handler: function(b, e){
					win.close();
				}
			}]

		});
		win.show();

	}
	function show_user_modifiy_information(av_user_id){
		var user_id = av_user_id;
        Ext.Ajax.request({
            url : '/store/get_myInfo.php',
            params : {
                user_id : user_id
            },
            callback : function(opts, success, response) {
                var r = Ext.decode(response.responseText);

                if (success){
                    var changeWindow = new Ext.Window({
                        width : 350,
                        height : 300,
                        title : _text('MN00043'),//'사용자 정보변경'
                        modal:true,
                        border : true,
                        layout : 'fit',
                        items : [{
                            xtype : 'form',
                            cls: 'change_background_panel',
                            frame : false,
                            width : 300,
                            padding: 10,
							border : false,
                            region : 'center',
                            buttonAlign : 'center',
                            defaults: {
                                    width: 200
                            },
                            items : [{
                                xtype : 'displayfield',
                                fieldLabel : _text('MN00189'),//'사용자'
                                value : r.data.user_nm+' ('+user_id+')',
                                id : 'user_id'
                            },{
                                xtype : 'textfield',
                                fieldLabel : _text('MN02127'),// '이메일'
                                value : r.data.email,
								allowBlank: false,
                                id : 'e_mail',
                                vtype: 'email'
                            },{
                                xtype : 'textfield',
                                fieldLabel : _text('MN00333'),//'전화번호'
                                value : r.data.phone,
                                id : 'phone'
                            },{
                                xtype : 'combo',
                                fieldLabel : _text('MN02189'),//'언어 선택'
								id : 'lang',
								hiddenName: 'lang',
								hiddenValue: 'value',
								displayField:'name',
								valueField: 'value',
								typeAhead: true,
								triggerAction: 'all',
								lazyRender:true,
								mode: 'local',
								value: 'all',
								editable : false,
								store: new Ext.data.ArrayStore({
										fields: ['name','value'],
										data: [['한국어', 'ko'], ['English', 'en'], ['日本語', 'ja']]
								}),
                                value : r.data.lang
                            },{
                                xtype : 'combo',
                                fieldLabel : _text('MN02513'),//'언어 선택'
								id : 'first_page',
								hiddenName: 'first_page',
								hiddenValue: 'value',
								displayField:'name',
								valueField: 'value',
								typeAhead: true,
								triggerAction: 'all',
								lazyRender:true,
								mode: 'local',
								editable : false,
								store: new Ext.data.ArrayStore({
										fields: ['name','value'],
										data: [[_text('MN00311'), 'home'], [_text('MN00096'), 'media'], ]
								}),
                                value : r.data.first_page
                            },{
                                xtype: 'radiogroup',
                                fieldLabel: _text('MN02319'),
                                name: 'top_menu_mode',
                                id: 'top_menu_mode_id',
                                allowBlank: false,
                                items: [
                                    {boxLabel: _text('MN02320'), id:'top_menu_mode_b', name: 'top_menu_mode', inputValue: 'B'},
                                    {boxLabel: _text('MN02321'),id:'top_menu_mode_s', name: 'top_menu_mode', inputValue: 'S'}
                                ],
                                listeners: {
                                    render: function(self){
                                        if(r.data.user_top_menu == 'S'){
                                            self.onSetValue('top_menu_mode_s', true);
                                        }else{
                                            self.onSetValue('top_menu_mode_b', true);
                                        }
                                    }

                                }
                            },{
                            	xtype: 'radiogroup',
                                fieldLabel: _text('MN02379'),
                                name: 'action_icon_slide',
                                id: 'action_icon_slide',
                                allowBlank: false,
                                items: [
                                    {boxLabel: _text('MN00001'), id:'action_icon_slide_yes', name: 'action_icon_slide', inputValue: 'Y'},
                                    {boxLabel: _text('MN00002'),id:'action_icon_slide_no', name: 'action_icon_slide', inputValue: 'N'}
                                ],
                                listeners: {
                                    render: function(self){
                                        if(r.data.action_icon_slide_yn == 'Y'){
                                            self.onSetValue('action_icon_slide_yes', true);
                                        }else{
                                            self.onSetValue('action_icon_slide_no', true);
                                        }
                                    }

                                }
                            }],

                            buttons : [{
								text : '<span style="position:relative;top:1px;"><i class="fa fa-key" style="font-size:13px;"></i></span>&nbsp;'+_text('MN00186'),
                                scale: 'medium',
                                handler : function(btnId, text, opts){									
									var changePwdWindow = new Ext.Window({
										width : 350,
										height : 150,
										title : _text('MN00043'),//'사용자 비밀번호 변경'
										modal:true,
										border : true,
										layout : 'fit',
										items : [{
											xtype : 'form',
											cls: 'change_background_panel',
											frame : false,
											width : 300,
											padding: 10,
											border : false,
											buttonAlign : 'center',
											defaults: {
													width: 200
											},
											items: [{
												xtype : 'textfield',
												fieldLabel : _text('MN00185'),//'비밀번호'
												inputType : 'password',
												allowBlank: false,
												name : 'password_1',
												value : r.data.ori_password
											},{
												xtype : 'textfield',
												fieldLabel : _text('MN00187'),//'비밀번호 확인'
												inputType : 'password',
												allowBlank: false,
												name : 'password_2'
											}],
											buttons: [{
												text: _text('MN00043'),
												handler: function(btn){
													var changePwdForm = btn.ownerCt.ownerCt.getForm();
													var password_1 = changePwdForm.findField('password_1').getValue();
													var password_2 = changePwdForm.findField('password_2').getValue();
													if( Ext.isEmpty(password_1) || Ext.isEmpty(password_2) ) {
														//Ext.Msg.alert( _text('MN00023'),'비밀번호를 입력하세요.');
														Ext.Msg.alert( _text('MN00023'), _text('MSG00095'));
														return;
													}
													if( password_1 != password_2 ) {
													   // Ext.Msg.alert( _text('MN00023'),'비밀번호가 서로 맞지 않습니다.');
													   Ext.Msg.alert( _text('MN00023'), _text('MSG00091'));
														return;
													}

													Ext.Ajax.request({
														url : '/store/change_password.php',
														params : {
															user_id : user_id,
															user_password : password_1
														},
														callback : function(opts, success, response){
															if (success) {
																try {
																	var r = Ext.decode(response.responseText);
																	if (r.success) {
																		Ext.Msg.alert(_text('MN00023'), _text('MSG02516'));
																		changePwdWindow.close();
																	} else {
																		Ext.Msg.alert(_text('MN00022'), r.msg);
																	}
																} catch(e) {
																	Ext.Msg.alert(_text('MN00022'), e+'<br />'+response.responseText);
																}
															} else {
																Ext.Msg.alert(_text('MN00022'), response.statusText);
															}
														}
													});
												}
											},{
												text: _text('MN00004'),
												handler: function(){
													changePwdWindow.close();
												}
											}]
										}]
									});

									changePwdWindow.show();
								}
							},{
                                text : '<span style="position:relative;top:1px;"><i class="fa fa-edit" style="font-size:13px;"></i></span>&nbsp;'+_text('MN00043'),//'저장'
                                scale: 'medium',
                                handler : function(btnId, text, opts){
                                    var email = Ext.get('e_mail').getValue();
                                    var phone = Ext.get('phone').getValue();
                                    var user_top_menu_mode = Ext.getCmp('top_menu_mode_id').getValue().inputValue;
                                    var action_icon_slide_yn = Ext.getCmp('action_icon_slide').getValue().inputValue;
                                    var first_page = Ext.getCmp('first_page').getValue();

									Ext.Msg.show({
										title : _text('MN00024'),//확인
										msg : _text('MSG02118'),//저장하시겠습니까?,
										buttons : Ext.Msg.OKCANCEL,
										fn : function(btn){
											if( btn == 'ok' ){
												Ext.Ajax.request({
													url : '/store/change_info.php',
													params : {
														user_id : user_id,
														email : email,
														phone : phone,
														lang : Ext.getCmp('lang').getValue(),
                                                        user_menu_mode: user_top_menu_mode,
                                                        action_icon_slide: action_icon_slide_yn,
                                                        first_page: first_page
													},
													callback : function(opts, success, response){
														if (success) {
															try {
																var r = Ext.decode(response.responseText);
																if (r.success) {
																   // Ext.Msg.alert( _text('MN00023'), r.msg);
																   //Ext.Msg.alert( _text('MN00023'), r.msg);
																	Ext.getCmp('show_user_info').getForm().setValues({
																		info_user_phone: phone,
																		info_user_email: email
																	});
																	changeWindow.close();
																	Ext.Msg.show({
																		icon: Ext.Msg.QUESTION,
																		//>>title: '확인',
																		title: _text('MN00024'),
																		//>> msg: '사용자 정보가 변경되었습니다. 다시 로그인 해 주시기 바랍니다.'+'</br>'+' 님 로그아웃 하시겠습니까?',
																		msg: _text('MSG02054')+' '+_text('MSG01038')+'</br>'+'<?=$_SESSION['user']['KOR_NM'].'('.$_SESSION['user']['user_id'].'), '?>'+_text('MSG00002'),
																		buttons: Ext.Msg.OKCANCEL,
																		fn: function(btnId, text, opts){
																			if(btnId == 'cancel') return;

																			Ext.Ajax.request({
																				url: '/store/logout.php',
																				callback: function(opts, success, response){
																					if(success){
																						try{
																							var r = Ext.decode(response.responseText);
																							if(r.success){
																								window.location = '/';
																							}else{
																								//>>Ext.Msg.alert('오류', r.msg);
																								Ext.Msg.alert(_text('MN00022'), r.msg);
																							}
																						}
																						catch(e){
																							//>>Ext.Msg.alert('오류', e+'<br />'+response.responseText);
																							Ext.Msg.alert(_text('MN00022'), e+'<br />'+response.responseText);
																						}
																					}else{
																						//>>Ext.Msg.alert('오류', response.statusText);
																						Ext.Msg.alert(_text('MN00022'), response.statusText);
																					}
																				}
																			})
																		}
																	});
																} else {
																	Ext.Msg.alert(_text('MN00022'), r.msg);
																}
															} catch(e) {
																Ext.Msg.alert(_text('MN00022'), e+'<br />'+response.responseText);
															}
														} else {
															Ext.Msg.alert(_text('MN00022'), response.statusText);
														}
													}
												});
											}
										}
									})


                                }
                            },{
                                text : '<span style="position:relative;top:1px;"><i class="fa fa-close" style="font-size:13px;"></i></span>&nbsp;'+_text('MN00004'),//'취소'
                                //text: _text('MN00004'),
                                scale: 'medium',
                                handler : function(){
                                    changeWindow.close();
                                }
                            }]
                        }]
                    }).show();
                }
            }
        });

	}

	function show_harris_storage() {

	}

	Ext.chart.Chart.CHART_URL = '/npsext/resources/charts.swf';
	Ext.BLANK_IMAGE_URL = '/npsext/resources/images/default/s.gif';

  Ext.isAdobePlugin           = <?=$adobe_plugin['isPluginUse']?>;
  Ext.isAdobeAgent            = "<?=$adobe_plugin['isAgentnm']?>";
  Ext.isHideMenu              = <?=$hide_menu_flag?>;
  Ext.isPremiere              = <?=$adobe_plugin[PREMIERE_AGENT_NM]['plugin_flag']?>;
  Ext.isPremiereHideMenu      = <?=$adobe_plugin[PREMIERE_AGENT_NM]['menu_hide_flag']?>;
  Ext.isPremiereUserid        = '<?=$user_id?>';
  Ext.isPremierelang          = '<?=$check_lang?>';
  Ext.isPremiereSession_id    = '<?=session_id()?>';
  Ext.isPremiereUdContent_id  = <?=$adobe_plugin[PREMIERE_AGENT_NM]['ud_content_id']?>;

  Ext.isPhotoshop             = <?=$adobe_plugin[PHOTOSHOP_AGENT_NM]['plugin_flag']?>;
  Ext.isPhotoshopBsContent_id = <?=$adobe_plugin[PHOTOSHOP_AGENT_NM]['bs_content_id']?>;

	//* NPS 메인페이지 함수 , 상단메뉴, 좌측메뉴 모듈 2012-08-23 by 이성용
	// src="/javascript/ext.ux/Ariel.Nps.Main.php

	// 세션 체크
	var session_expire_time = time() + <?=$session_time_limit * 60?>;
	var session_user_id = '<?=$user_id?>';
	var session_super_admin = '<?=$_SESSION['user']['super_admin']?>';
	var session_checker;
	var session_checker_id;

	var thumbSlider = "";

	function backHome() {
		location.href = 'http://'+location.host+'/index.php';
	}
	
	function sessionChecker () {
		session_checker = Ext.Ajax.request({
			url: '/store/session_check.php',
			params: {
				session_expire : session_expire_time,
				session_user_id : session_user_id,
				session_super_admin: session_super_admin
			},
			callback: function(opts, success, response) {
				var result = Ext.decode(response.responseText);
				if (result.has_session === false) {
					clearInterval(session_checker_id);
					if(result.check_duplication == true)
					{
						Ext.Msg.alert(_text('MN00024'), _text('MSG02511') + '<br />' + _text('MSG02512'), backHome);
					}
					else
					{
						Ext.Msg.alert(_text('MN00024'), _text('MSG02070') + '<br />' + _text('MSG02071'), backHome);
					}
				} else if (result.has_session === true) {
					session_expire_time = result.session_expire;
				}
			},
			failure: function (response, opts) {
				clearInterval(session_checker_id);
				Ext.Msg.alert(_text('MN00024'), _text('MSG02070'), backHome);
			}
		});
	}



	Ext.onReady(function(){

		// 30초 주기로 세션 종료 체크.
		session_checker_id = setInterval('sessionChecker()', 30*1000);

		Ext.QuickTips.init();
		Ext.apply(Ext.QuickTips.getQuickTip(),{
			showDelay: 50,
		    dismissDelay: 15000,
            shadow: false
		});

		thumbSlider = new Ext.FormPanel({
			renderTo: 'thumb_slider',
			layout: 'fit',
			items:[{
				xtype: 'slider',
				minValue: 0,
				maxValue: 100,
				//value:25,
			    id: 'grid_thumb_slider',
				width:200,
				increment: 1,
				stateful: true,
				listeners: {
					change: function(e,nv,ov) {
						var x = $(".x-grid3-row.ux-explorerview-large-icon-row");
						//var ad_width = (280 -(100-nv));

						var range_start = 150;
						var range_end = 380;
						var h_range_start = 85;
						var h_range_end = 214;
						var ad_width = (range_start +(range_end- range_start)*nv/100);
						var ad_height = (h_range_start +(h_range_end- h_range_start)*nv/100);

						for(var i=0;i<x.length;i++)
						{
							$(x[i]).height("100%");
							$(x[i]).width(ad_width+'px');
						}

						var height = parseInt((ad_width/16)*10);

						$(".thumb_img").css("max-width",(ad_width-7)+"px");
						$(".thumb_img").css("max-height",ad_height+"px");
						$(".thumb_img_box").css("width",ad_width+"px");
						$(".thumb_img_box").css("height",ad_height+"px");


					},
					changecomplete: function( slider, newValue, thumb ){
						Ext.Ajax.request({
							url: '/store/user/user_option/slide_thumb_size.php',
							params: {
								slide_thumb_value: newValue
							},
							callback: function(options, success, response) {
							}
						});
					},
					render: function(self){
						//self.setValue(0);
						self.setValue(<?=$user_option['slide_thumbnail_size']?>);

					}
				},
				change_image_size: function(){

					var x = $(".x-grid3-row.ux-explorerview-large-icon-row");
					var nv = Ext.getCmp('grid_thumb_slider').getValue();
					//var ad_width = (280 -(100-nv));
					var range_start = 150;
					var range_end = 380;
					var h_range_start = 85;
					var h_range_end = 214;
					var ad_width = (range_start +(range_end- range_start)*nv/100);
					var ad_height = (h_range_start +(h_range_end- h_range_start)*nv/100);

					for(var i=0;i<x.length;i++)
					{
						$(x[i]).height("100%");
						$(x[i]).width(ad_width+'px');
					}

					var height = parseInt((ad_width/16)*10);

					$(".thumb_img").css("max-width",(ad_width-7)+"px");
					$(".thumb_img").css("max-height",ad_height+"px");
					$(".thumb_img_box").css("width",ad_width+"px");
					$(".thumb_img_box").css("height",ad_height+"px");
				}
			}]

		});

		var view = new Ext.Viewport({
			layout: 'border',
			items: [{
				region: 'north',
      <?php if($hide_menu_flag == 'true'){?>
        height:0,
			<?php } else if($user_option['top_menu_mode'] == 'S'){?>
				height: 45,
			<?php }else{ ?>
				height: 70,
			<?php } ?>
				baseCls: 'bg_main_top_gif'
			},{
				region: 'center',
				id: 'nps_center',
				layout: 'card',
				border:false,
				activeItem: 0,
				//0 : home // 1 : search // 2 : statistic // 3 : system // 4 : request(zodiac) // 5 : interwork zodiac // 6 : statistic // 7 : system_dev
				items: [
				{//0 : home
					xtype: 'mainpanel',
					id: 'main_card_home'
				},
				new Ariel.Nps.Media({//1 : search
					id: 'main_card_search'
				}),
				new Ariel.Nps.Statistic({
					id: 'main_card_statistics'
				}),// 2 : statistic
				new Ariel.Nps.WorkManagement({
					id: 'main_card_system'
				}),// 3 : system
				<?php
				if($arr_sys_code['interwork_harris']['use_yn'] == 'Y') {
					echo "
				new Ariel.Nps.HarrisManagement({
					id: 'main_card_harris'
				}),
					";
				}
				?>
				<?php
				if(INTERWORK_ZODIAC == 'Y') {
					//2015-10-19 proxima_zodiac 메뉴 추가/ 4 : request(zodiac)
					// 5 : interwork zodiac
					echo "new Ariel.Nps.CheckRequest({
						id: 'main_card_zodiac_request'
					}),
					{
						xtype : 'infoReport',
						id: 'main_card_zodiac_report'
					},";
					//2015-10-30  proxima_zodiac 메뉴 추가
				}
				?>

				new Ariel.Nps.SystemManagement({
					id: 'main_card_configuration'
				})// 7 : system_dev
				],
				listeners: {
					afterlayout: function(self, layout) {
						// console.log(layout.activeItem);
						if (Ext.isAir) {
							try {
								if (layout.activeItem.id !== 'main-card-search') {
									airFunRemoveFilePath('all');
								}
							} catch (e) {
								// alert(e);
							}
						}

						TopMenuToggle('TopImage-home')
					}
				}
			}],
			listeners: {
				afterrender: function(self) {
          //alert(Ext.isPremiere);

          /*
				Premiere Plugin or Other first page Type check 
          */
          var first_page = '<?=$first_page?>';

      	  if(Ext.isAdobeAgent){
            TopMenuFunc('', 'TopImage-media');
            Ext.getCmp('tab_warp').setActiveTab(0);
          }else if(first_page=='media'){
              TopMenuFunc('', 'TopImage-media');
			  Ext.getCmp('tab_warp').setActiveTab(0);
          }else {
          		TopMenuFunc('', 'TopImage-home');
          }

          /*
          if(Ext.isAdobeAgent){
            TopMenuFunc('', 'TopImage-media');
            Ext.getCmp('tab_warp').setActiveTab(0);
          }
          else {
              TopMenuFunc('', 'TopImage-home');
          }
          */
    	
		


				}
			}
	   });

		var hideMask = function () {
			Ext.get('loading').remove();
			Ext.fly('loading-mask').fadeOut({
				remove:true
			});
		}

	    //hideMask.defer(250);

		//공통 키이벤트 2014-09-22
		var KeyMap =  new Ext.KeyMap(document,
			[{
				key: [83],
				alt : true,
				stopEvent : true,
				fn: function(e){
					//ctrl s
					if( !Ext.isEmpty(Ariel.RoughCutWindow) && !Ext.isEmpty(Ext.getCmp('tc_toolbar')) ){
						//러프컷프리뷰노트 입력
						Ext.getCmp('tc_toolbar').SaveTC();
					}
				}
			},{
				key: [73],
				alt : true,
				stopEvent : true,
				fn: function(e){
					//ctrl i
					if( !Ext.isEmpty(Ariel.RoughCutWindow) && !Ext.isEmpty(Ext.getCmp('tc_toolbar')) ){
						//러프컷프리뷰노트 입력
						Ext.getCmp('tc_toolbar').setInTC();
					}
				}
			},{
				key: [79],
				alt : true,
				stopEvent : true,
				fn: function(e){
					//ctrl o
					if( !Ext.isEmpty(Ariel.RoughCutWindow) && !Ext.isEmpty(Ext.getCmp('tc_toolbar')) ){
						//러프컷프리뷰노트 입력
						Ext.getCmp('tc_toolbar').setOutTC();
					}
				}
			},{
				key: [80],
				alt : true,
				stopEvent : true,
				fn: function(e){
					//엔터
					if( !Ext.isEmpty(Ariel.RoughCutWindow) && !Ext.isEmpty(Ext.getCmp('tc_toolbar')) ){
						//러프컷프리뷰노트 입력
						Ext.getCmp('tc_toolbar').setAddTC();
					}
				}
			},{
				key: [68],
				alt : true,
				stopEvent : true,
				fn: function(e){
					//ctrl d
					if( !Ext.isEmpty(Ariel.RoughCutWindow) && !Ext.isEmpty(Ext.getCmp('tc_toolbar')) ){
						//러프컷프리뷰노트 입력
						Ext.getCmp('tc_toolbar').DelTC();
					}
				}
			},{
				key: [67],
				alt : true,
				stopEvent : true,
				fn: function(e){
					//ctrl c
				}
			}
		]);

    });
    </script>
	<!-- 현이png스크립트추가-->
    <style type="text/css">
	.png24 {
        tmp:expression(setPng24(this));
	}
	</style>

	<script type="text/javascript" src="/flash/flowplayer/example/flowplayer-3.2.4.min.js"></script>

	<div id="thumb_slider"></div>
  <?php if($hide_menu_flag == 'true'){?>
    <header style="display:none;">
			<img src="/css/images/logo/proxima_logo_small_mode.gif"/>
			<ul>
				<?php
					$result= createTopMenu_main($_SESSION , $_GET);
					echo $result;
				?>
			</ul>
			<?php
			if ( $_SESSION['user']['user_id'] != 'temp' )
			{
			?>
			<div class="logout">
				<div title="<?=_text('MN00189')?>" style="float:left; margin-top:0px;padding: 2px 5px 5px 12px;"><b><?=$_SESSION['user']['KOR_NM']?></b></div>
				<button type="button" onClick="logout()" ext:qtip="<?=_text('MN00013')?>"></button>
			</div>
			<?
			}
			else
			{
				echo '';
			}
			?>
	    </header>
	<?php } else if($user_option['top_menu_mode'] == 'S'){?>
		<header class="header_small_mode">
			<img src="/css/images/logo/proxima_logo_small_mode.gif"/>
			<ul>
				<?php
					$result= createTopMenu_main($_SESSION , $_GET);
					echo $result;
				?>
			</ul>
			<?php
			if ( $_SESSION['user']['user_id'] != 'temp' )
			{
			?>
			<div class="logout">
				<div title="<?=_text('MN00189')?>" style="float:left; margin-top:0px;padding: 2px 5px 5px 12px;"><b><?=$_SESSION['user']['KOR_NM']?></b></div>
				<button type="button" onClick="logout()" ext:qtip="<?=_text('MN00013')?>"></button>
			</div>
			<?
			}
			else
			{
				echo '';
			}
			?>
	    </header>
    <?php }else{?>
    	<header class="header_big_mode">
			<img src="/css/images/logo/proxima_logo_big_mode.png"/>
			<ul>
				<?php
					$result= createTopMenu_main($_SESSION , $_GET);
					echo $result;
				?>
			</ul>
			<?php
			if ( $_SESSION['user']['user_id'] != 'temp' )
			{
			?>
			<div class="logout">
				<div title="<?=_text('MN00189')?>" style="float:left; margin-top:0px;padding: 4px 5px 0px 9px;"><b><?=$_SESSION['user']['KOR_NM']?></b></div>
				<button type="button" onClick="logout()" ext:qtip="<?=_text('MN00013')?>"></button>
			</div>
			<?
			}
			else
			{
				echo '';
			}
			?>
	    </header>
    <?php }?>



	<script type="text/javascript">
	function fn_checkLogout(callbackFunction, av_obj){
		Ext.Ajax.request({
			url: '/lib/session_check.php',
			async: false,
			callback: function(opts, success, response){
				if(success){
					try{
						if(response.responseText != 'true'){
							fn_msgLogout(av_obj);
						}else{
							if(!Ext.isEmpty(callbackFunction)){
								callbackFunction();
							}
						}
					}
					catch(e){
						fn_msgLogout(av_obj);
					}
				}else{
					fn_msgLogout(av_obj);
				}
			}
		});
	}

	function fn_Logout(av_obj){
		Ext.Ajax.request({
			url: '/store/logout.php',
			callback: function(opts, success, response){
				if(success){
					try{
						var r = Ext.decode(response.responseText);
						if(r.success){
							//넘어온 객체가 있고 객체의 부모가 있는 경우 부모를
							if(!Ext.isEmpty(av_obj) && !Ext.isEmpty(av_obj.opener)){

                if(Ext.isAdobeAgent){
                    av_obj.opener.location = '/?agent='+Ext.isAdobeAgent;
                }else {
                  av_obj.opener.location = '/';
                }

								if(!Ext.isEmpty(av_obj.self)){
									window.close();
								}
							}else{
                if(Ext.isAdobeAgent){
                    window.location = '/?agent='+Ext.isAdobeAgent;
                }else {
                    window.location = '/';
                }
							}
						}else{
							//>>Ext.Msg.alert('오류', r.msg);
							Ext.Msg.alert('<?=_text('MN00022')?>', r.msg);
						}
					}
					catch(e){
						//>>Ext.Msg.alert('오류', e+'<br />'+response.responseText);
						Ext.Msg.alert('<?=_text('MN00022')?>', e+'<br />'+response.responseText);
					}
				}else{
					//>>Ext.Msg.alert('오류', response.statusText);
					Ext.Msg.alert('<?=_text('MN00022')?>', response.statusText);
				}
			}
		});
	}

	function fn_msgLogout(av_obj){
		Ext.Msg.show({
			title: _text('MN00024'),
			msg: '재 로그인이 필요합니다',
			buttons: Ext.Msg.OK,
			fn: function(btnID){
				Ext.Ajax.request({
					url: '/store/logout.php',
					callback: function(opts, success, response){
						if(success){
							try{
								var r = Ext.decode(response.responseText);
								if(r.success){
									//넘어온 객체가 있고 객체의 부모가 있는 경우 부모를
									if(!Ext.isEmpty(av_obj) && !Ext.isEmpty(av_obj.opener)){

                    if(Ext.Ext.isAdobeAgent){
                        av_obj.opener.location = '/?agent='+Ext.isAdobeAgent;
                    }else {
                        av_obj.opener.location = '/';
                    }
										if(!Ext.isEmpty(av_obj.self)){
											window.close();
										}
									}else{
                    if(Ext.Ext.isAdobeAgent){
                        window.location = '/?agent='+Ext.isAdobeAgent;
                    }else {
                        window.location = '/';
                    }
									}
								}else{
									//>>Ext.Msg.alert('오류', r.msg);
									Ext.Msg.alert('<?=_text('MN00022')?>', r.msg);
								}
							}
							catch(e){
								//>>Ext.Msg.alert('오류', e+'<br />'+response.responseText);
								Ext.Msg.alert('<?=_text('MN00022')?>', e+'<br />'+response.responseText);
							}
						}else{
							//>>Ext.Msg.alert('오류', response.statusText);
							Ext.Msg.alert('<?=_text('MN00022')?>', response.statusText);
						}
					}
				});
			}
		});
	}

	function doInfoDownload(value){

		window.open('http://<?=convertIP( $_SERVER['REMOTE_ADDR'])?>/store/http_download.php?path='+value);
	}

	function TopMenuToggle(toggle_menu)
	{
		var menu_img_array = new Array("TopImage-home","TopImage-media","TopImage-tmmonitor","TopImage-statistics","TopImage-system","TopImage-request","TopImage-info_report","TopImage-statistics_", "TopImage-system_dev", "TopImage-harris");//2015-12-07 proxima_zodiac 의뢰, 보도정보, 통계 추가

		for(var i=0;i<menu_img_array.length;i++)
		{
			if(toggle_menu == menu_img_array[i])
			{
				var tar = Ext.get(Ext.query('a[name='+menu_img_array[i]+']')[0]);
				if(tar)
				{
					tar.setStyle('color','red');
				}

				var tar = Ext.get(Ext.query('span[name=arrow_'+menu_img_array[i]+']')[0]);
				if(tar)
				{
					tar.addClass('menu_arrow');
				}
			}
			else
			{
				var tar = Ext.get(Ext.query('a[name='+menu_img_array[i]+']')[0]);
				if(tar)
				{
					tar.setStyle('color','');
				}

				var tar = Ext.get(Ext.query('span[name=arrow_'+menu_img_array[i]+']')[0]);
				if(tar)
				{
					tar.removeClass('menu_arrow');
				}
			}
		}
	}

	function TopMenuFunc(that, menu){
		//메뉴이동시 상세검색창 닫기
		closeAdvancedSearchWin();
		var main_center = Ext.getCmp('nps_center').getLayout();
		thumbSlider.hide();
		switch(menu){
			case 'TopImage-home':
				afterMenuChange('main_card_home');
				TopMenuToggle(menu);
				//active시 스토어 로드되도록 수정 2014-12-26
				if( !Ext.isEmpty(Ext.getCmp('tab_warp')) ){
					Ext.getCmp('tab_warp').setActiveTab(0);
				}
			break;
			case 'TopImage-media':
				afterMenuChange('main_card_search');
				TopMenuToggle(menu);
				thumbSlider.show();
			break;
			case 'TopImage-statistics':
				afterMenuChange('main_card_statistics');
				TopMenuToggle(menu);
			break;
			case 'TopImage-system':
				afterMenuChange('main_card_system');
				TopMenuToggle(menu);
			break;
			case 'TopImage-request'://2015-10-19 proxima_zodiac  메뉴 추가
				afterMenuChange('main_card_zodiac_request');
				TopMenuToggle(menu);
			break;
			case 'TopImage-harris':
				afterMenuChange('main_card_harris');
				TopMenuToggle(menu);        
			break;
			case 'TopImage-info_report'://2015-10-30 proxima_zodiac  메뉴 추가
				afterMenuChange('main_card_zodiac_report');
				TopMenuToggle(menu);
				if( !Ext.isEmpty(Ext.getCmp('tab_list')) ){
					Ext.getCmp('tab_list').setActiveTab(0);
				}
				if( !Ext.isEmpty(Ext.getCmp('tab_content_list')) ){
					Ext.getCmp('tab_content_list').setActiveTab(0);
				}
			break;
			case 'TopImage-system_dev'://2016-01-25 super admin  메뉴 추가
				afterMenuChange('main_card_configuration');
				TopMenuToggle(menu);
			break;
		}

		//클릭 이미지 변경 2014-12-26 이성용
		MM_swapImgRestore();
		MM_swapImage(menu,'','/css/h_img/nps_menu_sun.png',1);

	}

	function contentTooolbarTemplete(that){
			var id = document.getElementById(that);
	}

	function goCueSheet() {
			var current_tab = Ext.getCmp('nps_center').getLayout().activeItem.id;

			if(current_tab == 'nps_media_main') {
		if(!Ext.isEmpty(cuesheetSearchWin)) {
		cuesheetSearchWin.hide();
		}
				var cuesheet = Ext.getCmp('media_cuesheet');
				if(cuesheet.collapsed) {
					Ext.getCmp('media_cuesheet').collapsible = true;
					Ext.getCmp('media_cuesheet').expand();
					console.log(Ext.getCmp('media_cuesheet'));
					document.getElementById('thumb_slider').style.right = '167px';
				} else {
					Ext.getCmp('media_cuesheet').collapse();
					Ext.getCmp('media_cuesheet').collapsible = false;
					document.getElementById('thumb_slider').style.top = '20px';
				}
			} else if(current_tab == 'nps_audio_main') {
		if(!Ext.isEmpty(cuesheetSearchWin)) {
		cuesheetSearchWin.hide();
		}
				var cuesheet = Ext.getCmp('audio_cuesheet');
				if(cuesheet.collapsed) {
					Ext.getCmp('audio_cuesheet').collapsible = true;
					Ext.getCmp('audio_cuesheet').expand();
					console.log(Ext.getCmp('media_cuesheet'));
					document.getElementById('thumb_slider').style.right = '167px';
				} else {
					Ext.getCmp('audio_cuesheet').collapse();
					Ext.getCmp('audio_cuesheet').collapsible = false;
					document.getElementById('thumb_slider').style.top = '20px';
				}
			} else {
				return;
			}
	}

	//메뉴 변경 함수 통합 2016-03-09 이성용
	function afterMenuChange(itemPosition){
		if(!itemPosition){
			itemPosition = 0;
		}
		Ext.getCmp('nps_center').getLayout().setActiveItem(itemPosition);
		Ext.getCmp('nps_center').doLayout();
	}

	// 메뉴 이동시 기존에 상세검색 window 가 떠있으면 hide 처리함
	function closeAdvancedSearchWin() {
	    if( Ariel.advancedSearch ) {
		    Ariel.advancedSearch.hide();
	    } else if ( Ariel.advancedAudioSearch ) {
		    Ariel.advancedAudioSearch.hide();
	    } else if ( Ariel.advancedCGSearch ) {
		    Ariel.advancedCGSearch.hide();
	    }
	}

// make zip file from urls using jszip
	function deferredAddZip(url, filename, zip) {
        var deferred = $.Deferred();
        JSZipUtils.getBinaryContent(url, function (err, data) {
            if(err) {
                deferred.reject(err);
            } else {
                zip.file(filename, data, {binary:true});
                deferred.resolve(data);
            }
        });
        return deferred;
    }

 /*
 로그아웃 버튼을 눌렀을 경우 수행하는 함수
 */
	function logout(){
		Ext.Msg.show({
			icon: Ext.Msg.QUESTION,
			//>>title: '확인',
			title: '<?=_text('MN00024')?>',
			//>> msg: ' 님 로그아웃 하시겠습니까?',
			msg: '<?=$_SESSION['user']['KOR_NM'].'('.$_SESSION['user']['user_id'].'), '._text('MSG00002')?>',
			buttons: Ext.Msg.OKCANCEL,
			fn: function(btnId, text, opts){
				if(btnId == 'cancel') return;

				Ext.Ajax.request({
					url: '/store/logout.php',
					callback: function(opts, success, response){
						if(success){
							try{
								var r = Ext.decode(response.responseText);
								if(r.success){
                  if(Ext.isAdobeAgent){
                      window.location = '/?agent='+Ext.isAdobeAgent;
                  }else {
									    window.location = '/';
                  }
								}else{
									//>>Ext.Msg.alert('오류', r.msg);
									Ext.Msg.alert('<?=_text('MN00022')?>', r.msg);
								}
							}
							catch(e){
								//>>Ext.Msg.alert('오류', e+'<br />'+response.responseText);
								Ext.Msg.alert('<?=_text('MN00022')?>', e+'<br />'+response.responseText);
							}
						}else{
							//>>Ext.Msg.alert('오류', response.statusText);
							Ext.Msg.alert('<?=_text('MN00022')?>', response.statusText);
						}
					}
				})
			}
		});
	}

	function doSimpleSearch(type) {

		// 통합검색일시 상세검색 초기화
		/*
		if(!Ext.isEmpty(Ext.getCmp('a-search-win'))) {
			Ext.getCmp('a-search-win').searchWinReset();
		}
		*/

		var is_research = null,
			value = '',
			content_tab = '',
			now_tree = '',
			active_tab,
			nodePath = '/0',
			search_field = '',
			mode,
			node;

		search_field =  Ext.getCmp('search_input');
        value = Ext.getCmp('search_input').getValue();
        content_tab = Ext.getCmp('tab_warp');
        //now_tree = Ext.getCmp('menu-tree');
        now_tree = Ext.getCmp('tree-tab').getActiveTab();
        is_research = Ext.getCmp('research_media').getValue();

	    if (is_research) {
	        search_field.search_array.push(value);
	    } else {
	        search_field.search_array = [];
	    }

		active_tab = content_tab.getActiveTab();
		node = now_tree.getSelectionModel().getSelectedNode();

		if ( ! Ext.isEmpty(node)) {
			nodePath = node.getPath();
		}

		if (now_tree.title == '지난 제작프로그램') mode = 'last';

		active_tab.get(0).reload({
			meta_table_id: active_tab.ud_content_id,
			list_type: 'common_search',
			filter_value: nodePath,
			mode: mode,
			search_q: value,
	        search_array: Ext.encode(search_field.search_array),
	        start: 0
		});

		content_tab.items.each(function(item){
			//item.setTitle(item.initialConfig.title + '(' + ')');
		});
	}
  /*
	function doAdvancedSearch(self){
		var position_arr = self.ownerCt.ownerCt.items.items[0].getPosition();
		var x_pos = position_arr[0];
		var y_pos = position_arr[1];
		var content_tab = Ext.getCmp('tab_warp');
        var active_tab = content_tab.getActiveTab();
        var ud_content_id = active_tab.ud_content_id;

		if( !Ext.isEmpty(Ariel.advancedSearch) ) {
			Ariel.advancedSearch.setPosition(x_pos, y_pos);
			Ariel.advancedSearch.show();
			return;
		}

		var advSearch_btn = Ext.getCmp('advSearchBtn');
		advSearch_btn.disable();
		Ext.Ajax.request({
			url: '/pages/browse/win_advancedSearch.php',// /  /pages/browse/win_advancedSearch.php
			params: {
				x_pos : x_pos,
				y_pos : y_pos,
				ud_content_id: ud_content_id
			},
			callback: function(self, success, response){
				try {
					var r = Ext.decode(response.responseText);
					r.show();
					advSearch_btn.enable();
				}
				catch(e){
					//>>Ext.Msg.alert('오류', e);
					Ext.Msg.alert(_text('MN00022'), e);
				}
			}
		});

	}
  */

  var isOpenedAdvSearchPanel = false;
   function openAdvancePanel()
   {
      var s_win = Ext.getCmp('a-search-win');
      s_win.toggleCollapse(); // 2012-06-23 광회 추가 collapse mini button 과 상세검색 버튼 연동 문제.
      if (isOpenedAdvSearchPanel)
      {
         isOpenedAdvSearchPanel = false;
         s_win.collapse();
      }
      else
      {
         isOpenedAdvSearchPanel = true;
         s_win.expand();
         //Ext.get('search_input').dom.value = '';
      }
   }
	function fn_pwCheck(p) {
		chk1 = /^[a-z\d\{\}\[\]\/?.,;:|\)*~`!^\-_+&lt;&gt;@\#$%&amp;\\\=\(\'\"]{8,12}$/i;  //영문자 숫자 특문자 이외의 문자가 있는지 확인
		chk2 = /[a-z]/i;  //적어도 한개의 영문자 확인
		chk3 = /\d/;  //적어도 한개의 숫자 확인
		chk4 = /[\{\}\[\]\/?.,;:|\)*~`!^\-_+&lt;&gt;@\#$%&amp;\\\=\(\'\"]/i; //적어도 한개의 특문자 확인

		return chk1.test(p) && chk2.test(p) && chk3.test(p) && chk4.test(p);
	}

	function checkPassword(add_user_id, value1, value2){
		if(Ext.isEmpty(value1)){
			//Ext.Msg.alert('확인','비밀번호를 입력해 주세요.');
			Ext.Msg.alert(_text('MN00024'), _text('MSG00095'));
			return 're';
		}else if(Ext.isEmpty(value2)){
			//Ext.Msg.alert('확인','비밀번호 확인을 입력해 주세요.');
			Ext.Msg.alert(_text('MN00024'), _text('MSG00096'));
			return 're';
		}else if(value1 != value2){
			//Ext.Msg.alert('확인','비밀번호 확인을 다시 입력해 주세요.');
			Ext.Msg.alert(_text('MN00024'), _text('MSG00097'));
			return 're';
		}else if('<?=$check_pw?>' == 'Y' && add_user_id != 'admin'){
			if( value1.length < 9 ){
				//Ext.Msg.alert('확인','비밀번호를 8자리 이상으로 입력해 주세요.');
				Ext.Msg.alert(_text('MN00024'), _text('MSG02034'));
				return 're';
			}else if( !fn_pwCheck(value1) ){
				//Ext.Msg.alert('확인','비밀번호는 영문, 숫자, 특수문자를 각각 1개 이상 포함하여야 합니다.');
				Ext.Msg.alert(_text('MN00024'), _text('MSG02035'));
				return 're';
			}
			return 'check';
		}else{
			return 'check';
		}
	}

	function changeInfo(action,add_user_id, value1, value2, email, phone, changeWindow, infos, groups, lang, top_menu_mode, action_icon_slide_yn)
	{
		var url, dept_nm, dept, groups, user_name, user_groups, msg_r, check_pw ;
		if(action == 'add')
		{
			url = '/store/user/user_oracle.php';
			msg_r = _text('MSG01024');//추가 되었습니다.
		}
		else
		{
			url = '/store/change_password.php';
			msg_r = _text('MSG02033');//변경 되었습니다.
		}

		if(infos)
		{
			dept_nm = infos.get(5).getValue();
			dept = infos.get(6).getValue();;
			user_groups = groups.join(',');
			user_name = infos.get(4).getValue();
		}

		check_pw = checkPassword(add_user_id, value1, value2);
		if(check_pw == 'check')
		{
			Ext.Ajax.request({
				url: url,
				params: {
					action : action,
					user_id : add_user_id,
					name : user_name,
					user_password : value1,
					password_1 : value1,
					password_2 : value2,
					email : email,
					phone : phone,
					groups: user_groups,
					job_position: dept,
					dept_nm : dept_nm,
					lang : lang,
					top_menu_mode: top_menu_mode,
					action_icon_slide_yn: action_icon_slide_yn
				},
				callback: function(options, success, response){
					if (success)
					{
						try
						{
							var r = Ext.decode(response.responseText);
							if (r.success)
							{
								if( Ext.getCmp('show_user_info') )
								{
									Ext.getCmp('show_user_info').getForm().setValues({
										info_user_phone: phone,
										info_user_email: email
									});
								}
								changeWindow.close();
							}
							else
							{
								if(r.msg){
									Ext.Msg.show({
										title: _text('MN00024'),//'확인'
										msg: r.msg,
										buttons: Ext.Msg.OK
									});
								}
							}
						}
						catch (e)
						{
							Ext.Msg.alert(e['name'], e['message']);
						}
					}
					else
					{
						Ext.Msg.alert(_text('MN00024'), response.statusText);//'확인'
					}
				}
			});
		}
	}

	function excelData(search_type, url, grid_column, search_text, search_value1, search_value2)
	{
		var columns = new Array();
		var coloumn_length, columnInfo;

		if(!Ext.isEmpty(grid_column)){
			if(search_type == 'program')
			{
				coloumn_length = grid_column.length;
				columnInfo = grid_column;
			} else if(search_type == 'form')
			{
				search_text = Ext.encode(search_text);
				search_value1 = Ext.encode(search_value1);
				coloumn_length = grid_column.getColumnCount();
				columnInfo = grid_column.columns;
			} else
			{
				coloumn_length = grid_column.getColumnCount();
				columnInfo = grid_column.columns;
			}

			for(var i = 0; i < coloumn_length; i++)
			{
				if(columnInfo[i].dataIndex == 'content_id')continue;
				if(columnInfo[i].hidden == true)
				{
					var hidden_text = 'hidden';
				}
				else
				{
					var hidden_text = 'show';
					var column_data = new Array();
					column_data[0] = columnInfo[i].dataIndex;
					column_data[1] = columnInfo[i].header;
					column_data[2] = columnInfo[i].width;
					column_data[3] = columnInfo[i].align;
					column_data[4] = hidden_text;//grid_column.columns[i].hidden
					columns[i] = column_data;
				}

			}
		}

		var form = document.createElement("form");
		form.setAttribute("method", "post"); // POST
		form.setAttribute("target", "_blank"); // 새창

		form.setAttribute("action", url);

		//조회값 종류
		var types = document.createElement("input");
		types.setAttribute("name", "search_type");
		types.setAttribute("value", search_type);
		form.appendChild(types);

		//조회 필드
		var search_menu = document.createElement("input");
		search_menu.setAttribute("name", "search_f");
		search_menu.setAttribute("value", search_text);
		form.appendChild(search_menu);

		//컬럼
		var grid_column = document.createElement("input");
		grid_column.setAttribute("name", "columns");
		grid_column.setAttribute("value", Ext.encode(columns));
		form.appendChild(grid_column);

		//조회 값
		var search_values1 = document.createElement("input");
		search_values1.setAttribute("name", "search_v");
		search_values1.setAttribute("value", search_value1);
		form.appendChild(search_values1);

		var search_values1 = document.createElement("input");
		search_values1.setAttribute("name", "search_sdate");
		search_values1.setAttribute("value", search_value1);
		form.appendChild(search_values1);

		var search_values2 = document.createElement("input");
		search_values2.setAttribute("name", "search_edate");
		search_values2.setAttribute("value", search_value2);
		form.appendChild(search_values2);

		//excel 구분값
		var is_excel = document.createElement("input");
		is_excel.setAttribute("name", "is_excel");
		is_excel.setAttribute("value", 1);
		form.appendChild(is_excel);

		document.body.appendChild(form);
		form.submit();

		return;
	}



	function webUploaderRegist( content_id ){
		if(!Ext.isEmpty(Ext.getCmp('ariel-upload-win')))
		{
			Ext.getCmp('ariel-upload-win').destroy();
		}

		var statusIconRenderer = function(value){
			switch(value){
				case 'Pending':
					return '<img src="/javascript/awesomeuploader/hourglass.png" width=16 height=16>';
				break;
				case 'Sending':
					return '<img src="/javascript/awesomeuploader/loading.gif" width=16 height=16>';
				break;
				case 'Error':
					return '<img src="/javascript/awesomeuploader/cross.png" width=16 height=16>';
				break;
				case 'Cancelled':
				case 'Aborted':
					return '<img src="/javascript/awesomeuploader/cancel.png" width=16 height=16>';
				break;
				case 'Uploaded':
					return '<img src="/javascript/awesomeuploader/tick.png" width=16 height=16>';
				break;
			}
		}, statusIconRendererName = function(value){
			switch(value){
				case 'Pending':
					return '대기';
					return '<img src="/javascript/awesomeuploader/hourglass.png" width=16 height=16>';
				break;
				case 'Sending':
					return '전송중';
					return '<img src="/javascript/awesomeuploader/loading.gif" width=16 height=16>';
				break;
				case 'Error':
					return '실패';
					return '<img src="/javascript/awesomeuploader/cross.png" width=16 height=16>';
				break;
				case 'Cancelled':
				case 'Aborted':
					return '취소';
					return '<img src="/javascript/awesomeuploader/cancel.png" width=16 height=16>';
				break;
				case 'Uploaded':
					return '성공';
					return '<img src="/javascript/awesomeuploader/tick.png" width=16 height=16>';
				break;
			}
		}
		, progressBarColumnTemplate = new Ext.XTemplate(
			'<div class="ux-progress-cell-inner ux-progress-cell-inner-center ux-progress-cell-foreground">',
				'<div>{value} %</div>',
			'</div>',
			'<div class="ux-progress-cell-inner ux-progress-cell-inner-center ux-progress-cell-background" style="left:{value}%">',
				'<div style="left:-{value}%">{value} %</div>',
			'</div>'
		),

		progressBarColumnRenderer = function(value, meta, record, rowIndex, colIndex, store){
			meta.css += ' x-grid3-td-progress-cell';
			return progressBarColumnTemplate.apply({
				value: value
			});
		},

		updateFileUploadRecord = function(id, column, value){
			var rec = Ext.getCmp('ariel-upload-form').awesomeUploaderGrid.store.getById(id);
			rec.set(column, value);
			rec.commit();
		};

		new Ext.Window({
			width: 480,
			height: 350,
			id: 'ariel-upload-win',
			title: '첨부파일 업로드',
			collapsible: false,
			titleCollapse: false,
			layout: 'fit',
			modal: true,
			listeners: {
				close: function(){
					if( !Ext.isEmpty(Ext.getCmp('media_list_new')) ){
						Ext.getCmp('media_list_new').getStore().reload();
					}
					if( !Ext.isEmpty(Ext.getCmp('media_list')) ){
						Ext.getCmp('media_list').getStore().reload();
					}
				},
				destroy: function(){
					if( !Ext.isEmpty(Ext.getCmp('media_list_new')) ){
						Ext.getCmp('media_list_new').getStore().reload();
					}
					if( !Ext.isEmpty(Ext.getCmp('media_list')) ){
						Ext.getCmp('media_list').getStore().reload();
					}
				}
			},
			items: [{
				xtype: 'form',
				id: 'ariel-upload-form',
				border: false,
				padding: 5,
				autoScroll: true,
				defaults: {
					anchor: '100%'
				},
				buttons: [{
					'text': '닫기',
					scale: 'medium',
					handler: function(){
						Ext.getCmp('ariel-upload-win').destroy();
					}
				}],
				items: [{
					xtype: 'hidden',
					id: 'content_id',
					name: 'content_id'
				},{
					xtype: 'awesomeuploader'
					,id: 'awesomeUploader'
					,ref: 'awesomeUploader'
					,height: 40
					,awesomeUploaderRoot: '/javascript/awesomeuploader/'
					,allowDragAndDropAnywhere: true
					,autoStartUpload: false
					,maxFileSizeBytes:  2 * 1024 * 1024 * 1024 // 15 MiB
					,listeners: {
						scope: this
						,fileselected: function( awesomeUploader, file){

							//							file will at minimum be:
							//							file = {
							//								name: fileName
							//								,method: "swfupload" //(can be "swfupload", "standard", "dnd"
							//								,id: 1 // a unique identifier to abort or remove an individual file, incrementing int
							//								,status: "queued" // file status. will always be queued at this point
							//								// if swfupload or dnd or standard upload on a modern browser (supports the FILE API) is used, size property will be set:
							//								,size: 12345 // file size in bytes
							//							}


														//Example of cancelling a file to be selection
							//							if( file.name == 'image.jpg' ){
							//								Ext.Msg.alert('Error','You cannot upload a file named "image.jpg"');
							//								return false;
							//							}

							Ext.getCmp('ariel-upload-form').awesomeUploaderGrid.store.loadData({
								id:file.id
								,name:file.name
								,size:file.size
								,status:'Pending'
								,progress:0
							}, true);
						}
						,uploadstart: function(awesomeUploader, file){

							updateFileUploadRecord(file.id, 'status', 'Sending');
						}
						,uploadprogress: function(awesomeUploader, fileId, bytesComplete, bytesTotal){

							updateFileUploadRecord(fileId, 'progress', Math.round((bytesComplete / bytesTotal)*100) );
						}
						,uploadcomplete:function(awesomeUploader, file, serverData, resultObject){
							//Ext.Msg.alert('Data returned from server'+ serverData);

							try{
								var result = Ext.util.JSON.decode(serverData);//throws a SyntaxError.
							}catch(e){
								resultObject.error = 'Invalid JSON data returned';
								//Invalid json data. Return false here and "uploaderror" event will be called for this file. Show error message there.
								return false;
							}
							resultObject = result;

							if(result.success){
								updateFileUploadRecord(file.id, 'progress', 100 );
								updateFileUploadRecord(file.id, 'status', 'Uploaded' );

								var params = Ext.getCmp('ariel-upload-form').getForm().getValues();
								params.filename = file.name;
								params.filesize = file.size;
								params.path = result.path;
								params.content_id = result.content_id;

								Ext.Ajax.request({
									url: '/javascript/awesomeuploader/regist.php',
									params: params,
									callback: function(opts, success, response){

										if(success)
										{
											try
											{
												var r  = Ext.decode(response.responseText);
												if(r.success)
												{
													Ext.Msg.alert('성공', r.msg);
												}
												else
												{
													Ext.Msg.alert( _text('MN00023'), r.msg);
												}
											}
											catch(e)
											{
												Ext.Msg.alert(e['name'], e['message']);
											}
										}
										else
										{
											Ext.Msg.alert('오류', response.statusText);
										}
									}
								});

							}else{
								return false;
							}

						}
						,uploadaborted:function(awesomeUploader, file ){
							updateFileUploadRecord(file.id, 'status', 'Aborted' );
						}
						,uploadremoved:function(awesomeUploader, file ){

							Ext.getCmp('ariel-upload-form').awesomeUploaderGrid.store.remove(Ext.getCmp('ariel-upload-form').awesomeUploaderGrid.store.getById(file.id) );
						}
						,uploaderror:function(awesomeUploader, file, serverData, resultObject){
							resultObject = resultObject || {};

							var error = 'Error! ';
							if(resultObject.error){
								error += resultObject.error;
							}

							updateFileUploadRecord(file.id, 'progress', 0 );
							updateFileUploadRecord(file.id, 'status', 'Error' );

						}
					}
				},{
					xtype:'grid'
					,ref:'awesomeUploaderGrid'
					,width:420
					,height:200
					,enableHdMenu: false
					,tbar:[{
						text:'업로드'
						,icon:'/javascript/awesomeuploader/tick.png'
						,scope:this
						,handler:function(){

							Ext.getCmp('ariel-upload-form').awesomeUploader.extraPostData = Ext.getCmp('ariel-upload-form').getForm().getValues();

							Ext.getCmp('ariel-upload-form').awesomeUploader.startUpload();
						}
					},{
						text:'Abort'
						,hidden: true
						,icon:'/javascript/awesomeuploader/cancel.png'
						,scope:this
						,handler:function(){
							var selModel = Ext.getCmp('ariel-upload-form').awesomeUploaderGrid.getSelectionModel();
							if(!selModel.hasSelection()){
								Ext.Msg.alert('','Please select an upload to cancel');
								return true;
							}
							var rec = selModel.getSelected();
							Ext.getCmp('ariel-upload-form').awesomeUploader.abortUpload(rec.data.id);
						}
					},{
						text:'Abort All'
						,hidden: true
						,icon:'/javascript/awesomeuploader/cancel.png'
						,scope:this
						,handler:function(){
							Ext.getCmp('ariel-upload-form').awesomeUploader.abortAllUploads();
						}
					},{
						text:'삭제'
						,icon:'/javascript/awesomeuploader/cross.png'
						,scope:this
						,handler:function(){
							var selModel = Ext.getCmp('ariel-upload-form').awesomeUploaderGrid.getSelectionModel();
							if(!selModel.hasSelection()){
								Ext.Msg.alert('','Please select an upload to cancel');
								return true;
							}
							var rec = selModel.getSelected();
							Ext.getCmp('ariel-upload-form').awesomeUploader.removeUpload(rec.data.id);
						}
					},{
						text:'모두 삭제'
						,icon:'/javascript/awesomeuploader/cross.png'
						,scope:this
						,handler:function(){
							Ext.getCmp('ariel-upload-form').awesomeUploader.removeAllUploads();
						}
					}]
					,store:new Ext.data.JsonStore({
						fields: ['id','name','size','status','progress']
						,idProperty: 'id'
					})
					,columns:[
						{header:'파일 명',dataIndex:'name', width:150}
						,{header:'크 기',dataIndex:'size', width:60, renderer:Ext.util.Format.fileSize}
						//,{header:'진행률',dataIndex:'progress', renderer:progressBarColumnRenderer},
						,new Ext.ux.ProgressColumn({
							header: '진행률',
							width: 120,
							dataIndex: 'progress',
							align: 'center',
							renderer: function(value, meta, record, rowIndex, colIndex, store, pct) {
								return Ext.util.Format.number(pct, "0%");
							}
						})
						,{header:'&nbsp;',dataIndex:'status', width:30, renderer:statusIconRenderer}
						,{header:'상 태',dataIndex:'status', width:60 , renderer:statusIconRendererName}
					]
				}]
			}]
		}).show();


		Ext.getCmp('content_id').setValue(content_id);

	}

	function sub_story_board_selection(el){
		var t = Ext.get(el);
		t.parent('#images-view').select('.thumb-wrap-disable').removeClass('sb-view-selected');
		t.parent('.template_container').select('.thumb-wrap-disable').addClass('sb-view-selected');
		var images_view_el = Ext.get('images-view').select('.sb-view-selected').elements;
		var images_view_el_length = images_view_el.length;
/*		var callbackFunction = function(evt){
				var host = window.location.host;
				var ori_ext = 'xml';
				var root_path = '<?=ATTACH_ROOT?>';
				var filename = images_view_el[i].getAttribute('xml_path');
				var path = 'application/'+ori_ext+':file:///' + root_path +filename +'.'+ ori_ext;
				var path = 'application/'+ori_ext+':'+title+'.'+ori_ext+': http://'+host+highres_web_root+'/'+ori_path;
				evt.dataTransfer.setData("DownloadURL",'path');
			}
*/

		var host = window.location.host;
		var ori_ext = 'xml';
		var root_path = '<?=ATTACH_ROOT?>';
		var filename = images_view_el[0].getAttribute('xml_path');
		//var path = 'application/'+ori_ext+':file:///' + root_path +filename;
		var path = root_path +'/'+filename;
		var edl_path = 'application/gmsdd:{"medias":["'+path+'"]}';

		for(i=0; i<images_view_el_length; i++) {
			var myEventHandler = function (evt) {
				//console.log(path);
				evt.dataTransfer.setData("DownloadURL",edl_path);
				//images_view_el[i].removeEventListener("dragstart",myEventHandler,false);
			}
			//var old_element = images_view_el[i];
			//var new_element = old_element.cloneNode(true);
			//old_element.parentNode.replaceChild(new_element, old_element);
			//images_view_el[i].removeEventListener("dragstart",myEventHandler,false);
			images_view_el[i].addEventListener("dragstart",myEventHandler,false);
		}
	}

	function delete_sub_story_board(story_board_id){
		//alert(story_board_id);
		Ext.MessageBox.confirm(_text ('MN00034'), _text ('MSG02115'), function(btn){
			if(btn === 'yes'){
				var action = 'delete_sub_story_board';
				Ext.Ajax.request({
					url: '/store/catalog/edit.php',
					params: {
						action: action,
						story_board_id: story_board_id,
						},
					callback: function(opt, success, response){
						var images_view = Ext.getCmp('images-view');
						images_view.store.reload();
					}
				});

			}
		});
	}

	function edit_sub_story_board(element){
		//alert(story_board_id);
		//alert(title);
		var sb_content = element.getAttribute('sb_content');
		var sb_title = element.getAttribute('sb_title');
		var sb_id = element.getAttribute('sb_id');
		new Ext.Window({
			layout: 'fit',
			height: 200,
			width: 600,
			modal: true,
			title: _text('MN02300'),
			buttonAlign: 'center',
			items: [{
				xtype: 'form',
				cls: 'change_background_panel',
				padding: 5,
				labelWidth: 50,
				border: false,
				items: [{
					xtype: 'textfield',
					anchor: '100%',
					fieldLabel: _text('MN00249'),//'제목'
					name: 'title',
					value: sb_title
				},{
					xtype: 'textarea',
					anchor: '100%',
					fieldLabel: _text('MN02311'),//'제목'
					name: 'content',
					value: sb_content
				},{
					xtype: 'textfield',
					anchor: '100%',
					hidden: true,
					fieldLabel: _text('MN02312'),//'제목'
					name: 'peoples'
					//value: peoples
				}]

			}],

			buttons: [{
				text: '<span style=\"position:relative;top:1px;\"><i class=\"fa fa-edit\" style=\"font-size:13px;\"></i></span>&nbsp;'+_text('MN00043'),
				scale: 'medium',
				handler: function(btn) {
					var win = btn.ownerCt.ownerCt;
					var form = win.get(0).getForm();
					if (form.getValues().title.trim() == '') {
						Ext.Msg.alert(_text('MN01039'), _text('MSG00090'));
						return;
					}
					var wait_msg = Ext.Msg.wait( _text('MSG02036'), _text('MN00066'));//('등록중입니다.', '요청');
					Ext.Ajax.request({
						url: '/store/catalog/edit.php',
						params: {
							action: 'edit_story_board_title',
							story_board_id: sb_id,
							title: form.getValues().title,
							content: form.getValues().content,
							//peoples: form.getValues().peoples,
						},
						callback: function(opts, success, response){
							wait_msg.hide();
							if (success) {
								try {
									var r = Ext.decode(response.responseText);
									if (r.success) {
										win.close();
										var images_view = Ext.getCmp('images-view');
										images_view.store.reload();
									} else {
										Ext.Msg.alert( _text('MN00003'), r.msg);//'확인'
									}
								} catch(e) {
									Ext.Msg.alert( _text('MN01039'), response.responseText);//'오류'
								}
							} else {
								Ext.Msg.alert( _text('MN01098'), response.statusText);//'서버 오류'
							}
						}
					});
				}
			},{
				text: '<span style=\"position:relative;top:1px;\"><i class=\"fa fa-close\" style=\"font-size:13px;\"></i></span>&nbsp;'+_text('MN00004'),
				scale: 'medium',
				handler: function(btn) {
					btn.ownerCt.ownerCt.close();
				}
			}]
		}).show();
	}

	function fn_contain_elements(list, value){
		for( var i = 0; i < list.length; ++i )
		{
			if(list[i] === value) return true;
		}

		return false;
	}

	function fn_action_icon_show_detail_popup(av_content_id){
		var content_id = av_content_id;

		self.load = new Ext.LoadMask(Ext.getBody(), {msg: _text('MSG00143')});
		self.load.show();
		var that = self;

		if ( !Ext.Ajax.isLoading(self.isOpen) )
		{
			self.isOpen = Ext.Ajax.request({
				url: '/javascript/ext.ux/Ariel.DetailWindow.php',
				params: {
					content_id: content_id
				},
				callback: function(self, success, response){
					if (success)
					{
						that.load.hide();
						try
						{
							var r = Ext.decode(response.responseText);

							if ( r !== undefined && !r.success)
							{
								Ext.Msg.show({
									title: '경고'
									,msg: r.msg
									,icon: Ext.Msg.WARNING
									,buttons: Ext.Msg.OK
								});
							}
						}
						catch (e)
						{
						}
					}
					else
					{
						Ext.Msg.alert(_text('MN00022'), response.statusText+'('+response.status+')');
					}
				}
			});
		} //endif
	}

	function fn_action_icon_show_workflow(av_content_id){

		var rs=[];
		rs.push(av_content_id);

		Ext.Ajax.request({
			url: '/javascript/ext.ux/viewWorkFlow.php',
			params: {
				records: Ext.encode(rs)
			},
			callback: function(options, success, response){
				if (success)
				{
					try
					{
						Ext.decode(response.responseText);
					}
					catch (e)
					{
						Ext.Msg.alert(e['name'], e['message']);
					}
				}
				else
				{
					Ext.Msg.alert(_text('MN00022'), response.statusText);
				}
			}
		});
	}
	function fn_action_icon_show_context_menu(av_content_id,event){

		var sm = Ext.getCmp('tab_warp').getActiveTab().get(0).getSelectionModel();
		var content_id_data = av_content_id
		var list_content_data = Ext.getCmp('tab_warp').getActiveTab().get(0).getStore();
		var list_content = list_content_data.data.items;

		if(sm.hasSelection()){
			var selection = sm.getSelections();
			var content_id_array = [];
			Ext.each(selection, function(r, i, a){
				content_id_array.push({
					content_id: r.get('content_id')
				});
			});

			var isExists = false;
			Ext.each(content_id_array, function(r, i, a){
				if(r.content_id == content_id_data){
					isExists = true;
				}
			});

			if(isExists == false){
				for(i = 0; i<list_content.length;i++){
					if(list_content[i].id == content_id_data){
						sm.selectRow(i);
						break;
					}
				}
			}

		}else{

			for(i = 0; i<list_content.length;i++){

				if(list_content[i].id == content_id_data){
					sm.selectRow(i);
					break;
				}
			}
		}

		var selected_content_data = sm.getSelected().data;
		var archived_checked = 0;
		var restore_checked = 0;
		var process_checked = 0;
		var xyEvent = [event.clientX+50, event.clientY-80];

		if(selected_content_data['archive_yn'] =='Y'){
			archived_checked = 1;
		} else if(selected_content_data['archive_yn'] =='N'){
			restore_checked = 1;
		} else if(selected_content_data['archive_yn'] =='P'){
			process_checked = 1;
		}

		var single_content = 0;
		var group_content = 0;
		Ext.each(selection, function(r, i, a){
			if(selected_content_data['is_group'] =='I'){
				single_content = 1;
			} else if(selected_content_data['is_group'] =='G'){
				group_content = 1;
			}
		});

		if( !Ext.isEmpty(Ariel.menu_context) ) {
			var restore_menu_item = Ext.getCmp('restore_menu_item');
			var archive_menu_item = Ext.getCmp('archive_menu_item');

			if(!Ext.isEmpty(Ext.getCmp('batch_edit_menu_item')) && Ext.getCmp('batch_edit_menu_item')!== 'undefined'){
				var batch_edit_metadata_group_image = Ext.getCmp('batch_edit_menu_item');
				
				if(single_content == 1 && group_content == 0){
					batch_edit_metadata_group_image.setVisible(false);
				}else if(single_content == 1 && group_content == 1){
					batch_edit_metadata_group_image.setVisible(false);
				}else if(single_content == 0 && group_content == 1){
					batch_edit_metadata_group_image.setVisible(true);
				}else if(single_content == 0 && group_content == 0){
					batch_edit_metadata_group_image.setVisible(false);
				}
			}
			if(!Ext.isEmpty(archive_menu_item) && !Ext.isEmpty(restore_menu_item)) {
				if(archived_checked == 1 && restore_checked == 0 && process_checked == 0){
					// restore
					archive_menu_item.setVisible(false);
					restore_menu_item.setVisible(true);
					Ariel.menu_context.showAt(xyEvent);
					return;
				}else if(archived_checked == 0 && restore_checked == 1 && process_checked == 0){
					// archive
					restore_menu_item.setVisible(false);
					archive_menu_item.setVisible(true);
					Ariel.menu_context.showAt(xyEvent);
					return;
				} else {
					restore_menu_item.setVisible(false);
					archive_menu_item.setVisible(false);
					Ariel.menu_context.showAt(xyEvent);
					return;
				}
			}else{
				Ariel.menu_context.showAt(xyEvent);
				return;
			}
		}
	}
	/*
	function fn_action_icon_show_image_preview(av_content_id){
		alert('fn_action_icon_show_image_preview:'+av_content_id);
		//aaaa
		var sm = Ext.getCmp('tab_warp').getActiveTab().get(0).getSelectionModel().getSelections();
		console.log(sm[0].data.qtip);

	}*/

	function fn_action_icon_show_loudness(av_content_id){
		show_loudness_log(av_content_id);
	}

	function fn_action_icon_do_archive(av_content_id){

		var send_win = new Ext.Window({
			title: _text('MN01057'),
			width: 300,
			height: 100,
			modal: true,
			layout: 'fit',
			resizable: false,
			items: [{
				xtype: 'form',
				id: 'req_archive_form',
				padding: 5,
				labelWidth: 100,
				labelAlign: 'right',
				labelSeparator: '',
				defaults: {
					xtype:'textfield',
					width:'90%'
				},
				items: [{
					xtype: 'combo',
					readOnly: false,
					anchor: '95%',
					triggerAction: 'all',
					fieldLabel: _text('MN01057'),
					allowBlank: false,
					name : 'archive_group',
					editable : false,
					forceSelection: true,
					displayField : 'name',
					valueField : 'code',
					hiddenName: 'archive_group',
					store : new Ext.data.JsonStore({
						url:'/store/get_archive_group.php',
						autoLoad: true,
						root: 'data',
						fields: [
							'code','name'
						]
					})
				}]
			}],
			buttonAlign: 'center',
			buttons: [{
				text: _text('MN00066'),
				handler: function(b,e){
					var form_valid = Ext.getCmp('req_archive_form').getForm().isValid();
					if(!form_valid) {
						Ext.Msg.alert(_text('MN00023'), _text('MSG01017'));
						return;
					}
					var values = b.ownerCt.ownerCt.get(0).getForm().getValues();

					var rs = [];
					rs.push({
						content_id: av_content_id,
						archive_group: values.archive_group
					});


					b.ownerCt.ownerCt.close();

					//requestAction('archive', '아카이브 하시겠습니까?', rs);MN00056 MSG01007
					requestAction('archive', _text('MN00056')+'. '+_text('MSG01007'), rs);
				}
			},{
				text: _text('MN00031'),
				handler: function(b,e){
					b.ownerCt.ownerCt.close();
				}
			}]
		}).show();
	}

	function fn_action_icon_do_restore(av_content_id,type){
		var sm = Ext.getCmp('tab_warp').getActiveTab().get(0).getSelectionModel();

		var rs = [];
		var _rs = sm.getSelections();
		Ext.each(_rs, function(r, i, a){
			rs.push(r.get('content_id'));
		});

		var sel = sm.getSelected();
		var content_id = sel.get('content_id');

		if(type == 'restore') {
			requestAction(type, _text('MN01021')+'. '+_text('MSG01007'), rs);
		} else {
			var self = Ext.getCmp('tab_warp').getActiveTab().get(0);
			self.load = new Ext.LoadMask(Ext.getBody(), {msg: '<?=_text('MSG00143')?>'});
			self.load.show();
			var that = self;

			if ( !Ext.Ajax.isLoading(self.isOpen) )
			{
				self.isOpen = Ext.Ajax.request({
					url: '/javascript/ext.ux/Ariel.DetailWindow.php',
					params: {
						content_id: content_id,
						record: Ext.encode(sel.json),
						page_mode: 'pfr'
					},
					callback: function(self, success, response){
						if (success)
						{
							that.load.hide();
							try
							{

								if (sel.get('status') == -1)
								{
									Ext.Msg.show({
										title: '경고'
										,msg: _text('MSG00216')
										,icon: Ext.Msg.WARNING
										,buttons: Ext.Msg.OK
										,fn: function(btnId, txt, opt){
											var r = Ext.decode(response.responseText);
										}
									});
								}
								else
								{
									var r = Ext.decode(response.responseText);
								}

								if ( r !== undefined && !r.success)
								{
									Ext.Msg.show({
										title: '경고'
										,msg: r.msg
										,icon: Ext.Msg.WARNING
										,buttons: Ext.Msg.OK
									});
								}
							}
							catch (e)
							{
							}
						}
						else
						{
							Ext.Msg.alert('<?=_text('MN00022')?>', response.statusText+'('+response.status+')');
						}
					}
				});
			}
		}
	}

	function fn_action_icon_do_delete_hr_content(av_content_id){

		var sm = Ext.getCmp('tab_warp').getActiveTab().get(0).getSelectionModel();
		var seletions = sm.getSelections();
		var isArchive;
		for (i = 0; i < seletions.length; i++) {
			if(seletions[i].data.archive_yn == 'N'){
				isArchive = false;
				break;
			}
		}

		if(isArchive == false){
			Ext.Msg.alert(_text('MN00144'), _text('MSG02120'));
			return;
		}

		var win = new Ext.Window({
				layout:'fit',
				title:'<?=_text('MN00128')?>',
				modal: true,
				width:500,
				height:150,
				buttonAlign: 'center',
				items:[{
					id:'delete_inform',
					xtype:'form',
					border: false,
					frame: true,
					padding: 5,
					labelWidth: 70,
					cls: 'change_background_panel',
					defaults: {
						anchor: '100%'
					},
					items: [{
						id:'delete_reason',
						xtype: 'textarea',
						height: 50,
						fieldLabel:'<?=_text('MN00128')?>',
						allowBlank: false,
						blankText: _text('MSG01062'),//'삭제 사유를 적어주세요',
						msgTarget: 'under'
					}]
				}],
				buttons:[{
						text : '<span style="position:relative;top:1px;"><i class="fa fa-trash" style="font-size:13px;"></i></span>&nbsp;'+_text('MN00034'),
						scale: 'medium',
						handler: function(btn,e){
							var isValid = Ext.getCmp('delete_reason').isValid();
							if (!isValid)
							{
								Ext.Msg.show({
									icon: Ext.Msg.INFO,
									title: '<?=_text('MN00024')?>',
									msg: _text('MSG01062'),//'삭제사유를 적어주세요.',
									buttons: Ext.Msg.OK
								});
								return;
							}


							var sm = Ext.getCmp('tab_warp').getActiveTab().get(0).getSelectionModel();
							var tm = Ext.getCmp('delete_reason').getValue();

							var rs = [];
							var _rs = sm.getSelections();
							Ext.each(_rs, function(r, i, a){
								rs.push({
									content_id: r.get('content_id'),
									delete_his: tm
								});
							});

							Ext.Msg.show({
								icon: Ext.Msg.QUESTION,
								title: '<?=_text('MN00024')?>',
								msg: '<?=_text('MSG00145')?>',

								buttons: Ext.Msg.OKCANCEL,
								fn: function(btnId, text, opts){
									if(btnId == 'cancel') return;

									var ownerCt = Ext.getCmp('tab_warp').getActiveTab().get(0);
									ownerCt.sendAction('delete_hr', rs, ownerCt);
									win.destroy();
								}
							});
						}
					},{
						text : '<span style="position:relative;top:1px;"><i class="fa fa-close" style="font-size:13px;"></i></span>&nbsp;'+_text('MN00004'),
						scale: 'medium',
						handler: function(btn,e){
							win.destroy();
						}
					}]
		});
		win.show();
	}

	function fn_action_icon_do_delete_content(av_content_id){
			var win = new Ext.Window({
				layout:'fit',
				title: _text('MN00128'),
				modal: true,
				width:500,
				height:150,
				buttonAlign: 'center',
				items:[{
					id:'delete_inform',
					xtype:'form',
					border: false,
					frame: true,
					padding: 5,
					labelWidth: 70,
					cls: 'change_background_panel',
					defaults: {
						anchor: '95%'
					},
					items: [{
						id:'delete_reason',
						xtype: 'textarea',
						height: 50,
						fieldLabel:_text('MN00128'),
						allowBlank: false,
						blankText: '<?=_text('MSG02015')?>',
						msgTarget: 'under'
					}]
				}],
				buttons:[{
					text : '<span style="position:relative;top:1px;"><i class="fa fa-trash" style="font-size:13px;"></i></span>&nbsp;'+_text('MN00034'),
					scale: 'medium',
					handler: function(btn,e){
						var isValid = Ext.getCmp('delete_reason').isValid();
						if ( ! isValid) {
							Ext.Msg.show({
								icon: Ext.Msg.INFO,
								title: _text('MN00024'),//확인
								msg: '<?=_text('MSG02015')?>',
								buttons: Ext.Msg.OK
							});
							return;
						}

						var sm = Ext.getCmp('tab_warp').getActiveTab().get(0).getSelectionModel();
						var tm = Ext.getCmp('delete_reason').getValue();

						var rs = [];
						var _rs = sm.getSelections();
						Ext.each(_rs, function(r, i, a){
							rs.push({
								content_id: r.get('content_id'),
								delete_his: tm
							});
						});

						Ext.Msg.show({
							icon: Ext.Msg.QUESTION,
							title: _text('MN00024'),
							msg: _text('MSG00145'),
							buttons: Ext.Msg.OKCANCEL,
							fn: function(btnId, text, opts){
								if(btnId == 'cancel') return;

								var ownerCt = Ext.getCmp('tab_warp').getActiveTab().get(0);
								ownerCt.sendAction('delete_request', rs, ownerCt);
								win.destroy();
							}
						});
					}
				},{
					text : '<span style="position:relative;top:1px;"><i class="fa fa-close style="font-size:13px;"></i></span>&nbsp;'+_text('MN00004'),
					scale: 'medium',
					handler: function(btn,e){
						win.destroy();
					}
				}]
		});
		win.show();
	}
	function fn_action_icon_do_fix_loudness(){
		Ext.Msg.show({
			title: _text('MN00024'),
			msg: _text('MSG02088'),
			modal: true,
			minWidth: 100,
			icon: Ext.MessageBox.QUESTION,
			buttons: Ext.Msg.OKCANCEL,
			fn: function(btnId) {
				if(btnId=='cancel') return;

				var sm = Ext.getCmp('tab_warp').getActiveTab().get(0).getSelectionModel();
				var sel = sm.getSelected();
				var content_id = sel.get('content_id');

				var w = Ext.Msg.wait(_text('MSG02086'));

				Ext.Ajax.request({
					url: '/store/nps_work/request_loudness.php',
					params: {
						content_id: content_id,
						action: 'adjust'
					},
					callback: function(opt, success, response) {
						w.hide();
						if (success) {
							var res = Ext.decode(response.responseText);
							if(res.success) {
								Ext.Msg.alert( _text('MN00023'), res.msg);
							} else {
								Ext.Msg.alert( _text('MN01039'), res.msg);
							}
						} else {
							Ext.Msg.alert(_text('MN01039'), response.statusText);
						}
					}
				});
			}
		});
	}
	function fn_action_icon_do_check_loudness(){
		Ext.Msg.show({
			title: _text('MN00024'),
			msg: _text('MSG02094'),
			modal: true,
			minWidth: 100,
			icon: Ext.MessageBox.QUESTION,
			buttons: Ext.Msg.YESNOCANCEL,
			fn: function(btnId) {
				if(btnId=='cancel') return;

				var sm = Ext.getCmp('tab_warp').getActiveTab().get(0).getSelectionModel();
				var sel = sm.getSelected();
				var content_id = sel.get('content_id');
				var is_correct = 'N';

				if(btnId == 'yes') {
					is_correct = 'Y';
				}

				var w = Ext.Msg.wait(_text('MSG02086'));

				Ext.Ajax.request({
					url: '/store/nps_work/request_loudness.php',
					params: {
						content_id: content_id,
						action: 'measure',
						is_correct: is_correct
					},
					callback: function(opt, success, response) {
						w.hide();
						if (success) {
							var res = Ext.decode(response.responseText);
							if(res.success) {
								Ext.Msg.alert( _text('MN00023'), res.msg);
							} else {
								Ext.Msg.alert( _text('MN01039'), res.msg);
							}
						} else {
							Ext.Msg.alert(_text('MN01039'), response.statusText);
						}
					}
				});
			}
		});
	}

	var  player_windown_flag = false;
	function fn_show_player_for_play_icon(av_content_id,event){
		event.stopPropagation();

		var sm = Ext.getCmp('tab_warp').getActiveTab().get(0).getSelectionModel();
		var content_id_data = av_content_id;
		var list_content_data = Ext.getCmp('tab_warp').getActiveTab().get(0).getStore();
		var list_content = list_content_data.data.items;

		if(sm.hasSelection()){
			var selection = sm.getSelections();
			var content_id_array = [];
			Ext.each(selection, function(r, i, a){
				content_id_array.push({
					content_id: r.get('content_id')
				});
			});

			var isExists = false;
			Ext.each(content_id_array, function(r, i, a){
				if(r.content_id == content_id_data){
					isExists = true;
				}
			});

			if(isExists == false){
				for(i = 0; i<list_content.length;i++){
					if(list_content[i].id == content_id_data){
						sm.selectRow(i);
						break;
					}
				}
			}

		}else{

			for(i = 0; i<list_content.length;i++){

				if(list_content[i].id == content_id_data){
					sm.selectRow(i);
					break;
				}
			}
		}


		player_windown_popup = Ext.getCmp('cuesheet_player_win');
		if(player_windown_flag){
			return;
		}else{
			player_windown_flag = true;
			Ext.Ajax.request({
				url:'/store/cuesheet/player_window.php',
				params:{
					content_id: av_content_id
				},
				callback:function(option,success,response) {
					var r = Ext.decode(response.responseText);

					if(success) {
						r.show();
						var player3 = videojs(document.getElementById('player3'), {}, function(){
						});
						/*
						$f("player3", {src: "/flash/flowplayer/flowplayer.swf", wmode: 'opaque'}, {
							clip: {
								autoPlay: true,
								autoBuffering: true,
								scaling: 'fit',
								provider: 'rtmp'
							},
							plugins: {
								rtmp: {
									url: '/flash/flowplayer/flowplayer.rtmp.swf',
									netConnectionUrl: Ariel.streamer_addr
								}
							}
						});
						*/
						player_windown_flag =false;
					} else {
						//Ext.Msg.alert('오류', '다시 시도 해 주시기 바랍니다.');
						Ext.Msg.alert( _text('MN01098'), _text('MSG02052'));
						player_windown_flag= false;
						return;
					}
				}
			});
		}
	}

  /*
    premiere 연동시 해당 스크립트를 가져온다.
  */
  if(Ext.isPremiere){
      var head = document.getElementsByTagName('head')[0];
      script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '/javascript/adobe_plugin/premiere_plugin.js';
      head.appendChild(script);
  }else if(Ext.isPhotoshop){
      var head = document.getElementsByTagName('head')[0];
      script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '/javascript/adobe_plugin/photoshop_plugin.js';
      head.appendChild(script);
  }

/*
	Category management Search page
*/
function fn_category_management_media(){
	var win = new Ext.Window({
			title: _text('MN02221'),
			id: 'manage_category_media',
			width: 500,
			modal: true,
			height: 250,
			miniwin: true,
			resizable: false,
			layout: 'fit',
			items: [{
                id: 'menu-tree-media-management',
                layout: 'fit',
				border : false,
                xtype: 'navcategory',
                //ddGroup: 'ContentDD',
                //title: '프로그램',
				//title: _text('MN00387'),
                rootVisible: false,
                listeners:{
                    render: function(self) {

                        // new Ext.tree.TreeSorter(self, {
                        //     property:
                        // });
                    },
                },
                reload_category_search: function(){
            		if( !Ext.isEmpty(Ext.getCmp('nav_tab')) ){

                        var tree, treeLoader, rootNode, activeTab;
                        tree = Ext.getCmp('menu-tree');
                        rootNode = tree.getRootNode();
                        treeLoader = tree.getLoader();
                        activeTab = Ext.getCmp('tab_warp').getActiveTab();
                        treeLoader.baseParams.ud_content_id = activeTab.ud_content_id;
                        rootNode.attributes.read = activeTab.c_read;
                        rootNode.attributes.add = activeTab.c_add;
                        rootNode.attributes.edit = activeTab.c_edit;
                        rootNode.attributes.del = activeTab.c_del;
                        rootNode.attributes.hidden =  activeTab.c_hidden;

                        if( !rootNode.attributes.read )
						{
							rootNode.disable(true);
						}
						else
						{
							rootNode.disable(false);
						}
						
                        if(treeLoader.isLoading()){
                            treeLoader.abort();
                        }
                        treeLoader.load(rootNode);
                    }
            	},
                loader: new Ext.tree.TreeLoader({
                    url: '/store/get_categories.php',
                    listeners: {
                        beforeload: function (treeLoader, node, callback){
                        	
                            if (!treeLoader.loaded && !treeLoader.baseParams.ud_content_id) {
                                treeLoader.baseParams.ud_content_id = Ext.getCmp('tab_warp').getActiveTab().ud_content_id;
                            }
                            treeLoader.baseParams.action = "get-folders";
                            treeLoader.baseParams.read = node.attributes.read;
							//2015-11-19 카테고리 보임
							//treeLoader.baseParams.read = 1;
                            treeLoader.baseParams.add = node.attributes.add;
                            treeLoader.baseParams.edit = node.attributes.edit;
                            treeLoader.baseParams.del = node.attributes.del;
                            treeLoader.baseParams.hidden = node.attributes.hidden;
							
						},

                        load: function (treeLoader, node, callback){
                        	
                            if (treeLoader.baseParams.ud_content_id) {
                                treeLoader.loaded = true;
                                delete treeLoader.baseParams.ud_content_id;
                            }

							if (!Ext.getCmp('menu-tree-media-management').getRootNode().isExpanded()){
								Ext.getCmp('menu-tree-media-management').getRootNode().expand();
							}

							if( !node.attributes.read ){
								node.disable(true);
							}
							
						}
                    }
                })
        	}],
        	listeners:{
        		close: function(self){
					Ext.getCmp('menu-tree-media-management').reload_category_search();
				}
        	},
			buttonAlign: 'center',
			fbar: [{
				text : '<span style="position:relative;top:1px;"><i class="fa fa-plus" style="font-size:13px;"></i></span>&nbsp;'+_text('MN00033'), //add
				scale: 'medium',
				handler: function(b, e){
					var categoryManagementObj = Ext.getCmp('menu-tree-media-management');
					var categoryManagementSelectNode = categoryManagementObj.getSelectionModel().getSelectedNode();
					if(categoryManagementSelectNode != null){
						categoryManagementObj.invokeCreateFolder(categoryManagementSelectNode);
					}else{
						Ext.Msg.alert(_text('MN00023'),_text('MSG00026'));
							return;
					}
					
				}
			},{
				text : '<span style="position:relative;top:1px;"><i class="fa fa-edit" style="font-size:13px;"></i></span>&nbsp;'+_text('MN00043'), //edit
				scale: 'medium',
				handler: function(b, e){
					var categoryManagementObj = Ext.getCmp('menu-tree-media-management');
					var categoryManagementSelectNode = categoryManagementObj.getSelectionModel().getSelectedNode();
					if(categoryManagementSelectNode != null){
						categoryManagementObj.editor.triggerEdit(categoryManagementSelectNode);
					}else{
						Ext.Msg.alert(_text('MN00023'),_text('MSG00026'));
							return;
					}
				}
			},{
				scale: 'medium',
				text : '<span style="position:relative;top:1px;"><i class="fa fa-trash" style="font-size:13px;"></i></span>&nbsp;'+_text('MN00034'), //delete
				handler: function(b, e){
					var categoryManagementObj = Ext.getCmp('menu-tree-media-management');
					var categoryManagementSelectNode = categoryManagementObj.getSelectionModel().getSelectedNode();
					if(categoryManagementSelectNode != null){
						if(categoryManagementSelectNode.getDepth()<2){
							Ext.Msg.alert(_text('MN00023'),_text('MSG02510'));
							return;
						}else{
							categoryManagementObj.deleteFolder(categoryManagementSelectNode);
						}
					}else{
						Ext.Msg.alert(_text('MN00023'),_text('MSG00026'));
						return;
					}
				}
			},{
				text : '<span style="position:relative;top:1px;"><i class="fa fa-close" style="font-size:13px;"></i></span>&nbsp;'+_text('MN00031'),
				scale: 'medium',
				handler: function(b, e){
					Ext.getCmp('menu-tree-media-management').reload_category_search();
					win.destroy();
				}
			}]
		});
		win.show();
}
	</script>
</body>
</html>
