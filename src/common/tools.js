// 拼接0
const add0 = s => s > 9 ? s : '0'+s;

module.exports =  {
	/**
	 * 获取日期格式化
	 * @param  {[type]} d 日期差 默认获取昨天
	 * @param  {[type]} m 月差
	 * @return {[type]}   format: 20180505
	 */
	getFormatDate: (d = -1, m = 0) => {
		const diff = 1000 * 60 * 60 * 24 * d + 1000 * 60 * 60 * 24 * 30 * m;
		const n = new Date(Date.now() + diff);

		return n.getFullYear() + '' + add0(n.getMonth() + 1) + '' + add0(n.getDate())
	},

	/**
	 * 获取月份格式化
	 * @param  {[type]} d 日期差 默认获取昨天
	 * @param  {[type]} m 月差
	 * @return {[type]}   format: 20180505
	 */
	getFormatMonth: (m = 0) => {
		const diff = 1000 * 60 * 60 * 24 * 30 * m;
		const n = new Date(Date.now() + diff);

		return n.getFullYear() + '' + add0(n.getMonth() + 1)
	}
}