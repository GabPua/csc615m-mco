export class Queue {
    constructor() {
        this.elements = {};
        this.head = 0;
        this.tail = 0;
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
    toString() {
        let string = '';
        for (let i = this.head; i < this.tail; i++) {
            string += String(this.elements[i]);
        }
        return string;
    }
}

export class Stack {
    constructor() {
        this.elements = {};
        this.top = 0;
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
        return this.elements[this.top];
    }
    get length() {
        return this.top;
    }
    get isEmpty() {
        return this.length === 0;
    }
    toString() {
        let string = '';
        for (let i = this.top - 1; i >= 0; i--) {
            string += String(this.elements[i]);
        }
        return string.split('').reverse().join('');
    }
}

export function clone(instance) {
    return Object.assign(
      Object.create(Object.getPrototypeOf(instance)),
      JSON.parse(JSON.stringify(instance))
    );
}