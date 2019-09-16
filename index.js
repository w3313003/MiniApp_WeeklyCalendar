const moment = require('moment');
moment.locale('zh-CN')
Page({
	data: {
		lastWeekCount: 50,
		weekList: {},
	},
	baseWeeks: 52,
	weekMap: {},
	lastCount: 0,
	currentWeek: moment().week(),
	/**
	 * 获取本周周一和周日日期
	 */
	getCurrentWeek() {
		const start = moment().weekday(1).format('YYYY-MM-DD'); //本周一
		const end = moment().weekday(7).format('YYYY-MM-DD'); //本周日
		return [start, end]
	},

	/**
	 * 获取前 i 周的周一和周日日期，并以数组的方式返回。
	 * 当 i=1，获取的是上周一和上周日的日期；
	 * 当 i=2，获取的是上上周一和上上周日的日期
	 * ...以此类推
	 * @param i
	 */
	getLastWeek(i) {
		const weekOfDay = parseInt(moment().format('E'));//计算今天是这周第几天
		const last_monday = moment().subtract(weekOfDay + 7 * i - 1, 'days').format('YYYY-MM-DD');//周一日期
		const last_sunday = moment().subtract(weekOfDay + 7 * (i - 1), 'days').format('YYYY-MM-DD');//周日日期
		return [last_monday, last_sunday]
	},

	/**
	 * 获取后 i 周的周一和周日日期，并以数组的方式返回。
	 * 当 i=1，获取的是下周一和下周日的日期；
	 * 当 i=2，获取的是下下周一和下下周日的日期
	 * ...以此类推
	 * @param i
	 */
	getNextWeek(i) {
		const weekOfDay = parseInt(moment().format('E'));//计算今天是这周第几天
		const next_monday = moment().add((7 - weekOfDay) + 7 * (i - 1) + 1, 'days').format('YYYY-MM-DD');//周一日期
		const next_sunday = moment().add((7 - weekOfDay) + 7 * i, 'days').format('YYYY-MM-DD');//周日日期
		return [next_monday, next_sunday]
	},
	run(weeks) {
		const count = this.currentWeek - 1 + weeks;
		console.log(count)
		const result = [];
		let _c = this.lastCount + 1;
		while (_c <= count) {
			result.push(this.getLastWeek(_c));
			_c++;
		};
		console.log(result);
		// 初次加载手动添加本周
		if(weeks === this.baseWeeks) {
			result.unshift(this.getCurrentWeek());
		}
		result.forEach(date => {
			const year = date[0].match(/\d+(?=-)/)[0],
				month = Number(date[0].match(/(?:-)(\d+)(?=-)/)[1]);
			if (!this.weekMap[year]) {
				this.weekMap[year] = {};
			};
			if (!this.weekMap[year][month]) {
				this.weekMap[year][month] = []
			};
			this.weekMap[year][month].unshift(date);
		});
		this.setData({
			weekList: Object.assign({}, this.data.weekList, this.weekMap)
		})
		this.weekMap = {};
		this.lastCount = count;
		console.log(this.data.weekList)
		return result;
	},
	onLoad() {
		this.run(this.baseWeeks);
		// 模拟滚动加载
		setTimeout(() => {
			this.run(this.baseWeeks * 2);
		}, 1000)
	}
})