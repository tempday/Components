/*Created by lglong519--2017/11/09*/

//document manipulation set ==Docms
~function(w,d){
	function DM(selector,parent){
		return new DM.fun.init(selector,parent);
	}
	DM.fun={
		name:"Docms",
		init:function(selector,parent){
			this.doms=this[0]=this.getElem(selector,parent);
		},
		//兼容ie7+,按("#id")|(".class")|("tagName") 获取元素,如果缺少父元素parent默认是从document开始查找,如果是按id查找返回的是单个dom对象,否则返回的是dom数组
		getElem:function(selector,parent){
			if(this.doms){
				return this.doms;
			}
			var doms=[];
			(parent&&parent.nodeType==1)||(parent=document);
			if(selector==undefined){
				console.info("info:selector is undefined");
				return [];
			}else if(typeof(selector)!="string"){
				console.warn("warning:selector is not a String");
				return [];
			}
			console.log(2);
			if(/^#[^\s]*$/.test(selector)){
				return document.getElementById(selector.replace("#",""));
			}
			if(/^[A-z]*$/.test(selector)){
				doms=parent.getElementsByTagName(selector);
			}
			if(/^\.[^\s]*$/.test(selector)){
				var selector=selector.replace(".","");
				if(document.getElementsByClassName){
					doms=parent.getElementsByClassName(selector);
				}else{
					var elems=parent.getElementsByTagName("*"),
						reg=new RegExp("^"+selector+"$|^"+selector+"(?=\\s)|\\s"+selector+"(?=\\s+)|\\s"+selector+"$");
					for(var i=0;i<elems.length;i++){
						reg.test(elems[i].className)&&(doms.push(elems[i]));
					}
				}
			}
			return Array.prototype.slice.call(doms);
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
			var reg=new RegExp("^"+attr+"$|^"+attr+"(?=\\s)|\\s"+attr+"(?=\\s+)|\\s"+attr+"$","g");
			var value,typeLis=[],attrLis=[];
			//console.log(reg);
			for(var i=0;i<tags.length;i++){
				value=attrType=="class"?tags[i].className:tags[i].getAttribute(attrType);
				if(value){//判断属性是否有效
					value=value.replace(/^\s*|\s*$/g,"");
					value&&(typeLis.push(tags[i]));
					if(attrType=="class"){
						//console.log(value);
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
		addClass:function(elem,cls){
			if(!elem){
				return false;
			}else{
				elem.className=elem.className==""?cls:elem.className+" "+cls;
			}
			return elem;
		},
		//移除class
		removeClass:function(elem,cls){
			var reg=new RegExp("^"+cls+"$|^"+cls+"(?=\\s)|\\s"+cls+"(?=\\s+)|\\s"+cls+"$","g");
			if(!elem){
				return false;
			}else{
				elem.className=elem.className.replace(reg,"").replace(/^\s*|\s*$/g,"");
			}
			return elem;
		},
		//兼容ie7/8,firefox:获取事件或事件目标,ev=0:返回事件[默认可不填],ev=1:返回目标
		getEventTarget:function(ev){
			ev=ev==1?ev:0;
			var e=window.event||arguments.callee.caller.arguments[0];
			var src= e.srcElement|| e.target;
			if(ev){
				return src;
			}else{
				return e;
			}
		}
	}//end DM
	DM.prototype=DM.fun;
	DM.fun.init.prototype=DM.prototype;
	Docms=w.DM=DM;
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