/**
 * User: jchionh
 * Date: 10/27/13
 * Time: 2:31 PM
 */

// namespace
rs.runner = rs.runner || {};

/**
 * StateRunner class
 *
 * maintains a stack of states and runs them
 *
 * onStart()
 * onStop()
 * onUpdate()
 * onRender()
 *
 * on the sates.
 *
 * onStart() is called once when the state is added to the stack
 * onStop() is called once when state is removed from the stack
 *
 * onUpdate(dt) is called for every loop with the deltaTime elapsed
 * onRender(dt, ctx) is called for every loop
 *
 * on remove of a state, we also remove all states on top of it towards the
 * top of the stack
 *
 * this allows the onStop() of a state to remove it's child states
 *
 * for example
 *
 * -- top of stack ---
 * GUI Run State
 * Game Run State
 * OtherStates
 * -- bottom of stack --
 *
 * if Game Run State ends, it will also remove GUI Run State that is running on top
 * of it.
 *
 * @constructor
 */
rs.runner.StateRunner = function() {

    /**
     * this is our run stack;
     * @type {Array<rs.runner.BaseRunState>}
     */
    this.stack = [];
};

/**
 * when destroy is called, we call all currently runing
 * state onStop() and release ressources of the states
 */
rs.runner.StateRunner.prototype.destroy = function() {

    var count = this.stack.length;
    // iterate and call release on all states in the stack
    for (var i = 0; i < count; ++i) {
        /**
         * @type {rs.runner.BaseRunState}
         */
        var state = this.stack[i];
        state.onStop();
        // null it to remove reference
        this.stack[i] = null;
    }
    // now let's delete the stack
    // by setting the length to 0, it's crazy, i know! this is javascript!!! :)
    this.stack.length = 0;
};

/**
 * adding a state to the stack, here, we'll call onStart
 *
 * @param {rs.runner.BaseRunState} state
 */
rs.runner.StateRunner.prototype.addState = function(state) {
    // push the game state onto the stack
    this.stack.push(state);
    // call the onStart of the state
    state.onStart();
};

/**
 * switch state pops the topmost state and replaces that with the new state
 *
 * @param {rs.runner.BaseRunState} state
 */
rs.runner.StateRunner.prototype.switchState = function(state) {
    this.popState();
    this.addState(state);
};

/**
 * we remove the top state here
 */
rs.runner.StateRunner.prototype.popState = function() {
    /**
     * @type {rs.runner.BaseRunState}
     */
    var state = this.stack.pop();
    if (state !== null) {
        state.onStop();
    }
};

/**
 * we call updates on all our states
 *
 * @param {number} dt
 */
rs.runner.StateRunner.prototype.update = function(dt) {

    var topIndex = this.stack.length - 1;

    // implement running the states from the top of the stack downwards
    // until it hits a state where the runflag is suspend lower, then it breaks
    for (var i = topIndex; i >= 0; --i) {
        /**
         * @type {rs.runner.BaseRunState}
         */
        var currentState = this.stack[i];
        currentState.onUpdate(dt);
        if (currentState.suspendLower() === true) {
            // if this state says not to run any lower states,
            // we'll break here.
            break;
        }
    }

    // now we check if any states has been set as exit is true, and release the states
    this.checkAndRemove();
};

/**
 * render our states
 *
 * @param {number} dt
 * @param {Object} ctx
 */
rs.runner.StateRunner.prototype.render = function(dt, ctx) {
    var topIndex = this.stack.length - 1;
    // implement running the states from the top of the stack downwards
    // until it hits a state where the runflag is suspend lower, then it breaks
    for (var i = topIndex; i >= 0; --i) {
        /**
         * @type {rs.runner.BaseRunState}
         */
        var currentState = this.stack[i];
        currentState.onRender(dt, ctx);
        if (currentState.suspendLower() === true) {
            // if this state says not to run any lower states,
            // we'll break here.
            break;
        }
    }
};

/**
 * now we check our states to see if the states have stopped, and remove them
 */
rs.runner.StateRunner.prototype.checkAndRemove = function() {
    // now step through the stack again from bottom up to find the first state that
    // exited. if this state exited, we remove this state and all states above it
    var count = this.stack.length;
    var firstIndex = -1;
    var currentState;
    var i;
    for (i = 0; i < count; ++i) {
        /**
         * @type {rs.runner.BaseRunState}
         */
        currentState = this.stack[i];
        if (currentState.stopped === true) {
            // save out our first index
            firstIndex = i;
            // break from loop
            break;
        }
    }

    // then we resize the array
    if (firstIndex !== -1) {
        // now we need to loop from the top of the stack down to release
        // the states in the right order
        for (i = count - 1; i >= firstIndex; --i) {
            /**
             * @type {rs.runner.BaseRunState}
             */
            currentState = this.stack[i];
            currentState.onStop();
            this.stack[i] = null;
        }

        // now we need to remove the states
        this.stack.splice(firstIndex, count - firstIndex);
    }
};
