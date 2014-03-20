function Waiter(stream) {
	var rq = this._requests = [];

	stream.on('readable', this._onreadable.bind(this));
}
Waiter.prototype._onreadable = function() {
	var r = this._readable[0];
	if(r == null) return;
	var data = stream.read(r.bytes);
	if(data != null) {
		this._readable.shift();
		r.cb(data);
	}
}
Waiter.prototype.getBytes = function(length, cb) {
	this._requests.push({
		bytes: length,
		cb: cb
	});
	this._onreadable();
}
Waiter.prototype.getLength = function(lengthSize, cb) {
	this.getBytes(lengthSize, function(length) {
		switch(lengthSize) {
		case 1:
			length = length.readUInt8(0);
			break;
		case 2:
			length = length.readUInt16BE(0);
			break;
		case 4:
			length = length.readUInt32BE(0);
			break;
		default:
			throw new Error('lengthSize must be 1, 2, or 4. ' + lengthSize + ' is not allowed.');
		}
		this._requests.unshift({
			bytes: length,
			cb: cb
		});
		this._onreadable();
	}.bind(this));
}

module.exports = Waiter;
