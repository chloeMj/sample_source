<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<HTML>
<HEAD>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<% 
	String requestUrl = request.getRequestURL().toString();
	String[] requestUrlArr = requestUrl.split("//");
	String[] urlArr = requestUrlArr[1].split("/");

	String pre_url = "/zodiac/zodiac-workspace/zodiac-app";

	%>

	<link rel="stylesheet" href="/zodiac/zodiac-workspace/zodiac-app/resources/css/print_style.css" />
	<script src="/zodiac/zodiac-workspace/zodiac-app/print/js/jquery.js"></script>
	<script src="/zodiac/zodiac-workspace/zodiac-app/print/js/jqueryui.js"></script>
	<script src="/zodiac/zodiac-workspace/zodiac-app/print/js/functions.js" type="text/javascript"></script>
	<script src="/zodiac/zodiac-workspace/zodiac-app/print/js/print_utils.js"></script>
	<script src="/zodiac/zodiac-workspace/zodiac-app/ext/bootstrap.js"></script>
	<script src="/zodiac/zodiac-workspace/zodiac-app/resources/config.js"></script>
	<script src="/zodiac/zodiac-workspace/zodiac-app/app/lib/lang.js"></script>
	<style type="text/css">
		.module {
			width: 446px;
			float: left;
			margin-right: 5px;
			border: 1px solid #1B9DE9;
		}

		.rb_t {
			background: #FFF;
			border: 1px solid #DDDDDD;
			line-height: 27px;
			text-align:center;
			color: #A0A0A0;
		}
		.b_t {
			background: #FFF;
			border: 1px solid #DDDDDD;
			line-height: 27px;
			text-align:center;
			color: #A0A0A0;
		}
		.rb {
			background: #FFF;
			border: 1px solid #DDDDDD;
			line-height: 27px;
		}
		.rb_l {
			background: #FFF;
			border: 1px solid #DDDDDD;
			line-height: 27px;
			padding-left: 7px;
		}
		.b {
			background: #FFF;
			border: 1px solid #DDDDDD;
			line-height: 27px;
		}
	</style>

