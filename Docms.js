/*Created by lglong519--2017/11/09*/

//document manipulation set ==Docms
~function(w,d){
	function Docms(selector,parent){
		return new Docms.fun.init(selector,parent);
	}
	Docms.fun={
		name:"Docms v1.0",
		elems:[],
		length:0,
		init:function(selector,parent){
			this.getElems(selector,parent);
		},
		//兼容ie7+,按("#id")|(".class")|("tagName") 获取元素,parent:[可选]值类型可以是3种,1.DM对象,2.dom对象,3.选择器字符串
		//?多个选择器用逗号分隔("#id,.class")
		//?返回的元素是用单个对象储存还是统一放入一个数组中暂时未定
		getElems:function(selector,parent){
			if(typeof(selector)==="object"){
				this.elems.push(selector);
				return this;
			}else if(this.elems.length){
				return this;
			}
			(parent&&parent.nodeType==1)||(parent=document);
			if(selector==undefined||selector==""){
				console.info("info:selector is undefined");
				return this;
			}else if(typeof(selector)!="string"){
				console.warn("warning:selector is not a String");
				return this;
			}
			if(/^#[^\s]*$/.test(selector)){
				this.elems[this.elems.length]=d.getElementById(selector.replace("#",""));
			}
			if(/^[A-z\*]*$/.test(selector)){
				this.elems=parent.getElementsByTagName(selector);
			}
			if(/^\.[^\s]*$/.test(selector)){
				var selector=selector.replace(".","");
				if(d.getElementsByClassName){
					this.elems=parent.getElementsByClassName(selector);
				}else{
					var tags=parent.getElementsByTagName("*"),
						reg=this.regOfIndStr(selector);
					for(var i=0;i<tags.length;i++){
						reg.test(tags[i].className)&&(this.elems.push(tags[i]));
					}
				}
			}
			this.resetElems();
			return this;
		},//重置元素列表
		resetElems:function(doms){
			doms&&(this.elems=doms);
			if(this.length>this.elems.length){
				for(var i=0;i<this.length-this.elems.length;i++){
					delete this[this.length-1-i]
				}
			}
			this.length=this.elems.length;
			for(var i=0;i<this.elems.length;this[i]=this.elems[i++]);
			this.elems=Array.prototype.slice.call(this.elems);
		},
		//兼容ie7+,按属性获取元素,1.attrType:属性类型;2.attr:属性值[可选],如果元素类型不为空则此参数必须设置可以为"";3.tagName:查找标签类型[可选],如果缺省则查找全部类型
		getElemsByAttr:function(attrType,attr,tagName){
			var parent=this.elems[0]||d,
				doms=[],tags,
				reg=this.regOfIndStr(attr),
				value,
				typeLis=[],
				attrLis=[];
			attr=attr||"";
			tagName=tagName||"*";
			doms=Docms.fun.getElems(tagName,parent).elems;
			for(var i=0;i<doms.length;i++){
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
		//添加class
		addClass:function(cls){
			if(this.elems.length){
				for(var i=0;i<this.elems.length;i++){
					this.elems[i].className=this.elems[i].className==""?cls:this.elems[i].className+" "+cls;
				}
			}		
			return this;
		},
		//移除class
		removeClass:function(cls){
			var reg=this.regOfIndStr(cls,"g");
			if(this.elems.length){
				for(var i=0;i<this.elems.length;i++){
					this.elems[i].className=this.elems[i].className.replace(reg,"").replace(/^\s*|\s*$/g,"");
				}
			}
			return this;
		},
		//兼容ie7/8,判断是否数组类型
		isArray:function(arr){
			if(!Array.isArray) {
				return Object.prototype.toString.call(arr) === '[object Array]';
			}else{
				return Array.isArray(arr)
			}
		},
		//完整且独立的字符串的正则表达式,无后瞻所以匹配到的字符左侧可能会带空格
		regOfIndStr:function(arg,attr){
			attr=attr||"";
			return new RegExp("^"+arg+"$|^"+arg+"(?=\\s)|(?:\\s)"+arg+"(?=\\s+)|(?:\\s)"+arg+"$",attr.toLowerCase());
		},
		addEvent:function(type,fn,bool){
			bool=bool||false;
			if(this.elems.length){
				for(var i=0;i<this.elems.length;i++){
					if (this.elems[i].addEventListener) {
						this.elems[i].addEventListener(type,fn,bool); 
					}else if (this.elems[i].attachEvent){
						this.elems[i].attachEvent('on'+type,fn);
					}
				}
			}	
		},
		isElems:function(){
			//return this[0].length?:this.isArray(this[0]);
		},
		find:function(){
		},
		on:function(){
		},
		each:function(){
		}
	}//end Docms
	//兼容ie7/8,firefox:获取事件或事件目标,ev=0:返回事件[默认可不填],ev=1:返回目标
	Docms.getEventTarget=function(ev){
		ev=ev==1?ev:0;
		var e=w.event||arguments.callee.caller.arguments[0];
		var src= e.srcElement|| e.target;
		if(ev){
			return src;
		}else{
			return e;
		}
	}
	Docms.prototype=Docms.fun;
	Docms.fun.init.prototype=Docms.prototype;
	DM=w.Docms=Docms;
}(window,document);

//-------------------------------------------------------------------------------------------------------------

//兼容ie7/8,源自developer.mozilla.org
if (!Function.prototype.bind) {
		Function.prototype.bind = function(oThis) {
			if (typeof this !== "function") {
				throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
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