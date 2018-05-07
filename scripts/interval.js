var IntervalSliderModule = (function() {

    /***** CONSTRUCTOR *****/
    function IntervalSliderModule(container_id, uri) {
        console.info("Constructing the interval slider")
        if (!(this instanceof arguments.callee)) {
            throw new Error("Constructor called as a function");
        }
        if (window.DEBUG) {
            console.log("Creating instance of 'interval.js' at '" + container_id + "'");
        }

        /***** PRIVATE VARIABLES *****/
        this._procedure_name = "http://opendsme.org/rpc/setInterval";
        this._stored_sessions = {};
        this._input = null;
        this._label = null;

        _prepare_input.call(this, uri, container_id);
        _setDisplayedValue.call(this, 1.0);
    }

    /***** PRIVATE METHODS *****/
    function _convertValue(text) {
        var that = this;

        var converted = parseFloat(text) / 100
        converted = Math.pow(5, converted);

        var decimals = Math.round(Math.sqrt(1 / converted));
        decimals = Math.max(0, decimals);
        decimals = Math.min(3, decimals);

        converted = converted.toFixed(decimals)
        return converted;
    }

    function _prepare_input(uri, container_id) {
        var that = this;

        that._input = document.createElement("input");
        that._input.id = container_id + "_range";
        that._input.name = that._input.id;
        that._input.type = "range";
        that._input.min = "-143";
        that._input.max = "100";
        that._input.onchange = onChange;
        that._input.oninput = onInput;

        that._label = document.createElement("label");
        that._label.id = container_id + "_label";
        that._label.innerText = "0.0 s";
        that._label.htmlFor = that._input.name;

        $("#" + container_id).append(that._input);
        $("#" + container_id).append(that._label);

        function onChange() {
            _setInterval.call(that, uri, _convertValue.call(that, that._input.value));
        }

        function onInput(value) {
            that._label.innerText = _convertValue.call(that, that._input.value) + " s";
        }
    }

    function _setDisplayedValue(value) {
        var that = this;

        that._label.innerText = value + " s";
        that._input.value = Math.floor(Math.log(value) / Math.log(5) * 100);
    }

    function _setInterval(uri, interval) {
        console.info("Got into setInterval function");
        var that = this;

        var sendInterval = parseFloat(interval);
        setParameter.call(that, uri, "Tictoc.tic", "sleepTime", interval)
        setParameter.call(that, uri, "Tictoc.toc", "sleepTime", interval)
    }

    /***** PUBLIC INTERFACE *****/
    IntervalSliderModule.prototype.reset = function() {
        var that = this;

        _setDisplayedValue.call(that, 1.0);
    };

    return IntervalSliderModule;
})();
