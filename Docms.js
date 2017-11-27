/*Created by lglong519*/

//document manipulation set
;~function(w,d){
	function Docms(selector,origin){
		return new Docms.fun.init(selector,origin);
	}
	Docms.fun={
		name:"document manipulation set",
		init:function(selector,origin){
			this.elems=[];//储存当前元素
			this.count=0;//当前元素的数量
			this.tempElems=[];//临时数组
			this.isChaining=false;//是否正在链式操作
			this.parent=null;//elems 第一个元素的父元素
			this.children=null;//elems 第一个元素的子元素
			this.source=[];//Docms()对象首次获取的元素
			this.elemStack=[];
			this.getElems(selector,origin);//实例化时立即进行第一次元素获取
		},
		//兼容ie7+,选择器selector的格式:"#id div ul>li a.link>.span",暂时不支持派生、伪类和条件选择器。
			//origin:[可选]值类型可以是3种,1.DM对象,2.dom对象,3.选择器字符串;
			//最后获得的元素放入数组elems中
		//?多个选择器用逗号分隔("#id,.class")
		getElems:function(selector,origin){
			this.elems=[];
			//父元素暂时只支持单对象
			typeof(origin)=="string"&&(origin=this.getElems(origin).elems[0]);
			this.elems=[];
			if(!origin || origin.nodeType!==1){
				//传入的父对象非dom元素提示错误
				origin && origin.nodeType!==1&& origin.nodeType!==9&&console.error('Docms tips:getElems() invalid origin');
				origin=d;
			}
			//判断selector的4个条件:1.未定义或是空字符;2.是对象且长度大于零;3.是对象且节点类型为1;4.字符串
			if(selector==undefined||selector==""){
				//console.info("Docms tips:getElems() selector is undefined");
				return this;
			}
			//对象类型
			if(typeof(selector)==="object"){
				//Docms 子类
				if(selector instanceof Docms.fun.init){
					this.elems=selector.elems;
				//dom元素节点或者文档节点
				}else if(selector.nodeType===1||selector.nodeType===9||selector===w){
					this.elems[0]=selector;
				//数组或类数组
				}else if(selector.length>0){
					this.elems=selector;
				}
			//字符串类型:css选择器
			}else{
				if(typeof(selector)!="string"){
					//console.warn("Docms tips:getElems() selector is not a String");
					return this;
				}
				//createDocumentFragment()
				if(/^\s*<.*?>\s*$/.test(selector)){
					var _tempTag=d.createElement('div');
					_tempTag.innerHTML=selector;
					this.elems=_tempTag.children;
				}else{
					selector=selector.trim().replace(/\s{2,}/g," ").match(/[^,]+/g);
					for(var i=0;i<selector.length;i++){
						this.elems=this.elems.concat(Docms.query(selector[i].trim(),origin));
					}
				}
				
			}
			this.resetElems();
			return this;
		},
		//内部api:重置元素列表
		resetElems:function(doms){
			doms&&(this.elems=doms);
			//清除getByAttr后多余的this[n]
			if(this.count>this.elems.length){
				for(var i=0;i<this.count-this.elems.length;i++){
					delete this[this.count-1-i]
				}
			}
			for(var i=0,_temp=[];i<this.elems.length;i++){
				if(this.elems[i]){
					_temp.push(this.elems[i]);
					this[i]=this.elems[i]
				}
			};
			this.elems=_temp;
			this.count=this.elems.length;
			//两个默认属性
			if(this.elems[0]&&this.elems[0]!==w){
				this.parent=this.elems[0].parentNode;
				this.children=Docms.arrConvert(this.elems[0].children);
			}else{
				this.children=this.parent=null;
			}
		},
		//兼容ie7+,按属性获取后代元素,1.attrType:属性类型;2.attr:属性值[可选],如果元素类型不为空则此参数必须设置可以为"";3.tagName:查找标签类型[可选],如果缺省则查找全部类型
		getByAttr:function(attrType,attr,tagName){
			this.isChaining?this.tempElems=this.elems:this.tempElems=this.source=this.elems;
			this.isChaining=true;
			//父元素时当前元素[0],如果当前元素是空则父元素是document
			attr=attr||"";
			var parentArg=this.elems[0]||d,
				doms=[],
				reg=Docms.regOfIndStr(attr),
				value,
				typeLis=[],
				attrLis=[];
			tagName=tagName||"*";
			doms=Docms.fun.getElems(tagName,parentArg).elems;
			for(var i=0;i<doms.length;i++){
				//ie7下用api获取class写法getAttribute("className")
				value=attrType=="class"?doms[i].className:doms[i].getAttribute(attrType);
				if(value){//判断属性是否有效,将带属性的元素放入数组
					value=value.replace(/^\s*|\s*$/g,"");
					value&&(typeLis.push(doms[i]));
					if(attrType=="class"){
						attr&&reg.test(value)&&(attrLis.push(doms[i]));
					}else {
						value==attr&&(attrLis.push(doms[i]));
					}
				}
			}
			attr?this.resetElems(attrLis):this.resetElems(typeLis);
			return this;
		},
		//添加class,自动遍历查寻结果中所有元素
		addClass:function(cls){
			if(this.elems.length){
				for(var i=0;i<this.elems.length;i++){
					this.elems[i].className=this.elems[i].className==""?cls:this.elems[i].className+" "+cls;
				}
			}
			return this;
		},
		//移除class,自动遍历查寻结果中所有元素
		removeClass:function(cls){
			var reg=Docms.regOfIndStr(cls,"g");
			if(this.elems.length){
				for(var i=0;i<this.elems.length;i++){
					this.elems[i].className=this.elems[i].className.replace(reg,"").replace(/^\s*|\s*$/g,"");
				}
			}
			return this;
		},
		//为元素添加事件
		addEvent:function(type,fn,bool){
			bool=bool||false;
			if(this.elems.length){
				for(var i=0;i<this.elems.length;i++){
					if (this.elems[i].addEventListener) {
						this.elems[i].addEventListener(type,fn,bool);
						//兼容ie9,修正this的指向
					}else if (this.elems[i].attachEvent){
						this.elems[i].fn=fn;
						this.elems[i].attachEvent('on'+type,this.elems[i].fn);
						this.elems[i].removeAttribute('fn');
					}
				}
			}
		},
		//移除元素事件
		removeEvent:function(type,fnName,bool){
			bool=bool||false;
			if(this.elems.length){
				for(var i=0;i<this.elems.length;i++){
					if (this.elems[i].removeEventListener) {
						this.elems[i].removetListener(type,fnName,bool);
						//兼容ie
					}else if (this.elems[i].detachEvent){
						this.elems[i].detachEvent('on'+type,fnName,bool);
					}
				}
			}
		},
		//为元素绑定事件
		on:function(type,fn){
			if(this.elems.length){
				for(var i=0;i<this.elems.length;i++){
					this.elems[i]['on'+type]=fn;
				}
			}
		},
		//fetch,查找父元素或子元素时都会将旧结果放入栈底,将当前结果置顶
		
		//按下标选择查询结果中的元素
		fetch:function(n){
			if(n==undefined||n>=this.elems.length){
				throw new RangeError("Docms tips:fetch() n is out of index.");
			}
			//判断当前是否已链式操作,如果是就要从临时文件夹获取元素进行操作,否则先将原结果储存起来,再从源文件夹获取元素进行操作
			this.isChaining?this.tempElems=this.elems:this.tempElems=this.source=this.elems;
			//避免数组关联操作先重置elems,如果不需要修改原数组elem则elem不需要重置
			this.elems=[];
			this.elems[0]=this.isChaining?this.tempElems[n]:this.source[n];
			this.isChaining=true;
			this.resetElems();
			return this;
		},
		//查找父元素
		sup:function(n){
			if(!this.elems.length){return this;}
			this.isChaining?this.tempElems=this.elems:this.tempElems=this.source=this.elems;
			this.elems=[];
			this.elems[0]=this.isChaining?this.tempElems[0]:this.source[0];
			this.isChaining=true;
			//父元素根据n的数值进行n+1次获取
			n=n||0;
			do{
				this.elems[0]=this.elems[0].parentNode;
			}while(n--);
			this.resetElems();
			return this;
		},
		//查找子元素,筛选的条件exp[可选]:id|class|标签; 例如('div')('#id')('div#id')('.class')('div.class')
		sub:function(exp){
			if(!this.elems.length){return this;}
			this.isChaining?this.tempElems=this.elems:this.tempElems=this.source=this.elems;
			if(typeof(exp)=="string"&&exp){
				this.elems=Docms.elemsFilter(this.elems[0].children,exp);
			}else if(typeof(exp)=="number"){
				this.elems=[];
				this.elems[0]=this.tempElems[0].children[exp];
			}else{
				this.elems=this.elems[0].children;
			}
			this.isChaining=true;
			this.resetElems();
			return this;
		},
		//查找所有后代元素,筛选的条件exp[可选],如果bool为true,将包含当前元素
		all:function(exp,bool){
			if(!this.elems.length){return this;}
			//参数不定,要先判断参数
			if(arguments.length){
				for(var i=0,a='',b=false;i<arguments.length;i++){
					typeof(arguments[i])==='string'&&(a=arguments[i]);
					typeof(arguments[i])==='boolean'&&(b=arguments[i]);
				}
			}
			exp=a,bool=b;
			this.isChaining?this.tempElems=this.elems:this.tempElems=this.source=this.elems;
			this.isChaining=true;
			var validElems=[];
			for(var i=0,_temps;i<this.elems.length;i++){
				_temps=[];
				//先获取所有的后代元素
				_temps=this.elems[i].getElementsByTagName('*');
				//再根据筛选条件对结果再次进行筛选
				exp&&(_temps=Docms.elemsFilter(_temps,exp));
				exp||(_temps=Docms.arrConvert(_temps));
				validElems=validElems.concat(_temps);
			}
			//是否包含当前元素
			if(bool){
				//this.elems.unshift(this.tempElems[0]);
				validElems=this.elems.concat(validElems);
			}
			this.elems=validElems;
			this.resetElems();
			return this;
		},
		//将结果集设置成初始状态
		me:function(){
			if(this.isChaining){
				this.isChaining=false;
				this.tempElems=[];
				this.elems=this.source;
				this.resetElems();
			}
			return this;
		},
		//在结果中查找带指定属性的元素
		hasAttr:function(attrType,attr){
			if(!this.elems.length){return this;}
			this.isChaining=true;
			this.tempElems=this.elems;
			//父元素是当前元素[0],如果当前元素是空则父元素是document
			attr=attr||"";
			var reg=Docms.regOfIndStr(attr),
				value,
				typeLis=[],
				attrLis=[];
			for(var i=0;i<this.elems.length;i++){
				//ie7下用api获取class写法getAttribute("className")
				value=attrType=="class"?this.elems[i].className:this.elems[i].getAttribute(attrType);
				if(value){//判断属性是否有效,将带属性的元素放入数组
					value=value.replace(/^\s*|\s*$/g,"");
					value&&(typeLis.push(this.elems[i]));
					if(attrType=="class"){
						attr&&reg.test(value)&&(attrLis.push(this.elems[i]));
					}else {
						value==attr&&(attrLis.push(this.elems[i]));
					}
				}
			}
			this.elems=[];
			attr?this.resetElems(attrLis):this.resetElems(typeLis);
			return this;
		},
		//遍历当前全部元素,fn有两个默认参数,第一个是每个元素对应的下标i,第二个是i对应的dom类型元素
		each:function(fn){
			//遍历所有元素,将下标i和i对应的元素当作参数传入fn并将this指向当前遍历到的元素
			for(var i=0;i<this.elems.length;i++){
				this.elems[i].fn=fn;
				this.elems[i].fn(i,this.elems[i]);
				this.elems[i].removeAttribute('fn');
			}
			return this;
		},
		//将当前所有元素设置为dom元素的子对象
		appendTo:function(dom){
			dom instanceof Docms.fun.init&&(dom=dom[0]);
			for(var i=0;i<this.elems.length;dom.appendChild(this.elems[i++]));
		},
		append:function(dom){
			dom instanceof Docms.fun.init&&(dom=dom.elems);
			if(dom.nodeType==1){
				this[0].appendChild(dom);
			}else{
				for(var i=0;i<dom.length;this[0].appendChild(dom[i++]));
			}
		},
		insert:function(dom){
			
		},
		//获取/设置样式,type:null/object/string,val:cssValue
		css:function(type,val){
			var reg=/height|width|margin|padding|font|left|right|top|bottom/;
			for(var n=0;n<this.elems.length;n++){
					
				if(typeof(type)=='object'){
					for(var i in type){
						if(reg.test(i)&&typeof(type[i])=='number'&&type[i]!=0){
							type[i]+='px';
						}
						//兼容ie78
						if(i=='opacity'){
							this.elems[n].style.filter='alpha(opacity='+type[i]*100+')';
						}
						this.elems[n].style[i]=type[i];
						
					}
					return this;
				}else{
					if(val){
						if(typeof(type)=='string'){
							if(type=='opacity'){
								this.elems[n].style.filter='alpha(opacity='+val*100+')';
							}
							this.elems[n].style[type]=val;
							return this;
						}else if(reg.test(type)&&typeof(val)=='number'&&val!=0){
							this.elems[n].style[type]=val+'px';
							return this;
						}
					}else{
						if(window.getComputedStyle){
							return type?window.getComputedStyle(this.elems[n] , null)[type]:
								window.getComputedStyle(this.elems[n] , null);
						}else{
							return type?this.elems[n].currentStyle[type]:this.elems[n].currentStyle;
						}
					}
				}
			}
		},
		//操作链断开,返回属性
		//返回元素的实际高度,即使设置了box-sizing
		height:function(n){
			n=n||0;
			return this.elems[n].offsetHeight;
		},
		width:function(n){
			n=n||0;
			return this.elems[n].offsetWidth;
		},
		//元素内容
		html:function(m){
			if(!this.elems[0]){
				console.warn('Docms.tips:val() 对象不存在');
				return !1;
			}
			if(typeof(m)!=="undefined"){
				//兼容ie789,解决表格元素innerHTML不可写的问题
				var tbReg=/table|thead|tbody|tfoot|tr|th|td/i;
				if(/msie\s*[789]\.0/i.test(navigator.userAgent)&&tbReg.test(this.elems[0].nodeName)){
					//字符串方式创建表格元素会按照表格完整结构生成,例如:要创建的只有一个td元素"<table><td></td></table>",实际就会生成这样:"<table><tbody><tr><td></td></tr></tbody></table>"
					var div=d.createElement(div),child,
						n=this.elems[0].childNodes.length;
					for(var i=n-1;i>=0;i--){
						this.elems[0].removeChild(this.elems[0].childNodes[i]);
					}
					div.innerHTML='<table>'+m+'</table>';
					//如果m是thead|tbody|tfoot
					if(/^\s*<\s*(thead|tbody|tfoot)/i.test(m)){
						child=div.children[0];
						addChild(this.elems[0],child.children);
					//如果m是tr
					}else if(/^\s*<\s*tr/i.test(m)){
						child=div.children[0].children[0];
						addChild(this.elems[0],child.children);
					//如果m是th|td
					}else if(/^\s*<\s*(th|td)/i.test(m)){
						child=div.children[0].children[0].children[0];
						addChild(this.elems[0],child.children);
					}else{
						//如果m是非表格元素或字符串
						child=div.children[0];
						n=child.childNodes.length;
						for(var i=n-1;i>=0;i--){
							if(!tbReg.test(child.childNodes[i].nodeName)){
								/*
								if(child.childNodes[i].nodeType==3){
									child.childNodes[i].nodeValue.replace(/^\s*|\s*$/g,"")!=""&&(this.elems[0].appendChild(child.childNodes[i]));
								}else{
									this.elems[0].appendChild(child.childNodes[i]);
								}
								*/
								this.elems[0].appendChild(child.childNodes[i]);
							}
						}
					}
					function addChild(p,c){
						var n=c.length;
						for(var i=n-1;i>=0;i--){
							p.appendChild(c[i]);
						}
					}
				}else{
					this.elems[0].innerHTML=m;
				}
				return this;
			}else{
				return this.elems[0].innerHTML;
			}
		},
		//元素value
		val:function(m){
			if(!this.elems[0]){
				console.warn('Docms.tips:val() 对象不存在');
				return !1;
			}
			if(typeof(m)!=="undefined"){
				this.elems[0].value=m;
				return this;
			}else{
				return this.elems[0].value;
			}
		},
		isElems:function(){
		}
	};//end Docms------------------------------
	//按选择器选择元素 格式"#id div ul>li a.link>.span"
	//实现过程:1.拆分选择器,2.格式化选择器,3.筛选元素,4.遍历选择器1,重复2+3
	Docms.query=function(selector,par){
		par=par||d;
		var elems,
			selArr=selector.match(/\s+|>|[^\s>]+/g),
			isLink=false,
			pars=[par];
		if(selArr.length){
			for(var i=0,arr;i<selArr.length;i++){
				elems=[];
				if(selArr[i].trim()){
					if(selArr[i]=='>'){
						isLink=true;
						continue;
					}
					//如果两个标签间有>,获取每个元素的子元素
					if(isLink){
						for(var n=0;n<pars.length;n++){
							arr=pars[n].children;
							if(arr.length){
								elems=elems.concat(Docms.arrConvert(arr));
							}
						}
						//根据选择器筛选全部子元素
						//console.log(i+":"+elems);
						pars=Docms.elemsFilter(elems,selArr[i]);
					}else{
						//如果两个标签间是空格,获取每个元素所有后代元素
						for(var n=0;n<pars.length;n++){
						//使用单个子选择器获取元素
							arr=Docms.getOne(selArr[i],pars[n]);
							arr.length&&(elems=elems.concat(arr));
						}
						pars=elems;
					}
					
					
				}else{
					isLink=false;
				}
			}
			if(pars.length&&pars[0]!=par){
				//元素数组去重
				elems=[pars[0]];
				for(var i=1,bool;i<pars.length;i++){
					bool=!0;
					for(var j=0;j<elems.length;j++){
						if(pars[i]==elems[j]){
							bool=!1;
							break;
						}
					}
					bool&&(elems.push(pars[i]));
				}
				return elems;
			}else{
				return [];
			}
		}
	}
	//单选择器获取元素
	Docms.getOne=function(exp,par){
		par=par||d;
		//如果传入的元素数组和筛选条件不为空
		if(typeof(exp)=="string"&&exp){
			//按类型格式化筛选条件
			var result=Docms.formatSelector(exp), _temp=[];
			//如果筛选条件是id,只需查询一次
			if(result.type=='id'){
				_temp.push(par.getElementById(result.n));
				return _temp;
			}
			//如果是单标签
			if(result.type=='tag'){
				_temp=par.getElementsByTagName(result.t);
				if(_temp.length){
					return Docms.arrConvert(_temp);
				}
			}
			//如果是类选择器,则生成对应的查询正则表达式
			if(result.type=='class'){
				var reg=Docms.regOfIndStr(result.n);
				//如果按class获取有效
				if(par.getElementsByClassName){
					var tags=par.getElementsByClassName(result.n);
					if(tags.length){
						if(result.t){
							for(var i=0;i<tags.length;i++){
								tags[i].nodeName==result.t&&(_temp.push(tags[i]));
							}
						}else{
							_temp=Docms.arrConvert(tags);
						}
					}
				}else{
					var tags=par.getElementsByTagName("*");
					for(var i=0;i<tags.length;i++){
						
						if(result.t){
							reg.test(tags[i].className)&&tags[i].nodeName==result.t&&(_temp.push(tags[i]));
						}else{
							reg.test(tags[i].className)&&(_temp.push(tags[i]));
						}
					}
				}
			}
			return _temp;
		}else{
			console.info("Docms tips:getOne() 参数格式不对");
			return [];
		}
	}
	//兼容ie7/8,firefox:获取事件或事件目标,ev=0:返回事件[默认可不填],ev=1:返回目标
	Docms.getEventSrc=function(ev){
		ev=ev==1?ev:0;
		var e=w.event||arguments.callee.caller.arguments[0],
			src= e.srcElement|| e.target;
		return ev?src:e;
	}
	//兼容ie7/8,判断是否数组类型
	Docms.isArray=function(arr){
		return Array.isArray ? Array.isArray(arr) : "[object Array]" === Object.prototype.toString.call(arr);
	}
	//完整且独立的字符串的正则表达式,无后瞻所以匹配到的字符左侧可能会带空格
	Docms.regOfIndStr=function(arg,attr){
		attr=attr||"";
		attr=attr.replace(/\s/g,"").toLowerCase();
		if(/[^gims]/i.test(attr)){
			//抛出异常并退出
			throw new TypeError("Docms tips:regOfIndStr() Invalid RegExp ["+attr+"]");
		}
		return new RegExp("^"+arg+"$|^"+arg+"(?=\\s)|(?:\\s)"+arg+"(?=\\s+)|(?:\\s)"+arg+"$",attr);
	}
	/*
	//暂时不使用
	Docms.query=function(selector,parentArg,bool){
		//是否进行多选,默认true;
		bool=bool||true;
		if(!parentArg || parentArg.nodeType!==1){
			//传入的父对象是非dom元素提示错误
			parentArg && parentArg.nodeType!==1&& parentArg.nodeType!==9&&console.error('getElems() error: invalid parentArg');
			parentArg=d;
		}
		return bool?parentArg.querySelectorAll(selector):parentArg.querySelector(selector);
	}
	*/
	//获取curr元素在兄弟元素中所在的下标
	Docms.index=function(curr){
		curr instanceof Docms.fun.init&&(curr=curr[0]);
		var childs=curr.parentNode.children;
		for(var i=0;i<childs.length;i++){
			if(curr==childs[i]){
				return i;
			}
		}
		return -1;
	}
	Docms.getCss=function(elem,css){
		if(window.getComputedStyle){
			return css?window.getComputedStyle(elem , null)[css]:
				window.getComputedStyle(elem , null);
		}else{
			return css?elem.currentStyle[css]:elem.currentStyle;
		}
	}
	//获取文档顶部与窗口顶部的距离,参数如果不为零则设置文档的y轴偏移量为axisY
	Docms.wTop=function(axisY){
		if(axisY){
			window.scrollTo(Docms.wLeft(),axisY);
			return Docms.wTop();
		}
		var y=[];
		if (document.documentElement) {
			//ie789 不支持
			y[y.length] = document.documentElement.scrollTop || 0;
		}
		if (document.body) {
			//基本不支持,除了u和Safari
			y[y.length] = document.body.scrollTop || 0;
		}
		//ie 不支持
		y[y.length] = window.scrollY || 0;
		return Math.max.apply(this,y);
	}
	//获取文档左侧与窗口左侧的距离,参数如果不为零则设置文档的x轴偏移量为axisX
	Docms.wLeft=function(axisX){
		if(axisX){
			window.scrollTo(axisX,Docms.wTop());
			return Docms.wLeft();
		}
		var y=[];
		if (document.documentElement) {
			y[y.length] = document.documentElement.scrollLeft || 0;
		}
		if (document.body) {
			y[y.length] = document.body.scrollLeft || 0;
		}
		y[y.length] = window.scrollX || 0;
		return Math.max.apply(this,y);
	}
	//文档可视区的高度,不包括滚动条
	Docms.wHeight=function(){
		return document.documentElement.clientHeight;
	}
	//文档可视区的宽度,不包括滚动条
	Docms.wWidth=function(){
		return document.documentElement.clientWidth
	}
	//格式化选择器参数,返回一个对象
	Docms.formatSelector=function(exp){
		if(typeof(exp)!='string'){
			throw new TypeError("Docms tips:formatSelector()"+exp);
		}
		//参数:type:结果类型,t:标签名,m:符号类型#|.,n:id|class的值
		//type类型:0:标签,1:id,2.class,3.带标签的class
		/#/.test(exp)&&(exp=exp.slice(exp.indexOf('#')));
		var results={sn:null,type:null,t:null,m:null,n:null},
			regTest=exp.match(/#|\.|[^#\.*]+|\*/g);
		if(regTest.length==1){
			results.sn=0;
			results.type='tag';
			results.t=exp.toUpperCase();
		}else if(regTest.length==2){
			if(regTest[0]=='#'){
				results.sn=1;
				results.type='id';
			}else if(regTest[0]=='.'){
				results.sn=2;
				results.type='class';
			}
			results.m=regTest[0];
			results.n=regTest[1];
		}else if(regTest.length==3){
			results.sn=3;
			results.type='class';
			results.t=regTest[0].toUpperCase();
			results.m=regTest[1];
			results.n=regTest[2];
		}
		return results;
	}
	//根据选择器过滤元素
	Docms.elemsFilter=function(elemsArr,exp){
		elemsArr instanceof Docms.fun.init&&(elemsArr=elemsArr.elems);
		//如果传入的元素数组和筛选条件不为空
		if(elemsArr.length&&typeof(exp)=="string"&&exp){
			//按类型格式化筛选条件
			var result=Docms.formatSelector(exp), _temp=[];
			//如果筛选条件是id,只需查询一次
			if(result.type=='id'){
				_temp.push(d.getElementById(result.n));
				return _temp;
			}
			//如果是类选择器,则生成对应的查询正则表达式
			result.type=='class'&&(reg=Docms.regOfIndStr(result.n));
			//遍历元素数组
			for(var i=0;i<elemsArr.length;i++){
				//如果筛选条件是class,先判断class是否存在
				if(result.type=='class'&&reg.test(elemsArr[i].className)){
					//如果有标签则再判断标签名是否相等
					result.t?
						elemsArr[i].nodeName==result.t&&_temp.push(elemsArr[i]):
						_temp.push(elemsArr[i]);
				}else if(result.type=='tag'&&elemsArr[i].nodeName==result.t){
					_temp.push(elemsArr[i]);
				}
			}
			return _temp;
		}else{
			Docms.isArray(elemsArr)||(console.info("Docms tips:elemsFilter() invalid elemsArr+exp"));
			return [];
		}
	}
	//兼容ie7:类数组转换
	Docms.arrConvert=function(arr){
		try{
			Docms.isArray(arr)||(arr=Array.prototype.slice.call(arr));
		}catch(e){
			for(var i=0,_temp=[];i<arr.length;i++){
				_temp[i]=arr[i];
			}
			arr=_temp;
		}
		return arr;
	}
	//元素数组去重
	Docms.unique=function(arr){
		for(var elems=[arr[0]],bool,i=1;i<arr.length;i++){
			bool=!0;
			for(var j=0;j<elems.length;j++){
				if(arr[i]==elems[j]){
					bool=!1;
					break;
				}
			}
			bool&&(elems.push(arr[i]));
		}
		return elems;
	}
	//定义ajax函数
	Docms.ajax=function(config) {
		//2.使用merge将config初始化合并一下
		config = merge(config);
		//3.创建ajax对象
		var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("microsoft.XMLHTTP"),
		//4.先去判断请求是否为post
			isPost = /post/i.test(config.type);
		//4.1无论是get还是post都要把json数据转化成get参数类型
		config.data = jsonToStr(config.data);
		//5.如果是get方式要判断是否要缓存，如果不要缓存就加时间戳。向地址上加时间的时候要判断之前是否有？号
		isPost||(
			config.url += (config.url.indexOf("?") > -1 ? "&" : "?") + (config.cache ? "" : new Date().getTime() + "=1") + "&" + config.data
		);
		//6.打开地址,兼容Firefox:open方法要放在setRequestHeader之前
		xhr.open(config.type, config.url, config.async);
		//7.如果是post
		isPost&&(
			//8.添加请求头
			xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded")
		);
		//9.执行发送之前的回调函数，要执行回调函数一定要判断它是不是函数
		typeof config.beforeSend == "function"&&(
			config.beforeSend()
		);
		//10.发送数据
		xhr.send(config.data);
		//11.添加监听事件
		xhr.onreadystatechange = function() {
			//12.判断是否完成
			if (xhr.readyState == 4) {
				//13.如果请求完成，并且有回调函数就执行
				if (typeof config.complete == "function") {
					config.complete(xhr.status, xhr);
				}
				if (typeof config.success == "function") {
					if(config.dataType.toLowerCase()=='json'){
						var data=[];
						try{
							data=eval('('+xhr.responseText+')')
						}catch(e){
							console.error('返回数据错误');
						}
						config.success(data, xhr);
						return;
					}
					config.success(xhr.responseText, xhr);
				}
			}
		}
	}
	//读取/设置 cookie,参数:1.名称,2.值,3.过期时间:格式为[yMdhms]+数字,例如:d2表示两天,h3表示3小时,大M是月,小m是分
	Docms.cookie=function(name,val,exp){
		name=name||"";
		exp=exp||"";
		exp=exp.match(/([yMdhms]{1})(\d+)/);
		//如果设置了过期时间,将exp转换成对应时间的毫秒
		if(exp){
			switch(exp[1]){
				case "y":exp=new Date().setFullYear(new Date().getFullYear()+exp[2]*1);break;
				case "M":exp=new Date().setMonth(new Date().getMonth()+exp[2]*1);break;
				case "d":exp=new Date().setDate(new Date().getDate()+exp[2]*1);break;
				case "h":exp=new Date().setHours(new Date().getHours()+exp[2]*1);break;
				case "m":exp=new Date().setMinutes(new Date().getMinutes()+exp[2]*1);break;
				case "s":exp=new Date().setSeconds(new Date().getSeconds()+exp[2]*1);
			}
		}
		//传入的参数name有效,则根据val进行读取或设置cookie
		if(name){//encodeURIComponent结果字符太多
			if(typeof(val)=='string'||typeof(val)=='number'){
				exp?document.cookie=name+'='+escape(val)+';expires='+new Date(exp).toUTCString():
				document.cookie=name+'='+escape(val);
				return !0;
			}else{
				var reg=new RegExp('('+name+')=(.*?)($|(?=;))'),
					arr=document.cookie.match(reg);
				//返回值:["name=val", "name", "val"]
				if(arr){
					return unescape(arr[2]);
				}
				return null;
			}
		//传入的参数name无效返回所有cookie
		}else{
			return document.cookie;
		}
	}
	function jsonToStr(data) {
		var str = "";
		//1.遍历json数据
		for (var i in data) {
			//2.将属性名与值连接起来     属性名=属性值
			str += i + "=" + data[i] + "&"; //i=data[i]
		}
		//3.去掉最后一个多余的&符号,并返回处理好的数据
		return str.replace(/&+$/, "");
	}
	function merge(ini) {
		//2.配置默认选项
		var config = {
			type: "get",
			url: "",
			async: true, //异步
			cache: false, //缓存
			data: {},
			dataType:'',
			success: function(){},
			beforeSend: function(){},
			complete: function(){}
		};
		//2.1如果没有传递参数 让默认参数为空对象
		ini = ini || {};
		//3.遍历默认选项，即使传进来的是选项中没有的属性也不会被添加进来
		for (var i in config) {
			//4.1就是配置属性名，从ini中找这个对应的数据，有就覆盖当前配置
			config[i] = typeof(ini[i]) === 'undefined' ? config[i] : ini[i];
		}
		//返回合并结果
		return config;
	}
	Docms.prototype=Docms.fun;
	Docms.fun.init.prototype=Docms.prototype;
	if(w.DM||w.Docms){
		throw new Error('Docms tips:Object Docms|DM exist!');
	}else{
		DM=w.Docms=Docms;
	}
}(window,document);
//兼容ie7/8,去头尾空格
if(!String.prototype.trim){
	String.prototype.trim=function(){return this.replace(/^\s*|\s*$/g,"")}
}
//兼容ie7/8,元素检索
if(!Array.prototype.indexOf){
	Array.prototype.indexOf=function(elem){
		var i=0;
		return (function(arr){
			if(elem===arr[i]){
				return i;
			}
			if(++i<arr.length){
				return arguments.callee(arr);
			}else{
				return -1;
			}
		})(this);
	}
}
//-------------------------------------------------------------------------------------------------------------

//兼容ie7/8,源自developer.mozilla.org
if (!Function.prototype.bind) {
	Function.prototype.bind = function(oThis) {
		if (typeof this !== "function") {
			throw new TypeError("Function.prototype.bind");
		}
		var aArgs = Array.prototype.slice.call(arguments, 1),
				fToBind = this,
				fNOP = function() {},
				fBound = function() {
					return fToBind.apply(this instanceof fNOP && oThis ? this : oThis,
							aArgs.concat(Array.prototype.slice.call(arguments)));
				};
		fNOP.prototype = this.prototype;
		fBound.prototype = new fNOP();
		return fBound;
	};
}