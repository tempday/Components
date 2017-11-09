/*
<div class="inlineblock">
	<ul>
		<li></li>
		<li></li>
		<li></li>
		<li></li>
	</ul>
</div>


*/

//图片自动左切换
	var slidePic={
		timer:null,
		interval:200,
		count:0,
		width:15,
		margin:1,
		unit:"em",
		tag:$(".inlineblock>ul"),
		moveImg:function(){
			var ob=this;
			ob.tag.animate({
				marginLeft:'-=1.6em'
			},ob.interval,"linear",function(){
				ob.count++;
				if(ob.count==10){
					ob.count=0;
					ob.tag.css({marginLeft:0});
					ob.tag.children(":first").appendTo(ob.tag);
					ob.tag.children().each(function(i) {
						$(this).css({
							left: i * (ob.width+ob.margin) +ob.unit
						})
					})
				}
			})
		},
		startToMove:function(){
			var ob=this;
			ob.moveImg();
			ob.timer=setInterval(function(){
				ob.moveImg();
			},ob.interval);

			ob.tag.mouseover(function(){
				clearInterval(ob.timer);
				ob.timer=null;
			});
			ob.tag.mouseout(function(){
				ob.timer=setInterval(function(){
					ob.moveImg()
				},ob.interval);
			});
		}
	};
	slidePic.startToMove();