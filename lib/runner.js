import { Queue, clone } from './util';

export function step_twa(states, branches) {
    let new_branches = [];
    let result = 'reject';

    for (let i in branches) {
        let { curr, tape, pointer } = branches[i];
        let state = states.get(curr);
        
        let input;
        if (state.type === 'L') {
            input = tape[--pointer];
        } else {
            input = tape[++pointer];
        }

        if (!state.transitions.has(input)) continue;

        let next_states = state.transitions.get(input);
        for (let j in next_states) {
            let next = next_states[j];
            let next_state = states.get(next);

            if (next_state.type === 'accept') {
                new_branches = [{
                    curr: next,
                    tape,
                    pointer
                }];
                result = 'accept';
                break;
            } else if (next_state.type === 'reject') {
                continue;
            }

            new_branches.push({
                curr: next,
                tape,
                pointer
            });
        }

        if (result === 'accept') break;
    }

    if (result === 'reject' && new_branches.length > 0) {
        result = '-';
    }

    return { branches: new_branches, result };
}

export function step_multi_queue(states, branches) {
    let new_branches = [];
    let result = 'reject';

    for (let i in branches) {
        let { curr, tape, pointer, queues } = branches[i];
        let state = states.get(curr);

        if (state.type[0] === 'R' || state.type[0] === 'W') {
            let newQueues = clone('multi-queue', queues);

            let queue_name = state.type.substring(2);
            let queue;
            if (newQueues.has(queue_name)) {
                queue = newQueues.get(queue_name);
            } else {
                queue = new Queue();
                newQueues.set(queue_name, queue);
            }
            
            for (let [c, next_states] of state.transitions) {
                if (state.type[0] === 'R') {
                    if (queue.peek() !== c) continue;
                    queue.dequeue();   
                } else {
                    queue.enqueue(c);
                }

                for (let j in next_states) {
                    let next = next_states[j];
                    let next_state = states.get(next);

                    if (next_state.type === 'accept') {
                        let status = true;
                        for (let [_, value] of newQueues) {
                            if (value.isEmpty) continue;
                            status = false;
                            break;
                        }

                        if (status) {
                            new_branches = [{
                                curr: next,
                                tape,
                                pointer,
                                queues: newQueues
                            }];
                            result = 'accept';
                            break;
                        }
                        continue;
                    }

                    new_branches.push({
                        curr: next,
                        tape,
                        pointer,
                        queues: newQueues
                    });
                }

                if (result === 'accept') break;
            }
        } else {
            let input;
            if (state.type[1] === 'L') {
                input = tape[--pointer];
            } else {
                input = tape[++pointer];
            }

            if (!state.transitions.has(input)) continue;

            let next_states = state.transitions.get(input);
            for (let j in next_states) {
                let next = next_states[j];
                let next_state = states.get(next);

                if (next_state.type === 'accept') {
                    let status = true;
                    for (let [_, value] of queues) {
                        if (value.isEmpty) continue;
                        status = false;
                        break;
                    }

                    if (status) {
                        new_branches = [{
                            curr: next,
                            tape,
                            pointer,
                            queues: clone('multi-queue', queues)
                        }];
                        result = 'accept';
                        break;
                    }
                    continue;
                }

                new_branches.push({
                    curr: next,
                    tape,
                    pointer,
                    queues: clone('multi-queue', queues)
                });
            }
        }

        if (result === 'accept') break;
    }

    if (result === 'reject' && new_branches.length > 0) {
        result = '-';
    }

    return { branches: new_branches, result };
}

export function step_two_stack(states, branches) {
    let new_branches = [];
    let result = 'reject';

    for (let i in branches) {
        let { curr, tape, pointer, stacks } = branches[i];
        let state = states.get(curr);
        
        if (state.type === 'S') {
            let input = tape[++pointer];

            if (!state.transitions.has(input)) continue;

            let next_states = state.transitions.get(input);
            for (let j in next_states) {
                let next = next_states[j];
                let next_state = states.get(next);

                if (next_state.type === 'accept') {
                    if (stacks[0].isEmpty && stacks[1].isEmpty) {
                        new_branches = [{
                            curr: next,
                            tape,
                            pointer,
                            stacks: clone('two-stack', stacks)
                        }];
                        result = 'accept';
                        break;
                    }
                    continue;
                }

                new_branches.push({
                    curr: next,
                    tape,
                    pointer,
                    stacks: clone('two-stack', stacks)
                });
            }
        } else {
            for (let [c, next_states] of state.transitions) {
                let newStacks = clone('two-stack', stacks);
                let stack = newStacks[Number(state.type[1]) - 1];

                if (state.type[0] === 'R') {
                    if (stack.peek() !== c) continue;
                    stack.pop();
                } else {
                    stack.push(c);
                }

                for (let j in next_states) {
                    let next = next_states[j];
                    let next_state = states.get(next);
    
                    if (next_state.type === 'accept') {
                        if (newStacks[0].isEmpty && newStacks[1].isEmpty) {
                            new_branches = [{
                                curr: next,
                                tape,
                                pointer,
                                stacks: newStacks
                            }];
                            result = 'accept';
                            break;
                        }
                        continue;
                    }
    
                    new_branches.push({
                        curr: next,
                        tape,
                        pointer,
                        stacks: newStacks
                    });
                }

                if (result === 'accept') break;
            }
        }

        if (result === 'accept') break;
    }

    if (result === 'reject' && new_branches.length > 0) {
        result = '-';
    }

    return { branches: new_branches, result };
}

export function step_tm(states, branches) {
    let new_branches = [];
    let result = 'reject';

    for (let i in branches) {
        let { curr, tape, pointer } = branches[i];
        let state = states.get(curr);
        
        let input;
        if (state.type === 'L') {
            input = tape[--pointer];
        } else {
            input = tape[++pointer];
        }

        if (!state.transitions.has(input)) continue;

        let next_states = state.transitions.get(input);
        for (let j in next_states) {
            let output = next_states[j][0]
            let next = next_states[j].substring(2);
            let next_state = states.get(next);

            if (next_state.type === 'accept') {
                new_branches = [{
                    curr: next,
                    tape: tape.substring(0, pointer) + output + tape.substring(pointer + 1),
                    pointer
                }];
                result = 'accept';
                break;
            } else if (next_state.type === 'reject') {
                continue;
            }

            new_branches.push({
                curr: next,
                tape: tape.substring(0, pointer) + output + tape.substring(pointer + 1),
                pointer
            });
        }

        if (result === 'accept') break;
    }

    if (result === 'reject' && new_branches.length > 0) {
        result = '-';
    }

    return { branches: new_branches, result };
}

export function run_twa(states, branches) {
    let res;
    while (true) {
        res = step_twa(states, branches);
        branches = res.branches;
        if (res.result !== '-') break;
    }
    return res;
}

export function run_multi_queue(states, branches) {
    let res;
    while (true) {
        res = step_multi_queue(states, branches);
        branches = res.branches;
        if (res.result !== '-') break;
    }
    return res;
}

export function run_two_stack(states, branches) {
    let res;
    while (true) {
        res = step_two_stack(states, branches);
        branches = res.branches;
        if (res.result !== '-') break;
    }
    return res;
}

export function run_tm(states, branches) {
    let res;
    while (true) {
        res = step_tm(states, branches);
        branches = res.branches;
        if (res.result !== '-') break;
    }
    return res;
}