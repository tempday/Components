function validPwd(obj){
		var reg=/^[\w]{6,}$/;
		if(obj.type=='password'){
			if(obj.id=='reconfirm'){
				if(obj.value===DM('#password')[0].value&&reg.test(obj.value)){
					DM('.userInfo').sub(DM.index(obj)+1).removeClass('display');
					return !0;
				}else{
					DM('.userInfo').sub(DM.index(obj)+1).addClass('display');
					return !1;
				}
			}else{
				if(!reg.test(obj.value)){
					DM('.userInfo').sub(DM.index(obj)+1).addClass('display');
					return !1;
				}else{
					DM('.userInfo').sub(DM.index(obj)+1).removeClass('display');
					return !0;
				}
			}
		}
	}