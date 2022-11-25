export class Queue {
    constructor(queue=null) {
        if (queue) {
            this.elements = clone_obj(queue.elements);
            this.head = queue.head;
            this.tail = queue.tail;
        } else {
            this.elements = {};
            this.head = 0;
            this.tail = 0;
        }
    }
    enqueue(element) {
        this.elements[this.tail] = element;
        this.tail++;
    }
    dequeue() {
        const item = this.elements[this.head];
        delete this.elements[this.head];
        this.head++;
        return item;
    }
    peek() {
        return this.elements[this.head];
    }
    get length() {
        return this.tail - this.head;
    }
    get isEmpty() {
        return this.length === 0;
    }
    to_string() {
        let string = '';
        for (let i = this.head; i < this.tail; i++) {
            string += String(this.elements[i]);
        }
        return string;
    }
}

export class Stack {
    constructor(stack=null) {
        if (stack) {
            this.elements = clone_obj(stack.elements);
            this.top = stack.top;
        } else {
            this.elements = {};
            this.top = 0;
        }
    }
    push(element) {
        this.elements[this.top] = element;
        this.top++;
    }
    pop() {
        const item = this.elements[--this.top];
        delete this.elements[this.top];
        return item;
    }
    peek() {
        return this.elements[this.top - 1];
    }
    get length() {
        return this.top;
    }
    get isEmpty() {
        return this.length === 0;
    }
    to_string() {
        let string = '';
        for (let i = this.top - 1; i >= 0; i--) {
            string += String(this.elements[i]);
        }
        return string.split('').reverse().join('');
    }
}

export function clone(mode, memory) {
    if (mode === 'two-stack') {
        return [new Stack(memory[0]), new Stack(memory[1])];
    } else {
        let queues = new Map();
        for (let [queue_name, queue] of memory) {
            queues.set(queue_name, new Queue(queue));
        }
        return queues;
    }
}

function clone_obj(instance) {
    return Object.assign(
      Object.create(Object.getPrototypeOf(instance)),
      JSON.parse(JSON.stringify(instance))
    );
}