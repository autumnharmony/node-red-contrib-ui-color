/**
 * Copyright JS Foundation and other contributors, http://js.foundation
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {

    // check required configuration
    function checkConfig(node, conf) {
        return true;
    }

    // generate HTML/Angular code for ui_list widget based on node
    // configuration.
    // Basic structure of generated code is as follows:
    //   <md-list>
    //       <md-list-item ng-repeat="item in msg.items" ...>
    //         specification of list item according to setting options
    //       </md-list-item>
    //   </md-list>
    // It uses ng-repeat of Angular in order to repeat over items in
    // a list pointed by msg.items sent from Node-RED backend.
    //
    function HTML(config) {
        var html = String.raw`
	<input id="input-color" type="color" name="color" ng-model="colorValue" ng-change="colorPicked()" />
`;
        return html;
    };

    // Holds a reference to node-red-dashboard module.
    // Initialized at #1.
    var ui = undefined;

    // Node initialization function
    function ColorNode(config) {
	debugger;
        try {
            var node = this;
            if(ui === undefined) {
                // #1: Load node-red-dashboard module.
                // Should use RED.require API to cope with loading different
                // module.  And it should also be executed at node
                // initialization time to be loaded after initialization of
                // node-red-dashboard module.
                // 
                ui = RED.require("node-red-dashboard")(RED);
            }
            // Initialize node
            RED.nodes.createNode(this, config);
            var done = null;
            if (checkConfig(node, config)) {
                // Generate HTML/Angular code
                var html = HTML(config);
                // Initialize Node-RED Dashboard widget
                // see details: https://github.com/node-red/node-red-ui-nodes/blob/master/docs/api.md
                done = ui.addWidget({
                    node: node,			// controlling node
                    width: config.width,	// width of widget
                    height: config.height,	// height of widget
                    format: html,		// HTML/Angular code
                    templateScope: "local",	// scope of HTML/Angular(local/global)*
                    group: config.group,	// belonging Dashboard group
                    emitOnlyNewValues: false,
                    forwardInputMessages: false,
                    storeFrontEndInputAsState: false,
                    convertBack: function (value) {
                        return value;
                    },
                    beforeEmit: function(msg, value) {
                        // make msg.payload accessible as msg.items in widget
                        return { msg: { items: value } };
                    },
                    beforeSend: function (msg, orig) {
                        if (orig) {
                            return orig.msg;
                        }
                    },
                    initController: function($scope, events) {
			debugger;

			  $scope.colorValue = '#f9ad17';
                        // initialize $scope.click to send clicked widget item
                        // used as ng-click="click(item, selected)"
                          $scope.colorPicked = function() {
				debugger;
                                $scope.send({payload: $scope.colorValue});
			  }
                    }
                });
            }
        }
        catch (e) {
            console.log(e);
        }
        node.on("close", function() {
            if (done) {
                // finalize widget on close
                done();
            }
        });
    }
    // register ui_list node
    RED.nodes.registerType('ui_color', ColorNode);
};