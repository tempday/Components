Docms.isArray=function(arr){
		if(!Array.isArray) {
			return Object.prototype.toString.call(arr) === '[object Array]';
		}else{
			return Array.isArray(arr)
		}
	}