</HEAD>
<script type='text/javascript'>
	var v_url = String().concat(url_prefix, '/news');
	var v_timeout = 20000;
	var today = calc_date();
	var tomorrow = calc_date('nextDay', 1);
	var params = {
		token : Ext.decode(Ext.util.Cookies.get('session')).token,
		cmd : 'getSelectYsysMain',
		ch_div_cd : Ext.decode(Ext.util.Cookies.get('session')).ChannelDivisionCode,
		usr_id : Ext.decode(Ext.util.Cookies.get('session')).id,
		format : 'JSON2',
		os_type : 'WEB',
		lang : 'KOR',
		next : 'web/json2.jsp'
	};
	
	function fn_load(){
		$('.list_num').text(_text('COMMON_171'));
		$('.home_issu_keyword').text(_text('MENU_003_02_011'));
		$('.home_issu_content').text(_text('COMMON_027'));
		$('.home_notice_title').text(_text('COMMON_038'));
		$('.home_notice_writer').text(_text('COMMON_173'));
		$('.home_notice_date').text(_text('COMMON_172'));
		//이슈일자 셋팅
		$('#issue_today').html(_text('MSG_011')+" ("+today.substring(2)+")");
		$('#issue_tommorow').html(_text('MSG_009')+" ("+tomorrow.substring(2)+")");
		$('#home_issu').text(_text('MENU_003'));
		$('#home_notice').text(_text('COMMON_049'));
		//$("#issue_dtm_today").html();
		//$("#issue_dtm_tomorrow").html('('+tomorrow.substring(2)+')');
		
		//data 조회
		fn_getSelectYsysMain();
	}
	
	function show_list_info(av_datas, av_target){
		var v_arr = $.isArray(av_datas)?av_datas:$.makeArray(av_datas);
		fn_showList(v_arr, false, av_target);
	}
	
	function fn_showList(obj_array, filter, target) {
		var template = $('.'+target).first();
		if (template == null) return;
		var html = '<tbody class=newtr>'+$(template).html()+'</tbody>';
		
		filter = (typeof(filter) != 'undefined')?filter:false;
		
		if (typeof(obj_array.length) == 'undefined') {
			new_obj_array = new Array();
			new_obj_array.push(obj_array);
			obj_array = new_obj_array;
		}

		for (var i=0; i<obj_array.length; i++) {
			var newTr = $(template).parent().append(html).find('tbody.newtr').last();
			
			$(newTr).find("td[data-seq]").each(function(index){
				var seq = i+1;
				$(this).text(seq);
			});
			$(newTr).find("td[data-id]").each(function(index){
				var id = $(this).attr('data-id');
				var val = obj_array[i][id];
				if (typeof(val) != 'undefined') {
					if (filter !== false) {
						var func = filter[id];
						if (typeof(func) != 'undefined') {

							val = func(val);
						}
					}
					$(this).html(val);
				} else {
					$(this).html('&nbsp;');
				}
			});
		}
	}
	
	function fn_getSelectYsysMain(){
		$.ajax({
			type: 'POST',
			url: v_url,
			data : params,
			dataType: 'json',
			timeout: v_timeout,
			success: function(datas){
				var v_datas;
				
				if(datas.result.msg == 'ok'){
					//이슈(오늘/내일)
					if(!Ext.isEmpty(datas.data.records.issu)){
						fn_set_issue(datas.data.records.issu.record);
					}
					
					//공지
					if(!Ext.isEmpty(datas.data.records.cont_notice)){
						fn_set_notice(datas.data.records.cont_notice.record);
					}
				}
			},
			error:function(request,status,error){
				ajax_error(request,status,error);
			}
		});
	}
	
	function fn_set_issue(av_datas){
		var v_today_arr = new Array();
		var v_tomorrow_arr = new Array();
		
		for(var i=0; i<av_datas.length; i++){
			if(av_datas[i].category == 'TODAY'){
				v_today_arr.push(av_datas[i]);
			}else if(av_datas[i].category == 'TOMORROW'){
				v_tomorrow_arr.push(av_datas[i]);
			}
		}
		var v_target = 'list_issue_today';
		show_list_info(v_today_arr, v_target);
		
		v_target = 'list_issue_tomorrow';
		show_list_info(v_tomorrow_arr, v_target);
	}	
	function fn_set_plan(av_datas){
		$("#plan_data").html(av_datas.bbm_ctt);
	}
	
	function fn_set_notice(av_datas){
		var v_target = 'list_notice';

		var av_datas2 = $.isArray(av_datas)?av_datas:$.makeArray(av_datas);
		for(var i=0; i<av_datas2.length; i++){
			av_datas2[i].input_dtm = av_datas2[i].input_dtm.toString().substring(0, 8);
			
			var v_temp = '<a href="JavaScript:fn_showNoticePopup(' +av_datas2[i].bb_id+ ',' +av_datas2[i].bbm_id+ ')">' + av_datas2[i].bbm_titl + '</a>';
			
			av_datas2[i].bbm_titl = v_temp;
			//showNoticePopup
		}
		
		show_list_info(av_datas2, v_target);
	}
	
	function fn_showNoticePopup(av_bb_id, av_bbm_id){
		var	v_params = {
			token : Ext.decode(Ext.util.Cookies.get('session')).token,
			ch_div_cd : Ext.decode(Ext.util.Cookies.get('session')).ChannelDivisionCode,
			usr_id : Ext.decode(Ext.util.Cookies.get('session')).id,
			bb_id : av_bb_id,
			bbm_id : av_bbm_id
		};
		
		window.open(Gemiso.config.print.board.notice.href + '&' + Ext.Object.toQueryString(v_params), Gemiso.config.print.hrefTarget, Gemiso.config.print.windowOpenOption);
	}
