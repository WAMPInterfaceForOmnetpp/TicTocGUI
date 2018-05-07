var ResetButtonModule = (function () {

    /***** CONSTRUCTOR *****/
    function ResetButtonModule(container_id, uri, objects) {
        if (!(this instanceof arguments.callee)) {
            throw new Error("Constructor called as a function");
        }
        if (window.DEBUG) {
            console.log("Creating instance of 'reset.js' at '" + container_id + "'");
        }

        /***** PRIVATE VARIABLES *****/
        this._procedure_name = "http://opendsme.org/rpc/restart"
        this._stored_sessions = {};
        this._objects = objects;

        _prepare_input.call(this, container_id, uri);
    }

    /***** PRIVATE METHODS *****/

    function _prepare_input(container_id, uri) {
        var that = this;

        var fieldset = document.createElement("fieldset");
        $("#" + container_id).append(fieldset);

        var store_button = document.createElement("button");
        store_button.id = container_id + "_button";
        store_button.innerText = "Restart Simulation";
        var p1 = document.createElement("p");
        $(p1).append(store_button);
        $(fieldset).append(p1);

        store_button.onclick = onClick;

        function onClick() {
            _connect.call(this, uri, "com.examples.functions.restartSimulation")
        }

    }

    function _connect(uri, event_name) {
        var that = this;
        
        var connection = new autobahn.Connection({
            url: uri,
            realm: "realm1"
        });

        connection.onopen = function (session, details) {
            console.info("Connected simulation start to " + uri);
            session.call(event_name).then(
                function showInterval(res) {
                    console.info("started simulation");
                    connection.close();
                },
                function error (error) {
                    console.info("An error occured", error);
                    connection.close();
                });
        };
         
         
        connection.onclose = function (reason, details) {
            console.info("Closed start simulation caller connection");
        }
        
        connection.open();
    }

    /***** PUBLIC INTERFACE *****/
    // NONE

    return ResetButtonModule;
})();
