// 2 entities
function parse_basic(states, entities) {
    let curr = entities[0], type = entities[1];
    if (states.has(curr)) {
        let state = states.get(curr);
        if (type === 'initial') {
            state.initial = true;
        } else {
            state.type = type;
        }
    } else {
        let transitions = new Map();
        let state = {
            type,
            transitions,
            initial: false
        };

        if (type === 'initial') state.initial = true;
        
        states.set(curr, state);
    }
}

// 4 or 5 entities
function parse_complex(states, curr, type, input, next) {
    if (states.has(curr)) {
        let state = states.get(curr);
        state.type = type;
        if (state.transitions.has(input)) {
            let destinations = state.transitions.get(input);
            destinations.push(next);
        } else {
            state.transitions.set(input, [next]);
        }
    } else {
        let transitions = new Map([[input, [next]]]);
        let state = {
            type,
            transitions,
            initial: false
        };
        states.set(curr, state);
    }
}

// mode - twa, multi-queue, two-stack, tm
export function parse_code(lines, mode) {
    let states = new Map();

    for (let i in lines) {
        let line = lines[i];
        if (line === "")
            continue;

        // parse line
        let entities = [];
        let temp = '';
        for (let j = 0; j < line.length; j++) {
            switch (line[j]) {
                case ']': case '(': case ',': case ')':
                    if (temp !== '')
                        entities.push(temp);
                    temp = '';
                    break;
                default:
                    temp += line[j];
            }
        }
        if (temp !== '')
            entities.push(temp);

        // update states
        if (entities.length === 2) {
            parse_basic(states, entities);
        } else {
            let curr = entities[0], type = entities[1], input = entities[2], next = entities[3];
            if (mode === 'multi-queue' && entities.length === 5) {
                type = entities[1] + ']' + entities[2];
                input = entities[3];
                next = entities[4];
            } else if (mode === 'tm') {
                next = entities[3] + ']' + entities[4];
            }

            parse_complex(states, curr, type, input, next);
        }
    }

    return states;
}