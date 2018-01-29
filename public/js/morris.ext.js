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

            if (this.options.yValueCheck.includes(row.x)) {
                return this.options.yValueCheckColor;
            }

            return this.options.pointFillColors[sidx % this.options.pointFillColors.length] || this.options.lineColors[sidx % this.options.lineColors.length];                   
        } else {
            return this.options.lineColors[sidx % this.options.lineColors.length];
        }
    };
}).call(this);
