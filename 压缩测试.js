Docms.cookie=function(name,val,exp){
		name=name||"";
		exp=exp||"";
		exp=exp.match(/([yMdhms]{1})(\d+)/);
		if(exp){
			switch(exp[1]){
				case "y":exp=new Date().setFullYear(new Date().getFullYear()+exp[2]*1);break;
				case "M":exp=new Date().setMonth(new Date().getMonth()+exp[2]*1);break;
				case "d":exp=new Date().setDate(new Date().getDate()+exp[2]*1);break;
				case "h":exp=new Date().setHours(new Date().getHours()+exp[2]*1);break;
				case "m":exp=new Date().setMinutes(new Date().getMinutes()+exp[2]*1);break;
				case "s":exp=new Date().setSeconds(new Date().getSeconds()+exp[2]*1);break;
			}
		}
		console.log(new Date(exp));
	}