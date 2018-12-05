import {$, proxy} from '../util/util.js'
import './style.scss'

export default class Slider {
	constructor(props) {
		this.props = props;
		this._init();
	}

	_init() {
		this._initData();
		this.initSlider();
		this._initEvent();
	}

	_initData() {
		let defaultOpt = {
			el: $('.slider')[0],
			loop: true,
			interval: 3000,
			button: true,
			dot: true,
			distance: 0.3
		};
		const self = this;

		if(typeof this.props === 'object') {
			let props = this.props;
			this.options = {...defaultOpt, ...props};
			props.el && (this.options.el = $(props.el));
		}else 
			this.options = defaultOpt;

		this.sliderGroup = this.options.el.getElementsByClassName('slider-group')[0];

		//代理options属性
		const keys = Object.keys(this.options);
		let i = keys.length;
	  while(i--) {  
	    const key = keys[i];
	    proxy(self, `options`, key);
	  } 

	  this.currentDom = null;
	  this.prevDom = null;
	  this.nextDom = null;
	  this.startX = 0;	//点击位置
	  this.lock = true;	//是否可滑动
	  this.moveX = 0;	//滑动距离
	  this.transformX = 0;	//位移
	  this.clientW = 0;	//容器宽度
	  this.timer = null;	//定时器
	  this.press = false; //是否按压
	}

	initSlider() {
		let sliderList = this.sliderGroup.children, groupW = 0, len = sliderList.length;
		//初始页 
		this.currentDom = sliderList[0];
		this.nextDom = sliderList[1];
		this.prevDom = sliderList[sliderList.length - 1];
		this.clientW = this.el.offsetWidth;	//获取容器宽度

		for(let i = 0; i < len; i++) {
			sliderList[i].style.width = this.clientW + 'px';
			if(i === 0) {
				sliderList[i].style.transform = 'translate(0px, 0px)';
				sliderList[i].style.left = '0px';
			}
			else {
				sliderList[i].style.transform = `translate(${this.clientW}px, 0px)`;
				sliderList[i].style.left = `${-this.clientW * i}px`;
			}

			groupW += this.clientW;
		}
		this.sliderGroup.style.width = groupW + 'px';
		this.transformX = Math.round(this.clientW * this.distance);	//切换移动距离
		//loop
		if(this.loop) {
			this.setLoop();
		}
	}

	_initEvent() {
		let self = this;
		this.sliderGroup.addEventListener('mousedown', function(e) {
			e.preventDefault();
			let currentDom = self.currentDom,
					prevDom = self.prevDom,
					nextDom = self.nextDom,
					parent = e.currentTarget;

			self.lock = false;
			self.startX = e.clientX;
			self.press = true;

			clearTimeout(self.timer);	//清除定时器

			if(currentDom && prevDom && nextDom) {	//清除过渡
				currentDom.style.transition = 'unset';
				prevDom.style.transition = 'unset';
				nextDom.style.transition = 'unset';
			}

			//获取关联的三个节点
			self.currentDom = e.target.parentNode;
			self.nextDom = self.currentDom.nextElementSibling || parent.firstElementChild;
			self.prevDom = self.currentDom.previousElementSibling || parent.lastElementChild;
		});

		this.sliderGroup.addEventListener('mousemove', function(e) {
			let moveX = 0,
					clientW = self.clientW;

			if(!self.lock) {
				e.preventDefault();
				moveX = self.moveX = e.clientX - self.startX;
				self.currentDom.style.transform = `translate(${moveX}px, 0px)`;
				self.prevDom.style.transform = `translate(${-clientW + moveX}px, 0px)`;
				self.nextDom.style.transform = `translate(${clientW + moveX}px, 0px)`;
			}
		})
		this.sliderGroup.addEventListener('mouseup', function(e) {
			let currentDom = self.currentDom,
					prevDom = self.prevDom,
					nextDom = self.nextDom,
					clientW = self.clientW;

			self.lock = true;
			self.press = false;

			if(self.moveX <= -self.transformX) {
				self.next();
			}else if(self.moveX >= self.transformX) {
				self.prev();
			}else {
				currentDom.style.transform = `translate(0px, 0px)`;
				prevDom.style.transform = `translate(${-clientW}px, 0px)`;
				nextDom.style.transform = `translate(${clientW}px, 0px)`;
			}
			if(self.loop) {
				self.setLoop();
			}
		})
		let timer = null;
		window.onresize = function() {
			timer && clearTimeout(timer); 
			timer = setTimeout(() => {
				self.initSlider();
			}, 50)
		}
	}
	setLoop() {
		this.timer = setInterval(() => {
			this.next();
		}, this.interval);
	}
	_getSibling(dom, str) {
		if(str === 'prev') 
			return dom.previousElementSibling || this.sliderGroup.lastElementChild;
		if(str === 'next')
			return dom.nextElementSibling || this.sliderGroup.firstElementChild;
	}
	prev() {
		this.currentDom.style.transform = `translate(${this.clientW}px, 0px)`;
		this.prevDom.style.transform = `translate(0px, 0px)`;
		this.nextDom.style.transform = `translate(${this.clientW * 2}px, 0px)`;
	}
	next() {
		if(!this.press) {
			this.currentDom.style.transition = 'all .3s ease';
			this.prevDom.style.transition = 'all .3s ease';
			this.nextDom.style.transition = 'all .3s ease';
		}

		this.currentDom.style.transform = `translate(${-this.clientW}px, 0px)`;
		this.prevDom.style.transform = `translate(${-this.clientW * 2}px, 0px)`;
		this.nextDom.style.transform = `translate(0px, 0px)`;

		if(!this.press) {
			//切换当前页
			this.prevDom = this.currentDom;
			this.currentDom = this.nextDom
			this.nextDom = this.nextDom.nextElementSibling;
			this.nextDom.style.transform = `translate(${this.clientW}px, 0px)`;
		}
	}
}