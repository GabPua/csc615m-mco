import { Stack } from './util';
import { parse_code } from './parser';

export function init(lines, mode, input) {
  let states = parse_code(lines, mode);

  let branches = [];
  for (let [curr, state] of states) {
    if (state.initial) {
      let branch = {
        curr,
        tape: '#'.repeat(10) + input + '#'.repeat(10),
        pointer: 9
      };

      if (mode === 'multi-queue') {
        branch.queues = new Map();
      } else if (mode === 'two-stack') {
        branch.stacks = [new Stack(), new Stack()];
      }

      branches.push(branch);
    }
  }

  console.log(states)
  return { states, branches };
}