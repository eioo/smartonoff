(function () {
    var $, MyMorris;

    MyMorris = window.MyMorris = {};
    $ = jQuery;

    MyMorris = Object.create(Morris);

    MyMorris.Grid.prototype.gridDefaults["checkYValues"] = "";
    MyMorris.Grid.prototype.gridDefaults["yValueCheck"] = 0;
    MyMorris.Grid.prototype.gridDefaults["yValueCheckColor"] = "";

    MyMorris.Line.prototype.colorFor = function (row, sidx, type) {
        if (typeof this.options.lineColors === 'function') {
            return this.options.lineColors.call(this, row, sidx, type);
        } else if (type === 'point') {
            switch (this.options.checkYValues) {
                case "eq":
                    if (row.y[sidx] == this.options.yValueCheck) {
                        return this.options.yValueCheckColor;
                    }
                    break;
                case "gt":
                    if (row.y[sidx] > this.options.yValueCheck) {
                        return this.options.yValueCheckColor;
                    }
                    break;
                case "lt":
                    if (row.y[sidx] < this.options.yValueCheck) {
                        return this.options.yValueCheckColor;
                    }
                    break;
                case "gteg":
                    if (row.y[sidx] >= this.options.yValueCheck) {
                        return this.options.yValueCheckColor;
                    }
                    break;

                case "lteg":
                    if (row.y[sidx] <= this.options.yValueCheck) {
                        return this.options.yValueCheckColor;
                    }
                    break;
                default:
                    return this.options.pointFillColors[sidx % this.options.pointFillColors.length] || this.options.lineColors[sidx % this.options.lineColors.length];
            }

            return this.options.pointFillColors[sidx % this.options.pointFillColors.length] || this.options.lineColors[sidx % this.options.lineColors.length];                   
        } else {
            return this.options.lineColors[sidx % this.options.lineColors.length];
        }
    };
}).call(this);
