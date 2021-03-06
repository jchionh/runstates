/**
 * User: jchionh
 * Date: 10/27/13
 * Time: 2:33 PM
 */

// namespace
rt.runner = rt.runner || {};

/**
 * runstate flag
 *
 * SUSPEND_LOWER: when we have this flag, any state at the bottom of this state in the stack is
 *                suspended
 *
 * RUN_LOWER:     with this flag, any state below this state in the stack, we run them.
 *
 * @const
 * @type {rt.runner.RunFlag}
 */
rt.runner.RunFlag = { "SUSPEND_LOWER": 0, "RUN_LOWER": 1 };

/**
 * BaseRunState defines a base state of the state machine.
 * it will have these methods:
 *
 * onStart()
 * onUpdate(dt)
 * onRender(dt)
 * onStop()
 *
 * @param {rt.runner.RunFlag} runFlag
 * @constructor
 */
rt.runner.BaseRunState = function(runFlag) {

    // default suspend lower if runFlag is not set
    this.runFlag = runFlag || rt.runner.RunFlag.SUSPEND_LOWER;

    // if stopped, our state runner will stop this state and remove it from the run stack
    this.stopped = false;
};

/**
 * onStart is called once when this state is added to the run stack
 */
rt.runner.BaseRunState.prototype.onStart = function() {
};

/**
 * onStop is called once when this stat is removed from the run stack
 */
rt.runner.BaseRunState.prototype.onStop = function() {
};

/**
 * onUpdate call is called every loop
 * this is meant to perform calculations and NOT render calls, rendering is done in onRender
 *
 * @param {number} dt the delta time since the last call
 */
rt.runner.BaseRunState.prototype.onUpdate = function(dt) {
};

/**
 * onRender called every loop
 * this method is meant to do ONLY render calls
 *
 * @param {number} dt
 * @param {Object} ctx the rendering context, -- can be gl, or 2d canvas
 */
rt.runner.BaseRunState.prototype.onRender = function(dt, ctx) {
    //console.log('BaseRunState::onRender');
};

/**
 * do we suspend lower for this runstate?
 *
 * @return {Boolean}
 */
rt.runner.BaseRunState.prototype.suspendLower = function() {
    return this.runFlag === rt.runner.RunFlag.SUSPEND_LOWER;
};
