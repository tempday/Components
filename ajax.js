(function() {
	//将变量闭包在匿名函数里面
	function jsonToGet(data) {
		var str = "";
		//1.遍历json数据
		for (var i in data) {
			//2.将属性名与值连接起来     属性名=属性值
			str += i + "=" + data[i] + "&"; //i=data[i]
		}
		//3.去掉最后一个多余的&符号
		str = str.replace(/&+$/, "");
		//4.将处理好的数据返回出去
		return str;
	}
	function merge(ini) {
		//2.配置默认选项
		var config = {
			type: "get",
			url: "",
			async: true, //异步
			cache: false, //缓存
			data: {},
			success: function() {},
			beforeSend: function() {},
			complete: function() {}
		};
		//2.1创建一个变量不给值，这就是undefined，用于比较属性是否是undefined
		var z;
		//2.2如果没有传递参数 让默认参数为空对象
		ini = ini || {};
		//3.遍历默认选项，即使传进来的是选项中没有的属性也不会被添加进来
		for (var i in config) {
			//4.1就是配置属性名，从ini中找这个对应的数据，有就覆盖当前配置，没有就不管了
			config[i] = ini[i] === z ? config[i] : ini[i];
		}
		//返回合并结果
		return config;
	}
	//1.定义ajax函数
	function ajax(config) {
			//2.使用merge将config初始化合并一下
			config = merge(config);
			//3.创建ajax对象
			var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject("microsoft.XMLHTTP");
			//4.先去判断请求是否为post
			var isPost = /post/i.test(config.type);
			//4.1无论是get还是post都要把json数据转化成get参数类型
			config.data = jsonToGet(config.data);
			//5.如果是get方式要判断是否要缓存，如果不要缓存就加时间戳。向地址上加时间的时候要判断之前是否有？号
			if (!isPost) {
				config.url += (config.url.indexOf("?") > -1 ? "&" : "?") + (config.cache ? "" : new Date().getTime() + "=1") + "&" + config.data;
			}
			//6.打开地址
			xhr.open(config.type, config.url, config.async);
			//7.如果是post
			if (isPost) {
				//8.添加请求头
				xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
			}
			//9.执行发送之前的回调函数，要执行回调函数一定要判断它是不是函数
			if (typeof config.beforeSend == "function") {
				config.beforeSend();
			}
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
						config.success(xhr.responseText, xhr);
					}
				}
			}
		}
		/*
		 * 所有的全局变量都是window的属性
		 *
		 * */
	window.ajax = ajax;
})();