</script>
<BODY onLoad="fn_load()">
	<div class="wrap">
		<div class="module_wrap">
			<!--이슈-->
			<div class="module">

				<div class="header">
					<div id="home_issu" style="background-image: url(/zodiac/zodiac-workspace/zodiac-app/app/view/home/images/tit_issue.gif); width: 446px; height: 30px; line-height: 31px; color: #fff; font-weight: bold; text-align: center;" alt="이슈" border="0">
					이슈
					</div>
					
				</div>

				<div class="content">

					<!--오늘 (15-02-16)-->
					<table class="tbl" cellspacing="0" cellpadding="0" width="100%" style="background: #DDDDDD;">
						<colgroup>
							<col width="49"></col><col width="124"></col><col width="*"></col>
						</colgroup>
						<tr>
							<td colspan="3" class="tit" style="text-align:center; line-height: 31px;" id="issue_today"></td>
						</tr>
						<tr>
							<td class="rb_t list_num">번호</td>
							<td class="rb_t home_issu_keyword">핵심어</td>
							<td class="b_t home_issu_content">내용</td>
						</tr>
					</table>
					<table class="tbl" cellspacing="0" cellpadding="0" width="100%" style="background: #DDDDDD;">
						<colgroup>
							<col width="49"></col><col width="124"></col><col width="*"></col>
						</colgroup>
						<tbody class="list_issue_today" style="display:none;">
							<tr >
								<td class='rb' data-seq="" style="text-align:center;"></td>
								<td class='rb_l' data-id="issu_kwd"></td>
								<td class='rb_l b' data-id="issu_ctt"></td>
							</tr>
						</tbody>
					</table>
					<!--//오늘 (15-02-16)-->

					<!--내일 (15-02-17)-->
					<table class="tbl" cellspacing="0" cellpadding="0" width="100%" style="background: #DDDDDD;">
						<colgroup>
							<col width="49"></col><col width="124"></col><col width="*"></col>
						</colgroup>
						<tr>
							<td colspan="3" class="tit" style="text-align:center; line-height: 31px;" id="issue_tommorow">내일 <span id="issue_dtm_tomorrow"></span></td>
						</tr>
						<tr>
							<td class="rb_t list_num">번호</td>
							<td class="rb_t home_issu_keyword">핵심어</td>
							<td class="b_t home_issu_content">내용</td>
						</tr>
					</table>
					<table class="tbl" cellspacing="0" cellpadding="0" width="100%" style="background: #DDDDDD;">
						<colgroup>
							<col width="49"></col><col width="124"></col><col width="*"></col>
						</colgroup>
						<tbody class="list_issue_tomorrow" style="display:none;">
							<tr>
								<td class='rb' data-seq="" style="text-align:center;"></td>
								<td class='rb_l' data-id="issu_kwd"></td>
								<td class='rb_l b' data-id="issu_ctt"></td>
							</tr>
						</tbody>
					</table>
					<!--//내일 (15-02-17)-->

				</div>
			</div>
			<!--//이슈-->

			<!--공지-->
			<div class="module">

				<div class="header">
					<div id="home_notice" style="background-image: url(/zodiac/zodiac-workspace/zodiac-app/app/view/home/images/tit_notice.gif); width: 446px; height: 30px; line-height: 31px; color: #fff; font-weight: bold; text-align: center;" alt="공지" border="0">
					공지
					</div>
				</div>

				<div class="content">

					<table class="tbl" cellspacing="0" cellpadding="0" width="100%" style="background: #DDDDDD;">
						<colgroup>
							<col width="49"></col><col width="*"></col><col width="64"></col><col width="76"></col>
						</colgroup>
						<tr>
							<td class="rb_t list_num">번호</td>
							<td class="rb_t home_notice_title">제목</td>
							<td class="rb_t home_notice_writer">작성자</td>
							<td class="b_t home_notice_date">날짜</td>
						</tr>
					</table>
					<table class="tbl" cellspacing="0" cellpadding="0" width="100%" style="background: #DDDDDD;">
						<colgroup>
							<col width="49"></col><col width="*"></col><col width="64"></col><col width="76"></col>
						</colgroup>
						<tbody class="list_notice" style="display:none;">
							<tr>
								<td class='rb' data-seq="" style="text-align:center;"></td>
								<td class='rb_l' data-id="bbm_titl"></td>
								<td class='rb' data-id="bbm_writer" style="text-align:center;"></td>
								<td class='b' data-id="input_dtm" style="text-align:center;"></td>
							</tr>
						</tbody>
					</table>

				</div>
			</div>
			<!--//편성-->

		</div>
	</div>
	<div class="bg_br"></div>
	<div class="bg_b"></div>
</BODY>
</HTML>
