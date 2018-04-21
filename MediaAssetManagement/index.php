<?php
session_start();
require_once($_SERVER['DOCUMENT_ROOT'].'/lib/config.php');
//require_once($_SERVER['DOCUMENT_ROOT'].'/lib/lang.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/lib/functions.php');

$lang_default_info = getCodeInfo( 'lang_default');
$lang_default = empty($lang_default_info[0]['code']) ? 'en' : $lang_default_info[0]['code'];


if (empty($_SESSION['user'])) {
	$_SESSION['user'] = array(
		'user_id' => 'temp',
		'is_admin' => 'N',
		'lang' => $lang_default,
		'groups' => array(
			//ADMIN_GROUP,
			//CHANNEL_GROUP
		)
	);
}


//어디서 페이지를 호출했는지에 대한 구분 2013-01-31 이성용
$flag = $_REQUEST['flag'];
$user_id = $_REQUEST['user_id'];
$direct = $_REQUEST['direct'];
$mode_a = empty($_REQUEST['mode']) ? '' : '?mode=pgsql';
$mode = empty($_REQUEST['mode']) ? '' : 'pgsql';

// 추가 agent 부분  by 2016-08-22 by hkh 플러그인 연계
$agent =  $_REQUEST['agent'] ? strtolower($_REQUEST['agent']) :  '';


if($direct && !empty($_REQUEST['muser_id'])){
	$user_id = $_REQUEST['muser_id'];
}

if ($_SESSION['user']['user_id'] != 'temp' && $flag == '')
{
	//echo "<script type=\"text/javascript\">window.location=\"browse.php\"</script>";
	if($agent){
		echo "<script type=\"text/javascript\">window.location=\"main.php?agent=".$agent."\"</script>";
	}else {
		echo "<script type=\"text/javascript\">window.location=\"main.php".$mode_a."\"</script>";
	}

}

// if ( ! empty($flag) && ! empty($user_id)) {
// 	$info = AutoLogin($user_id, '', $flag , $direct);
// 	if ($info['success']) {
// 		$_SESSION['user'] = $info['session'];
// 		echo '<script type="text/javascript">window.location = "/plugin/regist_form/index.php?flag='.$flag.'"</script>';
// 		exit;
// 	}else{
// 		// nothing
// 	}
// }


function rtn_mobile_chk() {
    // 모바일 기종(배열 순서 중요, 대소문자 구분 안함)
    $ary_m = array("iPhone","iPod","IPad","Android","Blackberry","SymbianOS|SCH-M\d+","Opera Mini","Windows CE","Nokia","Sony","Samsung","LGTelecom","SKT","Mobile","Phone");
    for($i=0; $i<count($ary_m); $i++){
        if(preg_match("/$ary_m[$i]/i", strtolower($_SERVER['HTTP_USER_AGENT']))) {
            return $ary_m[$i];
            break;
        }
    }
    return "PC";
}


$chk_m = rtn_mobile_chk();
if($chk_m == "PC"){
} else {
    echo "<script type=\"text/javascript\">window.location=\"m\"</script>";
}

?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>

<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=9" />
<title><?=_text('MN00092')?>::<?=_text('MN00090')?></title>
<link rel="SHORTCUT ICON" href="/css/images/logo/Ariel.ico"/>
<script src="/javascript/lang.php" type="text/javascript"></script>
<link rel="stylesheet" type="text/css" href="/npsext/resources/css/ext-all.css" />
<script type="text/javascript" src="/npsext/adapter/ext/ext-base.js"></script>
<script type="text/javascript" src="/npsext/ext-all.js"></script>
<!--[if lt IE 9]>
  <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
  <![endif]-->

  <!--[if lt IE 9]>
  <script src="http://ie7-js.googlecode.com/svn/version/2.1(beta4)/IE9.js"></script>
  <![endif]-->
<link rel="stylesheet" type="text/css" href="/css/style.css" />
<script type="text/javascript" src="/javascript/script.js"></script>
<link rel="stylesheet" type="text/css" href="/css/font-awesome.min.css">

<style type="text/css">
#login-submit:hover { background-color:#28aeff;cursor: pointer;}
#login-submit {border: none;background-color: #15a4fa;width: 85px;height: 28px;color: white;font-weight: bold;}
.logo_image_login_form{
	background-image: url(css/images/logo/login_logo.png);
	margin: 0 auto;
	width: 335px;
	height: 150px;
	background-repeat: no-repeat;
	background-position: right 60px;
}
</style>

