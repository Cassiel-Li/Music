(function(w){
	
	w.Cdrag = function(nav,callback){
//		var nav = document.querySelector('#wrap');
//		var navList = document.querySelector('#content');
		var navList = nav.children[0];
		transformCss(navList,'translateZ',0.01);
		
		// 定义手指和元素初始位置
		var startY = 0;
		var eleY = 0;
		var minWidth = document.documentElement.clientHeight-navList.offsetHeight;// 负值
		var lastPoint = 0;
		var lastTime = 0;
		var nowPoint = 0;
		var nowTime = 0;
		var disPoint = 0;
		var disTime = 0;
		
		// 防抖动（滚动条）
		var startX = 0;
		var isFirst = true;
		var isY = true;
		
		// Tween 函数 （返回值是每一点的位置）
		var Tween = {
			Linear: function(t,b,c,d){ return c*t/d + b; },
			easeOut: function(t,b,c,d,s){
	            if (s == undefined) s = 1.70158;
	            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
			}
		}
		
		nav.addEventListener('touchstart',function(ev){
			var touch = ev.changedTouches[0];
			
			clearInterval(navList.timer);
			
			navList.style.transition = 'none';
			
			startY = touch.clientY;
			eleY = transformCss(navList,'translateY');
			
			lastPoint = eleY;
			lastTime = new Date().getTime();
			
			disPoint = 0;
			
			if(callback && callback['start']){
				callback['start']();
			}
			
			isFirst = true;
			isY = true;
			
		})
		nav.addEventListener('touchmove',function(ev){
			var touch = ev.changedTouches[0];
			// 手指当前位置
			var nowY = touch.clientY;					
			var disY = nowY - startY;	// 手指滑动距离
			// 元素移动距离
			var translateY = eleY + disY;
			
			// 限定范围,效果（超出边界就很难拖拽）
			var scale = 0;
			if(translateY > 0){
				// 留白区域增加，比例大小增加,scale减小
				scale = 1-translateY/document.documentElement.clientHeight;
				translateY = translateY*scale;
			}else if(translateY < minWidth){
				var over = minWidth - translateY;	//右边留白区域,正值
				scale = 1-over/document.documentElement.clientHeight;
				translateY = minWidth - over*scale;
			}
			// 元素当前位置
			transformCss(navList,'translateY',translateY);
			
			nowPoint = translateY;
			nowTime = new Date().getTime();
			disPoint = nowPoint - lastPoint;
			disTime = nowTime - lastTime;
			
			if(callback && callback['move']){
				callback['move']();
			}
			
		})
		
		// 快速滑屏和回弹  --Tween函数
		nav.addEventListener('touchend',function(ev){
			var touch = ev.changedTouches[0];
			
			var speed = disPoint/(nowTime - lastTime);					
			var target = transformCss(navList,'translateY') + speed*100;
		
			
			// 回弹效果 + 即点即停
			var type = 'Linear';				
			if(target>0){
				target = 0;
				type = 'easeOut';
			}else if(target < minWidth){
				target = minWidth;
				type = 'easeOut';
			};
			
			var time =1;
			move(target,type,time);				
			
		})
		
		function move(target,type,time){
			var t = 0;	// 当前第一次的次数
			var b = transformCss(navList,'translateY');	// 初始位置
			var c = target - b;	// 初始位置和目标位置的差值
			var d = (time/0.02);	// 总次数
			
			clearInterval(navList.timer);
			navList.timer = setInterval(function(){
				t++;					
				if(t > d){
					if(callback && callback['end']){
						callback['end']();
					}
					clearInterval(navList.timer);
				}else{
					if(callback && callback['move']){
						callback['move']();
					}
					var point = Tween[type](t,b,c,d);
					transformCss(navList,'translateY',point);
				}					
			},20);					
		}			
	}	
		
	
	
	
})(window);
