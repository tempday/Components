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
			this.getElem(selector,parent);
		},
		//兼容ie7+,按("#id")|(".class")|("tagName") 获取元素,如果缺少父元素parent默认是从document开始查找,如果是按id查找返回的是单个dom对象,否则返回的是dom数组
		//?多个选择器用逗号分隔("#id,.class")
		//?返回的元素是用单个对象储存还是统一放入一个数组中暂时未定
		getElem:function(selector,parent){
			if(typeof(selector)==="object"){
				return this.elems.push(selector);
			}else if(this.elems.length){
				return this.elems;
			}
			(parent&&parent.nodeType==1)||(parent=document);
			if(selector==undefined||selector==""){
				console.info("info:selector is undefined");
				return [];
			}else if(typeof(selector)!="string"){
				console.warn("warning:selector is not a String");
				return [];
			}
			if(/^#[^\s]*$/.test(selector)){
				this.elems[this.elems.length]=d.getElementById(selector.replace("#",""));
			}
			if(/^[A-z]*$/.test(selector)){
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
			this.length=this.elems.length;
			for(var i=0;i<this.elems.length;this[i]=this.elems[i++]);
			this.elems=Array.prototype.slice.call(this.elems);
			return this;
		},
		//兼容ie7+,按属性获取元素
		getElemByAttr:function(tagName,attrType,attr,parentId){
			parentId=parentId||"";
			attr=attr||"";
			var parent=d.getElementById(parentId),tags;
			if(parent){
				tags=parent.getElementsByTagName(tagName);
			}else{
				tags=d.getElementsByTagName(tagName);
			}
			var reg=this.regOfIndStr(attr);
			var value,typeLis=[],attrLis=[];
			for(var i=0;i<tags.length;i++){
				value=attrType=="class"?tags[i].className:tags[i].getAttribute(attrType);
				if(value){//判断属性是否有效,将带属性的元素放入数组
					value=value.replace(/^\s*|\s*$/g,"");
					value&&(typeLis.push(tags[i]));
					if(attrType=="class"){
						attr&&reg.test(value)&&(attrLis.push(tags[i]));
					}else {
						value==attr&&(attrLis.push(tags[i]));
					}
				}
			}
			if(attr){
				return attrLis;
			}else{
				return typeLis;
			}
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
		isElems:function(){
			//return this[0].length?:this.isArray(this[0]);
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