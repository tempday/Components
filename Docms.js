/*Created by lglong519--2017/11/09*/

//document manipulation set ==Docms
~function(d){
	console.log(typeof window);
	window.Dm=window.Dm||{};
	Dm={
		name:"Docms",
		nameSpace:"space",
		//按指定属性获取标签
		getElemByAttr:function(tagName,attrType,attr,parentId){
			parentId=parentId||"";
			attr=attr||"";
			var parent=document.getElementById(parentId),tags;
			if(parent){
				tags=parent.getElementsByTagName(tagName);
			}else{
				tags=document.getElementsByTagName(tagName);
			}
			var reg=new RegExp("^"+attr+"$|^"+attr+"\\s|\\s"+attr+"$|\\s"+attr+"\\s","g");
			var typeLis=[],attrLis=[];
			//console.log(reg);
			for(var i=0;i<tags.length;i++){
				var value=tags[i].getAttribute(attrType);
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
		removeClass:function(elem,cls){
			var reg=new RegExp("^"+cls+"$|^"+cls+"\\s|\\s"+cls+"$|\\s"+cls+"\\s|^\\s*|\\s*$","g");
			if(!elem){
				return false;
			}else{
				elem.className=elem.className.replace(/\s/g,"  ").replace(reg," ").replace(/^\s*|\s*$/g,"").replace(/\s{2,}/g," ");
			}
			return elem;
		}
	}//end Dm
	/*
	function Dm(){
		console.log("function");
	}
	*/

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
	//window.Dm=Docms=Dm;
}(document)