<script type="text/javascript">

	function checkLogin(){
		var id = Ext.get('login-id').getValue();
		var pw = Ext.get('login-pw').getValue();

		if(id!='admin'){

			//		Ext.Msg.alert( _text('MN00023'),'서비스 점검중입니다.<br />08:00~10:00 ' );
				//	return;
		}

		Ext.Ajax.request({
			url: '/store/login_ok.php',
			params: {
				userName: id,
				password: pw,
				flag: '<?=$flag?>',
				mode : '<?=$mode?>',
				agent: '<?=$agent?>'
			},
			callback: function(opts, success, response){
				if (success) {
					try {
						var r = Ext.decode(response.responseText);
						if (r.success) {
							if (r.passchk) {
								Ext.Msg.show({
									title: _text('MN00024'),//MN00024'확인',
									msg: _text('MSG00008'),//암호가 설정되어 있지 않습니다. 마이페이지로 이동합니다
									icon: Ext.Msg.INFO,
									buttons: Ext.Msg.OK,
									fn: function(btnId){
										window.location = 'pages/mypage/index.php';
									}
								});
							} else {
								// 에어브라우저에서 로그인시 바로 미디어 검색페이지로
								// if (Ext.isAir) {
								// window.location = '/browse.php?media=true';
								// } else {
									window.location = '/'+r.redirection;
								// }
							}
						} else {
							Ext.Msg.show({
								title: '확인',
								msg: r.msg,
								icon: Ext.Msg.INFO,
								buttons: Ext.Msg.OK,
								fn: function(btnId) {
									Ext.get('login-id').focus(250);
								}
							});
						}
					} catch (e) {
						Ext.Msg.alert(e.title, e.message);
					}
				} else {
					Ext.Msg.alert( _text('MN01098'), response.statusText);//'서버 오류'
				}
			}
		});

		return false;
	}

	function AutoLogin(){
		Ext.Ajax.request({
			url: '/store/login_ok.php',
		params: {
			userName: '<?=$user_id?>',
			direct: '<?=$direct?>',
			flag: '<?=$flag?>',
			agent: '<?=$agent?>'
		},
		callback: function(opts, success, response){
			if (success){
				try{
					var r = Ext.decode(response.responseText);
					if (r.success){
						window.location = '/'+r.redirection;
					}
					else{
						Ext.Msg.show({
							title: '확인',
							msg: r.msg,
							icon: Ext.Msg.INFO,
							buttons: Ext.Msg.OK,
							fn: function(btnId, text, opts){
								Ext.get('login-id').focus(250);
							}
						});
					}
				}catch (e){
					Ext.Msg.alert(e['title'], e['message']);
				}

			}else{
				//MN01098 '서버 오류'
				Ext.Msg.alert(_text('MN01098'), response.statusText);
			}
		}
		});
		return false;
	}

	Ext.onReady(function(){

		<?php
		if($direct){
			echo "AutoLogin();";
		}
		?>

		Ext.get('login-id').focus();
		Ext.get('login-id').on('keydown', function(e, t, o){
			if (e.getKey() == e.ENTER)
			{
				e.stopEvent();
				checkLogin(Ext.get('login-id').getValue(), Ext.get('login-pw').getValue());
			}
		});
		Ext.get('login-pw').on('keydown', function(e, t, o){
			if (e.getKey() == e.ENTER)
			{
				e.stopEvent();
				checkLogin(Ext.get('login-id').getValue(), Ext.get('login-pw').getValue());
			}
		});
		Ext.get('login-submit').on('click', function(e, t, o){
				checkLogin(Ext.get('login-id').getValue(), Ext.get('login-pw').getValue());
			});
	});
</script>

</head>
<body class="centerbox1">
<div id="login">
	<div class="loginbox" style="background:url(css/images/loginbg.png)">

		<div class="logo_image_login_form"></div>

		<ul>
        	<li>
        		<label style="font-size: 17px;color:white;"><i class="fa fa-user" aria-hidden="true"></i></label>
        		<input type="text" name="" id="login-id" class="id" placeholder="User ID" />
        	</li>
            <li>
            	<label style="font-size: 17px;color:white;padding-left: 15px;"><i class="fa fa-lock" aria-hidden="true"></i></label>
            	<input type="password" name="" id="login-pw" class="pass" placeholder="Password" />
            </li>
            <li style="padding-left:10px;padding-top: 4px;">
            	<button id="login-submit">
            		<span>Login</span>
            		<label style="font-size: 17px;color:white;">
            			<i class="fa fa-sign-in" aria-hidden="true"></i>
            		</label>
            	</button>
            </li>
            <li class="forgotid" style="display:none;"><a href="#">Forgot Username or Password?</a></li>
        </ul>
		<dl>
        	<dt><img src="css/images/login_geminisoft.png" width="90px"; height="25px" style="margin-top: 0px;"/></dt>
            <dd>Copyright © 2016 Geminisoft Co., Ltd. / All rights reserved.	<span><?=$agent?></span></dd>
        </dl>
    </div>
</div>
</body>
</html>
